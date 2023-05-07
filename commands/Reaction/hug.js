const axios = require('axios');
const { Client, Message, EmbedBuilder, Embed } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
*/

exports.run = async (client, message, args) => {
    try {
        const response = await axios.get('https://nekos.life/api/v2/img/hug');
        const hug = response.data;

        const member = message.mentions.members.first();
        if (!args[0]) return message.reply("mentionner quelqu'un pour continuer !");

        const embed = new EmbedBuilder();
        if (message.author.id === member.user.id) {
            embed
                .setTitle("Tu t'embrasse 😳")
                .setColor('Random')
                .setImage(hug.url)

            message.channel.send({ embeds: [embed] });
        } else {
            embed
                .setTitle(`${message.guild.members.cache.get(message.author.id).displayName} embrasse ${message.guild.members.cache.get(member.user.id).displayName} (✿◡‿◡)`)
                .setColor('Random')
                .setImage(hug.url)

            message.channel.send({ embeds: [embed] });
        };
    } catch (error) {
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["peluk"],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'hug',
    description: 'réaction',
    usage: 'hug <user>',
    example: 'hug @juned'
}