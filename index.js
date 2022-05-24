const Discord = require("discord.js")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("node:fs")
const { Player } = require("discord-player")
const dotenv = require("dotenv")
const generateImage = require("./generateImage.js")

dotenv.config();
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID

const client = new Discord.Client ({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_VOICE_STATES"
    ]
})

client.slashCommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

const commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashCommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)

    try {
        console.log("Deploying slash commands")
        rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), 
                { body: commands }, 
            );

        console.log("Successfully loaded slash commands")

       } catch (error) {
           console.error(error);
       }

} else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
        client.user.setActivity("Shakugan no Shana", {type: "WATCHING"})
    })

    const welcomeChannelId = "968557012852035614"

    client.on("guildMemberAdd", async (member) => {
        const img = await generateImage(member)
        member.guild.channels.cache.get(welcomeChannelId).send({
            files: [img]
        })      
    })

    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
        if (!interaction.isCommand()) return    
        
        const slashcmd = client.slashCommands.get(interaction.commandName)
        if (!slashcmd) interaction.reply("Ungültiger Slash-Befehl.")
        
        await interaction.deferReply()
        await slashcmd.run({ client, interaction })
    }
    handleCommand()       
    })
    client.login(TOKEN)
}

