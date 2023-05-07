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
        if (!queue) return message.reply('Il y a de la musique.');

        await queue.clear();
        message.reply("La file d'attente a été effacée.");
    } catch (err) {
        message.channel.send(`Il y avait une erreur : ${err}`);
    }
}

exports.conf = {
    aliases: ['cl'],
    cooldown: 5,
}

exports.help = {
    name: 'clear',
    description: "Efface la file d'attente.",
    usage: 'clear',
    example: 'clear',
}