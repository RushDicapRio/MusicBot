const { Client, Message, EmbedBuilder } = require('discord.js');
const ms = require('ms');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    try {
        if (!message.guild.members.me.permissions.has('MuteMembers')) return message.channel.send("Je n'ai pas accès à !");
        if (!message.member.permissions.has('MuteMembers')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande !");

        const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mutee) return;

        const timeout = args[1];
        if (!timeout) return message.reply("Entrez d'abord la durée !");
        const durasi = ms(timeout);
        if (!durasi) return message.reply('Entrez la bonne durée !');
        if (durasi > 2419200000) return message.reply('La durée ne peut pas dépasser 28 jours !');

        const reason = args.slice(2).join(' ') || "pas donné une raison";
        mutee.timeout(durasi, reason).then(() => {
            message.channel.send(`${mutee.user.tag} a été muet pendant ${timeout}!`);
        });

        const embed = new EmbedBuilder()
            .setAuthor({ name: `MUTE | ${mutee.user.tag}`, iconURL: mutee.user.displayAvatarURL() })
            .setColor('Random')
            .addFields(
                { name: 'Utilisateur', value: `<@${mutee.id}>`, inline: true },
                { name: 'Modérateur', value: `<@${message.author.id}>`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Durée', value: client.util.parseDur(durasi), inline: true },
                { name: 'Raison', value: reason, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID : ${message.member.id}`, iconURL: message.guild.iconURL() });

        client.channels.cache.get(process.env.CHANNEL_MESSAGE_WARN).send({ embeds: [embed] });

    } catch (error) {
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    permissions: ['MUTE_MEMBERS'],
    location: __filename
}

exports.help = {
    name: 'tempmute',
    description: 'Donne un rôle coupé aux membres',
    usage: 'tempmute <user> [reason]',
    example: 'tempmute @juned spam'
}