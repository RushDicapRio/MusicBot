const { Client, ActivityType } = require('discord.js');
/**
 * 
 * @param {Client} client 
 */
module.exports = client => {
    console.log(`connecté en tant que ${client.user.tag}!`);
    client.user.setActivity({ name: "Saez", type: ActivityType.Competing });
    client.user.setStatus('dnd');
}