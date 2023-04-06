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
    const guild = member.guild;
    const MyWelcomeChannelID = guildProfile.guildJoinChannel;
    const MyCustomWelcomeMessage = guildProfile.customWelcomeMessage;
    const myGuildCountChannel = guildProfile.guildCountChannel;
    const welcomeChannel = client.channels.cache.get(`${MyWelcomeChannelID}`);
    //const countChannelName = client.channels.cache.get(`1088547089807581204`); //=> brut version
    const countChannelName = client.channels.cache.get(
      `${myGuildCountChannel}`
    ); //=>DB version
    // On récupère l'invitation utilisée pour inviter le membre
    const invites = await member.guild.invites.fetch();
    const invite = invites.find(inv => inv.uses < inv.maxUses);

    // On récupère l'utilisateur qui a créé l'invitation
    const inviter = invite ? await member.guild.members.fetch(invite.inviter.id) : null;
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
      Try to send the welcome message
     ------------------------------------------------------------ */
    try {
      /* ------------------------------------------------------------
              Update the counter
              ID :	channel,
              DATA use : myGuildCountChannel.
         ------------------------------------------------------------ */
      /*if (myGuildCountChannel) {
        const newCountName = getCounterChannelName(`${member.guild.memberCount}`);
        countChannelName.setName(newCountName);
      }
      /* ------------------------------------------------------------
              Send the message to the welcome channel
              ID :	welcomeChannel,
              DATA use : member, embed, file.
         ------------------------------------------------------------ */
      const inv = inviter ? `Tu as été invité par ${inviter.inviter}` : 'Malheureusement, nous ne savons pas qui t\'a invité';
      const msg = await welcomeChannel.send({
        content: `:wave::skin-tone-2: Hey ${member},\n${MyCustomWelcomeMessage}\n:arrow_right: **Invité par** : ${inv}\n:arrow_right: **Le serveur compte désormait :** `+getCounterChannelName(`${member.guild.memberCount}`),
        files: [attachment],
      });
      const reactionEmoji = msg.guild.emojis.cache.find(emoji => emoji.name === 'DrapeauEnclave');
      await msg.react(reactionEmoji);
    } catch (error) {
      console.log(error);
    }
  },
};
