const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ComponentType, ButtonInteraction } = require('discord.js');
const ms = require('ms');

module.exports = class Giveaway {
    /**
     * First, we need to create a constructor.
     * @param {Client} client 
     */
    constructor(client, time = 60_000) {
        if (!client) throw new Error("Le client n'est pas défini !");
        if (!time) throw new Error("Le temps n'est pas défini !");

        this.client = client;
        this.interval = time;
        this.db = this.client.db.giveaway;
    }

    /**
     * 
     * @param {Message} message 
     * @returns Promise<GiveawayData>
     */
    create(message) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {};

                let status = null;
                let msg = await message.channel.send('Choisissez le salon que vous souhaitez être un endroit !');

                status = 'channel';
                let collector = message.channel.createMessageCollector({ filter: (m) => m.author.id === message.author.id, time: 120000 });
                collector.on('collect', async m => {
                    switch (status) {
                        case 'channel':
                            if (m.mentions.channels.size === 0) return m.reply('Salon non valide !')
                                .then(t => setTimeout(() => t.delete(), 5000));
                            msg.delete();
                            data.channel = m.mentions.channels.first().id;

                            status = 'time';
                            msg = await message.channel.send(`<#${m.mentions.channels.first().id}> Devenez un lieu de cadeau, puis entrez la durée du cadeau !`);
                            break;

                        case 'time':
                            const timelist = m.content.split(' ');
                            const totalTime = [];
                            for (const time of timelist) {
                                if (!ms(time)) return m.reply('Temps invalide !').then(t => setTimeout(() => t.delete(), 5000));
                                totalTime.push(ms(time));
                            }

                            msg.delete();
                            data.time = totalTime.reduce((a, c) => a + c);

                            status = 'winner';
                            msg = await message.channel.send(`Giveaway dure **${this.client.util.parseDur(data.time)}**, Ensuite, entrez le nombre de gagnants !`);
                            break;

                        case 'winner':
                            if (!parseInt(m.content)) return message.reply('Gagnant non valide !').then(t => setTimeout(() => t.delete(), 5000));

                            msg.delete();
                            data.winner = m.content;

                            collector.stop();
                            await this._createOption(message, data);
                            break;
                    }

                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 
     * @param {Message} message 
     * @param {*} data 
     * @returns 
     */
    _createOption(message, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const select = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`select-${message.id}`)
                            .addOptions([
                                {
                                    label: 'Role',
                                    description: 'Utilisation du rôle',
                                    value: 'ROLE'
                                },
                                {
                                    label: 'None',
                                    description: "N'utilisez aucune condition",
                                    value: 'NONE'
                                }
                            ])
                            .setPlaceholder("Sélectionnez l'option que vous souhaitez choisir !")
                    );

                const r = await message.channel.send({ content: "Sélectionnez l'option que vous souhaitez choisir !", components: [select] });
                const collector = r.channel.createMessageComponentCollector({ filter: m => m.user.id === message.author.id && m.componentType === ComponentType.StringSelect, time: 60_000 });
                collector.on('collect', async m => {
                    await m.deferUpdate();
                    data.values = m.values.shift();
                    collector.stop();
                    r.delete();

                    let msg = data.values === 'MEE6' ? await message.reply('Entrez le niveau requis !')
                        : data.values === 'ROLE' ? await message.reply('Veuillez saisir le rôle que vous souhaitez entrer (Name, RoleID)\n**Goûter**: Détendez-vous généreux, nitro boost, Se détendre')
                            : await message.reply('Entrez le titre !');

                    if (data.values === 'NONE') {
                        data.values = 'title';
                        data.require = { name: 'NONE' };
                    }

                    const collector2 = message.channel.createMessageCollector({ filter: c => c.author.id === message.author.id, time: 69_000 });
                    collector2.on('collect', async m => {
                        switch (data.values) {
                            case 'MEE6':
                                if (!parseInt(m.content)) return message.reply('Doit valoir le numéro !');

                                data.require = { name: 'MEE6', value: m.content };
                                data.values = 'title';

                                msg = await message.reply('Entrez le titre !');
                                break;

                            case 'ROLE':
                                const query = m.content;
                                const roles = query.split(',');
                                data.require = { name: 'ROLE', value: [] };

                                const roleTemp = data.require.value;
                                for (const role of roles) {
                                    if (role.length < 1) continue;
                                    const name = role.trim();

                                    const roleID = message.guild.roles.cache.get(name);
                                    const findRole = message.guild.roles.cache.find(a => a.name.toLowerCase() === name.toLowerCase());
                                    const roleRegex = new RegExp(name, "i");
                                    const findRegex = message.guild.roles.cache.find(a => roleRegex.test(a.name) ? roleRegex.test(a.name) : null);

                                    if (roleID) {
                                        roleTemp.push(roleID.id);
                                    } else if (findRole) {
                                        roleTemp.push(findRole.id);
                                    } else if (findRegex) {
                                        roleTemp.push(findRegex.id);
                                    } else {
                                        message.reply(`Role ${name} pas trouvé`);
                                        return;
                                    };
                                };

                                data.values = 'title';
                                msg = await message.reply('Entrez le titre !');
                                break;

                            case 'title':
                                if (m.content.length < 10) return message.reply('Au moins, le contenu du titre est de 10 caractères !').then(t => setTimeout(() => t.delete(), 5000));
                                msg.delete();
                                collector2.stop();

                                if (data.values === 'NONE') data.require = { name: 'NONE' };
                                data.title = m.content;
                                await this._createFinal(message, data);
                                break;
                        }
                    });
                });

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    };

    /**
     * 
     * @param {Message} message 
     * @param {*} data
     * @returns 
     */
    _createFinal(message, data) {
        return new Promise(async (resolve, reject) => {
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`**${data.title}**`)
                .addFields(
                    { name: 'Faite par:', value: `<@${message.author.id}>` },
                )
                .setFooter({ text: `${data.winner} Gagnant | Giveaway fini` })
                .setTimestamp(Date.now() + data.time)

            data.require.name === 'MEE6' ? embed.addFields({ name: 'Nécessaire :', value: `Niveau MEE6 - **${data.require.value}**` })
                : data.require.name === 'ROLE' ? embed.addFields({ name: 'Nécessaire :', value: `Role ${data.require.value.map(a => `<@&${a}>`).join(', ')}` })
                    : embed.addFields({ name: 'Nécessaire :', value: "**Il n'y en a pas**" });

            const buttons = new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setLabel('✔️')
                        .setStyle(ButtonStyle.Success)
                        .setCustomId(`y-${message.id}`)
                    ,
                    new ButtonBuilder()
                        .setLabel('❌')
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId(`n-${message.id}`)
                ]);
            const r = await message.channel.send({ content: 'Es-tu sûr ?', embeds: [embed], components: [buttons] });
            const collector = r.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60_000 });
            collector.on('collect', async m => {
                await m.deferUpdate();
                switch (m.customId) {
                    case `y-${message.id}`:
                        embed.addFields({ name: 'Entrées :', value: '0' });
                        const giveaway = await message.guild.channels.cache.get(data.channel).send({
                            content: '🎉- Giveaway -🎉', embeds: [embed], components: [
                                new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel('🎉')
                                            .setStyle(ButtonStyle.Success)
                                            .setCustomId('giveawayID')
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel('❌')
                                            .setStyle(ButtonStyle.Danger)
                                            .setCustomId('giveawayCancel')
                                    )
                            ]
                        });

                        await this.db.set(`${giveaway.id}`, {
                            messageID: giveaway.id,
                            guildID: message.guild.id,
                            channelID: data.channel,
                            time: {
                                start: Date.now(),
                                duration: data.time,
                            },
                            require: data.require,
                            winnerCount: parseInt(data.winner),
                            entries: [],
                            isDone: false,
                            embed: embed.toJSON(),
                        });
                        message.channel.send('A été envoyé avec succès !');
                        break;

                    case `n-${message.id}`:
                        message.channel.send('Annulé !');
                        break;
                }
                collector.stop();
            })

            resolve();
        });
    }

    /**
     * 
     * @param {Message} message 
     * @param {[]} args 
     * @returns 
     */
    reroll(message, args) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!args[1]) return message.reply('ID de message requis');
                const giveawayData = await this.db.get(args[1]);
                if (!giveawayData) return message.reply('Pas trouvé !');
                if (!giveawayData.isDone) return message.reply("Le cadeau n'est pas terminé !");

                const channel = this.client.channels.cache.get(giveawayData.channelID);
                const msg = await channel.messages.fetch(giveawayData.messageID);
                const entries = giveawayData.entries;
                const reroll = this.client.util.shuffle(entries);

                channel.send(`En toute sécurité <@${reroll.shift()}>!\n${msg.url}`);
                message.reply('Dirigé avec succès !');

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 
     * @param {Message} message 
     * @param {[]} args 
     * @returns 
     */
    getData(message, args) {
        return new Promise(async (resolve, reject) => {
            try {
                const giveaways = await this.db.all();
                const giveawayDataList = giveaways.map(a => a.value);
                if (!giveawayDataList.length) return message.reply('Rien de données !');

                const mapData = giveawayDataList.map(a => `[${a.messageID}](https://discord.com/channels/${a.guildID}/${a.channelID}/${a.messageID}) - ${a.embed.description} | ${a.isDone ? 'Telah Selesai' : 'Belum Selesai'}`);
                const chunkData = this.client.util.chunk(mapData, 10);

                let pagination = 1;
                const embede = new EmbedBuilder().setColor('Random').setTitle('Liste des cadeaux');

                embede.setDescription(chunkData[pagination - 1].join('\n'));
                embede.setFooter({ text: `Page ${pagination} of ${chunkData.length}` });

                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('< Retour')
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(args[0] + 'back' + message.id),
                        new ButtonBuilder()
                            .setLabel('Suivant >')
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(args[0] + 'next' + message.id),
                        new ButtonBuilder()
                            .setLabel('🗑️')
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId(args[0] + 'delete' + message.id)
                    )

                const m = await message.channel.send({ embeds: [embede], components: [button] });
                const collector = m.channel.createMessageComponentCollector({ filter: msg => msg.user.id === message.author.id, time: 60000 });
                collector.on('collect', async (i) => {
                    switch (i.customId) {
                        case args[0] + 'back' + message.id:
                            if (pagination === 0) return;
                            pagination--;
                            embede.setDescription(chunkData[pagination - 1].join('\n'));
                            embede.setFooter({ text: `Page ${pagination} de ${chunkData.length}` });
                            m.edit({ embeds: [embede], components: [button] });
                            break;

                        case args[0] + 'next' + message.id:
                            if (pagination === chunkData.length) return;
                            pagination++;
                            embede.setDescription(chunkData[pagination - 1].join('\n'));
                            embede.setFooter({ text: `Page ${pagination} de ${chunkData.length}` });
                            m.edit({ embeds: [embede], components: [button] });
                            break;

                        case args[0] + 'delete' + message.id:
                            m.delete();
                            break;
                    };

                    await i.deferUpdate();
                });

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    end(message, args) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!args[1]) return message.reply('ID de message requis');
                const giveawayDataEnd = await this.db.get(args[1]);
                if (!giveawayDataEnd) return message.reply('Pas trouvé !');
                if (giveawayDataEnd.isDone) return message.reply('Giveaway déjà terminé !');

                giveawayDataEnd.time.duration = 0;
                await this.db.set(args[1], giveawayDataEnd);

                message.reply('A été arrêté, attendez 1 à 10 secondes !').then(t => setTimeout(() => t.delete(), 5000));

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    delete(message, args) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!args[1]) return message.reply('ID de message requis !');
                const giveawayDataDelete = await this.db.get(args[1]);
                if (!giveawayDataDelete) return message.reply('Pas trouvé !');
                if (!giveawayDataDelete.isDone) return message.reply(`Giveaway n'est pas encore terminé, pls finit d'abord le cadeau !`).then(a => a.delete({ timeout: 5000 }));

                await this.db.delete(args[1]);
                message.reply(`A été supprimé !`);

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 
     */
    async __timeHandler() {
        const giveaways = await this.db.all();
        const allGiveaway = giveaways.map(a => a.value);
        for (const data of allGiveaway) {
            const channel = this.client.channels.cache.get(data.channelID);
            if (!channel) continue;
            const timeLeft = Date.now() - data.time.start;

            if (timeLeft > data.time.duration) {
                if (data.isDone) continue;

                const msg = await channel.messages.fetch(data.messageID);
                if (data.entries.length === 0) {
                    data.isDone = true;
                    data.embed.fields[3] = { name: 'Gagnant :', value: 'Personne ne gagne', inline: false };

                    msg.edit({ content: '**🎉- Giveaway Fini -🎉**', embeds: [data.embed] });
                    await this.db.set(data.messageID, data);

                    return this.client.channels.cache.get(data.channelID).send(`Personne n'a gagné à cause de zéro participants !`);
                };

                const winLength = data.winnerCount;
                const win = this.client.util.shuffle(data.entries);
                const winners = win.slice(0, winLength);

                data.isDone = true;
                data.embed.fields[3] = { name: 'Gagnants :', value: winners.map(a => `<@${a}>`).join(', '), inline: false };

                msg.edit({ content: '**🎉- Giveaway Fini -🎉**', embeds: [data.embed] });
                this.client.channels.cache.get(data.channelID).send({ content: `Bravo ${winners.map(a => `<@${a}>`).join(', ')}!\n${msg.url}`, allowedMentions: { parse: ["users"] } });

                await this.db.set(data.messageID, data);
            }
        }
    }

    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @returns Promise<void>
     */
    giveawayValidator(interaction) {
        return new Promise(async (resolve, reject) => {
            if (interaction.customId != 'giveawayID') return;
            await interaction.deferUpdate();
            const data = await this.db.get(interaction.message.id);

            if (!data) return interaction.followUp({ content: "Le cadeau n'est pas trouvé !", ephemeral: true });
            if (data.isDone) return interaction.followUp({ content: 'Le cadeau est terminé !', ephemeral: true });
            if (data.entries.includes(interaction.user.id)) return interaction.followUp({ content: 'Vous avez suivi ce cadeau !', ephemeral: true });

            let isOK = null;
            switch (data.require.name) {
                case 'ROLE':
                    const requireRole = data.require.value;
                    const rolePlayer = interaction.member.roles.cache;
                    for (const role of requireRole) if (rolePlayer.has(role)) isOK = true;
                    break;

                default:
                    isOK = true;
                    break;
            }

            if (!isOK) return interaction.user.send('Les termes ne suffisent pas !');
            data.entries.push(interaction.user.id);
            data.embed.fields[2].value = `${data.entries.length}`;

            await interaction.message.edit({ embeds: [data.embed] });
            await this.db.set(data.messageID, data);

            interaction.followUp({ content: 'Enregistré avec succès dans le cadeau !', ephemeral: true });
            resolve();
        });
    }

    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    giveawayCancel(interaction) {
        return new Promise(async (resolve, reject) => {
            if (interaction.customId !== 'giveawayCancel') return;
            await interaction.deferUpdate();
            const data = await this.db.get(interaction.message.id);
            if (!data) return interaction.followUp({ content: "Le cadeau n'est pas trouvé !", ephemeral: true });
            if (data.isDone) return interaction.followUp({ content: 'Le cadeau est terminé !', ephemeral: true });
            if (!data.entries.includes(interaction.user.id)) return interaction.followUp({ content: "Vous n'avez pas suivi ce cadeau !", ephemeral: true });

            data.entries.splice(data.entries.indexOf(interaction.user.id), 1);
            data.embed.fields[2].value = `${data.entries.length}`;

            await interaction.message.edit({ embeds: [data.embed] });
            await this.db.set(data.messageID, data);

            interaction.followUp({ content: 'A réussi à sortir du cadeau !', ephemeral: true });
        });
    }

    async init() {
        setInterval(() => this.__timeHandler(), this.interval);
        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;

            switch (interaction.customId) {
                case 'giveawayID':
                    this.giveawayValidator(interaction);
                    break;
                case 'giveawayCancel':
                    this.giveawayCancel(interaction);
                    break;
                default:
                    break;
            }
        });
    }
}