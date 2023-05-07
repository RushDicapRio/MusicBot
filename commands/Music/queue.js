const { Client, Message } = require('discord.js');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    try {
        if (!message.member.voice.channel) return message.reply("Vous n'êtes pas dans un salon vocal.");
        if (message.member.voice.channelId !== message.guild.members.me.voice.channelId) return message.reply("Vous n'êtes pas dans le même salon vocal que le bot.");

        const queue = client.player.getQueue(message.guild);
        if (!queue) return message.reply('La musique ne se joue pas.');

        const now = queue.current;
        const timestamp = queue.getPlayerTimestamp();
        const tracks = queue.tracks.map((track, i) => `**${i + 1}. ${track.title}** [${track.duration}] \`${track.url}\` - Demandé par : ${track.requestedBy.tag}`);
        const list = typeof tracks === 'object' ? tracks.join('\n') : "Pas de pistes dans la file d'attente.";

        message.channel.send(`**Lecture en cours :**\n**${now.title}** \`[${timestamp.current} - ${now.duration}]\` **- Demandé par : ${now.requestedBy.tag}**\n[${now.url}]\n**File d'attente actuelle :**\n${list}`);
    } catch (err) {
        message.channel.send(`Il y avait une erreur : ${err}`);
    }
}

exports.conf = {
    aliases: ['q'],
    cooldown: 5,
}

exports.help = {
    name: 'queue',
    description: "Montre la file d'attente actuelle.",
    usage: 'queue',
    example: 'queue',
}