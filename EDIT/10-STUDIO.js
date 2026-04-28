// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  10  —  STUDIO PAGE  (YouTube Playlist Albums)   ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    The Studio page — three album sections showing YouTube        ║
// ║    playlists for student pieces, Instagram content, and the      ║
// ║    VHS archive                                                   ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  HOW TO ADD A PLAYLIST:                                          ║
// ║    1. Go to your YouTube channel → Playlists                     ║
// ║    2. Open the playlist you want to embed                        ║
// ║    3. Look at the URL:                                           ║
// ║         youtube.com/playlist?list=PLxxxxxxxxxxxxxxxx             ║
// ║       Copy everything after  ?list=                              ║
// ║    4. Paste it as the  playlistId  value below                   ║
// ║                                                                  ║
// ║  Leave  playlistId: ''  and the section shows a placeholder      ║
// ║  until you're ready to fill it in.                               ║
// ╚══════════════════════════════════════════════════════════════════╝

var ENN_STUDIO = {

  playlists: [

    {
      title:      'Student-Made Pieces',
      category:   'student',
      // category options: 'student'  'instagram'  'vhs'
      description: 'Original short films, segments, and video pieces produced entirely by ENN students.',
      playlistId:  'PLT5DUIPkiaHErv9n3CX0FZ2p7kgmKDjMq',
      // ↑ Paste your YouTube playlist ID here
    },

    {
      title:      'VHS Archive',
      category:   'vhs',
      description: 'Classic ENN bulletins digitized from the original VHS tapes — the full history of the show.',
      playlistId:  'PLT5DUIPkiaHEMBSupwNE-AbT9tgDKntfA',
    },

  ],

};
