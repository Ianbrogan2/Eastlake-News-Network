// ╔═══════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  22  —  STUDENT ROSTER  (Periods 1, 4 & 6)        ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  WHAT THIS FILE CONTROLS:                                        ║
// ║    Who is in ENN. When a student types their student ID on the   ║
// ║    newsroom login, this is what the site looks them up in.       ║
// ║                                                                  ║
// ║    It decides:                                                    ║
// ║      • the name they get greeted with                             ║
// ║      • which period and production group they belong to           ║
// ║      • whether they see the Leadership tab, and which role        ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  EASIEST WAY TO EDIT THIS:                                       ║
// ║    Don't edit this file by hand. Go to                            ║
// ║        eastlakenewsnetwork.com/admin                              ║
// ║    and open  "Student Roster".  Every slot below already exists   ║
// ║    as a form field — you just type the name and ID into it.       ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  HOW THE SLOTS WORK:                                             ║
// ║    Each period has 11 LEADERSHIP slots and 8 GROUPS of up to 8.  ║
// ║    Empty slots are simply ignored — leave any you don't use       ║
// ║    blank. Nothing breaks and nothing shows up on the site.        ║
// ║                                                                  ║
// ║    A student can be in BOTH a group and a leadership slot.        ║
// ║    Put the SAME student ID in both places and the site figures    ║
// ║    it out — they get their group AND their Leadership tab.        ║
// ║                                                                  ║
// ║    The ADVISOR is set once and applies to all three periods.      ║
// ╠═══════════════════════════════════════════════════════════════╣
// ║  THE FIELDS:                                                     ║
// ║    id     → the student's ID number — what they type to log in   ║
// ║    first  → first name  (used for "Hello Ian")                    ║
// ║    last   → last name                                             ║
// ║    role   → leadership title (leadership slots only)             ║
// ║    name   → the production group's name (groups only)             ║
// ╚═══════════════════════════════════════════════════════════════╝

var ENN_ROSTER = {
  advisorCode: 'ENNADM26',
  advisor: {
    first: 'Mr.',
    last: 'Nimmo',
    role: 'Faculty Advisor'
  },
  baseCallSign: 'ENN',
  period1: {
    leadership: [
      {
        role: 'Studio Director',
        id: '1595697',
        first: 'Ian',
        last: 'Brogan'
      },
      {
        role: 'Newsroom Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Creative Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Assistant Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Assistant Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Camera Operator',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Camera Operator',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Main Editor',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Anchor',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Anchor',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Equipment Manager',
        id: '',
        first: '',
        last: ''
      }
    ],
    groups: [
      {
        name: 'Group 1',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 2',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 3',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 4',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 5',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 6',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 7',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 8',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      }
    ]
  },
  period4: {
    leadership: [
      {
        role: 'Studio Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Newsroom Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Creative Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Assistant Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Assistant Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Camera Operator',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Camera Operator',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Main Editor',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Anchor',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Anchor',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Equipment Manager',
        id: '',
        first: '',
        last: ''
      }
    ],
    groups: [
      {
        name: 'Group 1',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 2',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 3',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 4',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 5',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 6',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 7',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 8',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      }
    ]
  },
  period6: {
    leadership: [
      {
        role: 'Studio Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Newsroom Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Creative Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Assistant Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Assistant Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Camera Operator',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Camera Operator',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Main Editor',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Anchor',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Anchor',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Equipment Manager',
        id: '',
        first: '',
        last: ''
      }
    ],
    groups: [
      {
        name: 'Group 1',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 2',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 3',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 4',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 5',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 6',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 7',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 8',
        members: [
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      }
    ]
  }
};
