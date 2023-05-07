const { Client, Message, EmbedBuilder } = require('discord.js');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {[]} args
 */

exports.run = async (client, message, args) => {
    try {
        if (!message.guild.members.me.permissions.has("MUTE_MEMBERS")) return message.channel.send("Je n'ai pas accès à !");
        if (!message.member.permissions.has("MUTE_MEMBERS")) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande !");

        if (args[0] === 'voice') {
            const channel = message.member.voice.channel;
            for (const member of channel.members) {
                member[1].voice.setMute(false)
            };
            message.channel.send('A été désactivé !');
        } else {
            const mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!mutee) return;

            mutee.timeout(null).then(() => {
                message.channel.send(`${mutee.user.tag} à été démuté !`);
            });

            const embed = new EmbedBuilder()
                .setAuthor({ name: `DEMUTE | ${mutee.user.tag}`, iconURL: mutee.user.displayAvatarURL() })
                .setColor('Random')
                .addFields(
                    { name: 'Utilisateur', value: `<@${mutee.id}>`, inline: true },
                    { name: 'Modérateur', value: `<@${message.author.id}>`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `${message.member.id}`, iconURL: message.guild.iconURL() });

            client.channels.cache.get(process.env.CHANNEL_MESSAGE_WARN).send({ embeds: [embed] });
        }
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
    name: 'unbisu',
    description: 'Libérer le rôle en sourdine',
    usage: 'unbisu <user/id>',
    example: 'unbisu @juned'
}