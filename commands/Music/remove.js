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

        const i = args[0] - 1;
        const track = queue.tracks[i];
        if (!track) return message.reply('Piste introuvable.');

        const removed = queue.remove(i);
        if (removed) message.reply(`Supprimé ${track.title} de la file d'attente.`);
    } catch (err) {
        message.channel.send(`Il y avait une erreur : ${err}`);
    }
}

exports.conf = {
    aliases: ['rm'],
    cooldown: 5,
}

exports.help = {
    name: 'remove',
    description: "Supprime une chanson de la file d'attente.",
    usage: 'remove <song number>',
    example: 'remove 1',
}