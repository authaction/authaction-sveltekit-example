import { Arctic, OAuth2Client } from 'arctic';

const domain = process.env.AUTHACTION_TENANT_DOMAIN!;

export const oauth2Client = new OAuth2Client(
  process.env.AUTHACTION_CLIENT_ID!,
  process.env.AUTHACTION_CLIENT_SECRET!,
  process.env.AUTHACTION_REDIRECT_URI!
);

export const authorizationEndpoint = `https://${domain}/oauth2/authorize`;
export const tokenEndpoint = `https://${domain}/oauth2/token`;
export const userinfoEndpoint = `https://${domain}/oauth2/userinfo`;
export const logoutEndpoint = `https://${domain}/oidc/logout`;
