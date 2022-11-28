const { Message } = require("discord.js");
const chalk = require("chalk");
const Guild = require(`../../../schemas/guild`);
const { sendLogMessage } = require("../../../functions/tools/sendLogMessage");
module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    try {
      await sendLogMessage(
        {
          author: message.member.user,
          guild: message.guild,
          content: message.content,
        },
        `Message create log`,
        client
      );
    } catch (e) {
      console.error(e);
    }
  },
};
