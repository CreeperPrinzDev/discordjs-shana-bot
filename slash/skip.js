const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Überspringt den aktuellen Song"),
    
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) 
            return await interaction.editReply("Es befinden sich keine Songs in der Wiedergabeliste.")
        
        const currentSong = queue.current
        queue.skip()
        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                .setColor("ORANGE")
                .setDescription(`${currentSong.title} wurde übersprungen.`)
                .setThumbnail(currentSong.thumbnail)
            ]
        })
    }, 

}