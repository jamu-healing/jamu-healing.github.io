export default class PostView {
  static generateTOC() {
    const toc = document.getElementById('toc');
    if (!toc) return;
    
    const headings = document.querySelectorAll('.post-content h2, .post-content h3');
    const ul = document.createElement('ul');
    
    headings.forEach(heading => {
      const id = heading.textContent.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      heading.id = id;
      
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = heading.textContent;
      a.className = heading.tagName.toLowerCase();
      
      li.appendChild(a);
      ul.appendChild(li);
    });
    
    toc.appendChild(ul);
  }

  static addCodeBlockButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(pre => {
      const code = pre.querySelector('code');
      if (!code) return;

      const langMatch = code.className.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : 'code';

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      const header = document.createElement('div');
      header.className = 'code-block-header';
      header.innerHTML = `<span>${lang}</span>`;

      const actions = document.createElement('div');
      actions.className = 'code-block-actions';

      // Copy button
      const copyBtn = document.createElement('button');
      copyBtn.innerHTML = '<i class="bi bi-copy"></i> Copy';
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied';
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="bi bi-copy"></i> Copy';
          }, 2000);
        } catch (error) {
          console.error('Copy failed:', error);
        }
      });
      actions.appendChild(copyBtn);

      // Download button
      const downloadBtn = document.createElement('button');
      downloadBtn.innerHTML = '<i class="bi bi-download"></i> Download';
      downloadBtn.addEventListener('click', () => {
        const text = code.textContent;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'code.txt';
        a.click();
        URL.revokeObjectURL(url);
      });
      actions.appendChild(downloadBtn);

      header.appendChild(actions);

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }

  static init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.generateTOC();
      this.addCodeBlockButtons();
    });
  }
}