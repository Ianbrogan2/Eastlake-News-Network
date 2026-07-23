// ╔═══════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  22  —  STUDENT ROSTER  (Periods 1, 4 & 6)        ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    Who is in ENN. When a student types their student ID on the   ║
// ║    newsroom login, this is what the site looks them up in.       ║
// ║                                                                  ║
// ║    It decides:                                                    ║
// ║      • the name they get greeted with                             ║
// ║      • which period and production group they belong to           ║
// ║      • whether they see the Leadership tab, and which role        ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  EASIEST WAY TO EDIT THIS:                                       ║
// ║    Don't edit this file by hand. Go to                            ║
// ║        eastlakenewsnetwork.com/admin                              ║
// ║    and open  "Student Roster".  Every slot below already exists   ║
// ║    as a form field — you just type the name and ID into it.       ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  HOW THE SLOTS WORK:                                             ║
// ║    Each period has 10 LEADERSHIP slots and 8 GROUPS of up to 8.  ║
// ║    Empty slots are simply ignored — leave any you don't use       ║
// ║    blank. Nothing breaks and nothing shows up on the site.        ║
// ║                                                                  ║
// ║    A student can be in BOTH a group and a leadership slot.        ║
// ║    Put the SAME student ID in both places and the site figures    ║
// ║    it out — they get their group AND their Leadership tab.        ║
// ║                                                                  ║
// ║    The ADVISOR is set once and applies to all three periods.      ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  THE FIELDS:                                                     ║
// ║    id     → the student's ID number — what they type to log in   ║
// ║    first  → first name  (used for "Hello Ian")                    ║
// ║    last   → last name                                             ║
// ║    role   → leadership title (leadership slots only)             ║
// ║    name   → the production group's name (groups only)             ║
// ╚═══════════════════════════════════════════════════════════════╝

var ENN_ROSTER = {

  // ── The one admin account ───────────────────────────────────
  // Mr. Nimmo types this code instead of a student ID. It unlocks
  // everything, in all three periods.
  advisorCode: 'ENNADM26',

  advisor: {
    first: 'Mr.',
    last:  'Nimmo',
    role:  'Faculty Advisor',
  },

  // ── The base call sign ─────────────────────────────────────
  // Anyone who types this gets the plain newsroom — no name, no
  // personal info. Set in newsroom/config.js as CALL_SIGN.
  // (kept here only as a reminder — change it in newsroom/config.js)
  baseCallSign: 'ENN',

  // ═════════════════  P E R I O D   1  ═══════════════════════════
  period1: {

    // ── Leadership — 10 slots ───────────────────────────────
    // Leave the ID blank for any role nobody holds this semester.
    leadership: [
      { role: 'Studio Director',    id: '', first: '', last: '' },
      { role: 'Newsroom Director',  id: '', first: '', last: '' },
      { role: 'Assistant Director',  id: '', first: '', last: '' },
      { role: 'Assistant Director',  id: '', first: '', last: '' },
      { role: 'Camera Operator',    id: '', first: '', last: '' },
      { role: 'Camera Operator',    id: '', first: '', last: '' },
      { role: 'Main Editor',        id: '', first: '', last: '' },
      { role: 'Anchor',             id: '', first: '', last: '' },
      { role: 'Anchor',             id: '', first: '', last: '' },
      { role: 'Equipment Manager',  id: '', first: '', last: '' },
    ],

    // ── Production groups — 8 groups, up to 8 students each ──────
    groups: [

      // ─ Group 1 ─
      { name: 'Group 1', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 2 ─
      { name: 'Group 2', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 3 ─
      { name: 'Group 3', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 4 ─
      { name: 'Group 4', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 5 ─
      { name: 'Group 5', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 6 ─
      { name: 'Group 6', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 7 ─
      { name: 'Group 7', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 8 ─
      { name: 'Group 8', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},
    ],

  },

  // ═════════════════  P E R I O D   4  ═══════════════════════════
  period4: {

    // ── Leadership — 10 slots ───────────────────────────────
    // Leave the ID blank for any role nobody holds this semester.
    leadership: [
      { role: 'Studio Director',    id: '', first: '', last: '' },
      { role: 'Newsroom Director',  id: '', first: '', last: '' },
      { role: 'Assistant Director',  id: '', first: '', last: '' },
      { role: 'Assistant Director',  id: '', first: '', last: '' },
      { role: 'Camera Operator',    id: '', first: '', last: '' },
      { role: 'Camera Operator',    id: '', first: '', last: '' },
      { role: 'Main Editor',        id: '', first: '', last: '' },
      { role: 'Anchor',             id: '', first: '', last: '' },
      { role: 'Anchor',             id: '', first: '', last: '' },
      { role: 'Equipment Manager',  id: '', first: '', last: '' },
    ],

    // ── Production groups — 8 groups, up to 8 students each ──────
    groups: [

      // ─ Group 1 ─
      { name: 'Group 1', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 2 ─
      { name: 'Group 2', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 3 ─
      { name: 'Group 3', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 4 ─
      { name: 'Group 4', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 5 ─
      { name: 'Group 5', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 6 ─
      { name: 'Group 6', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 7 ─
      { name: 'Group 7', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 8 ─
      { name: 'Group 8', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},
    ],

  },

  // ═════════════════  P E R I O D   6  ═══════════════════════════
  period6: {

    // ── Leadership — 10 slots ───────────────────────────────
    // Leave the ID blank for any role nobody holds this semester.
    leadership: [
      { role: 'Studio Director',    id: '', first: '', last: '' },
      { role: 'Newsroom Director',  id: '', first: '', last: '' },
      { role: 'Assistant Director',  id: '', first: '', last: '' },
      { role: 'Assistant Director',  id: '', first: '', last: '' },
      { role: 'Camera Operator',    id: '', first: '', last: '' },
      { role: 'Camera Operator',    id: '', first: '', last: '' },
      { role: 'Main Editor',        id: '', first: '', last: '' },
      { role: 'Anchor',             id: '', first: '', last: '' },
      { role: 'Anchor',             id: '', first: '', last: '' },
      { role: 'Equipment Manager',  id: '', first: '', last: '' },
    ],

    // ── Production groups — 8 groups, up to 8 students each ──────
    groups: [

      // ─ Group 1 ─
      { name: 'Group 1', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 2 ─
      { name: 'Group 2', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 3 ─
      { name: 'Group 3', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 4 ─
      { name: 'Group 4', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 5 ─
      { name: 'Group 5', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 6 ─
      { name: 'Group 6', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 7 ─
      { name: 'Group 7', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},

      // ─ Group 8 ─
      { name: 'Group 8', members: [
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
        { id: '', first: '', last: '' },
      ]},
    ],

  },

};
