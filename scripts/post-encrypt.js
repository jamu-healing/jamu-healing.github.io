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
  return Buffer.concat([iv, encrypted, authTag]).toString('base64');
}

const MASTER_KEY = process.env.MASTER_KEY;
if (!MASTER_KEY) {
  console.error('MASTER_KEY required');
  process.exit(1);
}

const keyBuffer = deriveKey(MASTER_KEY);
const siteDir = path.join(__dirname, '..', '_site', '4-70-16');

if (!fs.existsSync(siteDir)) {
  console.error('_site/4-70-16 not found');
  process.exit(1);
}

const htmlFiles = fs.readdirSync(siteDir).filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of htmlFiles) {
  const filePath = path.join(siteDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Find article content (includes CSS link, header, content)
  const articleMatch = html.match(/<link rel="stylesheet"[^>]*>[\s\S]*?<article[^>]*>[\s\S]*?<\/article>/i);
  if (!articleMatch) continue;

  const articleContent = articleMatch[0];
  const encrypted = encrypt(articleContent, keyBuffer);

  html = html.replace(
    articleContent,
    '<div class="enc-warning">Encrypted content - enter passkey in /4-70-16/ to view</div>\n' +
    '      <enc-box class="is-hidden">enc::' + encrypted + '</enc-box>'
  );

  var script = '\n<script>\n' +
    '(function(){var IV_LEN=12,ITERATIONS=100000;async function deriveKey(pk){var enc=new TextEncoder();var salt=enc.encode(pk);var km=await crypto.subtle.importKey("raw",enc.encode(pk),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:salt,iterations:ITERATIONS,hash:"SHA-256"},km,{name:"AES-GCM",length:256},false,["decrypt"]);}async function decrypt(b64,key){var buf=Uint8Array.from(atob(b64),function(c){return c.charCodeAt(0);});var iv=buf.slice(0,IV_LEN);var ct=buf.slice(IV_LEN);var pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:iv},key,ct);return new TextDecoder().decode(pt);}async function run(){var box=document.querySelector("enc-box");if(!box)return;var encText=box.textContent.trim().replace(/^enc::/,"");if(!encText)return;var pk=sessionStorage.getItem("passkey");if(!pk){var w=document.querySelector(".enc-warning");if(w)w.textContent="Passkey required - login at /4-70-16/ first";return;}var key=await deriveKey(pk);try{var html=await decrypt(encText,key);box.classList.remove("is-hidden");box.innerHTML=html;var w=document.querySelector(".enc-warning");if(w)w.classList.add("is-hidden");}catch(e){console.error("Decrypt failed:",e);}}document.addEventListener("DOMContentLoaded",run);})();\n' +
    '<\/script>\n';

  html = html.replace('</body>', script + '</body>');

  fs.writeFileSync(filePath, html);
  console.log('Encrypted:', file);
}