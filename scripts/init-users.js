#!/usr/bin/env node

/**
 * init-users.js
 * Generates public users.json from .local-keys.json
 * NEVER copies raw passwords to users.json
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const KEYS_PATH = path.join(__dirname, '..', '4-70-16', '.local-keys.json');
const USERS_PATH = path.join(__dirname, '..', '4-70-16', 'users.json');

function derivePubKey(passkey) {
  const enc = new TextEncoder();
  const salt = enc.encode(passkey + ':pubkey');
  const key = crypto.pbkdf2Sync(passkey, salt, 100000, 32, 'sha256');
  return key.toString('base64');
}

function generateShortHash(input) {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 6);
}

// Read local keys
const localKeys = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8'));

// Access levels mapping
const ACCESS_MAP = {
  admin: 'admin',
  debug: 'debug',
  guest: 'guest'
};

const PROFILES = {
  admin: {
    name: 'Administrator',
    image: '/images/evi-sudarto.jpg',
    id_timecode: '20260329-001',
    postslist: ['test-post.md', 'multable.md', 'new-test-post.md']
  },
  debug: {
    name: 'Debug User',
    image: '/images/evi-sudarto.jpg',
    id_timecode: '20260329-002',
    postslist: ['test-post.md']
  }
};

const users = {};

for (const [name, passkey] of Object.entries(localKeys)) {
  if (!passkey) continue;
  const hash = generateShortHash(name);
  const pubKey = derivePubKey(passkey);
  const profile = PROFILES[name] || { name: name, image: '/images/person-slash.svg', postslist: [] };

  users['u_' + hash] = {
    name: profile.name,
    pubKey: pubKey,
    accessLevel: ACCESS_MAP[name] || 'guest',
    image: profile.image,
    id_timecode: profile.id_timecode || '',
    postslist: profile.postslist
  };
}

fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2) + '\n');
console.log('Generated users.json with', Object.keys(users).length, 'users');
console.log('PubKeys generated from .local-keys.json (no raw passwords)');