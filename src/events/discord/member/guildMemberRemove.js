const { GuildMember, Client } = require("discord.js");
const Guild = require(`../../../schemas/guild`);
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
    console.log("[Event] guildMemberRemove : successfully apply");
    if (!MyLeavingChannelID) {
      console.error(`[${member.guild.id}] No Leaving Channel configured.`);
      return;
    }
    const WelcomeChannel = client.channels.cache.get(MyLeavingChannelID);
    try {
      WelcomeChannel.send(`<@${member.id}> a été placé dans une cuve de VEF. <a:VEF:695250802465439745>`);
    } catch (error) {
      console.log(error);
    }
  },
};
