const { Client, Message } = require('discord.js');
const { QuickDB } = require('quick.db');
/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    try {
        const db = client.db.afk;
        const afk = await db.get(message.author.id);
        const reason = args.join(' ');

        if (!afk) {
            message.channel.send(`**${message.author.tag}** AFK ! \n**Raison :** ${reason ? reason : "AFK"}`);
            setTimeout(async () => {
                await db.set(message.author.id, { alasan: reason || 'AFK', time: Date.now() });
            }, 7000);
        } else {
            await db.delete(message.author.id);
        };
    } catch (error) {
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    };
};

exports.conf = {
    aliases: ["away"],
    cooldown: 10
}

exports.help = {
    name: 'afk',
    description: "Ajouter le statut AFK à l'utilisateur",
    usage: 'avatar [mention/userid/serveur]',
    example: 'avatar @juned | avatar 458342161474387999 | avatar serveur'
}