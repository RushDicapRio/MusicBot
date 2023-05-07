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

        const volume = parseInt(args[0]);
        if (isNaN(volume)) return message.reply("S'il vous plait, entrez un nombre valide.");
        if (volume < 0 || volume > 100) return message.reply('Veuillez saisir un nombre entre 0 et 100.');
        if (queue.volume === volume) return message.reply(`Le volume est déjà défini sur ${volume}.`);

        const v = queue.setVolume(volume);
        console.log(v);
        if (v) message.reply(`Le volume a été défini sur ${volume}.`);
    } catch (err) {
        message.channel.send(`Il y avait une erreur : ${err}`);
    }
}

exports.conf = {
    aliases: ['vol', 'volume'],
    cooldown: 5,
}

exports.help = {
    name: 'set-volume',
    description: "Définit le volume de la file d'attente.",
    usage: 'set-volume <number>',
    example: 'set-volume 50',
}