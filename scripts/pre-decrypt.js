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

const exitCode = {
  script: 'pre-decrypt',
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
  const contentDir = path.join(__dirname, '..', '4-70-16');

  if (!fs.existsSync(contentDir)) {
    exitCode.exit_code.status = 'badsrc';
    exitCode.exit_code.error = 'Content directory not found';
    console.error('Content directory not found');
    console.log(JSON.stringify(exitCode));
    process.exit(1);
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md') && f !== 'index.md.old');

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const encMatch = raw.match(/enc::([A-Za-z0-9+/=]+)/);
    if (!encMatch) {
      continue;
    }

    try {
      const decrypted = decrypt(encMatch[1], keyBuffer);
      
      // Find original front matter
      const frontMatterMatch = raw.match(/^---([\s\S]*?)---\n/);
      
      let finalContent;
      if (frontMatterMatch) {
        // Remove front matter from decrypted content if present
        const cleanDecrypted = decrypted.replace(/^---[\s\S]*?---\n?/, '').trim();
        finalContent = `---${frontMatterMatch[1]}---\n\n${cleanDecrypted}`;
      } else {
        finalContent = decrypted;
      }
      
      fs.writeFileSync(filePath, finalContent);
      console.log('Decrypted:', file);
    } catch (e) {
      exitCode.exit_code.status = 'badkey';
      exitCode.exit_code.error = e.message;
      console.error('Failed:', file, e.message);
    }
  }

  console.log(JSON.stringify(exitCode));
} catch (e) {
  exitCode.exit_code.status = 'badsrc';
  exitCode.exit_code.error = e.message;
  console.error('Error:', e.message);
  console.log(JSON.stringify(exitCode));
  process.exit(1);
}