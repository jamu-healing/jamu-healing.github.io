# Implementation Plan: Private Access System for /4-70-16/

[Overview]
Implement a client-side zero-knowledge encrypted content system for the Jamu Healing website's private section. The system uses Web Crypto API (AES-GCM + PBKDF2) to encrypt/decrypt markdown content, with GitHub Actions handling server-side build-time encryption. The architecture ensures no plaintext content exists in the repository or on deployed pages.

[Types]
Data structures defined in users.json and runtime JavaScript objects.

### users.json Schema
```json
{
  "u_7d1a": {
    "name": "Administrator",
    "pubKey": "base64_derived_public_key",
    "accessLevel": "admin",
    "image": "/images/evi-sudarto.jpg",
    "postslist": ["test-post.md"]
  }
}
```
- Key: `u_[short_hash]` (not raw passkey name)
- `pubKey`: Base64 string derived from PBKDF2(passkey) -> exportKey("raw") -> btoa
- `accessLevel`: enum [admin, debug, guest, user, demo]
- `postslist`: Array of `.md` filenames user can access

### Runtime Objects
```javascript
// Session state
const state = {
  visitorId: string,       // FingerprintJS
  accessLevel: string,     // from users.json
  passkey: string,         // raw passkey input
  derivedKey: CryptoKey    // AES-GCM key from PBKDF2
};
```

### Encrypted File Format
```
---
layout: post
title: "Encrypted"
enc: true
pubKey: "base64_derived_key"
---

enc::base64(iv+ciphertext)
```

### HTML Encryption Format
```html
<enc-box data-enc-pk="base64_pubkey" class="is-hidden">base64_encrypted_html</enc-box>
<div class="enc-warning">Encrypted content - enter passkey to view</div>
```

[Files]
Files to create, modify, and configure for the private access system.

### New Files
| Path | Purpose |
|------|---------|
| `scripts/encrypt-build.js` | Node.js script for GitHub Actions: decrypt .md, jekyll build, encrypt HTML output |
| `_layouts/encrypted.html` | Jekyll layout for encrypted posts (renders enc-box + warning) |

### Modified Files
| Path | Changes |
|------|---------|
| `4-70-16/users.json` | Restructure: `u_hash` keys, add `pubKey`, `accessLevel` field |
| `4-70-16/auth.js` | Add crypto core (deriveKey, encrypt, decrypt), admin UI, GitHub API, decryptor |
| `4-70-16/index.html` | Add admin panel markup (editor textarea, PAT input, md list), enc-box decrypt logic |
| `css/private.css` | Add styles for admin editor, enc-warning, enc-box |
| `.github/workflows/jekyll.yml` | Add Node.js setup + `node scripts/encrypt-build.js` step before jekyll build |

### Deleted/Moved Files
| Path | Action | Reason |
|------|--------|--------|
| `4-70-16/test-post.md` | Rename to `.md.enc` | Encrypted format in repo |

[Functions]
JavaScript functions for crypto, UI management, and GitHub API.

### Crypto Core (auth.js)
| Function | Signature | Purpose |
|----------|-----------|---------|
| `deriveKey(passkey)` | `async (string) -> CryptoKey` | PBKDF2(SHA-256, 100000 iterations, salt from passkey) -> AES-GCM 256-bit key |
| `encrypt(text, key)` | `async (string, CryptoKey) -> string` | AES-GCM encrypt -> return base64(iv + ciphertext) |
| `decrypt(base64, key)` | `async (string, CryptoKey) -> string` | base64 decode -> split iv + ciphertext -> AES-GCM decrypt -> return plaintext |
| `derivePubKey(passkey)` | `async (string) -> string` | PBKDF2 -> exportKey("raw") -> base64 (for users.json pubKey generation) |
| `verifyAccess(passkey, pubKey)` | `async (string, string) -> bool` | derivePubKey(passkey) === pubKey |

