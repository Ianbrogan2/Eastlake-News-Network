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
// ║  NOTE: The social links (YouTube / Instagram) and the form      ║
// ║  submission endpoint (Google Sheets) are controlled in           ║
// ║  EDIT/01-CHANNEL.js — form submissions land in the Google        ║
// ║  Sheet and email team@eastlakenewsnetwork.com automatically.     ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_CONTACT = {

  // ── PAGE TABS ─────────────────────────────────────────────────────
  // The Contact page is split into two tabs (like the Team page):
  //   Tab 1 — the public forms everyone uses (coverage, songs, love lines)
  //   Tab 2 — the ENN crew desk (field passes, crew questions)

  tabEveryone: 'For Everyone',
  tabCrew:     'ENN Crew Desk',


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


  // ── SCHEDULING & ACCESS REQUEST FORM ─────────────────────────────
  // The crew-only form for special filming access — field passes,
  // assembly floor access, backstage, off-campus events.
  // Requests go to the scheduling desk (submissions land in the
  // Google Sheet under their own "Scheduling Request" tab).

  schedHeading: 'SCHEDULING & ACCESS REQUEST',

  // Small label above the heading
  schedEyebrow: 'ENN Crew Only',

  // The sentence describing what this form is for
  schedNote: 'Filming certain events requires an approved pass — football sidelines, assemblies, rallies, backstage, and off-campus coverage. Submit your request below and the scheduling desk will confirm your approval before the event. No approval, no access.',

  // The dropdown options for the "Access Needed" field.
  // Add or remove options by adding/removing lines inside the [ ].
  schedAccessTypes: [
    'Field Pass — Football',
    'Sideline — Other Sports',
    'Assembly / Rally Floor',
    'Backstage — Performances & Theater',
    'Off-Campus Event',
    'Other Special Access',
  ],

  // Message shown after the form is submitted successfully
  schedSuccessHeading: 'REQUEST SENT',
  schedSuccessBody: 'Your scheduling request is in. The scheduling desk will confirm your approval before the event — keep an eye out and don\'t film without it.',


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


  // ── MISC QUESTIONS FORM — "For Everyone" tab ─────────────────────
  // The catch-all questions form at the bottom of the public tab.
  // Asks for name + email so you can reply.

  miscHeading: 'OTHER QUESTIONS',
  miscNote: 'Something that doesn\'t fit the forms above? Ask here — include your email and we\'ll get back to you.',
  miscSuccessHeading: 'QUESTION RECEIVED',
  miscSuccessBody: 'Thanks! We\'ve got your question and will reply to the email you provided.',


  // ── MISC QUESTIONS FORM — "ENN Crew Desk" tab ────────────────────
  // The catch-all questions form for ENN students only.

  crewMiscHeading: 'CREW QUESTIONS',
  crewMiscNote: 'For ENN students — scheduling conflicts, equipment, shoot logistics, or anything else for the desk. Include your email so we can get back to you.',
  crewMiscSuccessHeading: 'QUESTION RECEIVED',
  crewMiscSuccessBody: 'Got it. The desk will reply to the email you provided.',


  // ── CREW INFO CARDS ──────────────────────────────────────────────
  // The cards on the right side of the ENN Crew Desk tab.
  // Same format as infoCards below.

  crewInfoCards: [

    {
      icon:    '⏱',
      heading: 'APPROVAL TIMELINE',
      body:    'Submit access requests at least <strong>one week before the event</strong>. You\'ll get a confirmation from the scheduling desk before game day.',
    },
    {
      icon:    '🎫',
      heading: 'PASS RULES',
      body:    'Approval is <strong>per event</strong> — one request per game, assembly, or shoot. No confirmed approval means no field, floor, or backstage access.',
    },

  ],


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
