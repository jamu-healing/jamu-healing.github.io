const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4').then(f => f.load());
const DEFAULT_AVATAR = '/images/person-slash.svg';

/* ═══ CRYPTO CORE ═══ */
const SALT_LEN = 16;
const IV_LEN = 12;
const ITERATIONS = 100000;

async function deriveKey(passkey) {
  const enc = new TextEncoder();
  const salt = enc.encode(passkey);
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passkey), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(text, key) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const enc = new TextEncoder();
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, enc.encode(text));
  const buf = new Uint8Array(IV_LEN + cipher.byteLength);
  buf.set(iv, 0);
  buf.set(new Uint8Array(cipher), IV_LEN);
  return btoa(String.fromCharCode.apply(null, buf));
}

async function decrypt(base64, key) {
  const buf = Uint8Array.from(atob(base64), function(c) { return c.charCodeAt(0); });
  const iv = buf.slice(0, IV_LEN);
  const cipher = buf.slice(IV_LEN);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, cipher);
  return new TextDecoder().decode(plain);
}

async function derivePubKey(passkey) {
  const enc = new TextEncoder();
  const salt = enc.encode(passkey + ':pubkey');
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passkey), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return btoa(String.fromCharCode.apply(null, new Uint8Array(bits)));
}

/* ═══ AUTH ═══ */
let SESSION = { passkey: null, key: null, access: 'guest', visitorId: null };

async function authorize(passkey) {
  try {
    const visitor = await (await fpPromise).get();
    SESSION.visitorId = visitor.visitorId;
    const users = await fetch('./users.json').then(function(r) { return r.json(); });
    const savedKey = localStorage.getItem('jamu_key_' + visitor.visitorId);
    const inputKey = passkey || savedKey;

    if (!inputKey) {
      setStatus('--:-- | Guest');
      return;
    }

    const derivedPub = await derivePubKey(inputKey);
    let matched = null;
    const keys = Object.keys(users);
    for (let i = 0; i < keys.length; i++) {
      if (users[keys[i]].pubKey === derivedPub) {
        matched = users[keys[i]];
        matched._id = keys[i];
        break;
      }
    }

    if (matched) {
      localStorage.setItem('jamu_key_' + visitor.visitorId, inputKey);
      sessionStorage.setItem('access_level', matched.accessLevel);
      sessionStorage.setItem('passkey', inputKey);
      SESSION.passkey = inputKey;
      SESSION.key = await deriveKey(inputKey);
      SESSION.access = matched.accessLevel;
      setStatus(new Date().toLocaleTimeString() + ' | ' + matched.accessLevel);
      document.getElementById('u-name').textContent = matched.name;
      document.getElementById('u-img').src = matched.image;
      document.querySelectorAll('#auth-controls, #intro').forEach(function(el) { el.classList.add('is-hidden'); });
      document.querySelectorAll('#posts-container').forEach(function(el) { el.classList.remove('is-hidden'); });

      if (matched.accessLevel === 'admin') {
        renderAdminUI();
      }
    } else if (passkey) {
      setStatus(new Date().toLocaleTimeString() + ' | Invalid Key');
    }
  } catch (error) {
    console.error('Authorization error:', error);
    setStatus(new Date().toLocaleTimeString() + ' | Error');
  }
}

function setStatus(text) {
  const el = document.getElementById('status-line');
  if (el) el.textContent = text;
}

