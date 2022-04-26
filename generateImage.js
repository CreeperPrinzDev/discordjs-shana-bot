const Canvas = require("canvas")
const Discord = require("discord.js")
const bg = "https://i.imgur.com/diSAq8O.jpg"

const dim = {
    height: 675,
    width: 1200,
    margin: 50
}

const av = {
    size: 256,
    x: 480,
    y: 170
}

const generateImage = async (member) => {
    let username = member.user.username
    let discrim = member.user.discriminator
    let avatarURL = member.user.displayAvatarURL({format: "png", dynamic: false, size: av.size})

    const canvas = Canvas.createCanvas(dim.width, dim.height)
    const ctx = canvas.getContext("2d")


    //draw background
    const backdrop = await Canvas.loadImage(bg)
    ctx.drawImage(backdrop, 0, 0)

    //draw black tinted box
    ctx.fillStyle = "rgba(0,0,0,0.8)"
    ctx.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

    //draw avatar
    const avimg = await Canvas.loadImage(avatarURL)
    ctx.save()

    ctx.beginPath()
    ctx.arc(av.x + av.size / 2, av.y + av.size /2, av.size /2, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(avimg, av.x, av.y)
    ctx.restore()

    // render text
    ctx.fillStyle = "white"
    ctx.textAlign = "center"

    // draw welcome
    ctx.font = "bold 50px Palatino Linotype"
    ctx.fillText("Willkommen,", dim.width / 2, dim.margin + 70)

    //draw username
    ctx.font = "bold 60px Palatino Linotype"
    ctx.fillText(username + "#" + discrim, dim.width / 2, dim.height - dim.margin - 125)

    //draw in server
    ctx.font = "bold 40px Palatino Linotype"
    ctx.fillText("Viel Spaß in Alaxis Dub Werkstatt!", dim.width / 2, dim.height - dim.margin - 50)

    //convert to attachment
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png")
    return attachment

}

module.exports = generateImage