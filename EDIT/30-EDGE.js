// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  30  —  THE EDGE · NEWSPAPER ISSUES                ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  Managed by the Site Manager → The Edge. You normally edit this   ║
// ║  through the CMS, not by hand. Each issue is one object below.    ║
// ║                                                                    ║
// ║  status : 'published' (public) · 'draft' · 'unpublished'          ║
// ║  pdf    : path to the issue PDF (new uploads) — image issues use  ║
// ║           cover + pages (pNN.webp) under theedge/issues/<id>/     ║
// ╚══════════════════════════════════════════════════════════════════╝
var ENN_EDGE = {

  // ── PAGE CONTENT — the words at the top of The Edge page ──
  page: {
    heroEyebrow: 'The Eastlake Edge · Student Newspaper',
    heroTitle: 'THE EDGE',
    heroSerif: 'the eastlake edge',
    heroTagline: 'Eastlake High\'s student newspaper — every issue we\'ve digitized, back to 1992. Read the latest, dig through the archive, or crack the case.',
    aboutEyebrow: 'About the Edge',
    aboutTitleLead: 'Eastlake Edge:',
    aboutTitleAccent: 'Voice of the Students',
    aboutBody: [
      'Welcome to the Eastlake Edge! We strive to amplify <b>YOUR</b> voices, perspectives, and experiences that connect our community. The Edge is committed to honest reporting and telling the stories that matter to our students.',
      'As a student-run club, we cover a variety of topics, from world politics to student life. To be in Eastlake Edge means to capture the Titan spirit and put it down on paper. We photograph the intense moments between athletic opponents in the hot fields. We craft articles that dive into the topics that are captivating students. We are more than just a newspaper, we are the voice of Eastlake High School.'
    ]
  },

  // ── ANNOUNCEMENT BAR — a slim notice at the very top (turn on to show) ──
  announce: {
    on: false,
    tag: 'The Edge',
    text: '',
    link: '',
    linkText: ''
  },

  issues: [
  { id:'2026-09-17', slug:'2026-09-17', status:'published', issueTitle:'Issue 1', mainTitle:'The Eastlake Edge', subtitle:'', issue:1, volume:36, year:2026, date:'2026-09-17', dateLabel:'Sep 17, 2026', author:'', editor:'Kat Wright', description:'The Fall 2026 issue — ICE on campus and the rights students have, the new phone ban, vaping and addiction at Eastlake, the spread of surveillance cameras, and a warming Pacific.', headline:'On Thin ICE', featured:true, pages:12, pdf:'', cover:'issues/2026-09-17/cover.webp', updatedAt:'' },
  { id:'2025-09-18', slug:'2025-09-18', status:'published', issueTitle:'Issue 1', mainTitle:'The Eastlake Edge', subtitle:'', issue:1, volume:35, year:2025, date:'2025-09-18', dateLabel:'Sep 18, 2025', author:'', editor:'', description:'', headline:'', featured:true, pages:8, pdf:'', cover:'issues/2025-09-18/cover.webp', updatedAt:'' },
  { id:'2025-05-22', slug:'2025-05-22', status:'published', issueTitle:'Issue 6', mainTitle:'The Eastlake Edge', subtitle:'', issue:6, volume:34, year:2025, date:'2025-05-22', dateLabel:'May 22, 2025', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2025-05-22/cover.webp', updatedAt:'' },
  { id:'2025-03-20', slug:'2025-03-20', status:'published', issueTitle:'Issue 5', mainTitle:'The Eastlake Edge', subtitle:'', issue:5, volume:34, year:2025, date:'2025-03-20', dateLabel:'Mar 20, 2025', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2025-03-20/cover.webp', updatedAt:'' },
  { id:'2025-02-13', slug:'2025-02-13', status:'published', issueTitle:'Issue 4', mainTitle:'The Eastlake Edge', subtitle:'', issue:4, volume:34, year:2025, date:'2025-02-13', dateLabel:'Feb 13, 2025', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2025-02-13/cover.webp', updatedAt:'' },
  { id:'2024-12-12', slug:'2024-12-12', status:'published', issueTitle:'Issue 3', mainTitle:'The Eastlake Edge', subtitle:'', issue:3, volume:34, year:2024, date:'2024-12-12', dateLabel:'Dec 12, 2024', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2024-12-12/cover.webp', updatedAt:'' },
  { id:'2024-11-07', slug:'2024-11-07', status:'published', issueTitle:'Issue 2', mainTitle:'The Eastlake Edge', subtitle:'', issue:2, volume:34, year:2024, date:'2024-11-07', dateLabel:'Nov 7, 2024', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2024-11-07/cover.webp', updatedAt:'' },
  { id:'2024-09-19', slug:'2024-09-19', status:'published', issueTitle:'Issue 1', mainTitle:'The Eastlake Edge', subtitle:'', issue:1, volume:34, year:2024, date:'2024-09-19', dateLabel:'Sep 19, 2024', author:'', editor:'', description:'', headline:'', featured:true, pages:16, pdf:'', cover:'issues/2024-09-19/cover.webp', updatedAt:'' },
  { id:'2024-05-21', slug:'2024-05-21', status:'published', issueTitle:'Issue 5', mainTitle:'The Eastlake Edge', subtitle:'', issue:5, volume:33, year:2024, date:'2024-05-21', dateLabel:'May 21, 2024', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2024-05-21/cover.webp', updatedAt:'' },
  { id:'2024-03-12', slug:'2024-03-12', status:'published', issueTitle:'Issue 4', mainTitle:'The Eastlake Edge', subtitle:'', issue:4, volume:33, year:2024, date:'2024-03-12', dateLabel:'Mar 12, 2024', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2024-03-12/cover.webp', updatedAt:'' },
  { id:'2024-02-13', slug:'2024-02-13', status:'published', issueTitle:'Issue 3', mainTitle:'The Eastlake Edge', subtitle:'', issue:3, volume:33, year:2024, date:'2024-02-13', dateLabel:'Feb 13, 2024', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2024-02-13/cover.webp', updatedAt:'' },
  { id:'2023-12-07', slug:'2023-12-07', status:'published', issueTitle:'Issue 2', mainTitle:'The Eastlake Edge', subtitle:'', issue:2, volume:33, year:2023, date:'2023-12-07', dateLabel:'Dec 7, 2023', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2023-12-07/cover.webp', updatedAt:'' },
  { id:'2023-10-19', slug:'2023-10-19', status:'published', issueTitle:'Issue 1', mainTitle:'The Eastlake Edge', subtitle:'', issue:1, volume:33, year:2023, date:'2023-10-19', dateLabel:'Oct 19, 2023', author:'', editor:'', description:'', headline:'', featured:true, pages:16, pdf:'', cover:'issues/2023-10-19/cover.webp', updatedAt:'' },
  { id:'2023-05-17', slug:'2023-05-17', status:'published', issueTitle:'Issue 6', mainTitle:'The Eastlake Edge', subtitle:'', issue:6, volume:32, year:2023, date:'2023-05-17', dateLabel:'May 17, 2023', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2023-05-17/cover.webp', updatedAt:'' },
  { id:'2023-03-15', slug:'2023-03-15', status:'published', issueTitle:'Issue 5', mainTitle:'The Eastlake Edge', subtitle:'', issue:5, volume:32, year:2023, date:'2023-03-15', dateLabel:'Mar 15, 2023', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2023-03-15/cover.webp', updatedAt:'' },
  { id:'2022-12-07', slug:'2022-12-07', status:'published', issueTitle:'Issue 3', mainTitle:'The Eastlake Edge', subtitle:'', issue:3, volume:32, year:2022, date:'2022-12-07', dateLabel:'Dec 7, 2022', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2022-12-07/cover.webp', updatedAt:'' },
  { id:'2022-11-02', slug:'2022-11-02', status:'published', issueTitle:'Issue 2', mainTitle:'The Eastlake Edge', subtitle:'', issue:2, volume:32, year:2022, date:'2022-11-02', dateLabel:'Nov 2, 2022', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2022-11-02/cover.webp', updatedAt:'' },
  { id:'2022-09-14', slug:'2022-09-14', status:'published', issueTitle:'Issue 1', mainTitle:'The Eastlake Edge', subtitle:'', issue:1, volume:32, year:2022, date:'2022-09-14', dateLabel:'Sep 14, 2022', author:'', editor:'', description:'', headline:'', featured:true, pages:16, pdf:'', cover:'issues/2022-09-14/cover.webp', updatedAt:'' },
  { id:'2022-05-18', slug:'2022-05-18', status:'published', issueTitle:'Senior Edition', mainTitle:'The Eastlake Edge', subtitle:'', issue:99, volume:31, year:2022, date:'2022-05-18', dateLabel:'May 18, 2022', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2022-05-18/cover.webp', updatedAt:'' },
  { id:'2022-03-16', slug:'2022-03-16', status:'published', issueTitle:'Issue 5', mainTitle:'The Eastlake Edge', subtitle:'', issue:5, volume:31, year:2022, date:'2022-03-16', dateLabel:'Mar 16, 2022', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2022-03-16/cover.webp', updatedAt:'' },
  { id:'2022-02-09', slug:'2022-02-09', status:'published', issueTitle:'Issue 4', mainTitle:'The Eastlake Edge', subtitle:'', issue:4, volume:31, year:2022, date:'2022-02-09', dateLabel:'Feb 9, 2022', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2022-02-09/cover.webp', updatedAt:'' },
  { id:'2021-12-15', slug:'2021-12-15', status:'published', issueTitle:'Issue 3', mainTitle:'The Eastlake Edge', subtitle:'', issue:3, volume:31, year:2021, date:'2021-12-15', dateLabel:'Dec 15, 2021', author:'', editor:'', description:'', headline:'', featured:false, pages:16, pdf:'', cover:'issues/2021-12-15/cover.webp', updatedAt:'' },
  { id:'2021-09-15', slug:'2021-09-15', status:'published', issueTitle:'Issue 1', mainTitle:'The Eastlake Edge', subtitle:'', issue:1, volume:31, year:2021, date:'2021-09-15', dateLabel:'Sep 15, 2021', author:'', editor:'', description:'', headline:'', featured:true, pages:12, pdf:'', cover:'issues/2021-09-15/cover.webp', updatedAt:'' },
  { id:'2020-02-12', slug:'2020-02-12', status:'published', issueTitle:'Issue 4', mainTitle:'The Eastlake Edge', subtitle:'', issue:4, volume:29, year:2020, date:'2020-02-12', dateLabel:'Feb 12, 2020', author:'', editor:'', description:'', headline:'', featured:true, pages:16, pdf:'', cover:'issues/2020-02-12/cover.webp', updatedAt:'' },
  { id:'1993-08-27', slug:'1993-08-27', status:'published', issueTitle:'Issue 1', mainTitle:'The Eastlake Edge', subtitle:'', issue:1, volume:2, year:1993, date:'1993-08-27', dateLabel:'Aug 27, 1993', author:'', editor:'', description:'', headline:'', featured:true, pages:8, pdf:'', cover:'issues/1993-08-27/cover.webp', updatedAt:'' },
  { id:'1992-12-18', slug:'1992-12-18', status:'published', issueTitle:'Issue 3', mainTitle:'The Eastlake Edge', subtitle:'', issue:3, volume:1, year:1992, date:'1992-12-18', dateLabel:'Dec 18, 1992', author:'', editor:'', description:'', headline:'', featured:true, pages:12, pdf:'', cover:'issues/1992-12-18/cover.webp', updatedAt:'' },
  ]
};
if (typeof module !== 'undefined') { module.exports = ENN_EDGE; }
