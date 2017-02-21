const slack = require('slack');
const includes = require('lodash').includes;

const API_KEYS = require('./config.js').API_KEYS;
const API = require('./api.js');

let selfID = null;


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
    selfID = data.self.id;
  }
}

function incomingMessage(data) {
  if (data == undefined) {
    console.log('MSG RECEIVED, NO MSG DATA')
    return;
  }

  const { text: msgText, channel: msgChannel } = data;


  if (includes(msgText, selfID)) {
    API.fetchData().then((data) => {
      const { quote } = data[0];

      slack.chat.postMessage({
        token: API_KEYS.adquotes,
        channel: msgChannel,
        text: quote,
      }, (err, data) => {
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
