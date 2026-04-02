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

function decrypt(base64, keyBuffer) {
  const buf = Buffer.from(base64, 'base64');
  const iv = buf.slice(0, IV_LEN);
  const authTag = buf.slice(buf.length - 16);
  const ciphertext = buf.slice(IV_LEN, buf.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

const MASTER_KEY = process.env.MASTER_KEY;
if (!MASTER_KEY) {
  console.error('MASTER_KEY required');
  process.exit(1);
}

const keyBuffer = deriveKey(MASTER_KEY);
const contentDir = path.join(__dirname, '..', '4-70-16');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md') && f !== 'index.md.old');

for (const file of files) {
  const filePath = path.join(contentDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const encMatch = raw.match(/enc::([A-Za-z0-9+/=]+)/);
  if (!encMatch) continue;

  try {
    const decrypted = decrypt(encMatch[1], keyBuffer);
    const newContent = raw.replace(/enc::[A-Za-z0-9+/=]+/, decrypted);
    fs.writeFileSync(filePath, newContent);
    console.log('Decrypted:', file);
  } catch (e) {
    console.error('Failed:', file, e.message);
  }
}