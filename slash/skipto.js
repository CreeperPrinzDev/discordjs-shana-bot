const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Springt zur angegebenen Songnummer")
    .addNumberOption((option) => 
        option.setName("track").setDescription("Songnummer").setMinValue(1).setRequired(true)),
    
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) 
            return await interaction.editReply("Es befinden sich keine Songs in der Wiedergabeliste.")
    

        const track = interaction.options.getNumber("track")
        if (track > queue.tracks.length) 
            await interaction.editReply("Diese Nummer gibt es nicht.")
        queue.skipTo(track - 1)
        await interaction.editReply(`Songs bis Track ${track} wurden übersprungen.`)
    }, 

}