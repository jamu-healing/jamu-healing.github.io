# Onboard Workflow — /4-70-16/ Private Blog Project

## Quick Facts

| Item | Value |
|------|-------|
| Repo | https://github.com/jamu-healing/jamu-healing.github.io.git |
| GitHub Pages | https://jamu-healing.github.io/4-70-16/ |
| Branch | redesign/static-css |
| Tech | Jekyll + Liquid + CSS + HTML + Web Crypto API + GitHub Apps |

## CRITICAL RULES

### 1. No Local Server
This is a Jekyll site with encrypted content. You cannot run `python3 -m http.server` to test. The only valid test is via deploy.

### 2. Deploy-First Workflow
All changes must be pushed to GitHub for testing. There is no local preview.

### 3. Read .clinerules Before Every Task
See `/.clinerules/` directory:
- NO inline styles
- NO emojis anywhere
- NO Tailwind CSS

## File Rules for /4-70-16/

### Allowed Files
- `index.html` — Entry point with auth
- `admin.html` — Admin dashboard (queue + users)
- `posts.html` — Posts list (my/shared)
- `auth.js` — Authentication logic
- `auth-handler.js` — GitHub OAuth integration
- `crypto-vault.js` — AES-GCM encryption
- `polling.js` — GitHub API polling
- `web-components.js` — Custom elements
- `users.json` — Legacy user database (deprecated, use registry.yml)
- `_private/` — Content directory (gitignored)
- `docs/` — Documentation (gitignored)

### Forbidden Files
- `index.md` — Blocks custom index.html (must be .md.old)

## Deploy Workflow

Step-by-step process for deploying changes:

```bash
# 1. Check current branch
git status

# 2. Stage changes
git add <files>

# 3. Check what will be committed
git status

# 4. Commit
git commit -m "description"

# 5. Push to dev branch
git push origin redesign/static-css

# 6. Merge to main for deployment
git checkout main && git merge redesign/static-css -m "description" && git push origin main && git checkout redesign/static-css
```

## Verification

After deploy, check the live site:

```bash
# Check private section loads
curl -s https://jamu-healing.github.io/4-70-16/

# Check specific file
curl -s https://jamu-healing.github.io/4-70-16/path/to/file

# Check encrypted content (should return enc:: prefix)
curl -s https://jamu-healing.github.io/4-70-16/test-post.html
```

## Common Pitfalls to Avoid

| Pitfall | Solution |
|---------|----------|
| index.md blocks custom index.html | Rename to .md.old |
| Changes not visible | Deploy via push (no local server) |
| 404 on .md files | Jekyll must process /4-70-16/ directory |
| CORS blocked | Use no-cors mode for external requests |
| Encrypt fails | MASTER_KEY not set in GitHub Secrets |

## Key Directories

| Directory | Purpose |
|-----------|---------|
| /4-70-16/ | Private content with auth |
| /4-70-16/_private/ | User-generated content (gitignored) |
| /4-70-16/docs/ | Documentation (ADR, tgt-vision, task-now) |
| /_data/ | Jekyll data files (registry.yml) |
| /css/ | Styles (private.css, blogpost.css) |
| /_includes/ | Reusable HTML fragments |
| /_layouts/ | Page templates (encrypted.html, post.html) |

## Authentication

### Current System (v2)
- **Passkey-based:** admin, debug
- **Auth files:** 4-70-16/auth.js, 4-70-16/users.json
- **Crypto:** PBKDF2 SHA-256 + AES-GCM 256-bit

### Target System (v3 - GitHub Apps)
- **GitHub OAuth 2.0:** Two apps for access and content
- **User registry:** _data/registry.yml
- **Content storage:** _private/usrs/, _private/shared/
- **Master key:** GitHub Secrets (ManageUsers-App)

## Project Documentation

### Main Files
- `4-70-16/docs/ADR-OAuth-MU.md` — Architecture decision for multi-user
- `4-70-16/docs/tgt-vision.md` — Target implementation vision
- `4-70-16/docs/task-now.md` — Current implementation plan

### To Start a New Task
1. Read ADR-OAuth-MU.md
2. Read tgt-vision.md
3. Check task-now.md for phase status
4. Implement changes
5. Deploy and verify

## Current Status (v2)

### What Works:
- ✅ index.html loads with crypto auth system
- ✅ Passkey field inside form (no DOM warning)
- ✅ User profile card with guest avatar (/images/person-slash.svg)
- ✅ Posts return 200 (test-post.html, multable.html)
- ✅ Users.json with pubKey schema
- ✅ Admin UI (editor, encrypted PAT, md list, GitHub push)
- ✅ Crypto core: deriveKey(), encrypt(), decrypt(), derivePubKey()
- ✅ Secrets isolation (.gitignore blocks .local-keys.json, .env)

### What Needs Work (v3):
- [ ] Implement auth-handler.js for two-app OAuth
- [ ] Create crypto-vault.js (Web Crypto API)
- [ ] Organize _private/ folder structure
- [ ] Configure GitHub Apps permissions
- [ ] Set MASTER_KEY in GitHub Secrets

## Next Steps (v3)

1. **Phase 1:** Foundation — auth-handler, crypto-vault, _private/ structure
2. **Phase 2:** Auth & Profile — login UI, request card, spinner
3. **Phase 3:** Admin Dashboard — queue, users tabs, approve/block
4. **Phase 4:** Posts List — my/shared views, decryption
5. **Phase 5:** Web Components — img-crsl, post-video, link-box
6. **Phase 6:** Deploy — GitHub Apps config, test

## Contact

For access to GitHub Secrets or help with configuration, contact the project administrator.