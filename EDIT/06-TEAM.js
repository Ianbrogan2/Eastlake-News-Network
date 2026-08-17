// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  06  —  TEAM MEMBERS  (Periods 1, 4 & 6)         ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    Everyone shown in the Team section (bottom of the About page) ║
// ║    — split into Period 1, Period 4, and Period 6 tabs, each      ║
// ║    with Leaders, Anchors, and the Advisor (advisor shows on all).║
// ║    Each person's card expands when clicked to show their bio.    ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  FIELDS FOR EACH PERSON:                                         ║
// ║    n     → Full name                                             ║
// ║    r     → Role or title                                         ║
// ║    grade → Grade level  e.g. '11th'  (leave '' to hide)         ║
// ║    bio   → Short bio shown when the card is clicked open         ║
// ║    email → Contact email  (students: [ID]@sweetwaterschools.net) ║
// ║    photo → Path to headshot, e.g. 'img/team/ian-brogan.jpg'      ║
// ║            Leave '' to show the person's initials instead.       ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO ADD A PERSON:                                            ║
// ║    Copy a { n: ... } block, paste it into the right section      ║
// ║    (period1.leaders / period1.anchors / …), and fill it in.     ║
// ║    Every person except the last one in a list needs a comma.    ║
// ║                                                                  ║
// ║  HOW TO ADD A HEADSHOT:                                          ║
// ║    Upload a square photo to  img/team/  on GitHub, then set the  ║
// ║    person's  photo:  to that path (e.g. 'img/team/ava.jpg').     ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_TEAM = {

  // ── PERIOD 1 ──────────────────────────────────────────────────────
  period1: {
    leaders: [
      { n: 'Ian Brogan',       r: 'Studio Director',    grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Ava Ridgeway',     r: 'Newsroom Director',  grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Hayden Macale',    r: 'Creative Director',  grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Maddy Mcgee',      r: 'Assistant Director', grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Christian Stevens',r: 'Assistant Director', grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Nate Enano',       r: 'Equipment Manager',  grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
    ],
    // Anchors — add them here as they're assigned.
    anchors: [],
  },

  // ── PERIOD 4 ──────────────────────────────────────────────────────
  period4: {
    leaders: [
      { n: 'Jovani Iglesias',      r: 'Studio Director',   grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Lucca Dei',            r: 'Newsroom Director', grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Logan Serrano-Wirth',  r: 'Equipment Manager', grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
    ],
    anchors: [],
  },

  // ── PERIOD 6 ──────────────────────────────────────────────────────
  period6: {
    leaders: [
      { n: 'JuJu Bischoffer',    r: 'Studio Director',    grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Alejandro Schejola', r: 'Newsroom Director',  grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Rondell Minor',      r: 'Assistant Director', grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Shiann Rodriguez',   r: 'Assistant Director', grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
      { n: 'Gibran Espinoza',    r: 'Equipment Manager',  grade: '', bio: 'Coming Soon', email: '[email protected]', photo: '' },
    ],
    anchors: [],
  },

  // ── FACULTY ADVISOR ───────────────────────────────────────────────
  // The advisor appears at the bottom of ALL period tabs automatically.
  advisor: {
    n:     'William Nimmo',
    r:     'Film Television Digital Media Instructor',
    grade: '',
    bio:   'Mr. Nimmo is an industry leader, bringing the standards of contemporary filmmaking and television production to the state-of-the-art programs at Eastlake High.',
    email: '[email protected]',
    photo: '',
  },

};
