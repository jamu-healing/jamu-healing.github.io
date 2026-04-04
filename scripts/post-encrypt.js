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

const exitCode = {
  script: 'post-encrypt',
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
  const siteDir = path.join(__dirname, '..', '_site', '4-70-16');

  if (!fs.existsSync(siteDir)) {
    exitCode.exit_code.status = 'badsrc';
    exitCode.exit_code.error = '_site/4-70-16 not found';
    console.error('_site/4-70-16 not found');
    console.log(JSON.stringify(exitCode));
    process.exit(1);
  }

  const htmlFiles = fs.readdirSync(siteDir).filter(f => f.endsWith('.html') && f !== 'index.html');

  for (const file of htmlFiles) {
    const filePath = path.join(siteDir, file);
    let html = fs.readFileSync(filePath, 'utf8');

    const contentMatch = html.match(/<div class="post-content prose">([\s\S]*?)<\/div>/i);
    if (!contentMatch) {
      continue;
    }

    try {
      const content = contentMatch[1];
      const encrypted = encrypt(content, keyBuffer);

      html = html.replace(
        contentMatch[0],
        '<div class="enc-warning">Encrypted content - enter passkey in /4-70-16/ to view</div>\n' +
        '<div class="post-content prose">\n' +
        '      <enc-box class="is-hidden">enc::' + encrypted + '</enc-box>\n' +
        '    </div>'
      );

      // Add exit_code script tag
      const exitCodeScript = `<script type="application/ld+json">
${JSON.stringify(exitCode)}
</script>`;
      html = html.replace('</head>', `${exitCodeScript}</head>`);

      fs.writeFileSync(filePath, html);
      console.log('Encrypted:', file);
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