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
    console.log(
      Date(Date.now()).toString() +
      " [Event] guildMemberRemove : successfully called"
    );
    if (!MyLeavingChannelID) {
      console.error(
        Date(Date.now()).toString() +
        ` [Event] guildMemberRemove : The guild ID [${member.guild.id}] No Leaving Channel configured.`
      );
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
      if (member.partial) {
        /*member = await member
          .fetch()
          .then((fullMember) => {
            console.log(
              Date(Date.now()).toString() +
              " [Event] guildMemberRemove (PARTIAL): member fetched " +
              "(" +
              fullMember +
              " )"
            );
          })
          .catch((error) => {
            console.log(
              Date(Date.now()).toString() +
              " [Event] guildMemberRemove (PARTIAL): Something went wrong when fetching the member: ",
              error
            );
          });*/
        const msg = WelcomeChannel.send(`<@${member.id}> a été placé dans une cuve de VEF. <a:VEF:695250802465439745>`).catch((error) => {
          console.log(
            Date(Date.now()).toString() +
            " [Event] guildMemberRemove (PARTIAL): Something went wrong when sending the message: ",
            error
          );
        });
        const reactionEmoji = msg.guild.emojis.cache.find(
          (emoji) => emoji.name === "VEF"
        );
        await msg.react(reactionEmoji).catch((error) => {
          console.log(
            Date(Date.now()).toString() +
            " [Event] guildMemberRemove (PARTIAL): Something went wrong when react to the message: ",
            error
          );
        });
        console.log(
          Date(Date.now()).toString() +
          " [Event] guildMemberRemove (PARTIAL): successfully finish " +
          member.user.tag
        );
      } else {
        const msg = await WelcomeChannel.send(
          `<@${member.id}> a été placé dans une cuve de VEF. <a:VEF:695250802465439745>`
        );
        const reactionEmoji = msg.guild.emojis.cache.find(
          (emoji) => emoji.name === "VEF"
        );
        await msg.react(reactionEmoji);
        console.log(
          Date(Date.now()).toString() +
          " [Event] guildMemberRemove : successfully finish " +
          member.user.tag
        );
      }
    } catch (error) {
      console.log(
        Date(Date.now()).toString() + " [Event] guildMemberRemove : yousk2 :",
        error
      );
    }
  },
};
