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
    const myGuildCountChannel = guildProfile.guildCountChannel;
    console.log("[Event] guildMemberRemove : successfully apply");
    if (!MyLeavingChannelID) {
      console.error(`[${member.guild.id}] No Leaving Channel configured.`);
      return;
    }
    const WelcomeChannel = client.channels.cache.get(MyLeavingChannelID);
    //Try to send the welcome message + update the counter
    try {

      //let channel = client.channels.cache.get(`1088547089807581204`); //=> brut version
      let channel = client.channels.cache.get(`${myGuildCountChannel}`); //=> DB version
      channel.setName(`Membres : ${member.guild.memberCount}`)
      WelcomeChannel.send(`<@${member.id}> a été placé dans une cuve de VEF. <a:VEF:695250802465439745>`);
    } catch (error) {
      console.log(error);
    }
  },
};
