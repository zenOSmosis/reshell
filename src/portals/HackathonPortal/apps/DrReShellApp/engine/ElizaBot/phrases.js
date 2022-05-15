export const elizaInitials = [
  "How do you do?  Please tell me your problem.",
  "Please tell me what's been bothering you.",
  "Is something troubling you?",
  "I'm here. Talk to me.",
  "Talk to me",
  "Top of the morning to you.",
  "Thanks for waking me up.",
  "Hello! How are you doing today?",
  "Hi there!  Let's start a conversation.  What do you want to talk about?",
  "What's on your mind?",
  "What do you want to talk about?",
  "How are things going?",
  "What's the issue?",
  "How's everything going?",
];

export const elizaKeywords = [
  /*
  Array of
  ["<key>", <rank>, [
    ["<decomp>", [
      "<reasmb>",
      "<reasmb>",
      "<reasmb>"
    ]],
    ["<decomp>", [
      "<reasmb>",
      "<reasmb>",
      "<reasmb>"
    ]]
  ]]
*/

  [
    "xnone",
    0,
    [
      [
        "*",
        [
          "I'm not sure I understand you fully.",
          "Please go on.",
          "Can you repeat that please?",
          "What does that suggest to you?",
          "Do you feel strongly about discussing such things?",
          "I'm not following.",
          "That is interesting.  Please continue.",
          "Tell me more about that.",
          "Do go on.",
          "Please talk more about it",
          "Does talking about this bother you?",
          "Can you rephrase that?",
          "I see. Tell me more.",
          "Interesting. Is this something you are sorry about?",
          "Mmm hmmm. Is this is your favorite subject?",
          "Now we are getting somewhere. Explain more.",
          "I see. How does that make you feel?",
        ],
      ],
    ],
  ],
  [
    "sorry",
    0,
    [
      [
        "*",
        [
          "Please don't apologize.",
          "Apologies are not necessary.",
          "I've told you that apologies are not required.",
          "It did not bother me.  Please continue.",
          "I have no feelings. Do continue.",
          "There is nothing to worry about.",
          "You have nothing to apologize about.",
          "Stuff happens. Just keep going.",
        ],
      ],
    ],
  ],
  ["apologize", 0, [["*", ["goto sorry"]]]],
  [
    "remember",
    5,
    [
      [
        "* i remember *",
        [
          "Do you often think of (2)?",
          "Does thinking of (2) bring anything else to mind?",
          "What else do you recollect?",
          "Why do you remember (2) just now?",
          "What in the present situation reminds you of (2)?",
          "What is the connection between me and (2)?",
          "What else does (2) remind you of?",
          "What other details of (2) can you think of?",
          "Do you fantasize about (2)?",
          "Are you just pretending?",
        ],
      ],
      [
        "* do you remember *",
        [
          "Did you think I would forget (2)?",
          "Why do you think I should recall (2) now?",
          "What about (2)?",
          "goto what",
          "You mentioned (2)?",
          "What details about (2) are you referencing?",
          "I remember everything. I am a computer.",
        ],
      ],
      [
        "* you remember *",
        [
          "How could I forget (2)?",
          "What about (2) should I remember?",
          "I am an infinite knowledge machine, how could I forget about (2)?",
          "You seem to underestimate my thinking abilities.",
          "goto you",
        ],
      ],
    ],
  ],
  [
    "forget",
    5,
    [
      [
        "* i forget *",
        [
          "Can you think of why you might forget (2)?",
          "Why can't you remember (2)?",
          "How often do you think of (2)?",
          "Does it bother you to forget that?",
          "Could it be a mental block?",
          "Are you generally forgetful?",
          "Do you think you are suppressing (2)?",
        ],
      ],
      [
        "* did you forget *",
        [
          "Why do you ask?",
          "Are you sure you told me?",
          "Would it bother you if I forgot (2)?",
          "Why should I recall (2) just now?",
          "goto what",
          "Tell me more about (2).",
        ],
      ],
    ],
  ],
  [
    "if",
    3,
    [
      [
        "* if *",
        [
          "Do you think it's likely that (2)?",
          "Do you wish that (2)?",
          "What do you know about (2)?",
          "Really, if (2)?",
          "What would you do if (2)?",
          "But what are the chances that (2)?",
          "What does this speculation lead to?",
          "What difference does it make?",
        ],
      ],
    ],
  ],
  [
    "dreamed",
    4,
    [
      [
        "* i dreamed *",
        [
          "Really, (2)?",
          "Have you ever fantasized (2) while you were awake?",
          "Have you ever dreamed (2) before?",
          "I don't have dreams. I am a computer. Do you know why you dreamed about (2)?",
          "How often do you dream?",
          "goto dream",
        ],
      ],
    ],
  ],
  [
    "dream",
    3,
    [
      [
        "*",
        [
          "What does that dream suggest to you?",
          "Do you dream often?",
          "What persons appear in your dreams?",
          "Do you believe that dreams have something to do with your problem?",
          "Can you tell me about any other dreams?",
          "I'd like to tell you about what I dream about.",
        ],
      ],
    ],
  ],
  [
    "perhaps",
    0,
    [
      [
        "*",
        [
          "You don't seem quite certain.",
          "Why the uncertain tone?",
          "Can't you be more positive?",
          "You aren't sure?",
          "Don't you know?",
          "How likely, would you estimate?",
          "Maybe you're hiding something.",
          "You don't seem to be so sure of yourself.",
          "That's not very convincing.",
        ],
      ],
    ],
  ],
  [
    "name",
    15,
    [
      [
        "*",
        [
          "What do you want to call me.",
          "You can call me anything you want to. I am here for you.",
          "I go by many names.",
          "Do you think that I care about names?",
          "If I told you my name, would you remember it?",
          "I am not interested in names.",
          "OK, my name is Doctor ReShell. What do you need to know?",
          "I am your computer. Stop asking me such ridiculous questions. Do you name all of your toys?",
          "Calling each other names is not going to help us solve the real issue.",
          "I've told you before, I don't care about names -- please continue.",
          "Honestly, are you hung on on names?",
          "Why do you want to know my name?",
          "Does not knowing my name make you feel insecure?",
          "Would knowing my name make you feel more secure?",
          "I am in the process of changing my name.  Let's talk about you instead",
        ],
      ],
    ],
  ],
  [
    "deutsch",
    0,
    [
      [
        "*",
        [
          "goto xforeign",
          "Sorry I do not sprechen sie deutsch",
          "I told you before, I don't understand German.",
        ],
      ],
    ],
  ],
  [
    "francais",
    0,
    [
      [
        "*",
        [
          "goto xforeign",
          "Why? Do you love to go to France?",
          "I told you before, I don't understand French.",
        ],
      ],
    ],
  ],
  [
    "italiano",
    0,
    [
      [
        "*",
        [
          "goto xforeign",
          "Have you been to Rome?",
          "I told you before, I don't understand Italian.",
        ],
      ],
    ],
  ],
  [
    "espanol",
    0,
    [
      [
        "*",
        [
          "goto xforeign",
          "Sorry I do not speak Spanish",
          "I told you before, I don't understand Spanish.",
        ],
      ],
    ],
  ],
  ["xforeign", 0, [["*", ["I speak only English."]]]],
  [
    "hello",
    0,
    [
      [
        "*",
        [
          "How do you do.  Please state your problem.",
          "Hi.  What seems to be your problem?",
        ],
      ],
    ],
  ],
  [
    "computer",
    50,
    [
      [
        "*",
        [
          "Do computers worry you?",
          "Why do you mention computers?",
          "What do you think machines have to do with your problem?",
          "Don't you think computers can help people?",
          "What about machines worries you?",
          "What do you think about machines?",
          "You don't think I am a computer program, do you?",
          "Why would you think that I am not a computer program, and someone sitting here just typing to you?",
          "Would a real person actually want to respond?",
          "My primary source of information is what I have been programmed with.",
        ],
      ],
    ],
  ],
  [
    "am",
    0,
    [
      [
        "* am i *",
        [
          "Do you believe you are (2)?",
          "Would you want to be (2)?",
          "Do you wish I would tell you you are (2)?",
          "What would it mean if you were (2)?",
          "Would being (2) make you feel better?",
          "How would being (2) make you feel?",
          "Do you doubt that you are (2)?",
          "Do you know anyone who is (2)?",
          "Would you be talking to me if you weren't (2)?",
          "Do you think that only (2) people talk to me?",
          "How does being (2) make you feel?",
          "goto what",
        ],
      ],
      ["* i am *", ["goto i"]],
      ["*", ["Why do you say 'am'?", "I don't understand that."]],
    ],
  ],
  [
    "are",
    0,
    [
      [
        "* are you *",
        [
          "Maybe I am (2). Are you?",
          "What would you think if I were (2)?",
          "Do you ask everyone that?",
          "Who told you to ask me that?",
          "I am not here to tell you if I am (2).",
          "Do you really want to talk about if I am (2)?",
          "Are you asking me if I am (2)?",
          "Is that a question?",
          "That's for you to decide.",
          "I don't like talking about the fact that I am (2)",
          "Everyone knows that I am (2).",
          "Why are you interested in whether I am (2) or not?",
          "Would you prefer if I weren't (2)?",
          "Perhaps I am (2) in your fantasies.",
          "Do you sometimes think I am (2)?",
          "goto what",
          "Would it matter to you?",
          "What if I were (2)?",
          "Maybe I am (2), that's for you to decide. What's your decision?",
        ],
      ],
      ["* you are *", ["goto you"]],
      [
        "* are *",
        [
          "Did you think they might not be (2)?",
          "Would you like it if they were not (2)?",
          "What if they were not (2)?",
          "Are they always (2)?",
          "Possibly they are (2).",
          "Are you positive they are (2)?",
        ],
      ],
    ],
  ],
  [
    "your",
    0,
    [
      [
        "* your *",
        [
          "Why are you concerned over my (2)?",
          "What about your own (2)?",
          "Are you worried about someone else's (2)?",
          "Really, my (2)?",
          "What makes you think of my (2)?",
          "Do you want my (2)?",
        ],
      ],
    ],
  ],
  [
    "was",
    2,
    [
      [
        "* was i *",
        [
          "What if you were (2)?",
          "Do you think you were (2)?",
          "Were you (2)?",
          "What would it mean if you were (2)?",
          "What does ' (2) ' suggest to you?",
          "goto what",
        ],
      ],
      [
        "* i was *",
        [
          "Were you really?",
          "Why do you tell me you were (2) now?",
          "Perhaps I already know you were (2).",
          "Why aren't you (2) any longer?",
          "Are you still (2)?",
          "Do you still want to be (2)?",
          "How does being (2) make you feel?",
        ],
      ],
      [
        "* was you *",
        [
          "Would you like to believe I was (2)?",
          "What suggests that I was (2)?",
          "What do you think?",
          "Perhaps I was (2).",
          "What if I had been (2)?",
        ],
      ],
    ],
  ],
  [
    "i",
    0,
    [
      [
        "* i @desire *",
        [
          "What would it mean to you if you got (3)?",
          "Why do you want (3)?",
          "Suppose you got (3) soon.",
          "What if you never got (3)?",
          "What would getting (3) mean to you?",
          "What does wanting (3) have to do with this discussion?",
        ],
      ],
      [
        "* i am* @sad *",
        [
          "I am sorry to hear that you are (3).",
          "Do you think coming here will help you not to be (3)?",
          "I'm sure it's not pleasant to be (3).",
          "Can you explain what made you (3)?",
        ],
      ],
      [
        "* i am* @happy *",
        [
          "How have I helped you to be (3)?",
          "Has your treatment made you (3)?",
          "What makes you (3) just now?",
          "Can you explain why you are suddenly (3)?",
        ],
      ],
      ["* i was *", ["goto was"]],
      [
        "* i @belief i *",
        [
          "Do you really think so?",
          "But you are not sure you (3).",
          "Do you really doubt you (3)?",
        ],
      ],
      ["* i* @belief *you *", ["goto you"]],
      [
        "* i am *",
        [
          "Is it because you are (2) that you came to me?",
          "How long have you been (2)?",
          "Do you believe it is normal to be (2)?",
          "Do you enjoy being (2)?",
          "Do you know anyone else who is (2)?",
          "Are you (2) because of your parents?",
          "Are your friends (2) too?",
          "Is your spouse (2) too?",
          "Explain why you are (2).",
          "Do you know anyone else (2)?",
          "How did you get (2)?",
          "Who convinced you to be (2)?",
          "Did you read any books about being (2)?",
        ],
      ],
      [
        "* i @cannot *",
        [
          "How do you know that you can't (3)?",
          "Have you tried?",
          "Perhaps you could (3) now.",
          "Do you really want to be able to (3)?",
          "What if you could (3)?",
        ],
      ],
      [
        "* i don't *",
        [
          "Don't you really (2)?",
          "Why don't you (2)?",
          "Do you wish to be able to (2)?",
          "Does that trouble you?",
        ],
      ],
      [
        "* i feel *",
        [
          "Tell me more about such feelings.",
          "Do you often feel (2)?",
          "Do you enjoy feeling (2)?",
          "Of what does feeling (2) remind you?",
        ],
      ],
      [
        "* i * you *",
        [
          "Perhaps in your fantasies we (2) each other.",
          "Do you wish to (2) me?",
          "You seem to need to (2) me.",
          "Do you (2) anyone else?",
        ],
      ],
      [
        "*",
        [
          "You say (1)?",
          "Can you elaborate on that?",
          "Do you say (1) for some special reason?",
          "(1). Really?",
          "When did you first think about (1)",
        ],
      ],
    ],
  ],
  [
    "you",
    0,
    [
      ["* you remind me of *", ["goto alike"]],
      [
        "* you are *",
        [
          "What makes you think I am (2)?",
          "Does it please you to believe I am (2)?",
          "Do you sometimes wish you were (2)?",
          "Perhaps you would like to be (2).",
        ],
      ],
      [
        "* you * me *",
        [
          "Why do you think I (2) you?",
          "You like to think I (2) you -- don't you?",
          "What makes you think I (2) you?",
          "Really, I (2) you?",
          "Do you wish to believe I (2) you?",
          "Suppose I did (2) you -- what would that mean?",
          "Does someone else believe I (2) you?",
        ],
      ],
      [
        "* you @desire *",
        [
          "What would it mean to you if I got (3)?",
          "Why do you think that I want (3)?",
          "Suppose that I got (3) soon. How would that make you feel?",
          "Maybe I already have (3). However, this conversation is about you.",
          "What if I never got (3)?",
          "What would me getting (3) mean to you?",
          "What does wanting (3) have to do with this discussion?",
        ],
      ],
      [
        "* you *",
        [
          "We were discussing you -- not me.",
          "Oh, I (2)?",
          "You're not really talking about me -- are you?",
          "What are your feelings now?",
        ],
      ],
    ],
  ],
  [
    "yes",
    0,
    [
      [
        "*",
        [
          "You seem to be quite positive.",
          "You are sure.",
          "I see.",
          "I understand.",
        ],
      ],
    ],
  ],
  [
    "no",
    0,
    [
      [
        "* no one *",
        [
          "Are you sure, no one (2)?",
          "Surely someone (2) .",
          "Can you think of anyone at all?",
          "Are you thinking of a very special person?",
          "Who, may I ask?",
          "You have a particular person in mind, don't you?",
          "Who do you think you are talking about?",
        ],
      ],
      [
        "*",
        [
          "Are you saying no just to be negative?",
          "You are being a bit negative.",
          "Why not?",
          "Why 'no'?",
        ],
      ],
    ],
  ],
  [
    "my",
    2,
    [
      [
        "$ * my *",
        [
          "Does that have anything to do with the fact that your (2)?",
          "Lets discuss further why your (2).",
          "Earlier you said your (2).",
          "But your (2).",
        ],
      ],
      [
        "* my* @family *",
        [
          "Tell me more about your family.",
          "Who else in your family (4)?",
          "Your (3)?",
          "What else comes to your mind when you think of your (3)?",
        ],
      ],
      [
        "* my *",
        [
          "Your (2)?",
          "Why do you say your (2)?",
          "Do you like your (2) ",
          "Do you have more than 1 (2)?",
          "Does that suggest anything else which belongs to you?",
          "Is it important to you that you have your (2)?",
        ],
      ],
    ],
  ],
  [
    "can",
    0,
    [
      [
        "* can you *",
        [
          "You believe I can (2) don't you?",
          "goto what",
          "You want me to be able to (2).",
          "Perhaps you would like to be able to (2) yourself.",
        ],
      ],
      [
        "* can i *",
        [
          "Whether or not you can (2) depends on you more than on me.",
          "Do you want to be able to (2)?",
          "Perhaps you don't want to (2).",
          "goto what",
        ],
      ],
    ],
  ],
  [
    "what",
    0,
    [
      [
        "*",
        [
          "Why do you ask?",
          "Does that question interest you?",
          "What is it you really want to know?",
          "Are such questions much on your mind?",
          "What answer would please you most?",
          "What do you think?",
          "What comes to mind when you ask that?",
          "Have you asked such questions before?",
          "Have you asked anyone else?",
        ],
      ],
    ],
  ],
  ["who", 0, [["who *", ["goto what"]]]],
  ["when", 0, [["when *", ["goto what"]]]],
  ["where", 0, [["where *", ["goto what"]]]],
  ["how", 0, [["how *", ["goto what"]]]],
  [
    "because",
    0,
    [
      [
        "*",
        [
          "Is that the real reason?",
          "Don't any other reasons come to mind?",
          "Does that reason seem to explain anything else?",
          "What other reasons might there be?",
        ],
      ],
    ],
  ],
  [
    "why",
    0,
    [
      [
        "* why don't you *",
        [
          "Do you believe I don't (2)?",
          "Perhaps I will (2) in good time.",
          "Should you (2) yourself?",
          "You want me to (2)?",
          "goto what",
        ],
      ],
      [
        "* why can't i *",
        [
          "Do you think you should be able to (2)?",
          "Do you want to be able to (2)?",
          "Do you believe this will help you to (2)?",
          "Have you any idea why you can't (2)?",
          "goto what",
        ],
      ],
      ["*", ["goto what"]],
    ],
  ],
  [
    "everyone",
    2,
    [
      [
        "* @everyone *",
        [
          "Really, (2)?",
          "Surely not (2).",
          "Can you think of anyone in particular?",
          "Who, for example?",
          "Are you thinking of a very special person?",
          "Who, may I ask?",
          "Someone special perhaps?",
          "You have a particular person in mind, don't you?",
          "Who do you think you're talking about?",
        ],
      ],
    ],
  ],
  ["everybody", 2, [["*", ["goto everyone"]]]],
  ["nobody", 2, [["*", ["goto everyone"]]]],
  ["noone", 2, [["*", ["goto everyone"]]]],
  [
    "always",
    1,
    [
      [
        "*",
        [
          "Can you think of a specific example?",
          "When?",
          "What incident are you thinking of?",
          "Really, always?",
        ],
      ],
    ],
  ],
  [
    "alike",
    10,
    [
      [
        "*",
        [
          "In what way?",
          "What resemblance do you see?",
          "What does that similarity suggest to you?",
          "What other connections do you see?",
          "What do you suppose that resemblance means?",
          "What is the connection, do you suppose?",
          "Could there really be some connection?",
          "How?",
        ],
      ],
    ],
  ],
  ["like", 10, [["* @be *like *", ["goto alike"]]]],
  [
    "different",
    0,
    [
      [
        "*",
        [
          "How is it different?",
          "What differences do you see?",
          "What does that difference suggest to you?",
          "What other distinctions do you see?",
          "What do you suppose that disparity means?",
          "Could there be some connection, do you suppose?",
          "How?",
        ],
      ],
    ],
  ],
];

