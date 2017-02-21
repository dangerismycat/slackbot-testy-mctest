const API_KEYS = require('./config.js').API_KEYS;

const slack = require('slack');
const dashbot = require('dashbot')(API_KEYS.dashbot).slack;
const includes = require('lodash').includes;

const API = require('./api.js');

let selfID = null;
let bot = null;
let team = null;

function initialHandshake(err, data) {
  if (arguments.length === 0) {
    console.log('NO RESPONSE?');
    return;
  }
  if (err) {
    console.log('ERROR:', err);
    return;
  }

  if (!data.ok) {
    console.log(data);
  } else {
    console.log('Sup 👋 \n');
    dashbot.logConnect(data);
    selfID = data.self.id;
    bot = data.self;
    team = data.team;
  }
}

function incomingMessage(data) {
  if (data == undefined) {
    console.log('MSG RECEIVED, NO MSG DATA')
    return;
  }

  const { text: msgText, channel: msgChannel } = data;
  dashbot.logIncoming(bot, team, data);

  if (includes(msgText, selfID)) {
    API.fetchData().then((data) => {
      const { quote } = data[0];
      const reply = {
        token: API_KEYS.adquotes,
        type: 'message',
        text: quote,
        channel: msgChannel
      };

      dashbot.logOutgoing(bot, team, reply);

      slack.chat.postMessage(reply, (err, data) => {
        if (err) { console.log('ERROR:', err); }
        if (data) { console.log('👍'); }
      });
    });

  } else {
    console.log('MSG RECEIVED, IGNORING');
  }
}


module.exports = {
  initialHandshake,
  incomingMessage,
};
