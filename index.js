const { EmbedBuilder, Client, GatewayIntentBits, Partials, PermissionsBitField, Routes, Collection } = require('discord.js');
const mongoose = require('mongoose');
const Svr = require("./models/server");
const { REST } = require('@discordjs/rest');
const fs = require('node:fs');

var listening;

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

const dbURI = "___Private_Key___";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => {
    console.log("Finished connecting to database.");
    listening = true;
    Svr.find({ Name: "Server" })
    .then((res) => {
        console.log(res[0].Name);
    })
    .catch((err) => {
        console.log(err);
    });
})
.catch((err) => {
    console.log("Error connecting to database: \n" + err);
});

var rr = false;
var rra = null;
var rrc = null;
var rrr = null;

module.exports.rrChange = function(_rr, _rra, _rrc, _rrr){
    rr = _rr;
    rra = _rra;
    rrc = _rrc;
    rrr = _rrr;
};

module.exports.getrr = function(){
    return rr;
}

var fetched = false;

const clientId = "___Private_Key___";

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

const rest = new REST({ version: '10' }).setToken("___Private_Key___");

const {initEmb, rankEmb} = require("./embeds.js");

client.once('ready', () => {
    client.user.setPresence({ activities: [{ name: '/d-help | Made by Speedev#6162' }] });
    console.log('DodoBot is online!');
});

async function fetchReacts(){
    //On startup, fetch messages that are used for reaction-roles
    client.guilds.cache.forEach(async (guild)=>{
        Svr.find({ Name: guild.name})
        .then((res)=>{
            res[0].React_Role.forEach(async role=>{
            var channel = await guild.channels.fetch(role.Channel);
            var message = await channel.messages.fetch(role.Message);
            console.log(`Cached message: ${message.content}\nCached channel: ${channel.name}`);
            });
        })
        .catch(err=>{
            console.log(`Couldn't find Server: \n${err}`);
        })
    });
    fetched = true;
}

