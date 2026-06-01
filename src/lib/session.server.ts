import type { Cookies } from '@sveltejs/kit';

const SESSION_COOKIE = 'session';
const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24, // 24 hours
};

export interface Session {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  accessToken: string;
}

// Simple base64 encoding — use a proper encrypted store in production
export function setSession(cookies: Cookies, session: Session): void {
  cookies.set(SESSION_COOKIE, btoa(JSON.stringify(session)), COOKIE_OPTIONS);
}

export function getSession(cookies: Cookies): Session | null {
  const raw = cookies.get(SESSION_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(atob(raw)) as Session;
  } catch {
    return null;
  }
}

export function clearSession(cookies: Cookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}
