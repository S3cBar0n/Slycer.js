const discord = require('discord.js');
const client = new discord.Client();
const config = require('./config/config.json');
const PREFIX = config.DISCORD_BOT.PREFIX;

client.login(config.DISCORD_BOT.TOKEN);

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
});


const isValidCommand = (message, cmdName) => message.content.toLowerCase().startsWith(PREFIX + cmdName);
const rollDice = () => Math.floor(Math.random() * 6) + 1;
const date = new Date();
const today = date.getDate()





//client.on('message', function (message) {
//    if (message.author.bot) return;
//    if (message.content === 'hello') {
//       message.channel.send('hello');
//    }
//});

client.on('message', function (message) {
    if (message.author.bot) return;
    if (isValidCommand(message, 'hello')) {
        message.reply('Hello!')
    }
    else if (isValidCommand(message, 'rolldice')) {
        message.reply('rolled a ' + rollDice())
    }
    else if (isValidCommand(message, 'today')) {
        message.reply('Today is ' + today)
    }
    else if (isValidCommand(message, 'add')) {
        let args = message.content.toLowerCase().substring(5)
        let { cache } = message.guild.roles;
    }
});