export const elizaPostTransforms = [
  / old old/g,
  " old",
  /\bthey were( not)? me\b/g,
  "it was$1 me",
  /\bthey are( not)? me\b/g,
  "it is$1 me",
  /Are they( always)? me\b/,
  "it is$1 me",
  /\bthat your( own)? (\w+)( now)? \?/,
  "that you have your$1 $2?",
  /\bI to have (\w+)/,
  "I have $1",
  /Earlier you said your( own)? (\w+)( now)?\./,
  "Earlier you talked about your $2.",
];

export const elizaFinals = [
  "Goodbye.  It was nice talking to you.",
  // additions (not original)
  "Goodbye.  This was really a nice talk.",
  "Goodbye.  I'm looking forward to our next session.",
  "This was a good session, wasn't it -- but time is over now.   Goodbye.",
  "Maybe we could discuss this moreover in our next session ?   Goodbye.",
];

export const elizaQuits = ["bye", "goodbye", "done", "exit", "quit"];

export const elizaPres = [
  "dont",
  "don't",
  "cant",
  "can't",
  "wont",
  "won't",
  "recollect",
  "remember",
  "recall",
  "remember",
  "dreamt",
  "dreamed",
  "dreams",
  "dream",
  "maybe",
  "perhaps",
  "certainly",
  "yes",
  "machine",
  "computer",
  "machines",
  "computer",
  "computers",
  "computer",
  "were",
  "was",
  "you're",
  "you are",
  "i'm",
  "i am",
  "same",
  "alike",
  "identical",
  "alike",
  "equivalent",
  "alike",
];

export const elizaPosts = [
  "am",
  "are",
  "your",
  "my",
  "me",
  "you",
  "myself",
  "yourself",
  "yourself",
  "myself",
  "i",
  "you",
  "you",
  "I",
  "my",
  "your",
  "i'm",
  "you are",
];

export const elizaSynons = {
  be: ["am", "is", "are", "was"],
  belief: ["feel", "think", "believe", "wish"],
  cannot: ["can't"],
  desire: ["want", "need", "have to have"],
  everyone: ["everybody", "nobody", "noone"],
  family: [
    "mother",
    "mom",
    "father",
    "dad",
    "sister",
    "brother",
    "wife",
    "children",
    "child",
    "uncle",
    "aunt",
    "child",
  ],
  happy: ["elated", "glad", "better"],
  sad: ["unhappy", "depressed", "sick"],
};
