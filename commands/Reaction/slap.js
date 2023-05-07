const axios = require('axios');
const { Client, Message, EmbedBuilder } = require("discord.js");

exports.run = async (client, message, args) => {
    try {
        const response = await axios.get('https://nekos.life/api/v2/img/slap');
        const hug = response.data;

        const member = message.mentions.members.first();
        if (!args[0]) return message.reply("mentionner quelqu'un pour continuer !");
        const embed = new EmbedBuilder().setColor('Random');

        if (message.author.id === member.user.id) {
            embed
                .setTitle('Tu te gifle 😳')
                .setImage(hug.url)

            message.channel.send({ embeds: [embed] });
        } else {
            embed
                .setTitle(`${message.guild.members.cache.get(message.author.id).displayName} gifle ${message.guild.members.cache.get(member.user.id).displayName} (✿◡‿◡)`)
                .setImage(hug.url)

            message.channel.send({ embeds: [embed] });
        }
    } catch (error) {
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["tampar"],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'slap',
    description: 'réaction',
    usage: 'slap <user>',
    example: 'slap @juned'
}