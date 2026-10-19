// ╔════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  32  —  THE EDGE · ONLINE ARTICLES                ║
// ║  Managed in the Site Manager → The Edge → Articles.              ║
// ║  Each article is one object. status: published/draft/unpublished. ║
// ║  section must be one of the names in the ‘sections’ list.          ║
// ╚════════════════════════════════════════════════════════════════╝
var ENN_ARTICLES = {
  sections: [
    'Student Life',
    'News & Politics',
    'Opinion',
    'Sports',
    'VAPA & College Corner',
    'Entertainment & Photo Journal'
  ],
  articles: [
    {
      slug: 'on-thin-ice',
      status: 'published',
      section: 'News & Politics',
      title: 'On Thin ICE',
      subtitle: 'Students weigh their rights as enforcement ramps up',
      author: 'Aaden Limon',
      position: 'Staff Writer',
      date: '2026-09-17',
      dateLabel: 'Sep 17, 2026',
      featured: true,
      content: 'Immigration and Customs Enforcement (ICE) was founded in March 2003, following the devastating 9/11 attacks. In recent years, lawmakers have raised concerns over ICE’s controversial operations — from the use of physical force during encounters to a sharp rise in criminal charges for those who resist or interfere with a federal officer.\n\n“I believe ICE is overreaching their power,” one student shared, pointing to the separation of families and the impact on people with no criminal record. If you are planning on opposing ICE at a protest or march, be cautious — and don’t forget that ICE has a history of suppressing opposition.',
      updatedAt: ''
    },
    {
      slug: 'addictions-on-campus',
      status: 'published',
      section: 'Student Life',
      title: 'Addictions on Campus',
      subtitle: 'Why vaping and drinking hit harder than students think',
      author: 'Iris Compean',
      position: 'Staff Writer',
      date: '2026-09-17',
      dateLabel: 'Sep 17, 2026',
      featured: false,
      content: 'School is meant to be a place where students learn, grow, build friendships, and feel safe — but vaping and drinking on campus can interfere with that environment. Even when a student thinks they are only doing it once, it can become a habit that affects their daily life.\n\nTeachers and staff have a responsibility to protect students and keep campus a place where everyone feels comfortable. Reaching out for help, and keeping vaping and drinking away from school, protects everyone.',
      updatedAt: ''
    },
    {
      slug: 'eyes-on-you',
      status: 'published',
      section: 'News & Politics',
      title: 'Eyes on You',
      subtitle: 'Flock cameras and the cost of constant surveillance',
      author: 'Nina De Unamuno',
      position: 'Managing Editor',
      date: '2026-09-17',
      dateLabel: 'Sep 17, 2026',
      featured: false,
      content: 'In the U.S., over 100 cities have banned the increasingly contentious Flock Safety cameras, which use “vehicle fingerprinting” to log license plates and build a detailed profile of a car — all under the claim of cracking down on crime.\n\nSupporters argue the technology helps solve crimes and find missing persons. Others question the accuracy of the detections and point to cases of misuse. “It’s giving 1984,” one Eastlake student said.',
      updatedAt: ''
    },
    {
      slug: 'ready-for-the-phone-ban',
      status: 'published',
      section: 'Opinion',
      title: 'Are We Ready for the Phone Ban?',
      subtitle: 'A new policy splits the student body',
      author: 'Natalie Falcon',
      position: 'Staff Writer',
      date: '2026-09-17',
      dateLabel: 'Sep 17, 2026',
      featured: false,
      content: 'Here at Eastlake High, a new phone ban has started this school year. Students are expected to keep their phones away at all times — and not everyone is happy about it.\n\nThe policy is meant to help students focus, finish their work, and participate in class. Some students agree it keeps them off social media; others see no point in it. Either way, it’s the biggest change to the school day in years.',
      updatedAt: ''
    },
    {
      slug: 'pacific-warming-winter-warning',
      status: 'published',
      section: 'VAPA & College Corner',
      title: 'Pacific Warming, Winter Warning',
      subtitle: 'What a warmer Pacific means for our winter',
      author: 'Carolina Muldoon Guajardo',
      position: 'News & Politics Editor',
      date: '2026-09-17',
      dateLabel: 'Sep 17, 2026',
      featured: false,
      content: 'El Niño — not a boy, but a natural climate pattern — causes the surface temperature of the Pacific Ocean to rise significantly this year. How will it affect us?\n\nAP Environmental Science teacher Mr. Smith explains the difference between the two patterns: “La Niña is where the currents in the Pacific are pushing west, while El Niño is where those currents reverse.” The upshot: a warmer, wetter season ahead.',
      updatedAt: ''
    }
  ]
};
if (typeof module !== 'undefined') { module.exports = ENN_ARTICLES; }
