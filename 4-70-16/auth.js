const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4').then(f => f.load());
const DEFAULT_AVATAR = '/images/person-slash.svg';

/* ═══ CRYPTO CORE ═══ */
const SALT_LEN = 16;
const IV_LEN = 12;
const ITERATIONS = 100000;

async function deriveKey(passkey) {
  var enc = new TextEncoder();
  var salt = enc.encode(passkey);
  var keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passkey), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(text, key) {
  var iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  var enc = new TextEncoder();
  var cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, enc.encode(text));
  var buf = new Uint8Array(IV_LEN + cipher.byteLength);
  buf.set(iv, 0);
  buf.set(new Uint8Array(cipher), IV_LEN);
  return btoa(String.fromCharCode.apply(null, buf));
}

async function decrypt(base64, key) {
  var buf = Uint8Array.from(atob(base64), function(c) { return c.charCodeAt(0); });
  var iv = buf.slice(0, IV_LEN);
  var cipher = buf.slice(IV_LEN);
  var plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, cipher);
  return new TextDecoder().decode(plain);
}

async function derivePubKey(passkey) {
  var enc = new TextEncoder();
  var salt = enc.encode(passkey + ':pubkey');
  var keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passkey), 'PBKDF2', false, ['deriveBits']);
  var bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return btoa(String.fromCharCode.apply(null, new Uint8Array(bits)));
}

/* ═══ AUTH ═══ */
var SESSION = { passkey: null, key: null, access: 'guest', visitorId: null };

