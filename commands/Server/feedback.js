const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    const isi = args.join(' ');
    if (isi.length <= 10) return message.reply('Contiennent au moins plus de 10 caractères');

    const embed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({ name: message.guild.name, text: message.guild.iconURL() })
        .setDescription(`**Remplissez l'entrée :**\n${isi}`)
        .setFooter({ text: `posté par ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
    const getChannel = client.channels.cache.get(process.env.DISCORD_CHANNEL_MESSAGE_FEEDBACK);
    if (!getChannel) return message.reply("Saez ne peut pas envoyer de conseils car le salon n'a pas été crée, veuillez vous présenter au personnel !");
    getChannel.send({ embeds: [embed] });

    message.reply('Des contributions ont été envoyées, merci !');
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'feedback',
    description: 'donner des commentaires',
    usage: 'feedback <commentaire>',
    example: 'feedback Je ne peux pas envoyer de messages'
}