/* ═══ ADMIN UI ═══ */
function renderAdminUI() {
  if (document.getElementById('admin-panel')) return;
  const panel = '<section id="admin-panel" class="admin-panel">' +
    '<div class="admin-title">Admin Panel</div>' +
    '<div class="admin-stat">Services: n8n <span id="n8n-stat">...</span> | WebDav <span id="webdav-stat">...</span></div>' +
    '<div class="admin-actions">' +
      '<input type="password" id="gh-pat" placeholder="GitHub PAT (encrypted)" class="passkey-input">' +
      '<button id="save-pat" class="btn btn-primary btn-sm">Save PAT</button>' +
      '<button id="logout-btn" class="btn btn-outline btn-sm">Logout</button>' +
    '</div>' +
    '<div class="admin-title admin-title-spaced">Encrypted Posts</div>' +
    '<div class="admin-actions admin-actions-spaced">' +
      '<button id="new-post-btn" class="btn btn-primary btn-sm">New Post</button>' +
    '</div>' +
    '<ul id="md-list" class="admin-md-list"></ul>' +
    '<textarea id="md-editor" class="admin-editor" placeholder="Select a file to edit or create new..." disabled></textarea>' +
    '<div class="admin-actions admin-actions-top">' +
      '<button id="md-save" class="btn btn-primary" disabled>Push to GitHub</button>' +
      '<button id="md-delete" class="btn btn-outline btn-danger" disabled>Delete</button>' +
    '</div>' +
  '</section>';
  document.getElementById('content-main').insertAdjacentHTML('afterbegin', panel);

  // Logout button
  document.getElementById('logout-btn').onclick = function() { logout(); };

  // Service checks
  fetch('https://n8n.iguanodon-halosaur.ts.net/webhook/sgn', { mode: 'no-cors' })
    .then(function() { const e = document.getElementById('n8n-stat'); if (e) e.textContent = 'Online'; })
    .catch(function() { const e = document.getElementById('n8n-stat'); if (e) e.textContent = 'Offline'; });

  fetch('https://webdav-server.iguanodon-halosaur.ts.net/', { headers: { 'Authorization': 'Basic ' + btoa('admin:admin') } })
    .then(function(r) { const e = document.getElementById('webdav-stat'); if (e) e.textContent = r.status <= 401 ? 'Online' : 'Error ' + r.status; })
    .catch(function() { const e = document.getElementById('webdav-stat'); if (e) e.textContent = 'Offline'; });

  // PAT storage
  const savedPat = localStorage.getItem('gh_pat_enc');
  if (savedPat) {
    document.getElementById('gh-pat').placeholder = 'PAT saved (encrypted)';
  }
  document.getElementById('save-pat').onclick = async function() {
    const patInput = document.getElementById('gh-pat');
    if (!patInput.value) return;
    const enc = await encrypt(patInput.value, SESSION.key);
    localStorage.setItem('gh_pat_enc', enc);
    patInput.value = '';
    patInput.placeholder = 'PAT saved (encrypted)';
  };

  // MD list
  const files = ['test-post.md', 'multable.md'];
  document.getElementById('md-list').innerHTML = files.map(function(f) {
    return '<li class="admin-md-item"><span>' + f + '</span>' +
      '<button class="btn btn-outline btn-sm" onclick="loadMd(\'' + f + '\')">Edit</button>' +
      '<button class="btn btn-outline btn-sm btn-danger" onclick="deleteMd(\'' + f + '\')">Delete</button>' +
      '</li>';
  }).join('');

  // Save button
  document.getElementById('md-save').onclick = function() { saveMd(); };

  // New post button
  document.getElementById('new-post-btn').onclick = function() { newPost(); };

  // Delete button
  document.getElementById('md-delete').onclick = function() {
    const filename = document.getElementById('md-save').dataset.filename;
    if (filename) deleteMd(filename);
  };
}

/* ═══ MD EDITOR ═══ */
async function loadMd(filename) {
  const resp = await fetch('./' + filename);
  const text = await resp.text();
  document.getElementById('md-editor').value = text;
  document.getElementById('md-editor').disabled = false;
  document.getElementById('md-save').disabled = false;
  document.getElementById('md-save').dataset.filename = filename;
}

async function saveMd() {
  const editor = document.getElementById('md-editor');
  const filename = document.getElementById('md-save').dataset.filename;
  const content = editor.value;
  if (!filename || !content) return;

  const encrypted = await encrypt(content, SESSION.key);
  const frontMatter = '---\nlayout: post\ntitle: "Encrypted"\nenc: true\npubKey: "' + await derivePubKey(SESSION.passkey) + '"\n---\n\nenc::' + encrypted;

  const pat = await decrypt(localStorage.getItem('gh_pat_enc'), SESSION.key);
  if (!pat) { alert('Save GitHub PAT first'); return; }

  await pushToGitHub(pat, filename, frontMatter);
}

/* ═══ NEW POST ═══ */
function newPost() {
  const editor = document.getElementById('md-editor');
  editor.value = '---\nlayout: encrypted\ntitle: "New Post"\ndate: ' + new Date().toISOString().split('T')[0] + '\ntags: []\nauthor: Admin\n---\n\nWrite your content here...';
  editor.disabled = false;
  document.getElementById('md-save').disabled = false;
  document.getElementById('md-save').dataset.filename = '';
  document.getElementById('md-delete').disabled = true;
  editor.focus();
}

