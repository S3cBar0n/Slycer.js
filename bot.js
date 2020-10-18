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

const checkPermissionRole = (role) =>
    role.permissions.has('ADMINISTRATOR') &&
    role.permissions.has('KICK_MEMBERS') &&
    role.permissions.has('BAN_MEMBERS') &&
    role.permissions.has('MANAGE_GUILD') &&
    role.permissions.has('MANAGE_CHANNELS');

const date = new Date();
const today = date.getDate();



//client.on('message', function (message) {
//    if (message.author.bot) return;
//    if (message.content === 'hello') {
//       message.channel.send('hello');
//    }
//});

client.on('message', async function (message) {
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
        console.log(message.content);
        let args = message.content.toLowerCase().substring(message.content.indexOf(' ') + 1);
        let roleNames = args.split(', ');
        let roleSet = new Set(roleNames);
        let { cache } = message.guild.roles;

        roleSet.forEach(roleName => {
            let role = cache.find(role => role.name.toLowerCase() === roleName);
            if(role) {
                if(message.member.roles.cache.has(role.id)) {
                    message.channel.send('You already have this role!');
                }
                if(checkPermissionRole(role)) {
                    message.channel.send('You cannot add yourself to this role.');
                }
                else {
                    message.member.roles.add(role)
                        .then(member => message.channel.send('You were added to this role.'))
                        .catch(err => {
                            console.log(err);
                            message.channel.send('Something went wrong');
                        });
                }
            }
            else {
                message.channel.send('Role not found!');
            }
        });

    }

    else if (isValidCommand(message, 'del')) {
        console.log(message.content);
        let args = message.content.toLowerCase().substring(message.content.indexOf(' ') + 1);
        let roleNames = args.split(', ');
        let roleSet = new Set(roleNames);
        let { cache } = message.guild.roles;

        roleSet.forEach(roleName => {
            let role = cache.find(role => role.name.toLowerCase() === roleName);
            if(role) {
                if(message.member.roles.cache.has(role.id)) {
                    message.member.roles.remove(role)
                        .then(member => message.channel.send('You were removed from this role.'))
                        .catch(err => {
                            console.log(err);
                            message.channel.send('Something went wrong...');
                        });
                }
                else {
                    message.channel.send('You do not have this role...')
                }
            }
            else {
                message.channel.send('Role not found!');
            }
        });
    }

    else if (isValidCommand(message, 'embed')) {
        let embedContent = message.content.substring(message.content.indexOf(' ') + 1);
        let embed = new discord.MessageEmbed();
        // embed.addField('Message', embedContent);
        embed.setDescription(embedContent);
        embed.setColor('#6be3bf');
        embed.setTitle('New Embed Message Created');
        embed.setTimestamp();
        embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
        message.channel.send(embed);

        // let embed = {
        //     image: {
        //         url: message.author.displayAvatarURL()
        //     },
        //     description: embedContent,
        //     thumbnail: {
        //         url: message.author.displayAvatarURL()
        //     },
        //     timestamp: new Date()
        // }
        // message.channel.send({ embed: embed });
    }

    else if (isValidCommand(message, 'say')) {
        let announcement = message.content.substring(message.content.indexOf(' ') + 1);
        // let announcementsChannel = client.channels.cache.get('CHANNEL_ID');
        // let communityEventsChannel = client.channels.cache.find(channel => channel.name.toLowerCase() === 'community-events');
        let botTestingChannel = client.channels.cache.find(channel => channel.name.toLowerCase() === 'bot-testing');

        // The permission check is to avoid users using the say command to have the bot ban users
        if (message.member.hasPermission('BAN_MEMBERS')) {
            if (botTestingChannel)
                botTestingChannel.send(announcement);
        }
    }

    else if (isValidCommand(message, 'ban')) {

        if (!message.member.hasPermission('BAN_MEMBERS')) {
            console.log(message.member.user.tag + ' tried using an admin command!')
        }
        else {
            let memberId = message.content.substring(message.content.indexOf(' ') + 1)
            try {
                let bannedMember = await message.guild.members.ban(memberId);
                if (bannedMember) {
                    console.log(bannedMember.tag + ' was banned by ' + message.member.user.tag)
                }
                else {
                    console.log(message.member.user.tag + ' tried banning user ' + bannedMember.tag + ' and failed.');
                }
            }
            catch (err) {
                console.log(message.member.user.tag + ' generated the following error when trying to use the ban command...')
                console.log(err)
            }

        }
    }


});