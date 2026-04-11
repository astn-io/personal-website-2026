export default function slugify(link: string): string {
  return link
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^\w-]/g, '_');
}
