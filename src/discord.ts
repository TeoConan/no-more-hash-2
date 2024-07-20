// Configuration du fichier .env
require('dotenv').config();

import { Client, GatewayIntentBits, Message, PartialMessage } from 'discord.js';
import main from '.';

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
    handleMessage(msg);
});

// Callback à l'update d'un message
client.on('messageUpdate', async (oldMsg, newMsg) => {
    if (oldMsg.content === newMsg.content) return;
    handleMessage(newMsg);
});

/**
 * Réaction à la réception d'un nouveau message
 * @param msg Message à traiter
 * @returns
 */
function handleMessage(msg: Message | PartialMessage) {
    try {
        // Le message provient d'un bot ou est null, on skip
        if (msg.author == null || msg.content == null || msg.author.bot) return;

        // On envoie le message et le nickname
        const answer = main(msg.content, msg.member?.nickname);

        // On traite la réponse et on emet une réaction si besoin
        const react = answer.getReaction();
        if (react != '' && react != undefined) msg.react(react);

        // On renvoie une réponse dans le channel Discord
        if (answer.message != '') msg.reply(answer.message);
    } catch (e) {
        console.error(e);
    }
}

client.login(process.env.CLIENT_TOKEN);
