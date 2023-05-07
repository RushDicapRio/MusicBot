const { Client, Message, EmbedBuilder } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    const db = client.db.cmd;
    try {
        const request = args.join(' ');
        if (!request) return message.reply("Sélectionnez l'option à déterminer `[ON / OFF]` \ n ** Exemple: > CMD Ping sur**");

        const cmd = client.commands.get(args[0])?.help;
        if (!cmd) return message.reply("Aucune commande n'a été trouvée !");

        const data = await db.get(`${message.guild.id}`);
        if (!data) data = await db.set(`${message.guild.id}`, { all: [], cmd: [] });

        const cmds = data.cmd;
        let getcmd = cmds.find(a => a.name === cmd.name);
        if (!getcmd) cmds.push({ name: cmd.name, channel: [] }) ? getcmd = cmds.find(a => a.name === cmd.name) : getcmd = null;

        switch (args[1]) {
            case 'off':
                if (getcmd.channel.includes(message.channel.id)) return message.reply('Cette commande a été désactivée !');
                getcmd.channel.push(message.channel.id);

                message.reply('Cette commande a été désactivée !');
                await db.set(`${message.guild.id}`, data);
                break;

            case 'on':
                if (!getcmd.channel.includes(message.channel.id)) return message.reply("Cette commande n'est pas désactivée !");
                getcmd.channel = getcmd.channel.filter(a => a !== message.channel.id);

                message.reply('perintah ini telah diaktifkan!');
                await db.set(`${message.guild.id}`, data);
                break;

            case 'list':
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`Commandes désactivées sur ${message.guild.name}`)
                    .setDescription(getcmd.channel.map((a, i) => `${i + 1}. <#${a}>`).join('\n') || "Aucune commande n'est désactivée !");

                message.channel.send({ embeds: [embed] });
                break;

            default:
                message.reply("Choisissez l'option !");
                break;
        }
    } catch (error) {
        return message.reply('Il semble y avoir une erreur :\n' + error.message);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: [],
    cooldown: 5,
}

exports.help = {
    name: 'cmd',
    description: 'Éteignez, allumez et voyez les données de commande',
    usage: 'cmd <command> <on/off>',
    example: 'cmd ping off'
}