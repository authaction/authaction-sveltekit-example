import type { PageServerLoad } from './$types';
import { getSession } from '$lib/session.server';

export const load: PageServerLoad = ({ cookies }) => {
  return { user: getSession(cookies) };
};
