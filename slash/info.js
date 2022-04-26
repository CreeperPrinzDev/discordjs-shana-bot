const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Zeigt Infos zum aktuellen Song an"),
    
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) 
            return await interaction.editReply("Es befinden sich keine Songs in der Wiedergabeliste.")
        
        let bar = queue.createProgressBar({
            queue: false,
            length: 19,
        })

        const song = queue.current

        await interaction.editReply({

            embeds: [
                new MessageEmbed()
                .setColor("ORANGE")
                .setThumbnail(song.thumbnail)
                .setDescription(`**Aktuell läuft:**\n[${song.title}](${song.url}) --<@${song.requestedBy.id}>\n\n` + bar)
                .setFooter({ text: `Dauer: ${song.duration}`})
            ],
        })
    }, 
}