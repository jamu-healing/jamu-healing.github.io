export default class OnPageDecryptor {
  static IV_LEN = 12;
  static ITERATIONS = 100000;

  static async deriveKey(passkey) {
    const enc = new TextEncoder();
    const salt = enc.encode(passkey);
    const keyMaterial = await crypto.subtle.importKey(
      'raw', 
      enc.encode(passkey), 
      'PBKDF2', 
      false, 
      ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      { 
        name: 'PBKDF2', 
        salt: salt, 
        iterations: this.ITERATIONS, 
        hash: 'SHA-256' 
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
  }

  static async decrypt(base64, key) {
    const buf = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const iv = buf.slice(0, this.IV_LEN);
    const cipher = buf.slice(this.IV_LEN);
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv }, 
      key, 
      cipher
    );
    return new TextDecoder().decode(plain);
  }

  static async decryptPage() {
    const box = document.querySelector('enc-box');
    if (!box) return;
    
    const encText = box.textContent.trim().replace(/^enc::/, '');
    if (!encText) return;
    
    const passkey = sessionStorage.getItem('passkey');
    if (!passkey) {
      const warning = document.querySelector('.enc-warning');
      if (warning) {
        warning.textContent = 'Passkey required - login at /4-70-16/ first';
      }
      return;
    }

    try {
      const key = await this.deriveKey(passkey);
      const html = await this.decrypt(encText, key);
      
      box.classList.remove('is-hidden');
      box.innerHTML = html;
      
      const warning = document.querySelector('.enc-warning');
      if (warning) {
        warning.classList.add('is-hidden');
      }
    } catch (error) {
      console.error('Decrypt failed:', error);
      const warning = document.querySelector('.enc-warning');
      if (warning) {
        warning.textContent = 'Decryption failed - invalid passkey';
      }
    }
  }

  static init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.decryptPage();
    });
  }
}