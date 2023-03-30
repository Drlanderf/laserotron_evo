const Canvas = require("@napi-rs/canvas");
const {
  AttachmentBuilder,
  GuildMember,
  Client,
  DiscordAPIError,
} = require("discord.js");
const Guild = require(`../../../schemas/guild`);
const {
  getCounterChannelName,
} = require("../../../functions/tools/getCounterChannelName");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    /**************************************************************************/
    let guildProfile = await Guild.findOne({
      guildId: member.guild.id,
    });
    /**************************************************************************/
    const MyWelcomeChannelID = guildProfile.guildJoinChannel;
    const MyCustomWelcomeMessage = guildProfile.customWelcomeMessage;
    const myGuildCountChannel = guildProfile.guildCountChannel;
    const welcomeChannel = client.channels.cache.get(`${MyWelcomeChannelID}`);
    //const countChannelName = client.channels.cache.get(`1088547089807581204`); //=> brut version
    const countChannelName = client.channels.cache.get(
      `${myGuildCountChannel}`
    ); //=>DB version
    /**************************************************************************/
    const canvas = Canvas.createCanvas(1024, 500);
    let ctx = canvas.getContext("2d");
    //Setup of the background
    const background = await Canvas.loadImage(
      `${process.cwd()}/assets/img/bg.png`
    );
    ctx.drawImage(background, 0, 0, 1024, 500);
    ctx.beginPath();
    ctx.arc(512, 245, 128, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.fill();
    /**************************************************************************/
    //Name of the user in the canvas
    ctx.font = "42px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(member.user.tag.toUpperCase(), 512, 420);
    /**************************************************************************/
    //Avatar of the user in the canvas
    ctx.beginPath();
    ctx.arc(512, 245, 119, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    //Taking the avatar picture
    let avatar = await Canvas.loadImage(
      member.user.displayAvatarURL({ size: 1024, format: "png" })
    );
    ctx.drawImage(avatar, 393, 125, 238, 238);
    /**************************************************************************/
    //Making a new attachment with a custom name signature
    const attachment = new AttachmentBuilder(await canvas.encode(`png`), {
      name: "made_by_doc_landerf.png",
    });
    /* ------------------------------------------------------------
              Update the counter
              ID :	channel,
              DATA use : myGuildCountChannel.
         ------------------------------------------------------------ */
    if (myGuildCountChannel) {
      const newCountName = getCounterChannelName(`${member.guild.memberCount}`);
      countChannelName.setName(newCountName);
    }
    /* ------------------------------------------------------------
      Try to send the welcome message
     ------------------------------------------------------------ */
    try {
      /* ------------------------------------------------------------
              Send the message to the welcome channel
              ID :	welcomeChannel,
              DATA use : member, embed, file.
         ------------------------------------------------------------ */
      welcomeChannel.send({
        content: `:wave::skin-tone-2: Hey ${member},\n${MyCustomWelcomeMessage}`,
        files: [attachment],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
