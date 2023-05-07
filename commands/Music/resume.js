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
        if (!queue.connection.paused) return message.reply('La piste est déjà en jeu.');

        const resume = queue.setPaused(false);
        if (resume) message.reply('La piste a repris.');
    } catch (err) {
        message.channel.send(`Il y avait une erreur : ${err}`);
    }
}

exports.conf = {
    aliases: ['rs'],
    cooldown: 5,
}

exports.help = {
    name: 'resume',
    description: 'reprend la piste actuelle.',
    usage: 'resume',
    example: 'resume',
}