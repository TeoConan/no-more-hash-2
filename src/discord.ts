require('dotenv').config();

import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

client.on('ready', () => {
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${client.user?.id}&permissions=11264&scope=bot`;

    console.log(`Invite your bot using this URL: ${inviteUrl}`);

    console.log(`Logged in as ${client.user?.tag}`);
});

client.on('messageCreate', async (msg) => {
    try {
        if (msg.author.bot) return;

        const message = msg.content;
    } catch (e) {
        console.error(e);
    }
});

client.login(process.env.CLIENT_TOKEN);
