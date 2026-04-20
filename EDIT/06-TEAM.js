// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  06  —  TEAM MEMBERS  (Period 1 & Period 4)      ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    Everyone shown on the Team page — split into Period 1 and     ║
// ║    Period 4 tabs, each with Leaders, Anchors, and the Advisor.   ║
// ║    Each person's card expands when clicked to show their bio.    ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  FIELDS FOR EACH PERSON:                                         ║
// ║    n     → Full name  (shown on card)                           ║
// ║    r     → Role or title  (shown on card)                       ║
// ║    grade → Grade level  e.g. '11th' or '12th'                   ║
// ║    bio   → Short bio shown when the card is clicked open        ║
// ║            (1–2 sentences recommended)                           ║
// ║    email → Contact email address                                 ║
// ║    photo → Path to headshot photo                               ║
// ║            Leave as '' to show initials instead of a photo      ║
// ║            To add a photo — see HOW TO ADD PHOTOS below         ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO ADD A PERSON:                                            ║
// ║    1. Copy one of the existing person blocks  { n: ... }        ║
// ║    2. Paste it inside the correct section                        ║
// ║       (period1.leaders / period1.anchors / period4.leaders …)   ║
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
// ║      • Navigate into  img/team/  and upload the photo there     ║
// ║      • JPG or PNG, square crop recommended                       ║
// ║      • Commit the file                                           ║
// ║                                                                  ║
// ║    STEP 2 — Link the photo to the person                         ║
// ║      • Find the person in this file                              ║
// ║      • Change their photo field to the path of the uploaded file ║
// ║      • Example: photo: 'img/team/ian-brogan.jpg'                ║
// ║      • Commit this file                                          ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_TEAM = {

  // ── PERIOD 1 ──────────────────────────────────────────────────────
  period1: {

    // 3 Leaders for Period 1
    leaders: [

      {
        n:     'Emily Na Sanchez',
        r:     'Lead Producer',
        grade: '11th',
        bio:   '',
        email: '',
        photo: '',
      },
      {
        n:     'Alejandro Schejola',
        r:     'Segment Producer',
        grade: '11th',
        bio:   '',
        email: '',
        photo: '',
      },
      {
        n:     'Jovani Iglesias',
        r:     'Broadcast Director',
        grade: '10th',
        bio:   '',
        email: '',
        photo: '',
      },

    ],

    // 4 Anchors for Period 1
    anchors: [

      {
        n:     'Rainen Gabriel',
        r:     'Anchor',
        grade: '12th',
        bio:   '',
        email: '',
        photo: '',
      },
      {
        n:     'Maddy Mcgee',
        r:     'Anchor',
        grade: '11th',
        bio:   '',
        email: '',
        photo: '',
      },
      {
        n:     'Chrisitan Steven/'s',
        r:     'Anchor',
        grade: '11th',
        bio:   '',
        email: '',
        photo: '',
      },
      {
        n:     'Erina Tsuya',
        r:     'Anchor',
        grade: '11th',
        bio:   '',
        email: '',
        photo: '',
      },

    ],

  },

  // ── PERIOD 4 ──────────────────────────────────────────────────────
  period4: {

    // 3 Leaders for Period 4
    leaders: [

      {
        n:     'Ian Brogan',
        r:     'Lead Producer',
        grade: '11th',
        bio:   '',
        email: '',
        photo: '',
      },
      {
        n:     'Cecilia Hettinger',
        r:     'Segment Producer',
        grade: '12th',
        bio:   '',
        email: '',
        photo: '',
      },
      {
        n:     'Rory Licht',
        r:     'Broadcast Director',
        grade: '12th',
        bio:   '',
        email: '',
        photo: '',
      },

    ],

    // 4 Anchors for Period 4
    anchors: [

      {
        n:     'Hayden Stolebarger',
        r:     'Anchor',
        grade: '11th',
        bio:   '',
        email: '',
        photo: '',
      },
      {
        n:     'Sidney Jonason',
        r:     'Anchor',
        grade: '11th',
        bio:   '',
        email: '',
        photo: '',
      },
      {
        n:     'Mia Beas',
        r:     'Anchor',
        grade: '11th',
        bio:   '',
        email: '',
        photo: '',
      },
      {
        n:     'Alyssa Lagler',
        r:     'Anchor',
        grade: '12th',
        bio:   '',
        email: '',
        photo: '',
      },

    ],

  },

  // ── FACULTY ADVISOR ───────────────────────────────────────────────
  // William appears at the bottom of BOTH period tabs automatically
  advisor: {
    n:     'William Nimmo',
    r:     'Broadcast Journalism Instructor',
    grade: '',
    bio:   '',
    email: 'william.nimmo@sweetwaterschools.net',
    photo: '',   // e.g. 'img/team/william-nimmo.jpg'
  },

};
