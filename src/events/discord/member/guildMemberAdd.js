const Canvas = require("@napi-rs/canvas");
const { AttachmentBuilder, GuildMember, Client } = require("discord.js");
const Guild = require(`../../../schemas/guild`);

const welcomeCanvas = {};
welcomeCanvas.create = Canvas.createCanvas(1024, 500);
welcomeCanvas.context = welcomeCanvas.create.getContext("2d");
welcomeCanvas.context.font = "68px sans-serif";
welcomeCanvas.context.fillStyle = "#ffffff";
Canvas.loadImage(`${process.cwd()}/assets/img/The_Enclave_Flag_(Fallout).png`).then(async (img) => {
  welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500);
  //welcomeCanvas.context.fillText("Bienvenue", 350, 75);
  welcomeCanvas.context.beginPath();
  welcomeCanvas.context.arc(512, 245, 128, 0, Math.PI * 2, true);
  welcomeCanvas.context.stroke();
  welcomeCanvas.context.fill();
});

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {

    let guildProfile = await Guild.findOne({
      guildId: member.guild.id,
    });

    const MyWelcomeChannelID = guildProfile.guildJoinChannel;
    const MyCustomWelcomeMessage = guildProfile.customWelcomeMessage;
    const welcomeChannel = client.channels.cache.get(`${MyWelcomeChannelID}`);

    let canvas = welcomeCanvas;
    canvas.context.font = "42px sans-serif";
    canvas.context.textAlign = "center";
    canvas.context.fillText(member.user.tag, 512, 420);
    canvas.context.font = "28px sans-serif";
    canvas.context.beginPath();
    canvas.context.arc(512, 245, 119, 0, Math.PI * 2, true);
    canvas.context.closePath();
    canvas.context.clip();

    await Canvas.loadImage(
      member.user.displayAvatarURL({ size: 1024, format: "png" })
    ).then((img) => {
      canvas.context.drawImage(img, 393, 125, 238, 238);
    });

    const attachment = new AttachmentBuilder(
      await welcomeCanvas.create.encode("png"),
      { name: "made_by_doc_landerf.png" }
    );

    try {
      welcomeChannel.send({
        content: `:wave::skin-tone-2: Hey ${member},\n${MyCustomWelcomeMessage},\n Tu es le ${member.guild.memberCount}éme membre.s`,
        files: [attachment],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
