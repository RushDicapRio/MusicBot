const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    try {
        if (!message.member.voice.channel) return message.reply("Vous n'êtes pas dans un salon vocal.");
        if (message.member.voice.channelId !== message.guild.members.me.voice.channelId) return message.reply("Vous n'êtes pas dans le même salon vocal que le bot.");

        const queue = client.player.getQueue(message.guild);
        if (queue) await queue.destroy();

        message.guild.members.me.voice.disconnect();

        message.reply('Déconnecté du salon vocal...');
    } catch (err) {
        message.channel.send(`Il y avait une erreur : ${err}`);
    }
}

exports.conf = {
    aliases: ['dc', 'leave', 'stop'],
    cooldown: 5,
}

exports.help = {
    name: 'disconnect',
    description: 'Débranche le bot du salon vocal.',
    usage: 'disconnect',
    example: 'disconnect',
}