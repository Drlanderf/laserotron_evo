const { ActivityType } = require("discord.js");

/**
 * @type {{type: ActivityType; text: string; status: string}[]}
 */
const activities = [
  //
  {
    type: 3,
    text: "Sers l'enclave",
    status: "online",
  },
  {
    type: 2,
    text: "Se recharge...",
    status: "idle",
  },
  {
    type: 0,
    text: "Plonge des intruts dans du VEF",
    status: "dnd",
  },
];
async function pickPresence(client) {
  const choice = activities[Math.trunc(Math.random() * activities.length)];
  await client.user.setPresence({
    activities: [
      {
        name: choice.text,
        type: choice.type,
      },
    ],
    status: choice.status,
  });
}
module.exports = { pickPresence };
