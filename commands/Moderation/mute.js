const { Client, Message, EmbedBuilder } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    try {
        if (!message.guild.members.me.permissions.has('ManageRoles')) return message.reply("Je n'ai pas la permission requise !");
        if (!message.member.permissions.has("MuteMembers")) return message.channel.send("Je n'ai pas accès à !");
        if (!message.member.permissions.has("MuteMembers")) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande !");

        if (args[0] === 'voice') {
            const channel = message.member.voice.channel;
            for (let member of channel.members) {
                member[1].voice.setMute(true)
            };
            message.channel.send('A été activé !');
        } else {
            const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!mutee) return;

            let reason = args.slice(1).join(" ");
            if (!reason) reason = "pas donné une raison";

            //give timeout
            mutee.timeout(require('ms')("28d"), reason).then(() => {
                message.channel.send(`${mutee.user.tag} ta été muet !`);
            });

            const embed = new EmbedBuilder()
                .setAuthor({ name: `MUTE | ${mutee.user.tag}`, iconURL: mutee.user.displayAvatarURL() })
                .setColor('Random')
                .addFields(
                    { name: 'Utilisateur', value: `<@${mutee.id}>`, inline: true },
                    { name: 'Modérateur', value: `<@${message.author.id}>`, inline: true },
                    { name: 'Raison', value: reason, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `ID : ${message.member.id}`, iconURL: message.guild.iconURL() });

            client.channels.cache.get(process.env.DISCORD_CHANNEL_MESSAGE_WARN)?.send({ embeds: [embed] });
        }
    } catch (error) {
        console.log(error);
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ['bisu'],
    cooldown: 5,
    permissions: ['MUTE_MEMBERS'],
    location: __filename
}

exports.help = {
    name: 'mute',
    description: 'Donne un rôle coupé aux membres',
    usage: 'mute <user> [reason]',
    example: 'mute @juned spam'
}