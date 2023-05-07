const { EmbedBuilder, Client, Message } = require('discord.js');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array} args 
 */
exports.run = async (client, message, args) => {
    try {

        const prefix = [
            process.env.DISCORD_PREFIX_1,
            process.env.DISCORD_PREFIX_2
        ];

        if (!args[0]) {
            let module = Array.from(client.helps.values());
            // if (!client.config.owners.includes(message.author.id)) 
            module = module.filter(x => !x.hide);

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTimestamp()
                .setFooter({ text: `© 2023 Saez • Total : ${client.commands.size} commandes`, iconURL: client.user.avatarURL() })
                .setDescription(`Taper \`${prefix[0]}help [commande] / ${prefix[1]}help [commande]\` Pour ajouter plus d'informations sur une commande.`)
                .setTitle(`<:kato:750342786825584811> ${client.user.username}-Liste de commande du Bot <:kato:750342786825584811>`)

            for (const mod of module) {
                embed.addFields({ name: `${mod.name}`, value: mod.cmds.map(x => `\`${x}\``).join(' . '), inline: true });
            }

            message.channel.send({ embeds: [embed] });
        } else {
            const cmd = args[0];
            if (client.commands.has(cmd) || client.commands.get(client.aliases.get(cmd))) {
                let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
                let name = command.help.name;
                let desc = command.help.description;
                let cooldown = command.conf.cooldown;
                let aliases = command.conf.aliases.join(', ') ? command.conf.aliases.join(', ') : 'Aucun alias fourni.';
                let usage = command.help.usage ? prefix[0] + command.help.usage : "Aucune utilisation fournie.";
                let example = command.help.example ? prefix[0] + command.help.example : "Aucun exemple fourni."

                let embed = new EmbedBuilder()
                    .setColor("#985ce7")
                    .setTitle(name)
                    .setDescription(desc)
                    .setThumbnail(client.user.avatarURL({ forceStatic: true }))
                    .setFooter({ text: "[] facultatif, <> requis. • N'ajoutez pas ce symbole lors de la saisie d'une commande." })
                    .addFields(
                        { name: 'Usage', value: usage, inline: true },
                        { name: 'Aliases', value: aliases, inline: true },
                        { name: 'Cooldown', value: `${cooldown} second(s)`, inline: true },
                        { name: 'Exaemple', value: `${example}`, inline: true }
                    )
                return message.channel.send({ embeds: [embed] });
            }
            if (!client.commands.has(cmd) || !client.commands.get(client.aliases.get(cmd))) {
                message.channel.send({ embed: { color: 0xcc5353, description: "Y" } })
            }
        }
    } catch (err) {
        console.log(err);
        message.channel.send({ content: 'Quelque chose ne va pas avec : ' + err.message });
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'help',
    description: 'Affiche une liste des commandes Saez Bot.',
    usage: 'help [command name]',
    example: 'help [command name]'
}