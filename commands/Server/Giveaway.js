const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    const option = args[0]?.toLowerCase() || null;
    if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply("Pas assez d'autorisation !");

    switch (option) {
        case 'create':
            await client.giveaway.create(message);
            break;

        case 'reroll':
            await client.giveaway.reroll(message, args);
            break;

        case 'list':
            await client.giveaway.getData(message, args);
            break;

        case 'end':
            await client.giveaway.end(message, args);
            break;

        case 'delete':
            await client.giveaway.delete(message, args);
            break;

        default:
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Liste de commande de cadeaux')
                        .setDescription([
                            '```',
                            'create - Créer un cadeau',
                            'reroll - Rejouer un cadeau',
                            'list - Listes des cadeaux',
                            'end - Mettre fin à un cadeau',
                            'delete - Supprimer un cadeau',
                            '```'
                        ].join('\n'))
                        .setColor('Random')
                        .setTimestamp()
                        .setFooter({ text: '© 2023 Saez', iconURL: client.user.displayAvatarURL({ forceStatic: true }) })
                        .toJSON()
                ]
            });
            break;
    }

};

exports.conf = {
    aliases: ['ga'],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'giveaway',
    description: 'giveaway',
    usage: 'giveaway',
    example: 'giveaway'
}