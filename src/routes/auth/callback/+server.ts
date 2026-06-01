import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { tokenEndpoint, userinfoEndpoint, oauth2Client } from '$lib/auth.server';
import { setSession } from '$lib/session.server';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get('oauth_state');
  const codeVerifier = cookies.get('oauth_code_verifier');

  if (!code || !state || state !== storedState || !codeVerifier) {
    error(400, 'Invalid OAuth2 callback');
  }

  cookies.delete('oauth_state', { path: '/' });
  cookies.delete('oauth_code_verifier', { path: '/' });

  // Exchange code for tokens
  const tokenRes = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.AUTHACTION_REDIRECT_URI!,
      client_id: process.env.AUTHACTION_CLIENT_ID!,
      client_secret: process.env.AUTHACTION_CLIENT_SECRET!,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenRes.ok) error(500, 'Token exchange failed');

  const tokens = await tokenRes.json();

  // Fetch user profile
  const userRes = await fetch(userinfoEndpoint, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userRes.ok) error(500, 'Failed to fetch user info');

  const user = await userRes.json();

  setSession(cookies, {
    sub: user.sub,
    name: user.name,
    email: user.email,
    picture: user.picture,
    accessToken: tokens.access_token,
  });

  redirect(302, '/dashboard');
};
