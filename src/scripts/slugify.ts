export default function slugify(link: string): string {
  return link.toLowerCase().replaceAll(' ', '-');
}
