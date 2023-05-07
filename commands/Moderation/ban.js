const { Client, Message, EmbedBuilder, Permissions, AttachmentBuilder } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */
exports.run = async (client, message, args) => {

    try {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(" ") || "Sans raison";
        let author = message.guild.members.cache.get(message.author.id);

        // Ketika tidak ada di mention
        if (!member)
            return;

        // Ketika usernamenya sama ama yang di mention
        if (member.user.id === message.author.id)
            return message.reply('Tu ne peux pas faire toi-même.');

        // Ketika yang membanned adalah member
        if (!author.permissions.has('BanMembers'))
            return;

        // Ketika yang dibanned adalah admin/momod
        if (member.permissions.has('BanMembers'))
            return message.reply('Vous ne pouvez pas interdire le personnel !');

        const attchments = new AttachmentBuilder("https://media2.giphy.com/media/H99r2HtnYs492/200.gif");
        member.ban({ reason: reason })
            .then((banMember) => {
                message.reply({ content: `Vous avez réussi à interdire **${banMember.user.tag}**\nRaison :\n${reason}`, files: [attchments] });
            })
            .catch((err) => {
                message.reply(`Il semble y avoir un problème !\n\`\`\`${err.message}\`\`\``);

            });
        //log
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: `BAN | ${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: 'Utilisateur', value: `<@${member.id}>`, inline: true },
                { name: 'Modérateur', value: `<@${message.author.id}>`, inline: true },
                { name: 'Raison', value: reason }
            )
            .setTimestamp()
            .setFooter({ text: `${message.member.id}`, iconURL: message.guild.iconURL() });

        client.channels.cache.get(process.env.DISCORD_CHANNEL_MESSAGE_WARN)?.send({ embeds: [embed] });
    } catch (error) {
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['BAN_MEMBERS'],
    location: __filename
}

exports.help = {
    name: 'ban',
    description: 'Bloquer les utilisateurs du serveur',
    usage: 'ban <user> [reason]',
    example: 'ban @juned test'
}