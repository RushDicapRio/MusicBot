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
        if (!queue) return message.reply('La piste ne joue pas.');

        const skip = queue.skip();
        if (skip) message.reply('La piste a été ignorée.');
    } catch (err) {
        message.channel.send(`Il y avait une erreur : ${err}`);
    }
}

exports.conf = {
    aliases: ['sk'],
    cooldown: 5,
}

exports.help = {
    name: 'skip',
    description: 'Sauter la piste actuelle.',
    usage: 'skip',
    example: 'skip',
}