# authaction-sveltekit-example

A SvelteKit application demonstrating OAuth2 authentication using [AuthAction](https://app.authaction.com/) with `@authaction/server-sdk`.

## Overview

This application shows how to configure and handle authentication using AuthAction's OAuth2 service in a SvelteKit application. The setup includes:

- OAuth2 login flow using `@authaction/server-sdk/svelte`
- Secure server-side session management with encrypted cookies
- Protected routes using SvelteKit's `+page.server.ts` loaders
- Logout with AuthAction's OIDC logout flow

## Prerequisites

- **Node.js 18+**
- **AuthAction credentials**: `domain`, `clientId`, `clientSecret`, and configured redirect URIs.

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
   AUTHACTION_DOMAIN=your-authaction-tenant-domain
   AUTHACTION_CLIENT_ID=your-authaction-client-id
   AUTHACTION_CLIENT_SECRET=your-authaction-client-secret
   AUTHACTION_REDIRECT_URI=http://localhost:5173/auth/callback
   SESSION_SECRET=your-secure-random-string-min-32-chars
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
│   │   ├── auth.server.ts        # createSvelteAuth from @authaction/server-sdk/svelte
│   │   └── session.server.ts     # (managed by @authaction/server-sdk)
│   ├── hooks.server.ts           # auth.handle SvelteKit hook
│   ├── routes/
│   │   ├── +page.svelte          # Home page (public)
│   │   ├── +page.server.ts       # Loads session for home page
│   │   ├── dashboard/
│   │   │   ├── +page.svelte      # Protected dashboard page
│   │   │   └── +page.server.ts   # Auth guard — redirects if no session
│   │   └── auth/
│   │       ├── login/+server.ts  # Calls auth.handleLogin(event)
│   │       ├── callback/+server.ts # Calls auth.handleCallback(event)
│   │       └── logout/+server.ts  # Calls auth.handleLogout(event)
│   └── app.d.ts
├── svelte.config.js
├── vite.config.js
├── .env.example
└── package.json
```

## Code Explanation

### `src/lib/auth.server.ts` — Auth Setup

Calls `createSvelteAuth` from `@authaction/server-sdk/svelte` with your AuthAction credentials (`domain`, `clientId`, `clientSecret`, `redirectUri`, `sessionSecret`). The returned `auth` object exposes the SvelteKit hook and all handler methods.

### `src/hooks.server.ts` — SvelteKit Hook

Exports `auth.handle` as the SvelteKit `handle` hook. This populates `event.locals.session` for all requests.

### `src/routes/auth/login/+server.ts` — Login

Calls `auth.handleLogin(event)` to redirect the user to AuthAction's authorization endpoint.

### `src/routes/auth/callback/+server.ts` — Callback

Calls `auth.handleCallback(event)` to exchange the authorization code for tokens and set the session cookie.

### `src/routes/auth/logout/+server.ts` — Logout

Calls `auth.handleLogout(event)` to clear the session cookie and redirect to AuthAction's OIDC logout endpoint.

### `src/routes/dashboard/+page.server.ts` — Auth Guard

Loader checks `locals.session` and redirects unauthenticated users to `/`.

## Common Issues

**Redirects not working** — Verify `AUTHACTION_REDIRECT_URI` matches exactly what is configured in the AuthAction dashboard.

**Session issues** — Ensure `SESSION_SECRET` is a long, random string (32+ characters).

**Network errors** — Verify your app can reach `https://{AUTHACTION_DOMAIN}/oauth2/token`.

## Contributing

Feel free to submit issues or pull requests if you encounter bugs or have suggestions for improvement!
