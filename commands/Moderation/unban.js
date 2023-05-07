const { Client, Message, EmbedBuilder } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
*/

exports.run = async (client, message, args) => {
    try {
        const member = args[0];
        const author = message.guild.members.cache.get(message.author.id);

        // Ketika tidak ada ID
        if (!member)
            return message.reply("Vous n'incluez pas l'identifiant !");

        // Ketika yang mengunban adalah member
        if (!author.permissions.has('BanMembers'))
            return message.reply('Vous êtes un membre ordinaire, vous ne pouvez pas utiliser cette commande !');

        message.guild.members.unban(member)
            .then(k => {
                message.reply(`Vous avez réussi à supprimer l'interdiction de **${member}** !`);
            })
            .catch(err => {
                message.reply(`Il semble y avoir un problème !\n\`\`\`${err.message}\`\`\``);
            });

        const embed = new EmbedBuilder()
            .setAuthor({ name: `UNBAN | ${member}`, iconURL: message.guild.iconURL() })
            .setColor('Random')
            .addFields(
                { name: 'Utilisateur', value: `<@${member}>`, inline: true },
                { name: 'Modérateur', value: `<@${message.author.id}>`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID : ${message.member.id}`, iconURL: message.guild.iconURL() });
    } catch (error) {
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'unban',
    description: "Bloquer l'utilisateur sur le serveur",
    usage: 'unban <userID>',
    example: 'unban '
}