/* ═══ DELETE MD ═══ */
async function deleteMd(filename) {
  if (!filename) {
    alert('No file selected');
    return;
  }

  if (!confirm('Are you sure you want to delete ' + filename + '? This action cannot be undone.')) {
    return;
  }

  const pat = await decrypt(localStorage.getItem('gh_pat_enc'), SESSION.key);
  if (!pat) {
    alert('Save GitHub PAT first');
    return;
  }

  await deleteFromGitHub(pat, filename);
}

/* ═══ GITHUB API ═══ */
async function getFileSHA(token, path) {
  const resp = await fetch('https://api.github.com/repos/jamu-healing/jamu-healing.github.io/contents/4-70-16/' + path, {
    headers: { 'Authorization': 'token ' + token }
  });
  if (resp.ok) {
    const data = await resp.json();
    return data.sha;
  }
  return null;
}

async function pushToGitHub(token, filename, content) {
  const sha = await getFileSHA(token, filename);
  const body = { message: 'Update encrypted ' + filename, content: btoa(unescape(encodeURIComponent(content))), branch: 'redesign/static-css' };
  if (sha) body.sha = sha;

  const resp = await fetch('https://api.github.com/repos/jamu-healing/jamu-healing.github.io/contents/4-70-16/' + filename, {
    method: 'PUT',
    headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (resp.ok) {
    alert('Pushed to GitHub');
    // Refresh file list
    location.reload();
  } else {
    const err = await resp.json();
    alert('Push failed: ' + (err.message || 'Unknown'));
  }
}

async function deleteFromGitHub(token, filename) {
  const sha = await getFileSHA(token, filename);
  if (!sha) {
    alert('File not found');
    return;
  }

  const body = { message: 'Delete encrypted ' + filename, sha: sha, branch: 'redesign/static-css' };

  const resp = await fetch('https://api.github.com/repos/jamu-healing/jamu-healing.github.io/contents/4-70-16/' + filename, {
    method: 'DELETE',
    headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (resp.ok) {
    alert('Deleted from GitHub');
    // Refresh file list
    location.reload();
  } else {
    const err = await resp.json();
    alert('Delete failed: ' + (err.message || 'Unknown'));
  }
}

/* ═══ POST DECRYPTOR ═══ */
async function decryptPage() {
  const box = document.querySelector('enc-box');
  if (!box) return;
  const encText = box.textContent.trim().replace(/^enc::/, '');
  if (!encText) return;

  const passkey = sessionStorage.getItem('passkey') || SESSION.passkey;
  if (!passkey) {
    const el = document.querySelector('.enc-warning');
    if (el) el.textContent = 'Passkey required - login first';
    return;
  }

  const key = await deriveKey(passkey);
  try {
    const html = await decrypt(encText, key);
    box.classList.remove('is-hidden');
    box.innerHTML = html;
    const warn = document.querySelector('.enc-warning');
    if (warn) warn.classList.add('is-hidden');
  } catch (e) {
    console.error('Decrypt failed:', e);
  }
}

/* ═══ LOGOUT ═══ */
function logout() {
  // Clear session and local storage
  sessionStorage.removeItem('access_level');
  sessionStorage.removeItem('passkey');
  localStorage.removeItem('jamu_key_' + SESSION.visitorId);
  SESSION.passkey = null;
  SESSION.key = null;
  SESSION.access = 'guest';

  // Reset UI
  setStatus('--:-- | Guest');
  document.getElementById('u-name').textContent = 'Guest';
  document.getElementById('u-img').src = DEFAULT_AVATAR;
  document.querySelectorAll('#auth-controls, #intro').forEach(function(el) { el.classList.remove('is-hidden'); });
  document.querySelectorAll('#posts-container, #admin-panel').forEach(function(el) { el.classList.add('is-hidden'); });
}

/* ═══ COPY LINK ═══ */
function initCopyLinkButtons() {
  const buttons = document.querySelectorAll('.copy-link-btn');
  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const url = btn.getAttribute('data-url');
      const fullUrl = window.location.origin + url;
      navigator.clipboard.writeText(fullUrl).then(function() {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check"></i>';
        setTimeout(function() {
          btn.innerHTML = originalHTML;
        }, 2000);
      });
    });
  });
}

/* ═══ INIT ═══ */
document.addEventListener('DOMContentLoaded', function() {
  const authForm = document.getElementById('auth-controls');
  if (authForm) {
    authForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const passkey = document.getElementById('passkey');
      if (passkey) authorize(passkey.value);
    });
  }
  authorize();
  decryptPage();
  initCopyLinkButtons();
});
