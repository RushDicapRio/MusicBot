const { Client, Message, EmbedBuilder } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 * @returns 
 */
exports.run = async (client, message, args) => {
    try {
        if (!args[0]) return message.channel.send('Consommation : **poll <insert ton texte ici>**');
        const isi = args.join(' ');
        if (isi.length <= 10) return;

        const embed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ forceStatic: true, size: 4096 }) })
            .setDescription(isi)
            .setFooter({ text: `Songment de ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ forceStatic: true, size: 4096 }) })
            .setColor('Random');

        const msg = await message.channel.send({ embeds: [embed] });
        await msg.react('✅');
        await msg.react('❌');
    } catch (error) {
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    };
};

exports.conf = {
    aliases: [],
    cooldown: 60
};

exports.help = {
    name: 'poll',
    description: 'vote',
    usage: 'poll',
    example: 'poll'
};