### Admin UI (auth.js)
| Function | Signature | Purpose |
|----------|-----------|---------|
| `renderAdminUI()` | `() -> void` | Show admin panel: md list, editor textarea, PAT input |
| `loadMdList()` | `async () -> void` | Fetch directory listing or use hardcoded list, render links |
| `editMdFile(filename)` | `async (string) -> void` | Fetch raw .md, decrypt if needed, populate textarea |
| `saveMdFile(filename)` | `async (string) -> void` | Encrypt textarea content, push to GitHub via API |

### GitHub API (auth.js)
| Function | Signature | Purpose |
|----------|-----------|---------|
| `getPAT()` | `() -> string` | Get encrypted PAT from localStorage, decrypt with passkey |
| `pushToGitHub(filename, content)` | `async (string, string) -> bool` | Create blob -> tree -> commit -> push via REST API |
| `getFileSHA(path)` | `async (string) -> string` | Get current file SHA for update operations |

### Decryptor (auth.js)
| Function | Signature | Purpose |
|----------|-----------|---------|
| `decryptPage()` | `async () -> void` | Find `<enc-box>`, get passkey from session, decrypt, replace warning with content |

### Modified Functions
| Function | File | Change |
|----------|------|--------|
| `authorize(key)` | auth.js | Rewrite: deriveKey, verifyAccess against all pubKeys, set accessLevel, render appropriate UI state |

### Removed Functions
| Function | File | Reason |
|----------|------|--------|
| `checkAdminServices()` | auth.js | Replace with admin panel render (n8n/webdav checks move to admin dashboard) |

[Classes]
No classes needed. Pure functional approach with module-level functions.

[Dependencies]
No external dependencies. All crypto via native Web Crypto API. GitHub API via native fetch.

### Tools Used
- Web Crypto API (AES-GCM, PBKDF2) - native browser API
- FingerprintJS v4 - already loaded via CDN
- GitHub REST API v3 - via fetch
- Node.js - only for build script (scripts/encrypt-build.js)

[Testing]
Verification approach using deploy-first workflow.

### Manual Verification Steps
1. Generate pubKey for "debug" passkey using `derivePubKey("debug")` in browser console
2. Update users.json with generated pubKey
3. Login with "debug" passkey - verify user card shows, posts list visible
4. Login with "admin" passkey - verify admin panel shows
5. Create encrypted test post via admin editor
6. Visit `/4-70-16/test-post.html` - verify enc-box decrypts with passkey in session
7. Test offline (file://) - verify cached passkey enables decryption

### Test Passkeys
- admin: Full access + admin panel + editor + GitHub push
- debug: View-only access to test-post.md
- guest: No access, only passkey form

[Implementation Order]
Sequential implementation to minimize integration conflicts.

### Phase 1: Crypto Core + Data Schema
1. Write `deriveKey()`, `encrypt()`, `decrypt()`, `derivePubKey()`, `verifyAccess()` functions
2. Generate pubKey for existing passkeys ("admin", "debug")
3. Update `users.json` with new schema (u_hash keys, pubKey, accessLevel)

### Phase 2: Auth Rewrite + UI States
4. Rewrite `authorize()` function to use crypto verification
5. Add `renderAdminUI()` with editor, PAT input, md list
6. Update `index.html` with admin panel markup
7. Add CSS styles for admin editor

### Phase 3: GitHub API + Push
8. Implement `getPAT()`, `pushToGitHub()`, `getFileSHA()`
9. Wire admin editor to GitHub API
10. Add encrypted PAT storage flow

### Phase 4: Encrypted Layout + Decryptor
11. Create `_layouts/encrypted.html` with enc-box markup
12. Implement `decryptPage()` function
13. Add enc-warning + enc-box CSS styles

### Phase 5: Build Script
14. Write `scripts/encrypt-build.js` for GitHub Actions
15. Update `.github/workflows/jekyll.yml` with Node.js step

### Phase 6: Deploy + Verify
16. Deploy all changes
17. Verify on live site
18. Update `specs/actual-progress.md`