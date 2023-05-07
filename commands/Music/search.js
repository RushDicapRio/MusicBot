const { Client, Message, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const playdl = require('play-dl');
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    if (!message.member.voice.channelId) return message.reply("Vous devez être dans un salon vocal pour utiliser cette commande.");
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) return message.reply("Vous devez être dans le même salon vocal que moi pour utiliser cette commande.");

    const query = args.join(' ');
    if (!query) return message.reply('Veuillez fournir une requête de recherche.');

    const queue = client.player.createQueue(message.guild, {
        metadata: {
            channel: message.channel
        },
        bufferingTimeout: 1000,
        disableVolume: true,
        leaveOnEnd: true,
        leaveOnStop: true,
        spotifyBridge: true,
        async onBeforeCreateStream(track, source) {
            if (source === 'youtube') {
                const stream = await playdl.stream(track.url, { discordPlayerCompatibility: true });

                return stream.stream;
            }
        }
    });
    try {
        if (!queue.connection) await queue.connect(message.member.voice.channel);

    } catch (err) {
        queue.destroy();
        return message.reply(`Il y avait une erreur se connectant au salon vocal : ${err}`);
    }

    const results = await client.player.search(query, { requestedBy: message.author, searchEngine: QueryType.AUTO });
    const embed = new EmbedBuilder()
        .setTitle(`Résultats de recherche pour ${query}`)
        .setColor('Random')
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(results.tracks.map((t, i) => `**${i + 1}. [${t.title}](${t.url})**`).join('\n'))
        .setFooter({ text: 'Tapez le numéro de la chanson que vous souhaitez jouer.' })
        .setTimestamp();

    const msg = await message.channel.send({ embeds: [embed] });

    let track = null;
    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 15000, max: 1, errors: ['time'] });
    collector.on('collect', async (m) => {
        const num = parseInt(m.content);
        if (isNaN(num) || num < 1 || num > 10) return message.reply('Numéro invalide.');

        track = results.tracks[num - 1];
        collector.stop();
        msg.delete();
    });

    collector.on('end', async (collected, reason) => {
        if (reason === 'time') {
            message.reply("Vous n'avez pas fourni de nombre à temps.");
            return msg.delete();
        }


        if (!queue.playing) {
            queue.addTrack(track);

            await queue.play();
            queue.playing = true;
            return message.reply(`Chargement de votre piste \`${track.title}\`...`);
        } else {
            queue.addTrack(track);
            return message.reply(`Ajoutée \`${track.title}\` à la file d'attente !`);
        }
    });

}

exports.conf = {
    aliases: ['cari'],
    cooldown: 5,
}

exports.help = {
    name: 'search',
    description: "Recherchez une chanson et ajoutez-la à la file d'attente.",
    usage: 'search <query>',
    example: 'search despacito'
}