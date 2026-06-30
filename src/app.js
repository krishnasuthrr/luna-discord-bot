require('dotenv').config();

const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance. client - connection manager between the application and Discord.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});


client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

/**
 * - Log in to Discord with your client's token - bot becomes online
 * - TCP/WebSocket connection is established
 * - Heartbeat/Heartbeat loop ACK starts here
 */
client.login(process.env.TOKEN);