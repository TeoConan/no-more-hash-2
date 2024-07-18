// Configuration du fichier .env
require('dotenv').config();

import { Client, GatewayIntentBits } from 'discord.js';
import main from '.';
import { AnswerType } from './answer';

// Configuration des autorisations du client sur le channel
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

// Callback quand le bot est prêt
client.on('ready', () => {
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${client.user?.id}&permissions=11264&scope=bot`;

    console.log(`Invite your bot using this URL: ${inviteUrl}`);

    console.log(`Logged in as ${client.user?.tag}`);
});

// Callback à la réception d'un message
client.on('messageCreate', async (msg) => {
    try {
        // Le message provient d'un bot, on skip
        if (msg.author.bot) return;

        const answer = main(msg.content, msg.author.id);

        switch (answer.getType()) {
            case AnswerType.Provocation:
                msg.react('🤓');
                break;

            case AnswerType.Correction:
                msg.react('😑');
                break;

            case AnswerType.Violation:
                msg.react('😡');
                break;

            case AnswerType.Trick:
                msg.react('🤡');
                break;
        }

        if (answer.message != '') msg.reply(answer.message);
    } catch (e) {
        console.error(e);
    }
});

client.login(process.env.CLIENT_TOKEN);
