import type { Block } from 'payload'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'CSS', value: 'css' },
        { label: 'HTML', value: 'html' },
        { label: 'JSON', value: 'json' },
        { label: 'Bash / Shell', value: 'bash' },
        { label: 'Svelte', value: 'svelte' },
        { label: 'Astro', value: 'astro' },
        { label: 'Markdown', value: 'markdown' },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    },
  ],
}
