const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stoppt die Wiedergabe und leert die Wiedergabeliste"),
    
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) 
            return await interaction.editReply("Es befinden sich keine Songs in der Wiedergabeliste.")
        
        queue.destroy()
        await interaction.editReply("Die Wiedergabe wurde gestoppt.")
    }, 

}