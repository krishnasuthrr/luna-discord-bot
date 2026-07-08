const { REST, Routes } = require("discord.js");
require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");

const guildCommands = [];
const globalCommands = [];

// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "src", "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      // commands.push(command.data.toJSON()); // convert command data into JSON for sending it to discord API
      if (command.guildOnly) {
        guildCommands.push(command.data.toJSON())
      } else {
        globalCommands.push(command.data.toJSON())
      }
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(
      `Deploying ${globalCommands.length} global and ${guildCommands.length} guild commands...`,
    );

    // Deploy Guild Commands (if any exist in the array)
    if (guildCommands.length > 0 && process.env.GUILD_ID) {
      console.log("Refreshing guild-specific commands...");
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID,
        ),
        { body: guildCommands },
      );
    }

    // Deploy Global Commands (if any exist in the array)
    if (globalCommands.length > 0) {
      console.log("Refreshing global commands...");
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: globalCommands,
      });
    }

    console.log(`Successfully reloaded all application commands.`);
  } catch (error) {
    console.error("Failed to deploy commands: ", error);
  }
})();
