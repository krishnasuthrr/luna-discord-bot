// commands/utility/heavyquery.js
const { SlashCommandBuilder } = require("discord.js");

// eslint-disable-next-line no-undef
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("heavyquery")
    .setDescription("Simulates a long-running database query."),

  async execute(interaction) {
    // 1. Acknowledge immediately.
    // We set ephemeral to true HERE so the "thinking..." message is private.
    await interaction.deferReply({ ephemeral: true });

    try {
      // 2. Perform the heavy backend lifting
      console.log("Querying database...");
      await sleep(5000); // Simulating a 5-second MongoDB aggregation

      // 3. Resolve the deferral
      // We DO NOT use ephemeral here. We just edit the existing private message.
      await interaction.editReply({
        content: "Data fetched successfully! Here are your private results.",
      });
    } catch {
      // 4. Graceful heavy error handling
      // If the DB crashes after 4 seconds, we still need to update the UI.
      await interaction.editReply({
        content: "The database connection timed out.",
      });
    }
  },
};
