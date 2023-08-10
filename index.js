//Webex Bot Starter - featuring the webex-node-bot-framework - https://www.npmjs.com/package/webex-node-bot-framework
require("dotenv").config();
var framework = require("webex-node-bot-framework");
var webhook = require("webex-node-bot-framework/webhook");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fetch = require('node-fetch');
var curDate = require('./jScripts/currentDateTime');
var form = require('./cards/reportform');
var { MongoClient } = require('mongodb')
const { parse } = require("dotenv");
app.use(bodyParser.json());
app.use(express.static("images"));
const config = {
  webhookUrl: process.env.WEBHOOKURL,
  token: process.env.BOTTOKEN,
  port: process.env.PORT,
};



// init framework
var framework = new framework(config);
framework.start();
console.log("Starting framework");

framework.on("initialized", () => {
  console.log("framework is running [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
// If actorId is set, it means that user has just added your bot to a new space
// If not, the framework has discovered your bot in an existing space
framework.on("spawn", (bot, id, actorId,) => {
  if (!actorId) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    console.log(
      `Bot found in room(s): ${bot.room.title}`
    );
  } else {
    // When actorId is present it means someone added your bot got added to a new space
    // Lets find out more about them..
    var msg =
      "You can say `help` to get the list of words I am able to respond to.";
    bot.webex.people
      .get(actorId)
      .then((user) => {
        msg = `Hello there ${user.displayName}. ${msg}`;
      })
      .catch((e) => {
        console.error(
          `Failed to lookup user details in framwork.on("spawn"): ${e.message}`
        );
        msg = `Hello there. ${msg}`;
      })
      .finally(() => {
        // Say hello, and tell users what you do!
        if (bot.isDirect) {
          bot.say("markdown", msg);
        } else {
          let botName = bot.person.displayName;
          msg += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@mention* ${botName}.`;
          bot.say("markdown", msg);
        }
      });
  }
});

// Implementing a framework.on('log') handler allows you to capture
// events emitted from the framework.  Its a handy way to better understand
// what the framework is doing when first getting started, and a great
// way to troubleshoot issues.
// You may wish to disable this for production apps
framework.on("log", (msg) => {
  console.log(msg);
});

// Process incoming messages
// Each hears() call includes the phrase to match, and the function to call if webex mesages
// to the bot match that phrase.
// An optional 3rd parameter can be a help string used by the frameworks.showHelp message.
// An optional fourth (or 3rd param if no help message is supplied) is an integer that
// specifies priority.   If multiple handlers match they will all be called unless the priority
// was specified, in which case, only the handler(s) with the lowest priority will be called

/* On mention with card example
ex User enters @botname 'report' phrase, the bot will produce a personalized card
*/
framework.hears(
  "report",
  async(bot, trigger) => {
    const uri = "mongodb://localhost:27017";
    let email = trigger.person.emails;
    let parsedemail = email.toString().replace(/@/g, ' ');
    let result = parsedemail.endsWith('RADNET.COM' || 'radnet.com' || 'RADNET.com');
    if(result == true) {
      console.log('sending ' + trigger.person.displayName + ' a form');
    bot.sendCard(
      form.reportform,
      "Looks like your device wasn't able to render this card. Please try again on another device or update webex."
    );
    }
    else{
      bot.say("I'm sorry, you must be using a radnet issued webex account to use this bot.")
      console.log("Unauthorized attempt to use this bot by " + trigger.person.displayName + ", " + trigger.person.emails);
      const client = new MongoClient(uri);
      try {
        const database = client.db("<db_name_here>");
        const coll = database.collection("<collection_name_here>");
        // create a document to insert
        const doc = {
          user: trigger.person.displayName,
          email: trigger.person.emails.toString(),
          attempted_command: trigger.text,
          date: curDate(),
      }
      const result = await coll.insertOne(doc);
        }
        finally {
          await client.close();
        }
      
    }
    
  },
  "**report**: (Sends the report form to report issues)",
  0
);

// auth testing
framework.hears(
  "auth",
  async(bot, trigger) => {
    const uri = "mongodb://localhost:27017";
    let email = trigger.person.emails;
    let parsedemail = email.toString().replace(/@/g, ' ');
    let result = parsedemail.endsWith('RADNET.COM' || 'radnet.com' || 'RADNET.com');
    if(result == true) {
      bot.say("You are authorized to use this bot!")
    }
    else{
      bot.say("I'm sorry, you must be using a radnet issued webex account to use this bot.")
      console.log("Unauthorized attempt to use this bot by " + trigger.person.displayName + ", " + trigger.person.emails);
      const client = new MongoClient(uri);
      try {
        const database = client.db("<db_name_here>");
        const coll = database.collection("<collection_name_here>");
        // create a document to insert
        const doc = {
          user: trigger.person.displayName,
          email: trigger.person.emails.toString(),
          attempted_command: trigger.text,
          date: curDate(),
      }
      const result = await coll.insertOne(doc);
        }
        finally {
          await client.close();
        }
    }

  },
  "**auth**: (Validates whether or not the user has permission to use this bot.)",
  0
);

// Handle card submission
framework.on('attachmentAction',
  async(bot, trigger) => {
    let attachmentAction = trigger.attachmentAction
    const outp = `${JSON.stringify(attachmentAction, null, 2)}`;
    var params = JSON.parse(outp);
  let inputs = trigger.attachmentAction.inputs;
  let dir = inputs.dir;
  let agentnum = inputs.agentnum;
  let agentemail = inputs.agentemail;
  let date = inputs.date;
  let patnumber = inputs.patnumber;
  let symptoms = inputs.symptoms;
  let time = inputs.time

const body = {
  text: "Submitted by: " + trigger.person.displayName + " \n" + "Inbound/ Outbound: " + dir + " \n" + "End User #: " + patnumber + " \n" + "Date: " + date + " \n" + "Time: " + time + " \n" + "Agent Phone #: " + agentnum + " \n" + "Agent Email: " + agentemail + " \n" + "Symptoms: " + "\n\n" + symptoms
}

  const response = await fetch('<Webhook_URL_here>', {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body: JSON.stringify(body)
  })
  .then(res => res.json()) // no error is thrown
   .then(() => console.log("Success")) // 
   .catch(() => console.log("Form submitted by " + trigger.person.displayName)) // fails to catch error
  
});

/* On mention with command
ex User enters @botname help, the bot will write back in markdown
 *
 * The framework.showHelp method will use the help phrases supplied with the previous
 * framework.hears() commands
*/
framework.hears(
  /help|what can i (do|say)|what (can|do) you do/i,
  async(bot, trigger) => {
    const uri = "mongodb://localhost:27017";
    let email = trigger.person.emails;
    let parsedemail = email.toString().replace(/@/g, ' ');
    let result = parsedemail.endsWith('RADNET.COM' || 'radnet.com' || 'RADNET.com');
    if(result == true) {
      bot
      .say(`Hello ${trigger.person.displayName}.`)
      //    .then(() => sendHelp(bot))
      .then(() => bot.say("markdown", framework.showHelp()))
      .catch((e) => console.error(`Problem in help hander: ${e.message}`));
    }
    else{
      bot.say("I'm sorry, you must be using a radnet issued webex account to use this bot.")
      console.log("Unauthorized attempt to use this bot by " + trigger.person.displayName + ", " + trigger.person.emails);
      const client = new MongoClient(uri);
      try {
        const database = client.db("<db_name_here>");
        const coll = database.collection("<collection_name_here>");
        // create a document to insert
        const doc = {
          user: trigger.person.displayName,
          email: trigger.person.emails.toString(),
          attempted_command: trigger.text,
          date: curDate(),
      }
      const result = await coll.insertOne(doc);
        }
        finally {
          await client.close();
        }
    }
    
  },
  "**help**: (what you are reading now)",
  0
);

/* On mention with unexpected bot command
   Its a good practice is to gracefully handle unexpected input
   Setting the priority to a higher number here ensures that other 
   handlers with lower priority will be called instead if there is another match
*/
framework.hears(
  /.*/,
  async(bot, trigger) => {
    const uri = "mongodb://localhost:27017";
    let email = trigger.person.emails;
    let parsedemail = email.toString().replace(/@/g, ' ');
    let result = parsedemail.endsWith('RADNET.COM' || 'radnet.com' || 'RADNET.com');
    if(result == true) {
      // This will fire for any input so only respond if we haven't already
    console.log(`Unhandled Text: ${trigger.text}`);
    bot
      .say(`Sorry, I don't know how to respond to "${trigger.text}"`)
      .then(() => bot.say("markdown", framework.showHelp()))
      //    .then(() => sendHelp(bot))
      .catch((e) =>
        console.error(`Problem in the unexepected command hander: ${e.message}`)
      );
    }
    else{
      bot.say("I'm sorry, you must be using a radnet issued webex account to use this bot.");
      console.log("Unauthorized attempt to use this bot by " + trigger.person.displayName + ", " + trigger.person.emails);
      const client = new MongoClient(uri);
      try {
        const database = client.db("<db_name_here>");
        const coll = database.collection("<collection_name_here>");
        // create a document to insert
        const doc = {
          user: trigger.person.displayName,
          email: trigger.person.emails.toString(),
          attempted_command: trigger.text,
          date: curDate(),
      }
      const result = await coll.insertOne(doc);
        }
        finally {
          await client.close();
        }
    }
    
  },
  99999
);

//Server config & housekeeping
// Health Check
app.get("/", (req, res) => {
  res.send(`I'm alive.`);
});

app.post("/", webhook(framework));

var server = app.listen(config.port, () => {
  framework.debug("framework listening on port %s", config.port);
});

// gracefully shutdown (ctrl-c)
process.on("SIGINT", () => {
  framework.debug("stopping...");
  server.close();
  framework.stop().then(() => {
    process.exit();
  });
});
