import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSession } from '$lib/session.server';

export const load: PageServerLoad = ({ cookies }) => {
  const user = getSession(cookies);
  if (!user) redirect(302, '/');
  return { user };
};
