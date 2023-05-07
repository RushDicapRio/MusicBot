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
        if (!queue) return message.reply('Track is not playing.');

        const now = queue.current;
        const timestamp = queue.getPlayerTimestamp();
        await message.channel.send(`**Lecture en cours :**\n**${now.title}** \`[${timestamp.current} - ${now.duration}]\` **- Demandé par : ${now.requestedBy.tag}**\n[${now.url}]`);
    } catch (err) {
        message.channel.send(`Il y avait une erreur : ${err}`);
    }
}

exports.conf = {
    aliases: ['np'],
    cooldown: 5,
}

exports.help = {
    name: 'nowplaying',
    description: 'Montre la piste actuelle.',
    usage: 'nowplaying',
    example: 'nowplaying',
}