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
      subtitle: 'Murder Mystery · The Vanished Pot',
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
    },
    {
      slug: 'proctor-valley-road',
      status: 'draft',
      isDefault: false,
      title: 'Murder on Proctor Valley Road',
      subtitle: 'Murder Mystery · Two Dead, One Dinner Party',
      kick: 'The Eastlake Edge',
      tagline: 'Two bodies, nine suspects, one dinner party on the valley’s most haunted road. Read the case file, follow the claw marks and the feather, and cross the guests off one by one until only the killer is left. Scan, and the clock starts.',
      caseNumber: 'EHS-1031',
      adminPass: 'edge-admin',
      updatedAt: '2026-11-01',
      intro: {
        caseTag: 'Case #EHS-1031, Murder on Proctor Valley Road',
        headline: 'Two dead on the valley road. Nine at the table. Name the one who did it.',
        body: [
          'Husky turned up dead on <b>Proctor Valley Road</b>, torn up by claws, the same night the whole crew sat down to dinner. Everybody liked <b>Coyote</b> for it, coyotes and dogs don&rsquo;t mix, and he was the last one seen with Husky. Then the lights went out at the party. When they came back, Coyote was dead on the bathroom floor with a <b>feather</b> on his body, and the easy answer died with him.',
          'The case file is in your hands, the one you scanned this off of: the floor plan, every guest&rsquo;s statement, and three pieces of evidence. Work the <b>three clues</b> in order. Each one crosses somebody off. The last one hands you the killer, if you&rsquo;re fast enough to beat the clock.'
        ],
        note: 'Clock&rsquo;s been running since you scanned. Open the file and start crossing off suspects.'
      },
      questions: [
        {
          tag: 'EVIDENCE 1 &middot; THE CLAWS',
          level: 'Easy',
          prompt: 'Start with the body. <b>Clue #1</b> is a close-up of the marks on Husky, deep, sharp claw slashes. Look at your nine guests: one of them has no sharp claws at all and gets crossed off first. Name the guest Clue #1 clears.',
          hint: 'Think about whose paws <i>couldn&rsquo;t</i> leave a slash like that. One guest is all floppy ears and no weapons.',
          hint2: 'It&rsquo;s the one whose whole statement is &ldquo;idk, I was chasing my tail in circles.&rdquo;',
          skip: 'Clue #1 is sharp claw marks, so the one guest with no sharp claws is out: <b>Beagle</b>, who was just chasing its tail. Eight suspects left.',
          right: 'Beagle&rsquo;s clear, no claws, no case. Eight left, and every one of them is armed. On to the next.',
          wrong: 'Not them. Clue #1 is about <i>claws</i>, find the one guest who hasn&rsquo;t got any sharp ones.',
          answers: ['beagle','the beagle','beagal','beagel']
        },
        {
          tag: 'EVIDENCE 2 &middot; THE BLACKOUT',
          level: 'Warmer',
          prompt: 'Now the night turns. At the dinner party the lights cut out, everyone panics, and when they come back on one of your suspects is dead in the bathroom, the exact one everybody was blaming. Who just went from prime suspect to second victim?',
          hint: 'Everyone was sure the killer was him before the blackout. Coyotes and dogs, remember.',
          hint2: 'He&rsquo;s the one whose chair is pushed back and left empty on the floor plan.',
          skip: 'When the lights came back, <b>Coyote</b> was dead on the bathroom floor. The room&rsquo;s prime suspect is now victim number two. Answer: <b>Coyote</b>.',
          right: 'Coyote. The whole table had him pegged, and now he&rsquo;s gone too. Two bodies, and the easy answer&rsquo;s off the board. Somebody wanted him quiet.',
          wrong: 'No. The dead one in the bathroom is the guest everyone suspected first, the one who left Husky on the road.',
          answers: ['coyote','the coyote','coyete','cayote','kyote']
        },
        {
          tag: 'EVIDENCE 3 &middot; THE FEATHER',
          level: 'Tricky',
          prompt: 'Over at <b>Coyote&rsquo;s crime scene</b> in the bathroom you&rsquo;ve got the <i>same</i> claw marks as Husky, but this time something extra is lying by the body, something a clawed animal wouldn&rsquo;t leave. Three guests were packed together at the dinner table the whole blackout and vouch for each other, so they clear too. What is the <b>one new piece of evidence</b> on Coyote&rsquo;s body?',
          hint: 'It&rsquo;s not a claw mark. Look at what&rsquo;s lying beside the outline at Coyote&rsquo;s crime scene.',
          hint2: 'Birds have them. One word.',
          skip: 'Coyote&rsquo;s crime scene has a single <b>feather</b> lying by the body, on top of the same claw marks. And Tiger, Mountain Lion and Wolf alibi each other at the table, so they&rsquo;re out. Answer: <b>feather</b>.',
          right: 'A feather. Claws say one thing, a feather says another, and the table trio (Tiger, Mountain Lion, Wolf) all vouch for each other, so cross them off. Down to four: Bert, RoboGriffin, Eagle and Golden Eagle.',
          wrong: 'Close, but I want the <i>new</i> thing on the body, not the claw marks. Check Coyote&rsquo;s crime scene again.',
          answers: ['feather','a feather','feathers','thefeather','bird feather']
        },
        {
          tag: 'EVIDENCE 4 &middot; THE METAL',
          level: 'Hard',
          prompt: 'Clue #2 puts that feather under a flashlight: it&rsquo;s not soft at all, it&rsquo;s <b>metal</b>, with rivets, panel seams and snapped wires where it was torn loose. Real feathers clear Eagle and Golden Eagle. Only one guest at that table has <i>metal</i> feathers. Who does Clue #2 point the finger at?',
          hint: 'Two of your four are birds with real feathers, they&rsquo;re out. Who&rsquo;s built out of metal?',
          hint2: 'Metal feathers, metal talons, Bert&rsquo;s best friend. Read his statement, he said he&rsquo;d have killed Coyote.',
          skip: 'A metal feather only comes off one guest: <b>RoboGriffin</b>. Eagle and Golden Eagle have real feathers, so they&rsquo;re cleared. It&rsquo;s down to RoboGriffin and Bert. Answer: <b>RoboGriffin</b>.',
          right: 'RoboGriffin, metal feathers, metal everything. And he did say he&rsquo;d have killed Coyote. Looks airtight&hellip; except he swears he was with Bert in the dark. Two left. One of them is being set up.',
          wrong: 'Not a real-feathered bird. The feather is <i>metal</i>, match it to the one guest made of metal.',
          answers: ['robogriffin','rg','robo griffin','griffin','robogriffins','robo griffins','griffins','camarena','robogryphon','robogriffon','robo griffon']
        },
        {
          tag: 'EVIDENCE 5 &middot; THE FOOTPRINT',
          level: 'Hard',
          prompt: 'Here&rsquo;s the trap. RoboGriffin says he felt a sharp <i>prick</i> in the blackout, that was someone plucking a feather off him to frame him. So look at the last clue instead. <b>Clue #3</b> is a bloody trail running out from Coyote&rsquo;s body. Describe the foot that made those prints: is it a sleek metal talon, or a big ______ paw?',
          hint: 'RoboGriffin&rsquo;s feet are metal talons, thin and sharp. The prints in Clue #3 are nothing like that.',
          hint2: 'The prints are huge, clawed, and covered in it. One word, the thing RoboGriffin doesn&rsquo;t have a single strand of.',
          skip: 'Clue #3 is a huge, clawed, <b>furry</b> paw print, the opposite of RoboGriffin&rsquo;s thin metal talons. The feather was a plant; the footprint is the truth. Answer: <b>furry</b> (a furry paw).',
          right: 'Furry. Big, clawed, furry paws, not a talon in sight. RoboGriffin was framed with his own feather. That print belongs to someone covered in fur&hellip; and there&rsquo;s only one of those left.',
          wrong: 'Look at Clue #3 again. Metal talons are thin and bare, these prints are the exact opposite.',
          answers: ['furry','fur','furry paw','a furry paw','furrypaw','hairy','paw','fuzzy']
        },
        {
          tag: 'EVIDENCE 6 &middot; THE KILLER',
          level: 'Hard',
          prompt: 'Put it together. The metal feather framed RoboGriffin, but his talons can&rsquo;t leave a furry paw print. Only one guest at that table is a huge, fuzzy, clawed monster with no feathers at all, the one who kept complaining about &ldquo;roadwork&rdquo; while Husky and Coyote fought outside his house. Name the killer.',
          hint: 'He&rsquo;s the Proctor Valley Monster. The &ldquo;roadwork&rdquo; in his statement was the fight that interrupted his reading.',
          hint2: 'Big, furry, clawed, holds a book, best friends with RoboGriffin. First name is enough.',
          skip: 'It was <b>Bert</b>, the Proctor Valley Monster. Furry, clawed, no feathers, the only feet that match the footprint. He killed both to stop the noise and framed his own best friend. Answer: <b>Bert</b>.',
          right: 'Bert. The Proctor Valley Monster himself. Case closed, sign the file.',
          wrong: 'Not him. The killer is furry, clawed, featherless, and was &ldquo;reading&rdquo; next to the fight. Name the monster.',
          answers: ['bert','the proctor valley monster','proctor valley monster','monster','bert the monster','proctorvalleymonster','the monster']
        }
      ],
      suspects: [
        { name: 'Bert', id: 'THE MONSTER', tag: 'The Proctor Valley Monster', guilty: true },
        { name: 'RoboGriffin', id: 'RG', tag: 'Framed with his own feather', guilty: false },
        { name: 'Eagle', id: 'GUEST', tag: 'Found the body', guilty: false },
        { name: 'Golden Eagle', id: 'GUEST', tag: 'Rejected, not a killer', guilty: false },
        { name: 'Tiger', id: 'GUEST', tag: 'Table alibi', guilty: false },
        { name: 'Mountain Lion', id: 'GUEST', tag: 'Table alibi', guilty: false },
        { name: 'Wolf', id: 'GUEST', tag: 'Table alibi', guilty: false },
        { name: 'Beagle', id: 'GUEST', tag: 'Chasing its tail', guilty: false }
      ],
      win: {
        verdict: 'Case closed, it was Bert, the Proctor Valley Monster.',
        blurb: 'Two bodies, one reason: the noise. Husky and Coyote&rsquo;s fight on Proctor Valley Road was the &ldquo;roadwork&rdquo; Bert kept griping about, so once Coyote stormed off, <b>Bert</b> came out and killed Husky to get his quiet back. When the questioning closed in, he waited for the blackout, plucked a <b>metal feather</b> from his best friend <b>RoboGriffin</b> (that&rsquo;s the prick RG felt), killed Coyote in the bathroom, and left the feather to frame the one guest who&rsquo;d just said he&rsquo;d have done it. The claws fit anyone; the feather pointed at RG, but the big, furry, <b>bloody footprint</b> running from the body only ever fit one set of feet. You beat the clock and the cover story. The Board&rsquo;s yours.'
      }
    }
  ]
};
if (typeof module !== 'undefined') { module.exports = ENN_CASES; }
