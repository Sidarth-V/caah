const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// Listener at http port 3000 for console response
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

// Routing to the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom elements
let numUsers = 0;
var userList = [];

// main io connection listener 
io.on('connection', (socket) => {
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    // to add username to the list of users
    userList.push(username);
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

setInterval(function(){
   var words = [ "A romantic candlelit dinner would be incomplete without  _______________ .", "After blacking out during New Year's Eve, I was awoken by  _______________ .", "After months of debate, the Occupy Wall Street General Assembly could only agree on More  _______________ !" , "After the earthquake, Sean Penn bought to the people of Haiti." , "Alternative medicine is now embracing the curative powers of  _______________ .", "And I would have gotten away with it, too, if it hadn't been for  _______________ .", "Anthropologists have recently discovered a primitive tribe that worships  _______________ .", "Before I run for president, I must destroy all evidence of my involvement with  _______________ .", "BILLY MAYS HERE FOR  _______________ .", "But before I kill you, Mr. Bond, I must show you  _______________ .", "Charades was ruined for me forever when my mom had to act out  _______________ .", "Coming to Broadway this season,  _______________ : The Musical.", "Dear Abby, I'm having some trouble with  and would like your advice." , "During his midlife crisis, my dad got really into  _______________ .", "During Picasso's often _______________ overlooked Brown Period, he produced hundreds of paintings of  _______________ .", "During sex, I like to think about  _______________ .", "Every Christmas my uncle gets drunk and tells the story about  _______________ .", "Everyone down on the ground! We don't want to hurt anyone. We're just here for  _______________ .", "He who controls  controls the world." , "How am I maintaining my relationship status.", "I do not know with what weapons World War III will be fought, but World War IV will be fought with.", "I drink to forget  _______________ .", "I got 99 problems but  ain't one." , "I learned the hard way that you can't cheer up a grieving friend with  _______________ .", "I'm sorry professor, but I couldn't complete my homework because of  _______________ .", "In 1,000 years when paper money is but a distant memory,  _______________  will be our currency.", "In an attempt to reach a wider audience, the Smithsonian Museum of Natural History has opened an interactive exhibit on  _______________ .", "In his new self _______________ produced album, Kanye West raps over the sounds of  _______________ .", "In his newest and most difficult stunt, David Blaine must escape from  _______________ .", "In its new tourism campaign, Detroit proclaims that it has finally eliminated  _______________ .", "In L.A. county Jail, word is you can trade 200 cigarettes for  _______________ .", "In Michael Jackson's final moments, he thought about  _______________ .", "In Rome, there are whisperings that the Vatican has a secret room devoted to  _______________ .", "In the distant future, historians will agree that  marked the beginning of America's decline." , "In the new Disney Channel Original Movie, Hannah Montana struggles with  for the first time." , "Instead of coal, Santa now gives the bad children  _______________  .", "It's a pity that kids these days are all getting involved with  _______________ .", "Jesus is  _______________ .", "Life for American Indians was forever changed when the White Man introduced them to  _______________ .", "Little Miss Muffet, Sat on a tuffet, Eating her curds and  _______________ .", "Major League Baseball has banned  for giving players an unfair advantage." , "Maybe she's born with it. Maybe it's  _______________ .", "Members of New York's social elite are paying thousands of dollars just to experience  _______________ .", "MTV's new reality show features eight washed _______________ up celebrities living with  _______________ .", "My country, 'tis of thee, sweet land of  _______________ .", "My mom freaked out when she looked at my browser history and found  _______________ .com/ _______________ .", "My new favorite porn star is Joey  _______________  McGee." , "Next from J.K. Rowling: Harry Potter and the Chamber of  _______________ .", "Next on ESPN2: The World Series of  _______________ .", "Next time on Dr. Phil: How to talk to your child about  _______________ .", "On the third day of Christmas, my true love game to me: three French hens, two turtle doves, and  _______________ .", "Only two things in life are certain: death and  _______________ .", "Science will never explain the origin of  _______________ .", "Studies show that lab rats navigate mazes 50% faster after being exposed to  _______________", "The CIA now interrogates enemy agents by repeatedly subjecting them to  _______________ .", "The class field trip was completely ruined by  _______________ .", "The Five Stages of Grief: denial, anger, bargaining,  _______________  acceptance.", "The healing process began when I joined a support group for victims of  _______________ .", "The socialist governments of Scandanavia have declared that access to  is a basic human right." , "The votes are in, and the new high school mascot is  _______________ .", "This holiday season, Tim Allen must overcome his fear of  to save Christmas." , "This is the way the world ends This is the way the world ends Not with a bang but with  _______________ .", "This is your captain speaking. Fasten your seatbelts and prepare for  _______________ .", "This month's Cosmo: Spice up your sex life by bringing  into the bedroom." , "This reason on Man vs. Wild, Bear Grylls must survive in the depths of the Amazon with only  and his wits." , "Tonight on 20/20: What you don't know about  could kill you." , "TSA guidelines now prohibit  on airplanes." , "Wake up, America. Christmas is under attack by secular liberals and their  _______________ .", "War! What is it good for?", "What am I giving up for Lent?", "What are my parents hiding from me?", "What brought the orgy to a grinding halt?", "What did I bring back from Mexico?", "What did the US airdrop to the children of Afghanistan?", "What did Vin Diesel eat for dinner?", "What do old people smell like?", "What does Dick Cheney prefer?", "What don't you want to find in your Chinese food?", "What ended my last relationship?", "What gets better with age?", "What gives me uncontrollable gas?", "What has been making life difficult at the nudist colony?", "What helps Obama unwind?", "What is Batman's guilty pleasure?", "What keeps me warm during the cold, cold winter?", "What never fails to liven up the party?", "What people like  _______________ .", "What will always get you laid?", "What will I bring back in time to convince people that I am a powerful wizard?", "What would grandma find disturbing, yet oddly charming?", "What's a girl's best friend?", "What's my anti _______________ drug?", "What's my secret power?", "What's Teach for America using to inspire inner city students to succeed?", "What's that smell?", "What's that sound?", "What's the crustiest?", "What's the gift that keeps on giving?", "What's the most emo?", "What's the new fad diet?", "What's the next Happy Meal toy?", "What's there a ton of in heaven?", "When all else fails, I can always masturbate to  _______________ .", "When I am a billionaire, I shall erect a 50 _______________ foot statue to commemorate  _______________ .", "When I am President of the United States, I will create the Department of  _______________ .", "When I pooped, what came out of my butt?", "When Pharaoh remained unmoved, Moses called down a Plague of  _______________ .", "When the United States raced the Soviet Union to the moon, the Mexican government funneled millions of pesos into research on  _______________ .", "Why am I sticky?", "Why can't I sleep at night?", "Why do I hurt all over?", "In the seventh circle of Hell, sinners must endure _______________  for all eternity.", "A successful job interview begins with a firm handshake and ends with _______________ .", "Lovin you is easy cause youre _______________ ." , "My life is ruled by a vicious cycle of _______________  and _______________ .", "The blind date was going horribly until we discovered our shared interest in _______________ .", " _______________  . Awesome in theory, kind of a mess in practice.", "Im not like the rest of you. Im too rich and busy for _______________ ." , "What left this stain on my couch?", "Call the law offices of Goldstein & Goldstein, because no one should have to tolerate _______________  in the workplace.", "Turns out that  Man was neither the hero we needed nor wanted." , "As part of his daily regimen, Anderson Cooper sets aside 15 minutes for _______________ .", "Money cant buy me love, but it can buy me _______________ ." , "And what did you bring for show and tell?", "During high school I never really fit in until I found _______________  club.", "Hey baby, come back to my place and Ill show you _______________ ." , "To prepare for his upcoming role, Daniel Day_______________Lewis immersed himself in the world of _______________ .", "Finally! A service that delivers _______________  right to your door.", "My gym teacher got fired for adding _______________  to the obstacle course.",  "As part of his contract, Prince wont perform without _______________  in his dressing room." ] ; 
  var randomNumber = Math.round( Math.random() * (words.length-1) ); 
  var randomNumber1 = Math.round( Math.random() * (userList.length-1) ); 
  var message = words[randomNumber]
  var judge = userList[randomNumber1]
    io.sockets.emit('channel_3', message);
    io.sockets.emit('channel_4', judge);
}, 10000);




