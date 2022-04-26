const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Spielt Musik in einem Sprachkanal ab")
    .addSubcommand((subcommand) =>
        subcommand
        .setName("song")
        .setDescription("YouTube-Link")
        .addStringOption((option) => option.setName("url").setDescription("YouTube-URL").setRequired(true))
    )
    
    .addSubcommand((subcommand) => 
        subcommand
        .setName("playlist")
        .setDescription("YouTube-Playist-Link")
        .addStringOption((option) => option.setName("url").setDescription("Playlist-URL").setRequired(true))
    )

    .addSubcommand((subcommand) => 
        subcommand
        .setName("search")
        .setDescription("Sucht nach dem Song auf YouTube, Spotify & Co.")
        .addStringOption((option) => option.setName("query").setDescription("Songtitel").setRequired(true))
        
    ), run: async ({ client, interaction }) => {
    if (!interaction.member.voice.channel) 
        return interaction.editReply("Du musst dich in einem Sprachkanal befinden, um diesen Befehl nutzen zu können.")
    
    const queue = await client.player.createQueue(interaction.guildId)
    if (!queue.connection) await queue.connect(interaction.member.voice.channel)

    let embed = new MessageEmbed()

    if (interaction.options.getSubcommand() == "song") {
        let url = interaction.options.getString("url")
        const result = await client.player.search(url, { 
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_VIDEO
        })

        if (result.tracks.length == 0)
            return interaction.editReply("Ich habe leider nichts gefunden.")

        const song = result.tracks[0]
        await queue.addTrack(song)

        embed
            .setColor("ORANGE")
            .setDescription(`**[${song.title}](${song.url})** wurde zur Wiedergabeliste hinzugefügt.`)
            .setThumbnail(song.thumbnail)
            .setFooter({text: `Dauer: ${song.duration}`})

    } else if (interaction.options.getSubcommand() == "playlist") {

        let url = interaction.options.getString("url")
        const result = await client.player.search(url, { 
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_PLAYLIST
        })

        if (result.tracks.length == 0)
            return interaction.editReply("Ich habe leider nichts gefunden.")

        const playlist = result.playlist
        await queue.addTracks(result.tracks)

        embed
            .setColor("ORANGE")
            .setDescription(`**${result.tracks.length}** Songs aus [${playlist.title}](${playlist.url}) zur Wiedergabeliste hinzugefügt.`)
            .setThumbnail(playlist.thumbnail)
        } else if (interaction.options.getSubcommand() == "search") {

        let query = interaction.options.getString("query")
        const result = await client.player.search(query, { 
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })

        if (result.tracks.length == 0)
            return interaction.editReply("Nichts gefunden.")

        const song = result.tracks[0]
        await queue.addTrack(song)

        embed
            .setColor("ORANGE")
            .setDescription(`**[${song.title}](${song.url})** wurde zur Wiedergabeliste hinzugefügt.`)
            .setThumbnail(song.thumbnail)
            .setFooter({text: `Dauer: ${song.duration}`})
        } 
        
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed] 
        })

    },

}
