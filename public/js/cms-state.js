/* CMS session state: a simulated sign-in step, then which role the
   visitor is viewing as. There is no real backend — signing in just
   needs any email/password, and role-switching is a demo convenience
   (the sidebar's "Switch role" control) rather than a security boundary. */
export const CMS = { loggedIn: false, role: null };
export function setCmsLoggedIn(v){ CMS.loggedIn = v; }
export function setCmsRole(r){ CMS.role = r; }
export function cmsSignOut(){ CMS.loggedIn = false; CMS.role = null; }
