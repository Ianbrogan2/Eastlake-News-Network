// ╔══════════════════════════════════════════════════════════════════╗
// ║  ENN EDIT FILE  31  —  THE EDGE · MURDER MYSTERY GAMES            ║
// ╠══════════════════════════════════════════════════════════════════╣
// ║  Managed in the Site Manager → The Edge → Murder Mystery.        ║
// ║  Each game is one object below. status: published/draft/          ║
// ║  unpublished. isDefault:true is the game the printed QR (which    ║
// ║  points at /murdermystery/) always opens — leave it on the        ║
// ║  Eastlake Assassins. New games open at /murdermystery/?game=slug. ║
// ╚══════════════════════════════════════════════════════════════════╝
var ENN_CASES = {
  games: [
    {
      slug: 'eastlake-assassins',
      status: 'published',
      isDefault: true,
      title: 'The Eastlake Assassins',
      subtitle: 'Whodunit · The Vanished Pot',
      kick: 'The Eastlake Edge',
      tagline: 'A $3,000 tournament, an account gone dark, and a thief hiding in plain sight. Work the corkboard, log the evidence, and close the case before anyone else does. This is the game the newspaper’s QR code drops you into.',
      caseNumber: 'EHS-0342',
      adminPass: 'edge-admin',
      updatedAt: '',
      intro: {
        caseTag: 'Case #EHS-0342, The Vanished Pot',
        headline: 'Somebody walked off with three grand. Help me prove who.',
        body: [
          'My name would be on the last page, if they hadn&rsquo;t pulled me off this first. So read fast. The <b>Eastlake Assassins</b> ran all summer through one anonymous account. Three hundred players, ten bucks a head, <b>$3,000</b> in the pot. Then the bracket ended, the account went dark, and nobody got paid.',
          'I logged <b>five things</b> before my clock ran out. Everything you need is pinned to the board in your hands, the one you scanned this off of. Work the five faster than I did, and the last one hands you the thief.'
        ],
        note: 'Clock&rsquo;s been running since you scanned. Open the file and let&rsquo;s move.'
      },
      questions: [
        {
          tag: 'CODE 1 &middot; THE POT',
          level: 'Easy',
          prompt: 'Every case starts with the money. The whole pot walked off with the account, and I need the exact figure before we go anywhere. Read the file and tell me what vanished.',
          hint: 'It&rsquo;s printed on the case file up top. Find the <b>SUBJECT</b> line.',
          hint2: 'Round number, four digits, the same figure the whole class has been yelling about since the account went dark.',
          skip: 'The case file&rsquo;s SUBJECT line reads &lsquo;Unpaid tournament funds, $3,000.&rsquo; The pot we&rsquo;re chasing is <b>$3,000</b>.',
          right: 'That&rsquo;s the number. Three grand, gone clean. Now, where did it go?',
          wrong: 'That&rsquo;s not the pot. Read it off the file, to the dollar.',
          answers: [
            '$3,000',
            '3000',
            '3,000',
            '$3000',
            '3 000',
            'three thousand'
          ]
        },
        {
          tag: 'CODE 2 &middot; THE TRAIL',
          level: 'Warmer',
          prompt: 'Three hundred buy-ins, and every dollar funneled into one account nobody can put a face to. Follow the money off the board and give me the exact handle the pot got paid into.',
          hint: 'There&rsquo;s a CashApp receipt pinned to the board. Somebody sent money, the question is <i>to whom.</i>',
          hint2: 'Read the <b>To:</b> line on that receipt. It&rsquo;s the same name the whole tournament ran under, the dollar sign in front doesn&rsquo;t matter.',
          skip: 'The CashApp receipt&rsquo;s <b>To:</b> line is <b>$lakeassassin27</b>, same name as the Instagram account. That&rsquo;s where all $3,000 landed. Answer: <b>lakeassassin27</b>.',
          right: 'There it is, <b>lakeassassin27</b>. Anonymous on purpose. Whoever&rsquo;s behind that handle is sitting on the whole pot.',
          wrong: 'Not the name I want. Find the CashApp receipt and read who the money went <i>to</i>.',
          answers: [
            'lakeassassin27',
            '$lakeassassin27',
            'lakeassassin',
            'lakeseniorassasin27',
            'lakeseniorassassin27'
          ]
        },
        {
          tag: 'CODE 3 &middot; THE GAP',
          level: 'Tricky',
          prompt: 'Miles Filamor swears he was knocked out around <b>9:15</b> that night. The Week&nbsp;2 bracket update logs his elimination a lot later. I don&rsquo;t want the logged time, I want the <b>gap</b>. How much time is missing between his story and the log?',
          hint: 'Two times, two exhibits. His <i>claimed</i> time is on his suspect card; the <i>logged</i> time is on the Week 2 bracket update photo.',
          hint2: 'Claimed 9:15 PM. Logged 11:45 PM. Subtract one from the other, give it to me in hours and minutes.',
          skip: '9:15 PM to 11:45 PM is <b>2 hours 30 minutes</b>. That&rsquo;s the stretch nobody can explain, somebody kept his name alive in the bracket after he says he was out. Answer: <b>2:30</b>.',
          right: 'Two and a half hours unaccounted for. Somebody sat on his elimination, which makes Miles a victim, not the thief. Keep pulling.',
          wrong: 'That&rsquo;s not the gap. Take the logged time, subtract when he says he was out. Hours and minutes.',
          answers: [
            '2:30',
            '230',
            '2 hours 30 minutes',
            '2hr30',
            '2h30',
            '2hrs30',
            '2 hrs 30 min',
            '150',
            '150 minutes',
            '150min',
            '2 30'
          ]
        },
        {
          tag: 'CODE 4 &middot; THE SAME NIGHT',
          level: 'Hard',
          prompt: 'Here&rsquo;s where it turns. That bracket got quietly edited at <b>11:45 PM</b>. Earlier the <i>same night</i>, somebody was already in the DMs planting the &lsquo;it&rsquo;s ASB&rsquo; story, steering blame before the bracket even moved. How long <b>before</b> the edit did that message go out?',
          hint: 'Two timestamps, same date, Aug 16. One&rsquo;s on the bracket update; the other&rsquo;s on the Instagram DM.',
          hint2: 'The DM posted at 10:02 PM. The bracket was edited at 11:45 PM. How much time sits between them?',
          skip: 'The &lsquo;blame ASB&rsquo; DM went out at 10:02 PM; the bracket was rigged at 11:45 PM, same night. That&rsquo;s <b>1 hour 43 minutes</b> earlier. The account&rsquo;s loudest defender was working the story <i>before</i> the crime. Answer: <b>1:43</b>.',
          right: 'One hour, forty-three minutes <i>before</i> the bracket moved. Whoever sent that DM wasn&rsquo;t reacting, they were getting ahead of it. That&rsquo;s not a bystander.',
          wrong: 'Off. Find the DM&rsquo;s time and the bracket edit&rsquo;s time, same night, and give me the gap between them.',
          answers: [
            '1:43',
            '143',
            '1 hour 43 minutes',
            '1hr43',
            '1h43',
            '1hrs43',
            '1 hr 43 min',
            '103',
            '103 minutes',
            '103min',
            '1 43'
          ]
        },
        {
          tag: 'CODE 5 &middot; THE ACCUSATION',
          level: 'Hard',
          prompt: 'You&rsquo;ve got the account, the money, and a timeline that only points one way. Three of these players lost, and they&rsquo;re loud about it. One never lost a thing, and spent every breath aiming you at a suspect who doesn&rsquo;t exist. Name him the only way that&rsquo;ll hold up: give me his <b>Player ID</b>.',
          hint: 'Whoever sent that 10:02 PM DM is the one steering everything toward &lsquo;ASB.&rsquo; Start by finding that handle.',
          hint2: 'The DM is from <b>@myles_rey07</b>, Myles Reyes. Match that name to a suspect card and read the Player ID off it.',
          skip: 'The DM handle @myles_rey07 belongs to <b>Myles Reyes</b>, and his suspect card reads <b>PLR-07</b>. He ran the account, took the pot, and invented &lsquo;ASB&rsquo; to keep your eyes off him. Answer: <b>PLR-07</b>.',
          right: 'PLR-07. Myles Reyes. That&rsquo;s our man, close it.',
          wrong: 'Not him. The one who never lost, the one steering you at &lsquo;ASB&rsquo;, match the DM handle to a card and read the ID.',
          answers: [
            'PLR-07',
            'PLR07',
            '07',
            '7',
            'plr 07',
            'plr-7'
          ]
        }
      ],
      suspects: [
        {
          name: 'Aaden Limon',
          id: 'PLR-08',
          tag: 'Underpaid, not the thief',
          guilty: false
        },
        {
          name: 'Miles Filamor',
          id: 'PLR-04',
          tag: 'Cheated out, a victim',
          guilty: false
        },
        {
          name: 'Ryan Hughes',
          id: 'PLR-11',
          tag: 'Sore runner-up, cleared',
          guilty: false
        },
        {
          name: 'Myles Reyes',
          id: 'PLR-07',
          tag: 'Ran $lakeassassin27',
          guilty: true
        }
      ],
      win: {
        verdict: 'Case closed, it was Myles Reyes.',
        blurb: 'The account stayed anonymous for a reason. Myles Reyes wasn&rsquo;t guessing at the thief, he <b>was</b> the thief. He ran <b>$lakeassassin27</b>, collected all <b>$3,000</b>, paid out nobody, and spent two weeks aiming the whole school at &lsquo;ASB&rsquo; so nobody&rsquo;d look at PLR-07. The loudest theory in the room was the cover story. You closed it faster than I ever got to, sign the file. The Board&rsquo;s yours.'
      }
    }
  ]
};
if (typeof module !== 'undefined') { module.exports = ENN_CASES; }
