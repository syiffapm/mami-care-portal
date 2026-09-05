/* Facility Portal session state (§6.2). A real device is bound to a
   facility and a credentialed user; this demo just needs a flag to
   gate the worklist behind an explicit "sign in" tap. */
export const FACILITY_SESSION = { signedIn: false };
export function setFacilitySignedIn(v){ FACILITY_SESSION.signedIn = v; }
