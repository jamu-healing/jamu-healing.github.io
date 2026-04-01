const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4').then(f => f.load());
const DEFAULT_AVATAR = '/images/person-slash.svg';

async function authorize(key) {
  try {
    const visitor = await (await fpPromise).get();
    const users = await fetch('./users.json').then(r => r.json());
    const savedKey = localStorage.getItem(`jamu_key_${visitor.visitorId}`);
    const activeKey = key || savedKey;
    const user = users[activeKey];

    if (user) {
      localStorage.setItem(`jamu_key_${visitor.visitorId}`, activeKey);
      sessionStorage.setItem('access_level', activeKey);
      
      document.getElementById('status-line').textContent = `${new Date().toLocaleTimeString()} | ${user.status}`;
      document.getElementById('u-name').textContent = user.name;
      document.getElementById('u-img').src = user.image;
      document.getElementById('posts-render').innerHTML = user.postslist
        .map(file => `<li><a href="./${file}">${file}</a></li>`).join('');
      
      document.querySelectorAll('#auth-controls, #intro').forEach(el => el.classList.add('is-hidden'));
      document.querySelectorAll('#posts-render').forEach(el => el.classList.remove('is-hidden'));

      if (activeKey === 'admin') {
        checkAdminServices();
      }
    } else if (key) {
      document.getElementById('status-line').textContent = `${new Date().toLocaleTimeString()} | Invalid Key`;
    }
  } catch (error) {
    console.error('Authorization error:', error);
    document.getElementById('status-line').textContent = `${new Date().toLocaleTimeString()} | Error`;
  }
}

function checkAdminServices() {
  const existingPanel = document.getElementById('admin-info');
  if (existingPanel) return;

  const adminPanel = '<section id="admin-info" class="admin-panel">' +
    '<div class="admin-title">Admin Services Status</div>' +
    '<div id="n8n-stat" class="admin-stat">n8n: checking...</div>' +
    '<div id="webdav-stat" class="admin-stat">WebDav: checking...</div>' +
    '</section>';
  document.getElementById('content-main').insertAdjacentHTML('afterbegin', adminPanel);

  // n8n - use webhook/sgn endpoint with no-cors (opaque response means success)
  fetch('https://n8n.iguanodon-halosaur.ts.net/webhook/sgn', { mode: 'no-cors' })
    .then(() => {
      var el = document.getElementById('n8n-stat');
      if (el) el.textContent = 'n8n: Online';
    })
    .catch(() => {
      var el = document.getElementById('n8n-stat');
      if (el) el.textContent = 'n8n: Offline';
    });

  // WebDav - GET with Basic auth, 401 = server responding (online)
  var auth = 'Basic ' + btoa('admin:admin');
  fetch('https://webdav-server.iguanodon-halosaur.ts.net/', {
    headers: { 'Authorization': auth }
  })
    .then(r => {
      var el = document.getElementById('webdav-stat');
      if (el) {
        if (r.status === 200) el.textContent = 'WebDav: Connected (200 OK)';
        else if (r.status === 401) el.textContent = 'WebDav: Online (401)';
        else el.textContent = 'WebDav: Error ' + r.status;
      }
    })
    .catch(() => {
      var el = document.getElementById('webdav-stat');
      if (el) el.textContent = 'WebDav: Offline';
    });
}

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
});
