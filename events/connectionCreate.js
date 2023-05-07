const { Client } = require('discord.js');
const { Queue, StreamDispatcher } = require('discord-player');

/**
 * Emitted when a connection is created.
 * @param {Client} client 
 * @param {Queue} queue 
 * @param {StreamDispatcher} connection 
 */
module.exports = async (client, queue, connection) => {
    console.log(`Connexion créée dans ${queue.guild.name} | ${queue.guild.id}`);
}