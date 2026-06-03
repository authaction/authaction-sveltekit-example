import type { RequestHandler } from './$types';
import { auth } from '$lib/auth.server';

export const POST: RequestHandler = (event) => auth.handleLogout(event);
