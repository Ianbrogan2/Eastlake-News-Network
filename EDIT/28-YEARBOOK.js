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
  enabled: 'T',
  announce: {
    on: 'F',
    title: '',
    body: '',
    startAt: '',
    endAt: ''
  },
  hero: {
    schoolYear: '2026-27',
    theme: 'Coming Soon',
    tagline: '',
    coverImg: ''
  },
  buy: {
    on: 'T',
    price: '90',
    jostensUrl: 'https://www.jostens.com/apps/store/productDetail/1015698/Eastlake-High-School/Yearbook/20260702121505630151/CATALOG_SHOP/Yearbook/20260702121505650151',
    nextBumpDate: '2026-10-12',
    nextBumpPrice: '95',
    history: [
      { price: '85', when: 'Through Aug' },
      { price: '90', when: 'Now' }
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
    on: 'T',
    photos: {
      on: 'T',
      categories: [
        'Sports', 'Clubs & Activities', 'Spirit Weeks', 'Dances & Events', 'Candids & Everyday'
      ],
      studentUrl: 'https://drive.google.com/drive/folders/1nsVIGHKPmPVdgQoFc0vskQVMQoliArXg?usp=sharing',
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
