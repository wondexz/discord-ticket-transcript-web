const { Client, Partials, IntentsBitField } = require("discord.js");
const { default: chalk } = require("chalk");
const { readdirSync } = require("fs");
const config = require("../config");
require('./server')

const client = new Client({
    intents: Object.values(IntentsBitField.Flags),
    partials: Object.values(Partials)
});

global.client = client;
client.commands = (global.commands = []);

readdirSync("./src/commands").forEach((category) => {
    readdirSync(`./src/commands/${category}`).forEach((file) => {
        if (!file.endsWith(".js")) return;

        const command = require(`./commands/${category}/${file}`);
        const { name, description, type, options, dm_permissions } = command;

        client.commands.push({
            name,
            description,
            type: type ? type : 1,
            options,
            dm_permissions
        });

        console.log(chalk.red("[KOMUT]"), chalk.white(`${name} adlı komut yüklendi!`));
    });
});

readdirSync("./src/events").forEach((category) => {
    readdirSync(`./src/events/${category}`).forEach((file) => {
        if (!file.endsWith(".js")) return;

        const event = require(`./events/${category}/${file}`);
        const eventName = event.name || file.split(".")[0];

        client.on(eventName, (...args) => event.run(client, ...args));

        console.log(chalk.blue("[EVENT]"), chalk.white(`${eventName} adlı event yüklendi!`));
    });
});

client.login(config.token);