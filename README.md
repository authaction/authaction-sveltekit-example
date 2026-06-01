# authaction-sveltekit-example

A SvelteKit application demonstrating OAuth2 authentication using [AuthAction](https://app.authaction.com/) with PKCE flow and server-side sessions.

## Overview

This application shows how to configure and handle authentication using AuthAction's OAuth2 service in a SvelteKit application. The setup includes:

- OAuth2 PKCE login flow using the `arctic` library
- Secure server-side session management with cookies
- Protected routes using SvelteKit's `+page.server.ts` loaders
- Logout with AuthAction's OIDC logout flow

## Prerequisites

- **Node.js 18+**
- **AuthAction credentials**: `tenantDomain`, `clientId`, `clientSecret`, and configured redirect URIs.

## Installation

1. **Clone the repository**:

   ```bash
   git clone git@github.com:authaction/authaction-sveltekit-example.git
   cd authaction-sveltekit-example
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure your AuthAction credentials**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and replace the placeholders:

   ```env
   AUTHACTION_TENANT_DOMAIN=your-authaction-tenant-domain
   AUTHACTION_CLIENT_ID=your-authaction-client-id
   AUTHACTION_CLIENT_SECRET=your-authaction-client-secret
   AUTHACTION_REDIRECT_URI=http://localhost:5173/auth/callback
   AUTHACTION_LOGOUT_REDIRECT_URI=http://localhost:5173
   ```

4. **Configure redirect URIs in the AuthAction dashboard**:

   - Login redirect URI: `http://localhost:5173/auth/callback`
   - Logout redirect URI: `http://localhost:5173`

## Usage

1. **Start the development server**:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

2. **Testing Authentication**:
   - Navigate to `http://localhost:5173` and click **Login with AuthAction**.
   - After login you are redirected to `/dashboard` with your name and email shown.
   - Click **Logout** to destroy the session and return to the home page.

## Project Structure

```
authaction-sveltekit-example/
├── src/
│   ├── lib/
│   │   ├── auth.server.ts        # OAuth2 endpoints and client config
│   │   └── session.server.ts     # Cookie session helpers
│   ├── routes/
│   │   ├── +page.svelte          # Home page (public)
│   │   ├── +page.server.ts       # Loads session for home page
│   │   ├── dashboard/
│   │   │   ├── +page.svelte      # Protected dashboard page
│   │   │   └── +page.server.ts   # Auth guard — redirects if no session
│   │   └── auth/
│   │       ├── login/+server.ts  # Initiates PKCE OAuth2 flow
│   │       ├── callback/+server.ts # Exchanges code for tokens
│   │       └── logout/+server.ts  # Clears session + OIDC logout
│   └── app.d.ts
├── svelte.config.js
├── vite.config.js
├── .env.example
└── package.json
```

## Code Explanation

### `src/lib/auth.server.ts` — OAuth2 Config

Exports the authorization, token, userinfo, and logout endpoint URLs built from `AUTHACTION_TENANT_DOMAIN`.

### `src/lib/session.server.ts` — Session Helpers

`setSession` / `getSession` / `clearSession` — base64-encoded cookie storage. Replace with an encrypted store in production.

### `src/routes/auth/login/+server.ts` — Login

Generates a PKCE `state` and `code_verifier`, stores them in short-lived cookies, and redirects to AuthAction's authorization endpoint.

### `src/routes/auth/callback/+server.ts` — Callback

Validates `state`, exchanges the authorization code for tokens using PKCE, fetches the user profile from the `userinfo` endpoint, and stores the session cookie.

### `src/routes/auth/logout/+server.ts` — Logout

Clears the session cookie and redirects to AuthAction's OIDC logout endpoint.

### `src/routes/dashboard/+page.server.ts` — Auth Guard

Loader reads the session cookie and redirects unauthenticated users to `/`.

## Common Issues

**Redirects not working** — Verify `AUTHACTION_REDIRECT_URI` matches exactly what is configured in the AuthAction dashboard.

**Session issues** — The example uses plain base64 encoding for simplicity. In production, use an encrypted session store.

**Network errors** — Verify your app can reach `https://{AUTHACTION_TENANT_DOMAIN}/oauth2/token`.

## Contributing

Feel free to submit issues or pull requests if you encounter bugs or have suggestions for improvement!
