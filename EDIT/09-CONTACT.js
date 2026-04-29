// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  09  —  CONTACT PAGE                             ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    Everything on the Contact page:                               ║
// ║      • The big headline and intro sentence at the top            ║
// ║      • The Coverage Request form heading and note               ║
// ║      • The dropdown options inside the form                      ║
// ║      • The success message shown after submitting                ║
// ║      • The four info cards on the right side                     ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO EDIT:                                                    ║
// ║    Find the section you want below, change the text inside       ║
// ║    the quotes, then commit the file.                             ║
// ║    Do NOT delete quotes, commas, or colons.                      ║
// ║                                                                  ║
// ║  NOTE: The social links (YouTube / Instagram) and the           ║
// ║  Formspree form ID are controlled in EDIT/01-CHANNEL.js.        ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_CONTACT = {

  // ── TOP HERO SECTION ─────────────────────────────────────────────
  // The big text that appears at the top of the Contact page

  heroEyebrow: 'Coverage Requests',

  // The large headline — use \n to start a new line
  heroHeadline: 'PITCH ENN\nA STORY.',

  // The sentence just below the headline
  heroSub: 'Teachers, clubs, and departments — if you have an event, announcement, spotlight, or story you\'d like on the broadcast, fill out the coverage request below.',


  // ── COVERAGE REQUEST FORM ─────────────────────────────────────────
  // The form card on the left side of the page

  formHeading: 'COVERAGE REQUEST',

  // Small note shown just below the heading, above the form
  formNote: 'Submissions are reviewed every Friday. We\'ll reach out within one school week to confirm scheduling.',

  // The dropdown options for the "Request Type" field.
  // Add or remove options by adding/removing lines inside the [ ].
  // Each option is text inside quotes, followed by a comma.
  formRequestTypes: [
    'Event Coverage',
    'Student Spotlight',
    'Club Feature',
    'School Announcement',
    'Sports Highlight',
    'Teacher Feature',
    'Other',
  ],

  // Message shown after the form is submitted successfully
  successHeading: 'REQUEST SUBMITTED',
  successBody: 'Thanks! We\'ve received your coverage request. A producer will be in touch within one school week.',


  // ── SONG REQUEST FORM ────────────────────────────────────────────
  // The second form card for song requests

  songHeading: 'SONG REQUEST',
  songNote: 'Want to hear a song on the broadcast? Submit it here. All songs must be verified clean before submission.',
  songSuccessHeading: 'SONG SUBMITTED',
  songSuccessBody: 'Thanks! We\'ll review your request and add it to the rotation if it makes the cut.',


  // ── LOVE LINES FORM ──────────────────────────────────────────────
  // The third form card — the Love Lines segment

  loveHeading: 'LOVE LINES',
  loveEyebrow: 'Back by popular demand',
  loveDesc: 'Send a shoutout, thank you, or message to someone at Eastlake — student to student, student to faculty, faculty to student, or faculty to faculty. Submissions may be read live on the ENN bulletin, so keep an ear open.',
  loveSuccessHeading: 'MESSAGE RECEIVED 💌',
  loveSuccessBody: 'Your Love Line has been submitted. Tune in to the bulletin — you might just hear it on air.',


  // ── INFO CARDS ────────────────────────────────────────────────────
  // The cards stacked on the right side of the page.
  // Each card has:
  //   icon    = the emoji shown in the top-left of the card
  //   heading = the card title in all caps
  //   body    = the paragraph text (you can use <strong>bold text</strong>)

  infoCards: [

    {
      icon:    '📅',
      heading: 'SUBMISSION DEADLINE',
      body:    'Submit your request atleast <strong>one full week ahead</strong> for coverage in the following week. Time-sensitive stories (same-day events) can be emailed directly to the producing team.',
    },
    {
      icon:    '📺',
      heading: 'BROADCAST SCHEDULE',
      body:    'ENN airs live <strong>Monday through Thursday</strong>, <strong>10:31–10:41 AM PST</strong>. Episodes are uploaded to YouTube @ennbulletin shortly after the broadcast ends.',
    },
    {
      icon:    '🎙',
      heading: 'HOW TO JOIN',
      body:    'Interested in becoming part of the ENN team? Broadcast Journalism is offered as an elective. See your counselor about enrollment for next semester.',
    },
    {
      icon:    '💬',
      heading: 'GENERAL QUESTIONS',
      body:    'For general press inquiries, corrections, or archived episodes, reach the studio in room 506 or send us an email at <strong>team@eastlakenewsnetwork.com</strong>',
    },

  ],

};
