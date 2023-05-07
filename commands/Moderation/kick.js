const { Client, Message, EmbedBuilder } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    try {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(" ") || "Sans raison";
        const author = message.guild.members.cache.get(message.author.id);

        // Ketika tidak ada di mention
        if (!member)
            return;

        // Ketika usernamenya sama ama yang di mention
        if (member.user.id === message.author.id)
            return message.reply('Tu ne peux pas faire toi-même.');

        // Ketika yang membanned adalah member
        if (!author.permissions.has('KickMembers'))
            return;

        // Ketika yang dibanned adalah admin/momod
        if (member.permissions.has('KickMembers'))
            return message.reply('Vous ne pouvez pas interdire le personnel !');

        member.kick({ reason: reason })
            .then(kickMember => {
                message.reply(`Tu as réussi à donner des coups de pied **${kickMember.user.tag}** avec raison :\n${reason}`);
            })
            .catch(err => {
                message.reply(`Il semble y avoir un problème !\n\`\`\`${err.message}\`\`\``);
            });
        const embed = new EmbedBuilder()
            .setAuthor({ name: `KICK | ${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
            .setColor('Random')
            .addFields(
                { name: 'Utilisateur', value: `<@${member.id}>`, inline: true },
                { name: 'Modérateur', value: `<@${message.author.id}>`, inline: true },
                { name: 'Raison', value: reason, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `${message.member.id}`, iconURL: message.guild.iconURL() })

        client.channels.cache.get(process.env.DISCORD_CHANNEL_MESSAGE_WARN).send({ embeds: [embed] });
    } catch (error) {
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["tendang"],
    cooldown: 5,
    permissions: ['KICK_MEMBERS'],
    location: __filename
}

exports.help = {
    name: 'kick',
    description: "Coup de pied à l'utilisateur du serveur",
    usage: 'kick <user> [reason]',
    example: 'kick @juned test'
}