const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const gis = require('g-i-s');

exports.run = async (client, message, args) => {
    try {
        gis(args.join(' '), async (err, res) => {
            if (err) message.reply(`Erreur : ${err}`);
            let pagination = 1;
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`Résultat pour ${args.join(' ')}`)
                .setFooter({ text: `Page ${pagination} de ${res.length}` })
                .setImage(res[pagination - 1].url);

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('< Retour')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(args[0] + 'back' + message.id),
                    new ButtonBuilder()
                        .setLabel('Suivant >')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(args[0] + 'next' + message.id)
                )

            const m = await message.channel.send({ embeds: [embed], components: [button] });
            const collector = m.channel
                .createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60000 });
            collector.on('collect', async (i) => {
                switch (i.customId) {
                    case args[0] + 'back' + message.id:
                        if (pagination === 0) return;
                        pagination--;
                        embed.setImage(res[pagination - 1].url);
                        embed.setFooter({ text: `Page ${pagination} de ${res.length}` });
                        m.edit({ embeds: [embed], components: [button] });
                        break;
                    case args[0] + 'next' + message.id:
                        if (pagination === res.length) return;
                        pagination++;
                        embed.setImage(res[pagination - 1].url);
                        embed.setFooter({ text: `Page ${pagination} de ${res.length}` });
                        m.edit({ embeds: [embed], components: [button] });
                        break;
                };

                await i.deferUpdate();
            });
        });
    } catch (err) {
        message.channel.send(`\`ERREUR\` \`\`\`js\n${err.stack}\n\`\`\``);
    }
};

exports.conf = {
    aliases: ['gis', 'img'],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'image',
    description: "Rechercher l'image à partir de la recherche d'images Google",
    usage: 'image <query>',
    example: 'image cat'
};