async function authorize(passkey) {
  try {
    var visitor = await (await fpPromise).get();
    SESSION.visitorId = visitor.visitorId;
    var users = await fetch('./users.json').then(function(r) { return r.json(); });
    var savedKey = localStorage.getItem('jamu_key_' + visitor.visitorId);
    var inputKey = passkey || savedKey;

    if (!inputKey) {
      setStatus('--:-- | Guest');
      return;
    }

    var derivedPub = await derivePubKey(inputKey);
    var matched = null;
    var keys = Object.keys(users);
    for (var i = 0; i < keys.length; i++) {
      if (users[keys[i]].pubKey === derivedPub) {
        matched = users[keys[i]];
        matched._id = keys[i];
        break;
      }
    }

    if (matched) {
      localStorage.setItem('jamu_key_' + visitor.visitorId, inputKey);
      sessionStorage.setItem('access_level', matched.accessLevel);
      SESSION.passkey = inputKey;
      SESSION.key = await deriveKey(inputKey);
      SESSION.access = matched.accessLevel;
      setStatus(new Date().toLocaleTimeString() + ' | ' + matched.accessLevel);
      document.getElementById('u-name').textContent = matched.name;
      document.getElementById('u-img').src = matched.image;
      document.getElementById('posts-render').innerHTML = matched.postslist
        .map(function(f) { return '<li><a href="./' + f + '">' + f + '</a></li>'; }).join('');
      document.querySelectorAll('#auth-controls, #intro').forEach(function(el) { el.classList.add('is-hidden'); });
      document.querySelectorAll('#posts-render').forEach(function(el) { el.classList.remove('is-hidden'); });

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
  var el = document.getElementById('status-line');
  if (el) el.textContent = text;
}

/* ═══ ADMIN UI ═══ */
function renderAdminUI() {
  if (document.getElementById('admin-panel')) return;
  var panel = '<section id="admin-panel" class="admin-panel">' +
    '<div class="admin-title">Admin Panel</div>' +
    '<div class="admin-stat">Services: n8n <span id="n8n-stat">...</span> | WebDav <span id="webdav-stat">...</span></div>' +
    '<div class="admin-actions">' +
      '<input type="password" id="gh-pat" placeholder="GitHub PAT (encrypted)" class="passkey-input">' +
      '<button id="save-pat" class="btn btn-primary btn-sm">Save PAT</button>' +
    '</div>' +
    '<div class="admin-title" style="margin-top:1.6rem;">Encrypted Posts</div>' +
    '<ul id="md-list" class="admin-md-list"></ul>' +
    '<textarea id="md-editor" class="admin-editor" placeholder="Select a file to edit..." disabled></textarea>' +
    '<button id="md-save" class="btn btn-primary" disabled>Push to GitHub</button>' +
  '</section>';
  document.getElementById('content-main').insertAdjacentHTML('afterbegin', panel);

  // Service checks
  fetch('https://n8n.iguanodon-halosaur.ts.net/webhook/sgn', { mode: 'no-cors' })
    .then(function() { var e = document.getElementById('n8n-stat'); if (e) e.textContent = 'Online'; })
    .catch(function() { var e = document.getElementById('n8n-stat'); if (e) e.textContent = 'Offline'; });

  fetch('https://webdav-server.iguanodon-halosaur.ts.net/', { headers: { 'Authorization': 'Basic ' + btoa('admin:admin') } })
    .then(function(r) { var e = document.getElementById('webdav-stat'); if (e) e.textContent = r.status <= 401 ? 'Online' : 'Error ' + r.status; })
    .catch(function() { var e = document.getElementById('webdav-stat'); if (e) e.textContent = 'Offline'; });

  // PAT storage
  var savedPat = localStorage.getItem('gh_pat_enc');
  if (savedPat) {
    document.getElementById('gh-pat').placeholder = 'PAT saved (encrypted)';
  }
  document.getElementById('save-pat').onclick = async function() {
    var patInput = document.getElementById('gh-pat');
    if (!patInput.value) return;
    var enc = await encrypt(patInput.value, SESSION.key);
    localStorage.setItem('gh_pat_enc', enc);
    patInput.value = '';
    patInput.placeholder = 'PAT saved (encrypted)';
  };

  // MD list
  var files = ['test-post.md', 'multable.md'];
  document.getElementById('md-list').innerHTML = files.map(function(f) {
    return '<li class="admin-md-item"><span>' + f + '</span><button class="btn btn-outline btn-sm" onclick="loadMd(\'' + f + '\')">Edit</button></li>';
  }).join('');

  // Save button
  document.getElementById('md-save').onclick = function() { saveMd(); };
}

/* ═══ MD EDITOR ═══ */
async function loadMd(filename) {
  var resp = await fetch('./' + filename);
  var text = await resp.text();
  document.getElementById('md-editor').value = text;
  document.getElementById('md-editor').disabled = false;
  document.getElementById('md-save').disabled = false;
  document.getElementById('md-save').dataset.filename = filename;
}

async function saveMd() {
  var editor = document.getElementById('md-editor');
  var filename = document.getElementById('md-save').dataset.filename;
  var content = editor.value;
  if (!filename || !content) return;

  var encrypted = await encrypt(content, SESSION.key);
  var frontMatter = '---\nlayout: post\ntitle: "Encrypted"\nenc: true\npubKey: "' + await derivePubKey(SESSION.passkey) + '"\n---\n\nenc::' + encrypted;

  var pat = await decrypt(localStorage.getItem('gh_pat_enc'), SESSION.key);
  if (!pat) { alert('Save GitHub PAT first'); return; }

  await pushToGitHub(pat, filename, frontMatter);
}

/* ═══ GITHUB API ═══ */
async function getFileSHA(token, path) {
  var resp = await fetch('https://api.github.com/repos/jamu-healing/jamu-healing.github.io/contents/4-70-16/' + path, {
    headers: { 'Authorization': 'token ' + token }
  });
  if (resp.ok) {
    var data = await resp.json();
    return data.sha;
  }
  return null;
}

async function pushToGitHub(token, filename, content) {
  var sha = await getFileSHA(token, filename);
  var body = { message: 'Update encrypted ' + filename, content: btoa(unescape(encodeURIComponent(content))), branch: 'redesign/static-css' };
  if (sha) body.sha = sha;

  var resp = await fetch('https://api.github.com/repos/jamu-healing/jamu-healing.github.io/contents/4-70-16/' + filename, {
    method: 'PUT',
    headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (resp.ok) {
    alert('Pushed to GitHub');
  } else {
    var err = await resp.json();
    alert('Push failed: ' + (err.message || 'Unknown'));
  }
}

/* ═══ POST DECRYPTOR ═══ */
async function decryptPage() {
  var box = document.querySelector('enc-box');
  if (!box) return;
  var encText = box.textContent.trim().replace(/^enc::/, '');
  if (!encText) return;

  var passkey = sessionStorage.getItem('passkey') || SESSION.passkey;
  if (!passkey) {
    var el = document.querySelector('.enc-warning');
    if (el) el.textContent = 'Passkey required - login first';
    return;
  }

  var key = await deriveKey(passkey);
  try {
    var html = await decrypt(encText, key);
    box.classList.remove('is-hidden');
    box.innerHTML = html;
    var warn = document.querySelector('.enc-warning');
    if (warn) warn.classList.add('is-hidden');
  } catch (e) {
    console.error('Decrypt failed:', e);
  }
}

/* ═══ INIT ═══ */
document.addEventListener('DOMContentLoaded', function() {
  var authForm = document.getElementById('auth-controls');
  if (authForm) {
    authForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var passkey = document.getElementById('passkey');
      if (passkey) authorize(passkey.value);
    });
  }
  authorize();
  decryptPage();
});
