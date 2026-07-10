const { SlashCommandBuilder, InteractionContextType } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("student")
        .setDescription("Insert student information")
        .setContexts(InteractionContextType.Guild)

        .addSubcommand((subcommand) =>
        subcommand
            .setName("name")
            .setDescription("Get student name")
            .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("enter your name")
                .setRequired(true)
                .setMinLength(2)
                .setMaxLength(20),
            ),
        )

        .addSubcommand((subcommand) =>
        subcommand
            .setName("roll-number")
            .setDescription("Get student roll number")
            .addIntegerOption((option) =>
            option
                .setName("roll-no")
                .setDescription("enter your roll number")
                .setRequired(true),
            ),
        )

        .addSubcommand((subcommand) =>
        subcommand
            .setName("above-18")
            .setDescription("Student age validation")
            .addBooleanOption((option) =>
            option
                .setName("above-18")
                .setDescription("is your age above 18?")
                .setRequired(true),
            ),
        )

        .addSubcommand((subcommand) =>
        subcommand
            .setName("section")
            .setDescription("Set student section")
            .addStringOption((option) =>
            option
                .setName("section")
                .setDescription("enter your section")
                .setRequired(true)
                .addChoices(
                { name: "A", value: "A" },
                { name: "B", value: "B" },
                { name: "C", value: "C" },
                { name: "D", value: "D" },
                ),
            ),
        ),

    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand()
    
            switch(subcommand) {
                case "name": {
                    const name = interaction.options.getString("name");
                    await interaction.reply(`Name: ${name}`)
                    break;
                }
                case "roll-number": {
                    const rollNo = interaction.options.getInteger("roll-no")
                    await interaction.reply(`Roll No: ${rollNo}`)
                    break;
                }
                case "above-18": {
                    const isAbove18 = interaction.options.getBoolean("above-18")
                    await interaction.reply(`Above 18? ${isAbove18}`)
                    break;
                }
                case "section": {
                    const section = interaction.options.getString("section")
                    await interaction.reply(`Section: ${section}`)
                    break;
                }
                default: {
                    await interaction.reply({ content: "Unknwon Subcommand", ephemeral: true })
                }
            }
        } catch (error) {
            console.log(error)
            await interaction.reply({ content: "An error occurred", ephemeral: true })
        }
    }

};