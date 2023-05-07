const { Client, Message } = require('discord.js');
const { QueryType } = require('discord-player');
const playdl = require('play-dl');
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {[]} args 
 */
exports.run = async (client, message, args) => {
    if (!message.member.voice.channelId) return message.reply('Vous devez être dans un salon vocal pour utiliser cette commande.');
    if (message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId) return message.reply('Vous devez être dans le même salon vocal que moi pour utiliser cette commande.');

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

    const track = await client.player.search(query, { requestedBy: message.author, searchEngine: QueryType.AUTO }).then(x => x.tracks[0]);
    if (!track) return message.reply("Aucun resultat n'a été trouvé.");

    if (!queue.playing) {
        queue.addTrack(track);

        await queue.play();
        queue.playing = true;
        return message.reply(`Chargement de votre piste \`${track.title}\`...`);
    } else {
        queue.addTrack(track);
        return message.reply(`Ajoutée \`${track.title}\` à la file d'attente !`);
    }
}

exports.conf = {
    aliases: ['p'],
    cooldown: 5,
}

exports.help = {
    name: 'play',
    description: 'Jouer une chanson.',
    usage: 'play <query>',
    example: 'play Never gonna give you up'
}