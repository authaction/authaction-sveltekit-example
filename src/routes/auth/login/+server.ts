import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateState, generateCodeVerifier, calculatePKCECodeChallenge } from 'arctic';
import { authorizationEndpoint, oauth2Client } from '$lib/auth.server';

export const GET: RequestHandler = async ({ cookies }) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);

  cookies.set('oauth_state', state, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 600 });
  cookies.set('oauth_code_verifier', codeVerifier, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 600 });

  const url = new URL(authorizationEndpoint);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', oauth2Client.clientId);
  url.searchParams.set('redirect_uri', process.env.AUTHACTION_REDIRECT_URI!);
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  redirect(302, url.toString());
};
