/* Which CMS role the visitor is currently viewing as. There is no real
   login behind this demo — picking a role on the #/cms screen is enough
   to see what that role would and would not have access to. */
export const CMS = { role: null };
export function setCmsRole(r){ CMS.role = r; }
