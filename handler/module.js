const { Collection } = require("discord.js");
const fs = require("fs");

module.exports = client => {
    client.commands = new Collection();
    client.aliases = new Collection();
    client.helps = new Collection();

    fs.readdir("./commands/", (err, categories) => {
        if (err) console.log(err);
        console.log(`Trouvé ${categories.length} Catégorie de dossiers.`);
        categories.forEach(category => {
            const moduleConf = require(`../commands/${category}/module.json`);
            moduleConf.path = `./commands/${category}`;
            moduleConf.cmds = [];
            client.helps.set(category, moduleConf);
            if (!moduleConf) return;
            fs.readdir(`./commands/${category}`, (err, files) => {
                console.log(
                    `Trouvé ${files.length - 1} commande du dossier ${category}.`
                );
                if (err) console.log(err);
                files.forEach(file => {
                    if (!file.endsWith(".js")) return;
                    const prop = require(`../commands/${category}/${file}`);
                    client.commands.set(prop.help.name, prop);
                    prop.conf.aliases.forEach(alias => {
                        client.aliases.set(alias, prop.help.name);
                    });
                    client.helps.get(category).cmds.push(prop.help.name);
                });
            });
        });
    });
};