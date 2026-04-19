// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  08  —  ABOUT PAGE                               ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    Everything on the About page:                                 ║
// ║      • The big headline and intro sentence at the top            ║
// ║      • The Mission box on the left                               ║
// ║      • The body paragraphs on the right                         ║
// ║      • The three stat boxes at the bottom                        ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO EDIT:                                                    ║
// ║    Find the section you want below, change the text inside       ║
// ║    the quotes, then commit the file.                             ║
// ║    Do NOT delete quotes, commas, or colons.                      ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_ABOUT = {

  // ── TOP HERO SECTION ─────────────────────────────────────────────
  // The big text that appears at the top of the About page

  heroEyebrow: 'About the Network',

  // The large headline — use \n to start a new line
  heroHeadline: 'EASTLAKE\'S\nOWN\nNEWSROOM.',

  // The sentence just below the headline
  heroSub: 'ENN — the Eastlake News Network — is the student-run broadcast news program of Eastlake High School in Chula Vista, California. We report, produce, and air four live shows every week.',


  // ── MISSION BOX ──────────────────────────────────────────────────
  // The box on the left side of the about body

  missionHeading: 'Stories told by students, for students.',

  missionBody: 'To train the next generation of journalists, producers, and broadcasters — and to give our school a daily record of what matters, who we are, and what\'s next.',


  // ── BODY PARAGRAPHS ──────────────────────────────────────────────
  // The paragraphs on the right side. Add or remove paragraphs freely.
  // Each paragraph is one item in the list between [ and ].

  bodyParagraphs: [

    'ENN began as a morning announcement slot and grew into a full daily broadcast. Every weekday morning, our anchors, producers, and camera crew take the school\'s newsdesk live, covering campus news, sports, student life, and everything in between.',

    'Our coverage is reported, written, edited, and delivered entirely by students. Advisors guide — but the stories, the writing, the camerawork, the graphics, and the voice behind the desk all belong to the student journalists of Eastlake.',

    'Episodes stream live into every first-period classroom through our closed-circuit broadcast system, then publish to our YouTube channel afterward so the whole community can watch on demand.',

    'We cover the Titans. The classrooms. The quad. The bleachers. If it matters at Eastlake, it goes on the bulletin.',

  ],


  // ── STATS ────────────────────────────────────────────────────────
  // The three number boxes at the bottom of the About page
  // meta = small label above the number
  // num  = the big number or word
  // lbl  = the description below the number

  stats: [

    {
      meta: 'Weekly Output',
      num:  '4×',
      lbl:  'Live broadcasts every week — Monday through Thursday, 10:31–10:41 AM PST.',
    },
    {
      meta: 'Production',
      num:  '100%',
      lbl:  'Student-produced — reporting, writing, directing, editing, and on-air talent.',
    },
    {
      meta: 'Home Campus',
      num:  'Eastlake High',
      lbl:  'Based in the Eastlake High School broadcast studio, Chula Vista, California.',
    },

  ],

};