client.on('interactionCreate', async interaction => {
    //Handle commands
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('guildMemberAdd', guildMember => {
    //Welcome messages and join roles
    Svr.find({ Name: guildMember.guild.name })
    .then((res) => {
        for (var i = 0; i < res[0].Join_Role.length; i++) {
            if (res[0].Join_Role[i] == null) {
                console.log("Couldn't add role null.");
            } else {
                guildMember.roles.add(guildMember.guild.roles.cache.get(res[0].Join_Role[i]))
                .catch((err) => {
                    console.log(err);
                });
            }
        }

        if (res[0].W_Msg.Channel != "undefined") {
            var wm = res[0].W_Msg.Msg.replace("$", "<@" + guildMember.user.id + ">");
            guildMember.guild.channels.cache.get(res[0].W_Msg.Channel).send(wm)
            .catch((err) => {
                console.log(err);
            });
        }
    })
    .catch((err) => {
        console.log(err);
    });
});

client.on('messageReactionRemove', async (reaction, user) => {
    //Remove reaction role
    if(!fetched) await fetchReacts();
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;

    Svr.find({ Name: reaction.message.guild.name })
    .then(async (res) => {
        for (let n = 0; n < res[0].React_Role.length; n++) {
            if (res[0].React_Role[n].Channel == reaction.message.channel.id) {
                if (res[0].React_Role[n].Message == reaction.message.id) {
                    if (res[0].React_Role[n].Reaction_ID != null) {
                        if (res[0].React_Role[n].Reaction_ID == reaction.emoji.id) {
                            const u = await reaction.message.guild.members.fetch(user.id);
                            u.roles.remove(res[0].React_Role[n].Role)
                            .catch((err) => {
                                console.log(err);
                            });
                        }
                    } else {
                        if (res[0].React_Role[n].Reaction_Name == reaction.emoji.name) {
                            const u = await reaction.message.guild.members.fetch(user.id);
                            u.roles.remove(res[0].React_Role[n].Role)
                            .catch((err) => {
                                console.log(err);
                            });
                        }
                    }
                }
            }

        }
    })
    .catch((err) => {
        console.log(err);
    });
});

client.on('messageReactionAdd', async (reaction, user) => {
    //Add reaction role or create reaction role
    if(!fetched) await fetchReacts();
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;
    if (!reaction.message.guild) return;


    Svr.find({ Name: reaction.message.guild.name })
    .then(async(res) => {
        for (let n = 0; n < res[0].React_Role.length; n++) {
            if (res[0].React_Role[n].Channel == reaction.message.channel.id) {
                if (res[0].React_Role[n].Message == reaction.message.id) {
                    if (res[0].React_Role[n].Reaction_ID != null) {
                        if (res[0].React_Role[n].Reaction_ID == reaction.emoji.id) {
                            const u = await reaction.message.guild.members.fetch(user.id);
                            u.roles.add(res[0].React_Role[n].Role)
                            .catch((err) => {
                                console.log(err);
                            });
                        }
                    } else {
                        if (res[0].React_Role[n].Reaction_Name == reaction.emoji.name) {
                            const u = await reaction.message.guild.members.fetch(user.id);
                            u.roles.add(res[0].React_Role[n].Role)
                            .catch((err) => {
                                console.log(err);
                            });
                        }
                    }
                }
            }

        }
    })
    .catch((err) => {
        console.log(err);
    });

    if (rr) {
        if (reaction.message.channel.id == rrc) {
        if (reaction.message.author.id == rra) {

            Svr.find({ Name: reaction.message.guild.name })
            .then((res) => {
                res[0].React_Role[res[0].React_Role.length] = {
                Message: reaction.message.id,
                Channel: reaction.message.channel.id,
                Reaction_Name: reaction.emoji.name,
                Reaction_ID: reaction.emoji.id,
                Role: rrr
                }

                rr = false;

                const date = new Date();

                res[0].save()
                .then(() => {
                    console.log("Successfully updated object      [" + date.getHours() + ":" + date.getMinutes() + "]");
                    reaction.message.react(reaction.emoji)
                    .catch((err) => {
                        console.log(err);
                    });
                })
                .catch((err) => {
                    console.log("Error updating object (101):\n " + err)
                });
            })
            .catch((err) => {
                console.log(err);
            });
        }
        }
    }
});



client.on('messageCreate', message => {
    //Initiate DodoBot for server if necessary
    if(message.guild){
        Svr.find({ Name: message.guild.name })
        .then((res) => {
            if (!res[0]) {
                Save(new Svr({
                    Name: message.guild.name,
                    Join_Role: [

                    ],
                    React_Role: [

                    ],
                    W_Msg: {
                        Channel: "undefined",
                        Msg: "Welcome $, make sure to read the rules!"
                    },
                    Users: [],
                    Rank_Channel: "undefined",
                    Warn_Words: []
                }));
                message.channel.send({ embeds: [initEmb] })
                .catch((err) => {
                    console.log(err);
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    //Warnings
    if (!message.author.bot) {
        Svr.find({ Name: message.guild.name })
        .then((res) => {
            //Words
            for (var i = 0; i < res[0].Warn_Words.length; i++) {
                if (message.content.toLocaleLowerCase().includes(res[0].Warn_Words[i])) {
                    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                        var e = true;
                        for (var n = 0; n < res[0].Users.length; n++) {
                            if (res[0].Users[n].id == message.author.id) {
                                e = false;
                                res[0].Users[n].warns[res[0].Users[n].warns.length] = {
                                    Reason: "BAD WORD: " + res[0].Warn_Words[i],
                                    Time: new Date().getTime()
                                }
                            }
                        }

                        if (e) {
                            res[0].Users[res[0].Users.length] = {
                                id: message.author.id,
                                xp: 0,
                                warns: [{
                                    Reason: "BAD WORD: " + res[0].Warn_Words[i],
                                    Time: new Date().getTime()
                                }]
                            }
                        }

                        const date = new Date();

                        res[0].save()
                        .then(() => {
                            console.log("Successfully updated object      [" + date.getHours() + ":" + date.getMinutes() + "]");
                        })
                        .catch((err) => {
                            console.log("Error updating object (101):\n " + err)
                        });

                        let emb = new EmbedBuilder()
                        .setColor('#ff9933')
                        .setTitle("You have received a Warning in " + message.guild.name)
                        .setDescription("<t:" + Math.floor(new Date().getTime() / 1000) + ":F>")
                        .addFields({name: "Reason: ", value: "BAD WORD\nMessage:\n" + message.content });

                        message.delete()
                        .catch((err) => {
                        console.log(err);
                        });

                        message.author.send({ embeds: [emb] })
                        .catch((err) => {
                            console.log(err);
                        });
                    }
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });


        //Xp stuff
        message.channel.messages.fetch({ limit: 2 })
        .then((res) => {
            var msgs = Array.from(res.values());
            if (msgs[1].author.id != message.author.id && msgs[1].author.bot != true) {
                Svr.find({ Name: message.guild.name })
                .then((res) => {
                    var e = true;
                    for (var i = 0; i < res[0].Users.length; i++) {
                        if (res[0].Users[i].id == message.author.id) {
                            e = false;
                            if (Math.floor(Math.sqrt(res[0].Users[i].xp / 2)) != Math.floor(Math.sqrt((res[0].Users[i].xp + 1) / 2))) {
                                if (res[0].Rank_Channel != "undefined") {
                                message.guild.channels.cache.get(res[0].Rank_Channel).send({ embeds: [rankEmb.setDescription("GG <@" + message.author.id + ">, you just reached Level " + Math.floor(Math.sqrt((res[0].Users[i].xp + 1) / 2)) + "!")] })
                                    .catch((err) => {
                                    console.log(err);
                                    });
                                }
                            }
                            res[0].Users[i].xp += 1;
                            break;
                        }
                    }
                    if (e) {
                        res[0].Users[res[0].Users.length] = {
                        id: message.author.id,
                        xp: 1,
                        warns: []
                        }
                        if (res[0].Rank_Channel != "undefined") {
                            message.guild.channels.cache.get(res[0].Rank_Channel).send({ embeds: [rankEmb.setDescription("GG <@" + message.author.id + ">, you just reached Level 0! Keep up the Good Work!")] })
                            .catch((err) => {
                                console.log(err);
                            });
                        }
                    }
                    const date = new Date();

                    res[0].save()
                    .then(() => {
                        console.log("Successfully updated object      [" + date.getHours() + ":" + date.getMinutes() + "]");
                    })
                    .catch((err) => {
                        console.log("Error updating object (101):\n " + err)
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports.sleep = sleep;

function Save(obj) {
    if (listening) {
        const date = new Date();

        obj.save()
        .then(() => {
            console.log("Successfully saved object      [" + date.getHours() + ":" + date.getMinutes() + "]");
        })
        .catch((err) => {
            console.log("Error saving object (101):\n " + err)
        });
    } else {
        console.log("Error saving object (102):\n No connection to database");
    }
}

client.login('___Private_Key___');

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );    

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();