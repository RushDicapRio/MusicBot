const { EmbedBuilder, Client, Message } = require('discord.js');

/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array} args 
 */
exports.run = async (client, message, args) => {
    const mention = message.mentions.users.first();
    const userID = message.guild.members.cache.get(args[0]);
    const self = !args[0];
    const bannerUser = (mention || userID || message.author) && args.includes("banner");
    const server = args[0] === "server";
    const banner = server && args.includes("banner");

    const userRegex = new RegExp(args.join(" "), "i");
    const find = message.guild.members.cache.find(a => {
        return userRegex.test(a.nickname) ? userRegex.test(a.nickname) : a.user.username.toLowerCase() === args.join(' ').toLowerCase();
    });

    //embed
    const embed = new EmbedBuilder().setColor('Random');

    //get avatar and send to user
    if (bannerUser) {
        const getUser = await client.users.fetch(mention?.id || userID?.id || message.author.id, { force: true });
        const bannerURL = getUser.bannerURL({ size: 4096 });
        if (mention) {
            embed
                .setAuthor({ name: mention.tag, iconURL: mention.displayAvatarURL({ size: 4096, forceStatic: true }) })
                .setDescription(`[LIEN de la bannière](${bannerURL})`)
                .setImage(bannerURL);
        } else if (userID) {
            embed
                .setAuthor({ name: userID.user.tag, iconURL: userID.user.displayAvatarURL({ size: 4096, forceStatic: true }) })
                .setDescription(`[LIEN de la bannière](${bannerURL})`)
                .setImage(bannerURL);
        } else {
            embed
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ size: 4096, forceStatic: true }) })
                .setDescription(`[LIEN de la bannière](${bannerURL})`)
                .setImage(bannerURL);
        }
    } else if (mention) {
        embed.setAuthor({ name: mention.tag, iconURL: mention.displayAvatarURL({ size: 4096, forceStatic: true }) })   //author embed
        embed.setDescription(`[LIEN de l'avatar](${mention.displayAvatarURL({ size: 4096, forceStatic: true })})`) //redirect to avatar link
        embed.setImage(mention.displayAvatarURL({ size: 4096, forceStatic: true }).replace('.webp', '.png')) //image of avatar
    } else if (userID) {
        embed.setAuthor({ name: userID.user.tag, iconURL: userID.user.displayAvatarURL({ size: 4096, forceStatic: true }) })
        embed.setDescription(`[LIEN de l'avatar](${userID.user.displayAvatarURL({ size: 4096, forceStatic: true })})`)
        embed.setImage(userID.user.displayAvatarURL({ size: 4096, forceStatic: true }).replace('.webp', '.png'))
    } else if (self) {
        embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ size: 4096, forceStatic: true }) })
        embed.setDescription(`[LIEN de l'avatar](${message.author.displayAvatarURL({ size: 4096, forceStatic: true })})`)
        embed.setImage(message.author.displayAvatarURL({ size: 4096, forceStatic: true }).replace('.webp', '.png'))
    } else if (server) {
        embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
        embed.setDescription(`[LIEN de l'avatar](${message.guild.iconURL({ size: 4096, forceStatic: true })})`)
        embed.setImage(message.guild.iconURL({ size: 4096, forceStatic: true }).replace('.webp', '.png'))
    } else if (banner) {
        const getUserBannerURL = message.guild.bannerURL({ size: 4096, forceStatic: true });
        embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ size: 4096, forceStatic: true }) })
        embed.setDescription(`[LIEN de l'avatar](${getUserBannerURL})`)
        embed.setImage(getUserBannerURL)
    } else if (find) {
        embed.setAuthor({ name: find.user.tag, iconURL: find.user.displayAvatarURL({ size: 4096, forceStatic: true }) })
        embed.setDescription(`[LIEN de l'avatar](${find.user.displayAvatarURL({ size: 4096, forceStatic: true })})`)
        embed.setImage(find.user.displayAvatarURL({ size: 4096, forceStatic: true }).replace('.webp', '.png'))
    } else {
        return message.channel.send(`${message.author} Je n'ai pas pu trouver cet utilisateur.`);
    }

    message.channel.send({ embeds: [embed] });
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
};

exports.help = {
    name: 'avatar',
    description: 'Voir Avatar',
    usage: 'avatar [@mention | userID | server | nickname]>',
    example: 'avatar @juned'
}