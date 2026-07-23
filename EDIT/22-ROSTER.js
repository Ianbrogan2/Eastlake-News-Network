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
// ║    Each period has 11 LEADERSHIP slots and 10 GROUPS of up to 5.  ║
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
  advisorCode: 'A113',
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
        id: '1592547',
        first: 'Ava',
        last: 'Ridgeway'
      },
      {
        role: 'Creative Director',
        id: '',
        first: '',
        last: ''
      },
      {
        role: 'Assistant Director',
        id: '1592985',
        first: 'Maddy',
        last: 'Mcgee'
      },
      {
        role: 'Assistant Director',
        id: '1594938',
        first: 'Christian',
        last: 'Stevens'
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
            id: '1593912',
            first: 'Erina',
            last: 'Tsuya'
          },
          {
            id: '1085049',
            first: 'Sophia',
            last: 'Meza'
          },
          {
            id: '1592985',
            first: 'Maddy',
            last: 'Mcgee'
          },
          {
            id: '1607409',
            first: 'Elise',
            last: 'Navarette'
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
            id: '1593438',
            first: 'Clarissa',
            last: 'Vazquez'
          },
          {
            id: '1595483',
            first: 'Tyler',
            last: 'Little'
          },
          {
            id: '1594778',
            first: 'Gavin',
            last: 'Labak'
          },
          {
            id: '1605674',
            first: 'Sofia ',
            last: 'Fong'
          },
          {
            id: '2121212',
            first: 'Barac',
            last: 'Salinas'
          }
        ]
      },
      {
        name: 'Group 3',
        members: [
          {
            id: '1592547',
            first: 'Ava',
            last: 'Ridgeway'
          },
          {
            id: '1594938',
            first: 'Christian',
            last: 'Stevens'
          },
          {
            id: '1599232',
            first: 'Chloe',
            last: 'Marzella'
          },
          {
            id: '1652535',
            first: 'Isabella',
            last: 'Suarez'
          },
          {
            id: '1594563',
            first: 'Chloe Kiana',
            last: 'Moreno'
          }
        ]
      },
      {
        name: 'Group 4',
        members: [
          {
            id: '1593772',
            first: 'Nicolas',
            last: 'Teigeiro'
          },
          {
            id: '1595737',
            first: 'Jacob',
            last: 'Estala'
          },
          {
            id: '1596164',
            first: 'Ty',
            last: 'Chanthalangsy'
          },
          {
            id: '1595007',
            first: 'Adrian',
            last: 'Infante'
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
            id: '1594297',
            first: 'Cain ',
            last: 'Benitez-Brown'
          },
          {
            id: '1593174',
            first: 'Evan',
            last: 'Harry'
          },
          {
            id: '1592859',
            first: 'Andres',
            last: 'solorzano'
          },
          {
            id: '1593401',
            first: 'Clark',
            last: 'Del Rosario'
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
            id: '1593936',
            first: 'Joaquin',
            last: 'Lopez'
          },
          {
            id: '1593760',
            first: 'Farid',
            last: 'Al-ayyoub'
          },
          {
            id: '1593963',
            first: 'Hayden',
            last: 'Stolebarger'
          },
          {
            id: '1592644',
            first: 'Sidney',
            last: 'Jonason'
          },
          {
            id: '1594809',
            first: 'Aidan',
            last: 'Castillo'
          }
        ]
      },
      {
        name: 'Group 7',
        members: [
          {
            id: '1595262',
            first: 'Kike',
            last: 'Perez'
          },
          {
            id: '1596239',
            first: 'Andrew',
            last: 'Baffico'
          },
          {
            id: '1592672',
            first: 'David',
            last: 'Branco'
          },
          {
            id: '1604388',
            first: 'Emilio',
            last: 'Uribe'
          },
          {
            id: '1594735',
            first: 'Caleb',
            last: 'Foss'
          }
        ]
      },
      {
        name: 'Group 8',
        members: [
          {
            id: '1605506',
            first: 'Rafael',
            last: 'Contreras'
          },
          {
            id: '1592995',
            first: 'Brooke',
            last: 'Lee'
          },
          {
            id: '1628682',
            first: 'Tyler',
            last: 'Cannon'
          },
          {
            id: '1639299',
            first: 'Henry',
            last: 'Sinks'
          },
          {
            id: '',
            first: '',
            last: ''
          }
        ]
      },
      {
        name: 'Group 9',
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
          }
        ]
      },
      {
        name: 'Group 10',
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
          }
        ]
      }
    ]
  },
  period4: {
    leadership: [
      {
        role: 'Studio Director',
        id: '1607177',
        first: 'Jovani',
        last: 'Iglesias'
      },
      {
        role: 'Newsroom Director',
        id: '1598123',
        first: 'Lucca',
        last: 'Dei'
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
        id: '1595647',
        first: 'Logan',
        last: 'Serrano-Wirth'
      }
    ],
    groups: [
      {
        name: 'Group 1',
        members: [
          {
            id: '1596078',
            first: 'Reese',
            last: 'Hernandez'
          },
          {
            id: '1594021',
            first: 'Riley',
            last: 'McElroy'
          },
          {
            id: '1593681',
            first: 'Lily',
            last: 'Tonna'
          },
          {
            id: '1605611',
            first: 'Jacob',
            last: 'Torres'
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
            id: '1621832',
            first: 'Avalon',
            last: 'Sandan'
          },
          {
            id: '1620465',
            first: 'Kaylin',
            last: 'Wright'
          },
          {
            id: '1631771',
            first: 'Bryleigh',
            last: 'Hill'
          },
          {
            id: '1624483',
            first: 'Max',
            last: 'Fuenzalida'
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
            id: '1594312',
            first: 'Antonio',
            last: 'Villarreal De Leon'
          },
          {
            id: '1596024',
            first: 'Ysabel',
            last: 'Ramirez'
          },
          {
            id: '1606641',
            first: 'Elyas',
            last: 'Gean'
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
            id: '1592955',
            first: 'Shaila',
            last: 'Ortiz'
          },
          {
            id: '1638345',
            first: 'Audrick',
            last: 'Munsayac'
          },
          {
            id: '1593192',
            first: 'Nataly',
            last: 'Meier'
          },
          {
            id: '1604031',
            first: 'Nicole',
            last: 'Kim'
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
            id: '1593084',
            first: 'Sophia',
            last: 'Soriano'
          },
          {
            id: '1624904',
            first: 'Jaelyn',
            last: 'Smith'
          },
          {
            id: '1607888',
            first: 'German',
            last: 'Leon Ramirez'
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
            id: '1606337',
            first: 'Danyaal',
            last: 'Javier'
          },
          {
            id: '1606413',
            first: 'Lucas',
            last: 'Yriqui'
          },
          {
            id: '1607815',
            first: 'Ryan',
            last: 'Tandy'
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
            id: '1599413',
            first: 'Erick',
            last: 'Villeda'
          },
          {
            id: '1593852',
            first: 'Santiago',
            last: 'Aleta'
          },
          {
            id: '1592578',
            first: 'Matthew',
            last: 'Delgado'
          },
          {
            id: '1593741',
            first: 'Brian',
            last: 'Banthaw'
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
          }
        ]
      },
      {
        name: 'Group 9',
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
          }
        ]
      },
      {
        name: 'Group 10',
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
        first: 'GiuGiu',
        last: 'Bischoffer'
      },
      {
        role: 'Newsroom Director',
        id: '1595814',
        first: 'Alejandro',
        last: 'Schejola'
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
          }
        ]
      },
      {
        name: 'Group 9',
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
          }
        ]
      },
      {
        name: 'Group 10',
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
          }
        ]
      }
    ]
  }
};
