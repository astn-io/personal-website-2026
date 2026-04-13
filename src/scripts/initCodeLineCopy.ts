export default function initCodeLineCopy(): () => void {
  const controller = new AbortController();
  const { signal } = controller;

  const lines = document.querySelectorAll<HTMLElement>('.astro-code .line');

  lines.forEach((line) => {
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
          console.warn('[code-copy] clipboard write failed', err);
        }
      },
      { signal },
    );
  });

  return () => controller.abort();
}
