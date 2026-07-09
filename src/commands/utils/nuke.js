const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  MessageFlags
} = require("discord.js");


// all servers (prod)
module.exports = {
  // 1. The Schema / Route Definition
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("Deletes up to 100 messages in the current channel.")

    // RBAC: Only users with the "Manage Messages" server permission can see this.
    // It prevents your server from having to check permissions manually.
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    // Context: This command makes no sense in a Direct Message.
    // We restrict it to ONLY be usable inside a Server (Guild).
    .setContexts(InteractionContextType.Guild)  // alternative to deprecated setDMPermission()

    // Safety: We keep this false for standard utility commands.
    .setNSFW(false)

    // We add an option to let the admin specify HOW MANY messages to delete
    .addIntegerOption(
      (option) =>
        option
          .setName("amount")
          .setDescription("Number of messages to delete (1-100)")
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100),
    ),

  // 2. The Controller / Execution
  async execute(interaction) {
    // Since we restricted contexts to Guilds, we know interaction.channel exists.
    // Since we set Min/Max values, we know the amount is perfectly valid.

    const amount = interaction.options.getInteger("amount");

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {

      const botId = interaction.client.user.id;

      const botMember = await interaction.member.guild.members.fetch(botId);

      if (!botMember.permissions.has(PermissionFlagsBits.Administrator)) {
        return await interaction.editReply({
          content:
            "❌ I cannot execute this command because I am missing the **Administrator** permission on this server!",
          flags: [MessageFlags.Ephemeral],
        });
      }

      // standard discord.js method to bulk delete messages
      const deleted = await interaction.channel.bulkDelete(amount, true);

      await interaction.editReply({
        content: `Successfully nuked ${deleted.size} messages.`,
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: "Failed to nuke messages." });
    }
  },
};
