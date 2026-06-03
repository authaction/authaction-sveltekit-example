import { createSvelteAuth } from '@authaction/server-sdk/svelte';
import { env } from '$env/dynamic/private';

export const auth = createSvelteAuth({
  domain: env.AUTHACTION_DOMAIN,
  clientId: env.AUTHACTION_CLIENT_ID,
  clientSecret: env.AUTHACTION_CLIENT_SECRET,
  redirectUri: env.AUTHACTION_REDIRECT_URI,
  sessionSecret: env.SESSION_SECRET,
});
