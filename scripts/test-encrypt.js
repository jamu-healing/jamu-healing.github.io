#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const IV_LEN = 12;
const ITERATIONS = 100000;

function deriveKey(passkey) {
  const salt = Buffer.from(passkey);
  return crypto.pbkdf2Sync(passkey, salt, ITERATIONS, 32, 'sha256');
}

function encrypt(text, keyBuffer) {
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([iv, encrypted, authTag]);
  return combined.toString('base64');
}

function decrypt(base64, keyBuffer) {
  const buf = Buffer.from(base64, 'base64');
  const iv = buf.slice(0, IV_LEN);
  const authTag = buf.slice(buf.length - 16);
  const ciphertext = buf.slice(IV_LEN, buf.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

const MASTER_KEY = process.env.MASTER_KEY;
if (!MASTER_KEY) {
  console.error('MASTER_KEY required');
  process.exit(1);
}

const keyBuffer = deriveKey(MASTER_KEY);
const filePath = path.join(__dirname, '..', '4-70-16', 'new-test-post.md');
const content = fs.readFileSync(filePath, 'utf8');

console.log('=== ENCRYPTING ===');
const encrypted = encrypt(content, keyBuffer);
console.log('Encrypted base64:', encrypted.substring(0, 80) + '...');

console.log('\n=== DECRYPTING ===');
const decrypted = decrypt(encrypted, keyBuffer);
console.log('Decrypted matches original:', content === decrypted);

// Write encrypted file
const encContent = '---\nlayout: post\ntitle: "Encryption tests"\ndate: 2026-02-04\ncategories: [encrypted]\ntags: [tests]\nexcerpt: "Encrypted content"\nauthor: Ded Miron\nenc: true\npubKey: "' + keyBuffer.toString('base64') + '"\n---\n\nenc::' + encrypted;
fs.writeFileSync(filePath, encContent);
console.log('\nEncrypted file written to', filePath);