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
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

const exitCode = {
  script: 'source-md-encoder',
  exit_code: {
    status: 'ok',
    error: 'noerr'
  }
};

try {
  const MASTER_KEY = process.env.MASTER_KEY;
  if (!MASTER_KEY) {
    exitCode.exit_code.status = 'badkey';
    exitCode.exit_code.error = 'MASTER_KEY required';
    console.error('MASTER_KEY required');
    console.log(JSON.stringify(exitCode));
    process.exit(1);
  }

  const keyBuffer = deriveKey(MASTER_KEY);
  const filePath = path.join(__dirname, '..', '4-70-16', 'new-test-post.md');
  
  if (!fs.existsSync(filePath)) {
    exitCode.exit_code.status = 'badsrc';
    exitCode.exit_code.error = 'File not found';
    console.error('File not found');
    console.log(JSON.stringify(exitCode));
    process.exit(1);
  }

  let content = fs.readFileSync(filePath, 'utf8');

  let decryptedContent = content;
  const encMatch = content.match(/enc::([A-Za-z0-9+/=]+)/);
  if (encMatch) {
    console.log('=== ALREADY ENCRYPTED - DECRYPTING FIRST ===');
    decryptedContent = decrypt(encMatch[1], keyBuffer);
  }

  console.log('=== ENCRYPTING ===');
  const encrypted = encrypt(decryptedContent, keyBuffer);
  console.log('Encrypted base64:', encrypted.substring(0, 80) + '...');

  console.log('\n=== DECRYPTING ===');
  const decrypted = decrypt(encrypted, keyBuffer);
  console.log('Decrypted matches original:', decryptedContent === decrypted);

  const frontMatterMatch = decryptedContent.match(/---([\s\S]*?)---/);
  if (frontMatterMatch) {
    const frontMatter = frontMatterMatch[1];
    const body = decryptedContent.slice(frontMatterMatch[0].length);
    const encContent = `---${frontMatter}---\n\nenc::${encrypted}`;
    fs.writeFileSync(filePath, encContent);
    console.log('\nEncrypted file written to', filePath);
  } else {
    exitCode.exit_code.status = 'badsrc';
    exitCode.exit_code.error = 'No front matter found';
    console.error('ERROR: No front matter found');
    console.log(JSON.stringify(exitCode));
    process.exit(1);
  }

  console.log(JSON.stringify(exitCode));
} catch (e) {
  exitCode.exit_code.status = 'badkey';
  exitCode.exit_code.error = e.message;
  console.error('Error:', e.message);
  console.log(JSON.stringify(exitCode));
  process.exit(1);
}