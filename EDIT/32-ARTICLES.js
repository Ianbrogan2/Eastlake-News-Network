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
      slug: 'meet-the-editor-in-chief',
      status: 'draft',
      section: 'Entertainment & Photo Journal',
      title: 'Meet the Editor-in-Chief',
      subtitle: 'How First-Year Editor-in-Chief Katerina Wright Is Guiding the Next Generation of Student Journalists',
      author: 'Sara Arnazzi',
      position: 'Staff Writer',
      date: '2026-10-22',
      dateLabel: 'Oct 22, 2026',
      content: 'As we transition into the new school year, Newspaper’s newest Editor in Chief, Katerina Wright, constantly works behind the scenes to ensure our school successfully stays up to date with important events, figures, and traditions. \n\nWright joined the Newspaper industry 3 weeks into the school year as her best friend Nina inspired her to join. She believes the students in Newspaper contain creativity still needed to channel into the writing abilities that may not yet seem to be there currently. With the learning Wright is serving to these students in order to find their way through creative writing and thinking, there is a lot of potential for the school year.  \n\nAs someone who joined without any prior journalism experience, Wright faced the majority of the challenges some students are facing currently in the class. She claims that it was difficult learning the organization parts of Newspaper, specifically working the pages and making them come to life in order for it to “appeal” to the audience. As she holds her leadership role, she claims that she wasn’t ready for this commitment right away. She is still adjusting to work with a group of people twice as big as last year. As she handles the workload, she hopes for Newspaper to reach more students so they can see the hard work put in each issue and to win was the annual Newspaper fair contest in Del Mar. ',
      featured: false,
      updatedAt: '2026-10-22T18:21:08.291Z'
    }
  ]
};
if (typeof module !== 'undefined') { module.exports = ENN_ARTICLES; }
