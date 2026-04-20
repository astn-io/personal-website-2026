import { defineMiddleware } from 'astro:middleware';

const PAYLOAD_URL =
  process.env.PAYLOAD_URL ??
  process.env.NEXT_PUBLIC_SERVER_URL ??
  'http://localhost:3000';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname, search } = context.url;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const target = new URL(pathname + search, PAYLOAD_URL);
    return context.redirect(target.toString(), 302);
  }

  return next();
});
