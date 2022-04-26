const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Ordnet die Songs in der Wiedergabeliste neu"),
    
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) 
            return await interaction.editReply("Es befinden sich keine Songs in der Wiedergabeliste.")
        
        queue.shuffle()
        await interaction.editReply("Die Songreihenfolge ist nun neu angeordnet.")
    }, 

}