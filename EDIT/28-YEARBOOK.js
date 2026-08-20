// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  28  —  YEARBOOK HUB                             ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  The whole Yearbook page. Manage it from the admin panel under    ║
// ║  "Yearbook" — you don't need to touch this file by hand.          ║
// ║                                                                  ║
// ║  enabled : 'T' = the page is LIVE (shows in the menu)            ║
// ║            'F' = the page is DOWN / hidden  ← starts here        ║
// ║  Every feature has its own  on: 'T' / 'F'  switch, so you can    ║
// ║  turn any single part on or off without deleting anything.       ║
// ║  Everything is left blank on purpose — fill it in when ready.    ║
// ╚══════════════════════════════════════════════════════════════════╝
var ENN_YEARBOOK = {
  enabled: 'F',
  announce: {
    on: 'F',
    title: '',
    body: ''
  },
  hero: {
    schoolYear: '',
    theme: '',
    tagline: '',
    coverImg: ''
  },
  buy: {
    on: 'F',
    price: '',
    jostensUrl: '',
    nextBumpDate: '',
    nextBumpPrice: '',
    history: [
      {
        price: '',
        when: ''
      }
    ],
    remind: {
      on: 'F',
      url: ''
    },
    gift: {
      on: 'F',
      price: '',
      url: ''
    },
    extras: {
      on: 'F',
      items: [
        {
          label: '',
          price: '',
          url: ''
        }
      ]
    }
  },
  ads: {
    on: 'F',
    tributes: {
      on: 'F',
      desc: '',
      deadline: '',
      formUrl: '',
      tiers: [
        {
          label: '',
          price: ''
        }
      ]
    },
    sponsors: {
      on: 'F',
      becomeUrl: '',
      tiers: [
        {
          label: '',
          price: ''
        }
      ]
    },
    groups: {
      on: 'F',
      formUrl: '',
      tiers: [
        {
          label: '',
          price: ''
        }
      ]
    }
  },
  submit: {
    on: 'F',
    photos: {
      on: 'F',
      categories: [
        ''
      ],
      studentUrl: '',
      parentUrl: ''
    },
    superlatives: {
      on: 'F',
      note: '',
      voteUrl: '',
      teacherUrl: ''
    },
    rosters: {
      on: 'F',
      url: ''
    }
  },
  history: {
    on: 'F',
    covers: [
      {
        year: '',
        theme: '',
        img: ''
      }
    ],
    alumni: {
      on: 'F',
      people: [
        {
          name: '',
          classOf: '',
          note: '',
          img: ''
        }
      ]
    }
  },
  hype: {
    on: 'F',
    reveal: {
      on: 'F',
      date: ''
    },
    staff: {
      on: 'F',
      people: [
        {
          name: '',
          role: '',
          img: ''
        }
      ]
    },
    progress: {
      on: 'F',
      avgPerDay: '',
      done: '',
      total: ''
    }
  },
  dates: {
    on: 'F',
    items: [
      {
        label: '',
        date: ''
      }
    ],
    distribution: {
      on: 'F',
      date: '',
      where: ''
    }
  },
  testimonials: {
    on: 'F',
    items: [
      {
        quote: '',
        who: ''
      }
    ]
  }
};
