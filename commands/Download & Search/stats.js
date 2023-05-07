const { Client, Message, EmbedBuilder } = require("discord.js");
const { version } = require("discord.js");
const moment = require("moment");
const os = require('os')
const cpuStat = require("cpu-stat");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 * @returns 
 */
exports.run = async (client, message, args) => {

    try {
        cpuStat.usagePercent(function (err, percent) {
            if (err) return console.log(err);
            const uptime = moment.duration(client.uptime);
            const duration = `${uptime.days()} jours, ${uptime.hours()} heures, ${uptime.minutes()} minutes, ${uptime.seconds()} secondes`

            const djs_icon = "<\:discordjs:592136964531290112>";
            const njs_icon = "<\:node:592137881091309571>";

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${client.user.username}\'s Stats`, iconURL: "https://cdn.discordapp.com/emojis/559740262520455169.png?v=1" })
                .setThumbnail(`${client.user.displayAvatarURL()}`)
                .setDescription(`${djs_icon}  **Discord.js (v${version})**\n${njs_icon}  **Node.js (${process.version})**`)
                .addFields(
                    { name: "❯ Utilisation de la mémoire", value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0)} / ${(os.totalmem() / 1024 / 1024).toFixed(0)} MB\``, inline: true },
                    { name: "❯ L'utilisation du processeur", value: `\`${percent.toFixed(0)} %\``, inline: true },
                    { name: "❯ Platforme", value: `\`${os.type}\``, inline: true },
                    { name: "❯ Uptime", value: `\`${duration}\``, inline: true },
                    { name: "❯ Ping", value: `API : \`${Math.floor(client.ws.ping)}ms\`\nLatence : \`${message.createdTimestamp - Date.now()} ms\``, inline: true },
                    { name: "❯ Client", value: `Serveur : \`${client.guilds.cache.size} Joined\`\nSalons : \`${client.channels.cache.size} Salons\`\nUtilisateurs : \`${client.users.cache.size} Utilisateurs\``, inline: true }
                )
                .setFooter({ text: `⌨ ${client.user.username} | ${moment().get('year')}`, iconURL: client.user.displayAvatarURL() })
                .setColor('Random')
                .setTimestamp()
            message.channel.send({ embeds: [embed] });

        });
    } catch (error) {
        return message.channel.send(`Quelque chose s'est mal passé : ${error.message}`);
        // Restart the bot as usual.
    }
}

exports.conf = {
    aliases: ["spec"],
    cooldown: 5
}

exports.help = {
    name: 'stats',
    description: 'Voir les spécifications PC utilisées par Saez',
    usage: 'stats',
    example: 'stats'
}