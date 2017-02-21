const slack = require('slack');
const bot = slack.rtm.client();

const { API_KEYS } = require('./config.js');
const HANDLERS = require('./handlers.js');

// Start listening
bot.listen({ token: API_KEYS.adquotes }, HANDLERS.initialHandshake);

// Event handlers
bot.message(HANDLERS.incomingMessage);
