const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Stezt die Wiedergabe fort"),
    
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) 
            return await interaction.editReply("Es befinden sich keine Songs in der Wiedergabeliste.")
        
        queue.setPaused(false)
        await interaction.editReply("Die Wiedergabe läuft wieder. Benutze `/pause`, um die Wiedergabe zu pausieren.")
    }, 

}