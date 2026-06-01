import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logoutEndpoint } from '$lib/auth.server';
import { clearSession } from '$lib/session.server';

export const POST: RequestHandler = async ({ cookies }) => {
  clearSession(cookies);

  const url = new URL(logoutEndpoint);
  url.searchParams.set('post_logout_redirect_uri', process.env.AUTHACTION_LOGOUT_REDIRECT_URI!);

  redirect(302, url.toString());
};
