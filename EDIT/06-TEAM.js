// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  06  —  TEAM MEMBERS                             ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    Everyone shown on the Team page — anchors, crew, and advisor  ║
// ║    Each person expands when clicked to show their full bio       ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  FIELDS FOR EACH PERSON:                                         ║
// ║    n     → Full name  (shown on card)                           ║
// ║    r     → Role or title  (shown on card)                       ║
// ║    grade → Grade level  e.g. '11th Grade' or '12th Grade'       ║
// ║    bio   → Short bio shown when the card is clicked open        ║
// ║            (1–2 sentences recommended)                           ║
// ║    email → Contact email address                                 ║
// ║    photo → Path to headshot photo                               ║
// ║            Leave as '' to show initials instead of a photo      ║
// ║            To add a photo — see HOW TO ADD PHOTOS below         ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO ADD A PERSON:                                            ║
// ║    1. Copy one of the existing person blocks  { n: ... }        ║
// ║    2. Paste it inside the correct section (anchors/crew/advisor) ║
// ║    3. Fill in their name, role, grade, bio, and email           ║
// ║    4. Make sure every person except the last has a comma after } ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO REMOVE A PERSON:                                         ║
// ║    Delete their entire block from { n: ... } to the closing }   ║
// ║    including the comma after it                                  ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO ADD A HEADSHOT PHOTO:                                    ║
// ║    STEP 1 — Upload the photo to GitHub                           ║
// ║      • Go to your repo on github.com                             ║
// ║      • Navigate into  img/team/anchors/  (or crew/ or advisor/) ║
// ║      • Click  Add file → Upload files                            ║
// ║      • Upload the photo  (JPG or PNG, square crop recommended)  ║
// ║      • Commit the file                                           ║
// ║                                                                  ║
// ║    STEP 2 — Link the photo to the person                         ║
// ║      • Find the person in this file                              ║
// ║      • Change their photo field to the path of the uploaded file ║
// ║      • Example: photo: 'img/team/anchors/jane-smith.jpg'        ║
// ║      • Commit this file                                          ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_TEAM = {

  // ── ANCHORS & ON-AIR TALENT ──────────────────────────────────────
  // These appear in the "Anchors & On-Air Talent" section on the Team page
  anchors: [

    {
      n:     'Anchor 1',
      r:     'Lead Anchor',
      grade: '',
      bio:   '',
      email: '',
      photo: '',   // e.g. 'img/team/anchors/anchor1.jpg'
    },
    {
      n:     'Anchor 2',
      r:     'Co-Anchor',
      grade: '',
      bio:   '',
      email: '',
      photo: '',
    },
    {
      n:     'Reporter 1',
      r:     'Field Reporter',
      grade: '',
      bio:   '',
      email: '',
      photo: '',
    },
    {
      n:     'Reporter 2',
      r:     'Sports Reporter',
      grade: '',
      bio:   '',
      email: '',
      photo: '',
    },
    {
      n:     'Reporter 3',
      r:     'Entertainment Reporter',
      grade: '',
      bio:   '',
      email: '',
      photo: '',
    },

  ],

  // ── PRODUCTION CREW ───────────────────────────────────────────────
  // These appear in the "Production Crew" section on the Team page
  crew: [

    {
      n:     'Ian Brogan',
      r:     'P4 - Lead Producer',
      grade: '11th',
      bio:   '',
      email: '1595697@sweetwaterschools.net',
      photo: '',   // e.g. 'img/team/crew/producer1.jpg'
    },
    {
      n:     'Cecilia Hettinger',
      r:     'P4 - Segment Producer',
      grade: '12th',
      bio:   '',
      email: '',
      photo: '',
    },
    {
      n:     'Rory Licht',
      r:     'P4 - Broadcast Director',
      grade: '12th',
      bio:   '',
      email: '',
      photo: '',
    },
    {
      n:     'Emily Na Sanchez',
      r:     'P1 - Lead Producer',
      grade: '',
      bio:   '',
      email: '',
      photo: '',
    },
    {
      n:     'Alejandro Schejola',
      r:     'P1 - Segment Producer',
      grade: '',
      bio:   '',
      email: '',
      photo: '',
    },
    {
      n:     'Jovani Iglesias',
      r:     'P1 - Broadcast Director',
      grade: '10th',
      bio:   '',
      email: '',
      photo: '',
    },

  ],

  // ── FACULTY ADVISOR ───────────────────────────────────────────────
  // Appears in the "Faculty Advisor" section on the Team page
  advisor: [

    {
      n:     'William Nimmo',
      r:     'Broadcast Journalism Instructor',
      grade: '',
      bio:   'The best teacher on EHS campus',
      email: 'william.nimmo@sweetwaterschools.net',
      photo: '',   // e.g. 'img/team/advisor/advisor.jpg'
    },

  ],

};
