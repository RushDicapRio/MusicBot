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
        if (!queue || queue.connection.paused) return message.reply('La piste ne joue pas.');

        const paused = queue.setPaused(true);
        if (paused) message.reply('La piste a été interrompue.');
    } catch (err) {
        message.channel.send(`Il y avait une erreur : ${err}`);
    }
}

exports.conf = {
    aliases: ['ps'],
    cooldown: 5,
}

exports.help = {
    name: 'pause',
    description: 'Passe la piste actuelle.',
    usage: 'pause',
    example: 'pause',
}