const {EmbedBuilder} = require("discord.js");

module.exports.errEmb = new EmbedBuilder()
  .setColor('#ff0000')
  .setTitle("Error");

module.exports.helpEmb = new EmbedBuilder()
  .setColor('#0099ff')
  .setTitle("Commands:")
  .addFields(
    { name: "/d-help", value: "Overview over all DodoBot-Commands\n" },
    { name: "USER MANAGEMENT", value: "/kick @user\n--> Kick a user (Kick permissions required)\n\n/ban @user\n--> Ban a user (Ban permissions required)\n\n/mute @user <duration> <reason:optional>\n--> Timeout a user (Admin required)\n" },
    { name: "RANKS", value: "/rank @user:optional\n--> View a user's Rank\n\n/rank-lb <page>\n--> View the rank leaderboard\n\n/rank-set @user <number of lvls>\n--> Set someone's rank (Admin required)\n\n/rank-channel #channel\n--> Set the channel for rankup-messages (Admin required)\n" },
    { name: "WARNINGS", value: "/warn add @user <reason:optional>\n--> Warn a user (Mod required)\n\n/warn list @user\n--> View all warnings of a specific user (Mod required)\n\n/warn remove @user <index or all>\n--> Remove one or all warnings from a user (Mod required)\n\n/warn-words list/add/remove <word>\n--> View all words that result in a warning or edit the list (Mod required)\n" },
    { name: "CHANNEL MANAGEMENT", value: "/clear <amount(1 to 99)>\n--> Clear messages in a channel (Admin required)" },
    { name: "NEW MEMBERS", value: "/join-role <list/add/remove> @role:situational\n--> Manage join roles\n\n/welcome <message> #channel\n--> Set a welcome message (Admin required)\n" },
    { name: "REACTION ROLES", value: "/react-role <list/add/remove> @role:situational\n--> Manage reaction roles (in 'add', you will have to react to the message within the following 10 seconds, Role managing permissions required)"}
  );

module.exports.restartEmb = new EmbedBuilder()
  .setColor('#ff9933')
  .setTitle("Restarting...")
  .setDescription("Successfully started restart.");

module.exports.successEmb = new EmbedBuilder()
  .setColor('#00ff00')
  .setTitle("Success!");

module.exports.initEmb = new EmbedBuilder()
  .setColor('#00ff00')
  .setTitle("DodoBot initialised!")
  .setDescription("Successfully initialised DodoBot. Type /d-help for a Command Overview.")
  .setFooter({ text: "©Speedev24 (Speedev#6162)", iconURL: "https://cdn.discordapp.com/avatars/706819441727373342/45dd8af25a81990c16fe06d5acc81f2c.webp" });

module.exports.nopeEmb = new EmbedBuilder()
  .setColor('#ff3300')
  .setTitle("Invalid");

module.exports.rankEmb = new EmbedBuilder()
  .setColor('#00ff00')
  .setTitle("Rankup!");