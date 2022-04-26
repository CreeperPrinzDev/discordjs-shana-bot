const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausiert die Wiedergabe"),
    
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) 
            return await interaction.editReply("Es befinden sich keine Songs in der Wiedergabeliste.")
        
        queue.setPaused(true)
        await interaction.editReply("Die Wiedergabe ist nun pausiert! Benutze `/resume`, um die Wiedergabe fortzusetzen.")
    }, 

}