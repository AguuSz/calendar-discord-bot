const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config/keys.js')
const { ListEvents, handleCreateEvent, DeleteEvent, handleTokenKey } = require('./calendar_exports.js')
const cron = require('cron');

//config for heroku
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Hello World!');
  res.end();
}).listen(process.env.PORT);
//config for heroku


client.on('ready', () => {
  console.log('Ready!');
});



client.on('message', async message => {
  //Check bot ping
  if (message.content === '!ping') {
    // message.reply("pong");
  }

  // List events
  if (message.content === '!listar') {
    let scheduledMessage = new cron.CronJob('* * 23 * * *', async () => {
      message.channel.send("<@&741062874486538300>, el menu del dia");
      let events = await ListEvents(message);
      // message.channel.send(events);
    });

    scheduledMessage.start();
  }

  // Create new event
  if (message.content.startsWith('!create-event')) {
    let contents = message.content.split(" ");
    try {
      var eventLink = await handleCreateEvent(contents, message)
    } catch (e) {
      var eventLink = e;
    }
    message.channel.send(eventLink);
  }

  // Delete event
  if (message.content.startsWith('!remove-event' || '!delete-event')) {
    let deleteMessage = await DeleteEvent(message.content, message)
    message.channel.send(deleteMessage);
  }

  // Accept Token Key
  if (message.content.startsWith('!token-key')) {
    if (client.user.lastMessage && client.user.lastMessage.content.startsWith("Authorize the app by visiting the url ") && !client.user.lastMessage.content.startsWith("Authenticated")) {
      const tokenKey = message.content.split(" ")[1]
      let authMessage = await handleTokenKey(tokenKey, message);
      message.channel.send(authMessage)
    }
    else {
      message.channel.send("Nope...")
    }
  }

});

client.login(config.token);