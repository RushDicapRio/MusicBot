module.exports = async (client, queue, err) => {
    console.log(err);
    console.log(`Erreur de connexion dans ${queue.guild.name} | ${queue.guild.id}`);
}