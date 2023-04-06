const { GuildMember, Client } = require("discord.js");
const Guild = require(`../../../schemas/guild`);
const {
  getCounterChannelName,
} = require("../../../functions/tools/getCounterChannelName");
module.exports = {
  name: "guildMemberRemove",
  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    let guildProfile = await Guild.findOne({
      guildId: member.guild.id,
    });
    const MyLeavingChannelID = guildProfile.guildLeavingChannel;
    const myGuildCountChannel = guildProfile.guildCountChannel;
    //const countChannelName = client.channels.cache.get(`1088547089807581204`); //=> brut version
    const countChannelName = client.channels.cache.get(
      `${myGuildCountChannel}`
    ); //=>DB version
    console.log("[Event] guildMemberRemove : successfully apply");
    if (!MyLeavingChannelID) {
      console.error(`[${member.guild.id}] No Leaving Channel configured.`);
      return;
    }
    const WelcomeChannel = client.channels.cache.get(MyLeavingChannelID);
    /* ------------------------------------------------------------
              Update the counter
              ID :	channel,
              DATA use : myGuildCountChannel.
         ------------------------------------------------------------ */
    /*if (myGuildCountChannel) {
      const newCountName = getCounterChannelName(`${member.guild.memberCount}`);
      countChannelName.setName(newCountName);
    }*/ //=> not working
    /* ------------------------------------------------------------
          Try to send the welcome message
       ------------------------------------------------------------ */
    try {
      /* ------------------------------------------------------------
              Send the message to the welcome channel
              ID :	welcomeChannel,
              DATA use : member.id.
         ------------------------------------------------------------ */
      const msg = await WelcomeChannel.send(
        `<@${member.id}> a été placé dans une cuve de VEF. <a:VEF:695250802465439745>`
      );
      const reactionEmoji = msg.guild.emojis.cache.find(emoji => emoji.name === 'VEF');
      await msg.react(reactionEmoji);

    } catch (error) {
      console.log(error);
    }

  },
};
