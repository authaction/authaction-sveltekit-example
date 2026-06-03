import type { RequestHandler } from './$types';
import { auth } from '$lib/auth.server';

export const GET: RequestHandler = (event) => auth.handleLogin(event);
