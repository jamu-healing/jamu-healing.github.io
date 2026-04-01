#!/usr/bin/env node

/**
 * encrypt-build.js
 * GitHub Actions build script:
 * 1. Find encrypted .md files (containing "enc::")
 * 2. Decrypt them with MASTER_KEY (from env)
 * 3. Run Jekyll build
 * 4. Post-process: encrypt HTML content into <enc-box>
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const IV_LEN = 12;
const ITERATIONS = 100000;

function deriveKey(passkey) {
  const salt = Buffer.from(passkey);
  return crypto.pbkdf2Sync(passkey, salt, ITERATIONS, 32, 'sha256');
}

function decrypt(base64, keyBuffer) {
  const buf = Buffer.from(base64, 'base64');
  const iv = buf.slice(0, IV_LEN);
  const encrypted = buf.slice(IV_LEN);
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  const authTag = encrypted.slice(encrypted.length - 16);
  const ciphertext = encrypted.slice(0, encrypted.length - 16);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

const MASTER_KEY = process.env.MASTER_KEY || '';
if (!MASTER_KEY) {
  console.log('No MASTER_KEY set, skipping encryption step');
  process.exit(0);
}

const keyBuffer = deriveKey(MASTER_KEY);
const CONTENT_DIR = path.join(__dirname, '..', '4-70-16');

// Find and decrypt .md files
const mdFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md') && f !== 'index.md.old');
for (const file of mdFiles) {
  const filePath = path.join(CONTENT_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const encMatch = content.match(/enc::(.+?)$/m);
  if (encMatch) {
    try {
      const decrypted = decrypt(encMatch[1], keyBuffer);
      fs.writeFileSync(filePath, decrypted);
      console.log('Decrypted:', file);
    } catch (e) {
      console.error('Failed to decrypt:', file, e.message);
    }
  }
}

// Run Jekyll build
console.log('Running Jekyll build...');
execSync('bundle exec jekyll build', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

// Post-process: encrypt HTML in _site/4-70-16/*.html
const SITE_DIR = path.join(__dirname, '..', '_site', '4-70-16');
if (fs.existsSync(SITE_DIR)) {
  const htmlFiles = fs.readdirSync(SITE_DIR).filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const filePath = path.join(SITE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    // Find post content between <main> tags or post-content div
    const contentMatch = html.match(/<div class="post-content[^"]*">([\s\S]*?)<\/div>\s*<div class="tags-container/);
    if (contentMatch) {
      const postContent = contentMatch[1];
      // Re-encrypt for browser decryption
      const iv = crypto.randomBytes(IV_LEN);
      const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
      const encrypted = Buffer.concat([cipher.update(postContent, 'utf8'), cipher.final()]);
      const authTag = cipher.getAuthTag();
      const combined = Buffer.concat([iv, encrypted, authTag]);
      const base64 = combined.toString('base64');
      // Replace content with enc-box
      html = html.replace(contentMatch[1], '<div class="enc-warning">Encrypted content - enter passkey to view</div><enc-box data-enc-pk="' + deriveKey(MASTER_KEY).toString('base64') + '" class="is-hidden">enc::' + base64 + '</enc-box>');
      fs.writeFileSync(filePath, html);
      console.log('Encrypted HTML:', file);
    }
  }
}

console.log('Build complete with encryption');