const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    const m = await message.reply('Pinging...');
    m.edit({
        content: 'Pong !',
        embeds: [
            new EmbedBuilder()
                .setColor('Random')
                .setTitle('Pong !')
                .addFields(
                    {
                        name: '⌛ Latence', value: `**${m.createdTimestamp - message.createdTimestamp}ms**`
                    },
                    {
                        name: "💓 Latence de l'API", value: `**${Math.round(client.ws.ping)}ms**`
                    }
                )
                .setTimestamp()
        ]
    });
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'ping',
    description: 'Ping le bot.',
    usage: 'ping',
    example: 'ping',
}