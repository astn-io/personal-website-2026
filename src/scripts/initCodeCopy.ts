export default function initCodeCopy(): () => void {
  const controller = new AbortController();
  const { signal } = controller;

  document
    .querySelectorAll<HTMLElement>('.astro-code .line')
    .forEach((line) => {
      line.addEventListener(
        'click',
        async () => {
          if (window.getSelection()?.toString()) return;

          const text = line.textContent ?? '';
          if (!text.trim()) return;

          try {
            await navigator.clipboard.writeText(text);
            line.dataset.copied = 'true';
            setTimeout(() => {
              delete line.dataset.copied;
            }, 1200);
          } catch (err) {
            console.warn('[code-copy] line clipboard write failed', err);
          }
        },
        { signal },
      );
    });

  document.querySelectorAll<HTMLElement>('.astro-code').forEach((block) => {
    if (block.parentElement?.classList.contains('code-block-wrapper')) return;

    const lang = block.dataset.language || 'text';

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';

    const badge = document.createElement('button');
    badge.type = 'button';
    badge.className = 'code-copy-badge';
    badge.textContent = lang;
    badge.setAttribute('aria-label', `Copy ${lang} code block`);

    badge.addEventListener(
      'click',
      async (e) => {
        e.stopPropagation();

        const code = block.querySelector('code');
        const text = code?.textContent ?? '';
        if (!text.trim()) return;

        try {
          await navigator.clipboard.writeText(text);
          badge.dataset.copied = 'true';
          badge.textContent = 'Copied!';
          setTimeout(() => {
            delete badge.dataset.copied;
            badge.textContent = lang;
          }, 1200);
        } catch (err) {
          console.warn('[code-copy] block clipboard write failed', err);
        }
      },
      { signal },
    );

    block.parentNode?.insertBefore(wrapper, block);
    wrapper.appendChild(block);
    wrapper.appendChild(badge);
  });

  return () => controller.abort();
}
