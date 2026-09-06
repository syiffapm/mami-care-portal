/* Facility Portal session state (§6.2). A real device is bound to a
   facility and a credentialed user. Signing in happens in two steps,
   deliberately not one: entering a PIN identifies *who* it is
   (`staff`), and starting a shift is the separate act of actually
   taking the worklist for that shift (`signedIn`) — a midwife could in
   principle be identified without starting a shift (e.g. to hand the
   device to a colleague), so these are two flags, not one. */
export const FACILITY_SESSION = { signedIn: false, staff: null, shiftStartedAt: null };

export function identifyFacilityStaff(staff){ FACILITY_SESSION.staff = staff; }

export function startFacilityShift(){ FACILITY_SESSION.signedIn = true; FACILITY_SESSION.shiftStartedAt = new Date(); }

/* Ending a shift (or a failed sign-in reset) clears identity too — the
   next person to pick up the device starts from a real PIN entry, not
   a leftover session. */
export function setFacilitySignedIn(v){
  FACILITY_SESSION.signedIn = v;
  if(!v){ FACILITY_SESSION.staff = null; FACILITY_SESSION.shiftStartedAt = null; }
}
