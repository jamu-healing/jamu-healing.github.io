# Actual Progress - /4-70-16/ Project Status

## Current State After Deploy (v2 - ADR Implementation)

### What Works:
- ✅ index.html loads with crypto auth system (PBKDF2 + AES-GCM)
- ✅ Passkey field inside `<form>` (no DOM warning)
- ✅ User profile card with guest avatar (/images/person-slash.svg, #666)
- ✅ Posts return 200 (test-post.html, multable.html)
- ✅ Users.json with pubKey schema (u_hash keys, no raw passwords)
- ✅ Admin UI (editor, encrypted PAT, md list, GitHub push)
- ✅ Crypto core: deriveKey(), encrypt(), decrypt(), derivePubKey()
- ✅ Secrets isolation (.gitignore blocks .local-keys.json, .env, payload.json)
- ✅ init-users.js generates users.json from .local-keys.json
- ✅ encrypt-build.js for GitHub Actions CI/CD
- ✅ encrypted.html layout for encrypted posts
- ✅ GitHub Actions workflow updated with Node.js + encrypt-build.js step

### Crypto Details:
- **Algorithm:** AES-GCM 256-bit
- **KDF:** PBKDF2 SHA-256, 100000 iterations
- **IV:** 12 bytes random
- **PubKey:** PBKDF2(passkey + ":pubkey") -> Base64
- **PAT Storage:** localStorage encrypted with AES-GCM (current session key)

### What Does NOT Work:

#### 1. MASTER_KEY not set in GitHub Secrets
**Status:** PENDING

encrypt-build.js requires `MASTER_KEY` environment variable from GitHub Repository Secrets. Without it, the encryption step is skipped.

**Fix Required:**
- Add MASTER_KEY to GitHub Repository Secrets
- Test encrypt-build.js with real encrypted .md files

#### 2. No real encrypted test content
**Status:** PENDING

No .md file with `enc::` prefix exists for testing the decrypt flow in CI/CD.

**Fix Required:**
- Create a test encrypted .md file via admin UI
- Verify GitHub Actions decrypts and encrypts correctly

#### 3. GitHub PAT not saved
**Status:** PENDING

Admin UI requires PAT to push encrypted content to GitHub. No PAT is currently stored.

**Fix Required:**
- Login as admin, enter GitHub PAT in admin panel
- Test push via admin UI

---

## Summary:

**Status: DEPLOYED - CRYPTO READY**

- Auth system ✅ Working (PBKDF2 + AES-GCM)
- Posts ✅ All return 200 (Jekyll processes /4-70-16/)
- User icon ✅ Guest avatar visible
- Server check ✅ n8n /webhook/sgn, WebDav GET 401=Online
- DOM ✅ No warnings (form element)
- CSS ✅ .is-hidden, admin-panel, editor, enc-box styles
- Crypto ✅ deriveKey, encrypt, decrypt, derivePubKey
- Secrets ✅ Isolated via .gitignore + .local-keys.json
- CI/CD ✅ encrypt-build.js + GitHub Actions workflow

**Next Steps:**
1. Set MASTER_KEY in GitHub Repository Secrets
2. Create encrypted test .md via admin UI
3. Verify full encrypt/decrypt cycle in production