const { Client, Message } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    try {
        if (!message.member.permissions.has('ManageMessages')) return;

        if (!args[0]) return message.channel.send(" Impossible de supprimer le message que vous souhaitez !");
        message.delete();
        message.channel.bulkDelete(args[0]).then(() => {
            message.channel.send(`:ok_hand: ${args[0]} Le message a été supprimé !`).then(msg => setTimeout(() => msg.delete(), 5000));
        });

    } catch (error) {
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["hapus"],
    cooldown: 5,
    permissions: ['MANAGE_MESSAGES'],
    location: __filename
}

exports.help = {
    name: 'prune',
    description: 'Supprimer un message',
    usage: 'prune <jumlah pesan>',
    example: 'prune 10'
}