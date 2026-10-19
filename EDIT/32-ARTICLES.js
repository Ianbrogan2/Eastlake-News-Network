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
  articles: []
};
if (typeof module !== 'undefined') { module.exports = ENN_ARTICLES; }
