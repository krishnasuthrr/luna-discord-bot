const { SlashCommandBuilder } = require("discord.js")


// all servers (prod)
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!."),
  async execute(interaction) {
    await interaction.reply("pong!");
  },
};