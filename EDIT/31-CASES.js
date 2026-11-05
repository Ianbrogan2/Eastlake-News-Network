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
      status: 'published',
      isDefault: false,
      title: 'Murder on Proctor Valley Road',
      subtitle: 'Murder Mystery &middot; Two Dead, One Dinner Party',
      kick: 'The Eastlake Edge',
      tagline: 'Somebody killed two guests the night of the dinner party, and the only witness is a road with an eighty-year-old ghost story. You get the case file, the floor plan, and three pieces of evidence. Beat the clock and name the killer.',
      caseNumber: 'EHS-1105',
      adminPass: 'edge-admin',
      updatedAt: '2026-11-05',
      intro: {
        caseTag: 'Case #EHS-1105, Murder on Proctor Valley Road',
        headline: 'Two dead on the valley road. Nine at the table. Name the one who did it.',
        body: [
          'For eighty years people on Proctor Valley Road have sworn there is a monster out there. Big thing, covered in fur, leaves footprints the size of dinner plates with the fur still printed into the dirt. The valley keeps a plaster cast of one in a glass case like a trophy. Most nights it is just a story you tell to scare freshmen. Tonight it stopped being a story. Husky was found dead on <b>that road</b>, torn up by claws, the same night the whole crew came over for dinner. Everybody blamed <b>Coyote</b> right away. Coyotes and dogs never got along, and Coyote was the last one seen with Husky before he died. Then the lights cut out in the middle of dinner. When they came back on, Coyote was dead on the bathroom floor with a <b>feather</b> lying on him, and the easy answer was gone.',
          'You are holding the case file now, the same one you scanned this off of. Inside is the floor plan, a statement from every guest, and three pieces of evidence. Take the <b>three clues</b> in order. Each one knocks a name off the list. Get through all three and the last clue leaves you looking right at the killer, as long as you are quick enough to beat the clock.'
        ],
        note: 'The clock started the second you scanned. Open the file and start cutting names.'
      },
      questions: [
        {
          tag: 'EVIDENCE 1 &middot; THE CLAWS',
          level: 'Easy',
          prompt: 'Clue #1 is a close-up of the marks on Husky, deep clean slashes from a set of claws. Do not worry about motive yet. Go down the list of all nine guests and look at their <i>feet</i>. Eight of them have claws or talons that could rip a mark like that. One does not. Soft paws, nothing sharp, and it spent the whole night running in circles after its own tail. That is the one you cross off.',
          hint: 'Look at anatomy, not alibi. Which guest physically could not have left a sharp slash?',
          hint2: 'Floppy ears, no real claws, and its whole statement is basically &ldquo;idk, I was chasing my tail.&rdquo;',
          skip: 'Claw marks need claws, and one guest does not have any. That is <b>Beagle</b>, who was busy chasing its tail all night. Eight left.',
          right: 'Right. A beagle&rsquo;s paws cannot cut like that. <b>Beagle</b> is out. Eight to go, and every one of them is armed.',
          wrong: 'Think about the <i>feet</i>, not the story. Who physically could not leave a sharp claw slash?',
          answers: ['beagle','the beagle','beagal','beagel']
        },
        {
          tag: 'EVIDENCE 2 &middot; THE BLACKOUT',
          level: 'Warmer',
          prompt: 'The lights cut out and the whole room panics. When they come back, the guest everybody at the table had already decided was guilty is dead on the bathroom floor. He had the obvious motive, coyotes and dogs do not mix, and he was the last one seen with Husky. His own murder is what clears him, because a dead man did not pull this off. Who went from prime suspect to second body?',
          hint: 'Everybody was sure he did it, right up until he could not have.',
          hint2: 'His chair is the one pushed back and left empty on the floor plan.',
          skip: 'The guest everybody blamed, <b>Coyote</b>, is the one found dead in the bathroom. Answer: <b>Coyote</b>.',
          right: 'Coyote. The easy answer is lying on the bathroom floor now. Two bodies, and somebody wanted him quiet before he said too much.',
          wrong: 'No. The second body is the one everybody had already blamed, the one who left Husky out on the road.',
          answers: ['coyote','the coyote','coyete','cayote','kyote']
        },
        {
          tag: 'EVIDENCE 3 &middot; THE DIFFERENCE',
          level: 'Tricky',
          prompt: 'Both bodies have the <i>same</i> claw marks, so the claws do not tell you anything new. But there is one thing on the second body that was never on the first. Three guests sat packed together at the table through the entire blackout, so they clear themselves right here. Put the two crime scenes side by side and name the one piece of evidence that is on Coyote but was never on Husky.',
          hint: 'Compare Husky&rsquo;s scene to Coyote&rsquo;s. What shows up in one and not the other?',
          hint2: 'It is not a claw mark, and a clawed animal would not drop it. Birds have them.',
          skip: 'The new thing on Coyote, and not on Husky, is a single <b>feather</b>. Tiger, Mountain Lion and Wolf were alibiing each other at the table, so they are out. Answer: <b>feather</b>.',
          right: 'A feather, and only on the second body. The three at the table (Tiger, Mountain Lion, Wolf) back each other up, so cross them off. Four left: Bert, RoboGriffin, Eagle and Golden Eagle.',
          wrong: 'The claw marks are on <i>both</i> of them. I want the thing that is only on the second body. Compare the two scenes.',
          answers: ['feather','a feather','feathers','thefeather','bird feather']
        },
        {
          tag: 'EVIDENCE 4 &middot; THE FRAME',
          level: 'Hard',
          prompt: 'Hold the feather under a flashlight and it is not soft at all. It is metal. Rivets, panel seams, a couple of snapped wires where it got torn loose. That rules out the guests with real feathers. It points straight at the one guest built out of metal, which is a little too convenient, since he had just finished telling the whole room he would have killed Coyote himself. Before you work out who planted it, name the guest this feather is trying to pin it on.',
          hint: 'Two of your four are real birds with real feathers, so they clear. Who is actually made of metal?',
          hint2: 'Metal feathers, metal talons, Bert&rsquo;s best friend, and a motive he announced out loud. Almost too easy.',
          skip: 'A metal feather points right at the one metal guest, <b>RoboGriffin</b>. Eagle and Golden Eagle have real feathers, so they clear. Just keep in mind how clean this all looks. Answer: <b>RoboGriffin</b>.',
          right: 'RoboGriffin, who even said out loud he would have done it. It looks airtight, and that is the problem. Somebody wants you to stop reading right here. Two left.',
          wrong: 'Not a real bird. A <i>metal</i> feather only comes off the one guest made of metal.',
          answers: ['robogriffin','rg','robo griffin','griffin','robogriffins','robo griffins','griffins','camarena','robogryphon','robogriffon','robo griffon']
        },
        {
          tag: 'EVIDENCE 5 &middot; THE FOOTPRINT',
          level: 'Hard',
          prompt: 'Now that old legend finally matters. For eighty years people have blamed the Proctor Valley Monster for one thing more than anything else, the giant footprints with the fur printed around the edges, the same ones the valley keeps a plaster cast of. Clue #3 is a photo of exactly that. Huge furry tracks, nothing like a thin metal talon. So the metal feather was planted. Name the one thing the real killer left behind at the scene, the mark the legend is known for and nobody could fake.',
          hint: 'What is the Proctor Valley Monster <i>famous</i> for leaving behind? Clue #3 is a picture of it.',
          hint2: 'Huge, furry, on the floor, headed away from the body. One word for the mark a foot leaves.',
          skip: 'The legend&rsquo;s calling card, and Clue #3, is a giant <b>footprint</b>. RoboGriffin walks on thin metal talons, so the prints clear him and prove the feather was a setup. Answer: <b>footprint</b>.',
          right: 'The footprint. The exact mark that monster has left on this road for eighty years, and nothing a metal talon could ever make. RoboGriffin is cleared. Only one guest has feet like that.',
          wrong: 'Think about what the Proctor Valley Monster is known for leaving behind, then look at Clue #3. One word.',
          answers: ['footprint','footprints','a footprint','the footprint','foot print','paw print','pawprint','paw prints','pawprints','prints','print','tracks','track','paw','paws']
        },
        {
          tag: 'EVIDENCE 6 &middot; THE MONSTER',
          level: 'Hard',
          prompt: 'Only one set of feet in that house leaves a huge, furry, clawed paw print, and it matches every story ever told about the thing that haunts this road. He sat at the dinner table calling the fight outside his window &ldquo;roadwork&rdquo; while Husky and Coyote screamed at each other out there. The footprint belongs to the legend, and the legend was eating dinner with everybody. Name the Proctor Valley Monster.',
          hint: 'Big, furry, clawed, no feathers, always carrying a book, best friends with the guy he framed. The &ldquo;roadwork&rdquo; was the fight.',
          hint2: 'He <i>is</i> the Proctor Valley Monster. First name does it.',
          skip: 'It was <b>Bert</b>, the Proctor Valley Monster, the only furry clawed guest with no feathers and the only feet that fit the print. Answer: <b>Bert</b>.',
          right: 'Bert. The Proctor Valley Monster, sitting at the table the entire time. Case closed. Sign the file.',
          wrong: 'Not him. The killer is the furry, clawed, featherless one who called the fight &ldquo;roadwork.&rdquo; Name the monster.',
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
        verdict: 'Case closed. It was Bert, the Proctor Valley Monster.',
        blurb: 'Two bodies, and the reason was the noise. Husky and Coyote&rsquo;s fight out on Proctor Valley Road was the &ldquo;roadwork&rdquo; <b>Bert</b> kept complaining about all night. Once Coyote stormed off, Bert went outside and killed Husky to get his quiet back. Then the questions started closing in, so he waited for the blackout, pulled a <b>metal feather</b> off his best friend <b>RoboGriffin</b> (that is the prick RG felt in the dark), killed Coyote in the bathroom, and dropped the feather to frame the one guest who had just said he would do it. The claws matched everybody. The feather pointed at RG. But the big furry <b>bloody footprint</b> running away from the body only ever fit one set of feet. You beat the clock and you beat the cover story. The Board is yours.'
      }
    }
  ]
};
if (typeof module !== 'undefined') { module.exports = ENN_CASES; }
