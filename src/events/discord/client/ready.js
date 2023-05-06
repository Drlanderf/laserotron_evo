const ascii = require("ascii-table");
const { loadCommands } = require("../../../functions/handlers/handleCommands");
const { checkDBGuildId } = require("../../../functions/mongo/checkDBGuildId");
const { pickPresence } = require("../../../functions/tools/pickPresence");
const Guild = require(`../../../schemas/guild`);
const { Client, Collection, Partials, GuildMember,GuildMemberManager } = require("discord.js");
const wait = require("timers/promises").setTimeout;
module.exports = {
  name: "ready",
  async execute(client) {
    await wait(1000);
    const table = new ascii().setHeading("Logged into Discord as");
    table.addRow(`${client.user.tag} - ${client.user.id}`);
    console.log(table.toString());
    await loadCommands(client);
    await checkDBGuildId(client);
    await pickPresence(client);
    /* ------------------------------------------------------------
		Sync all member with the cache of the bot
	   ------------------------------------------------------------ */
    await client.guilds.cache.forEach((guild) => {
      guild.members.fetch()
        .then(()=>console.log(Date(Date.now()).toString() +"[Event] Ready : Fetching members for guild "+guild.name))
        .catch(console.error);
    });
    setInterval(() => pickPresence(client), 15 * 1000);
  },
};
