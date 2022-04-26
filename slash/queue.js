const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Zeigt die aktuelle Wiedergabeliste an")
    .addNumberOption((option) => option.setName("page").setDescription("Seitennummer der Wiedergabeliste").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        
        if (!queue || !queue.playing) {
            return await interaction.editReply("Die Wiedergabeliste ist leer.")            
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages) 
            return await interaction.editReply("Diese Seite existiert nicht.")
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}. \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`  
        })

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor("ORANGE")
                    .setDescription(`**Aktuell läuft:**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "Nichts")
                    + `\n\n**Wiedergabeliste:**\n${queueString.join("\n")}`)
                    .setFooter({text: `Seite ${page + 1} von ${totalPages}`})
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}