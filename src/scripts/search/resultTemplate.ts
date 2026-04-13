const SOURCE_META: Record<string, { label: string; icon: string }> = {
  blog: { label: 'Blog Post', icon: 'ri-quill-pen-line' },
  guides: { label: 'Guide', icon: 'ri-book-open-line' },
  frontendProjects: { label: 'Frontend Project', icon: 'ri-code-s-slash-line' },
};

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getLink(result: any) {
  switch (result.source) {
    case 'blog':
      return `/blog/${result.slug}`;
    case 'guides':
      return `/guides/${result.slug}`;
    case 'frontendProjects':
      return `/projects/frontend/${result.slug}`;
    default:
      return '#';
  }
}

function formatDate(result: any) {
  return new Date(result.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function resultTemplate(result: any) {
  const link = getLink(result);
  const date = formatDate(result);
  const meta = SOURCE_META[result.source] ?? {
    label: result.source,
    icon: 'ri-file-line',
  };

  const title = escapeHtml(result.title);
  const desc = escapeHtml(result.description);

  return /*html*/ `
    <li class="search-result-item">
      <h3 class="search-result-title">
        <a href="${link}">${title}</a>
      </h3>
      <hr class="search-result-hr" />
      <div class="search-result-meta">
        <span class="search-result-source">
          <span class="${meta.icon}" aria-hidden="true"></span>${meta.label}
        </span>
        <time class="search-result-date">
          <span class="ri-calendar-line" aria-hidden="true"></span>${date}
        </time>
      </div>
      <p class="search-result-desc">${desc}</p>
    </li>
  `;
}
