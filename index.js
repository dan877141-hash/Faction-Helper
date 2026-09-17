require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes,
} = require('discord.js');

const fs = require('fs');
const path = require('path');

const STICKY_FILE = path.join(__dirname, 'sticky.json');

function loadSticky() {
    if (!fs.existsSync(STICKY_FILE)) {
        return {};
    }

    try {
        return JSON.parse(
            fs.readFileSync(STICKY_FILE, 'utf8')
        );
    } catch (error) {
        console.error('❌ Could not read sticky.json:', error);
        return {};
    }
}

function saveSticky(data) {
    fs.writeFileSync(
        STICKY_FILE,
        JSON.stringify(data, null, 2)
    );
}

const stickyMessages = loadSticky();


// ======================================================
// BOT SETUP
// ======================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


// ======================================================
// SETTINGS
// ======================================================

const GUILD_ID = process.env.GUILD_ID;

// Your bot Client ID
const CLIENT_ID = process.env.CLIENT_ID;

// Your gang logs channel ID
const GANG_LOG_CHANNEL_ID = process.env.GANG_LOG_CHANNEL_ID;


// ======================================================
// GANG CONFIGURATION
// ======================================================
//
// Replace the ROLE IDs below with your actual Discord
// role IDs.
//
// leaderRole = role that allows someone to manage the gang
// gangRole   = role that gets given to gang members
//
// ======================================================

const GANGS = {

    Admin: {
        name: 'Admin',
        leaderRole: '1549649301397970974',
        gangRole: '1549649573604233246'
    },

    FactionNAme: {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    },

    FactionNAme: {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    },

    'FactionNAme': {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    },

    FactionNAme: {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    },

    FactionNAme: {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    },
    
    FactionNAme: {
        name: 'NAme',
        leaderRole: '',
        gangRole: ''
    },
    
    FactionNAme: {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    },

    FactionNAme: {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    },

    'FactionNAme': {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    },

    FactionNAme: {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    },

    FactionNAme: {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    },

    FactionNAme: {
        name: 'Name',
        leaderRole: '',
        gangRole: ''
    }
};


// ======================================================
// SLASH COMMANDS
// ======================================================

const commands = [

    new SlashCommandBuilder()
        .setName('sticky')
        .setDescription('Create or replace the sticky message in this channel.')
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('The message you want to make sticky.')
                .setRequired(true)
                .setMaxLength(2000)
        ),

    new SlashCommandBuilder()
        .setName('unsticky')
        .setDescription('Remove the sticky message from this channel.'),

    new SlashCommandBuilder()
        .setName('gangadd')
        .setDescription('Add a member to your gang.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to add to your gang.')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('gangremove')
        .setDescription('Remove a member from your gang.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to remove from your gang.')
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName('ganginfo')
        .setDescription('Show your gang information.'),
    
    new SlashCommandBuilder()
    .setName('ganglist')
    .setDescription('Show all registered factions.'),

    new SlashCommandBuilder()
        .setName('gangleader')
        .setDescription('Show the leader of a registered faction.'),

    new SlashCommandBuilder()
        .setName('gangtransfer')
        .setDescription('Transfer your faction leadership to another member.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The member you want to transfer leadership to.')
                .setRequired(true)
        )

    

].map(command => command.toJSON());


// ======================================================
// REGISTER SLASH COMMANDS
// ======================================================

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registerCommands() {

    try {

        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                CLIENT_ID,
                GUILD_ID
            ),
            {
                body: commands
            }
        );

        console.log('Slash commands registered successfully.');

    } catch (error) {

        console.error('Error registering commands:');
        console.error(error);

    }

}


// ======================================================
// FIND WHICH GANG A LEADER CONTROLS
// ======================================================

function getLeaderGang(member) {

    for (const [gangKey, gang] of Object.entries(GANGS)) {

        if (member.roles.cache.has(gang.leaderRole)) {

            return {
                key: gangKey,
                ...gang
            };

        }

    }

    return null;

}


// ======================================================
// GANG LOGGING SYSTEM
// ======================================================

async function sendGangLog({
    guild,
    action,
    leader,
    target,
    gang,
    success = true,
    reason = null
}) {

    try {

        const logChannel = guild.channels.cache.get(
            GANG_LOG_CHANNEL_ID
        );

        if (!logChannel) {
            console.log(
                '❌ Gang log channel was not found.'
            );
            return;
        }

        // ==================================================
        // MEMBER ADDED
        // ==================================================

        if (action === 'Member Added') {

            const leaderGang = getLeaderGang(leader);

            const logEmbed = {
                title: '✨ Faction Member Added',

                description:
                    `${target} has been added to **${gang}**.`,

                color: 0x5865F2,

                fields: [

                    {
                        name: '👤 Member',
                        value: `${target}`,
                        inline: true
                    },

                    {
                        name: '🏷️ Faction',
                        value: gang,
                        inline: true
                    },

                    {
                        name: '👮 Assigned By',
                        value: `${leader}`,
                        inline: true
                    },

                    {
                        name: '🏅 Leader Role',
                        value: leaderGang
                            ? `<@&${leaderGang.leaderRole}>`
                            : 'Unknown',
                        inline: false
                    }

                ],

                footer: {
                    text: `Lynwood Factions • ${gang} • Member Added`
                },

                timestamp: new Date().toISOString()
            };

            await logChannel.send({
                embeds: [logEmbed]
            });

            return;
        }

        // ==================================================
        // MEMBER REMOVED
        // ==================================================

        if (action === 'Member Removed') {

            const leaderGang = getLeaderGang(leader);

            const logEmbed = {
                title: '✨ Faction Member Removed',

                description:
                    `${target} has been removed from **${gang}**.`,

                color: 0xED4245,

                fields: [

                    {
                        name: '👤 Member',
                        value: `${target}`,
                        inline: true
                    },

                    {
                        name: '🏷️ Faction',
                        value: gang,
                        inline: true
                    },

                    {
                        name: '👮 Removed By',
                        value: `${leader}`,
                        inline: true
                    },

                    {
                        name: '🏅 Leader Role',
                        value: leaderGang
                            ? `<@&${leaderGang.leaderRole}>`
                            : 'Unknown',
                        inline: false
                    }

                ],

                footer: {
                    text: `Lynwood Factions • ${gang} • Member Removed`
                },

                timestamp: new Date().toISOString()
            };

            await logChannel.send({
                embeds: [logEmbed]
            });

            return;
        }

        // ==================================================
        // FAILED / UNAUTHORIZED
        // ==================================================

        const failedEmbed = {

            title: '⚠️ Faction Management Failed',

            description:
                reason || 'An unknown error occurred.',

            color: 0xFEE75C,

            fields: [

                {
                    name: '👤 User',
                    value: `${leader}`,
                    inline: true
                },

                {
                    name: '👤 Target',
                    value: target
                        ? `${target}`
                        : 'None',
                    inline: true
                },

                {
                    name: '🏷️ Faction',
                    value: gang || 'Unknown',
                    inline: true
                }

            ],

            footer: {
                text:
                    `Lynwood Factions • ${gang || 'Faction'} • ${action}`
            },

            timestamp: new Date().toISOString()
        };

        await logChannel.send({
            embeds: [failedEmbed]
        });

    } catch (error) {

        console.error(
            '❌ Could not send gang log:',
            error
        );

    }

}


// ======================================================
// BOT READY
// ======================================================

client.once('ready', () => {

    console.log('======================================');
    console.log(`Bot Online: ${client.user.tag}`);
    console.log(`Server ID: ${GUILD_ID}`);
    console.log(`Gang Log Channel: ${GANG_LOG_CHANNEL_ID}`);
    console.log('Gang Management System Ready');
    console.log('======================================');

});


// ======================================================
// SLASH COMMAND HANDLER
// ======================================================

client.on('interactionCreate', async interaction => {

    // Make sure this is a slash command
    if (!interaction.isChatInputCommand()) return;

    // Make sure command is being used inside a server
    if (!interaction.guild) return;


    // ==================================================
    // /sticky
    // ==================================================

    if (interaction.commandName === 'sticky') {

        // ----------------------------------------------
        // CHECK PERMISSION
        // ----------------------------------------------

        if (!interaction.member.permissions.has('ManageMessages')) {

            return interaction.reply({
                content:
                    '❌ You need the **Manage Messages** permission to use `/sticky`.',
                ephemeral: true
            });

        }

        const channel = interaction.channel;

        const message =
            interaction.options.getString('message');

        // ----------------------------------------------
        // DELETE OLD STICKY
        // ----------------------------------------------

        const oldSticky = stickyMessages[channel.id];

        if (oldSticky) {

            try {

                const oldMessage =
                    await channel.messages.fetch(
                        oldSticky.messageId
                    );

                await oldMessage.delete().catch(() => {});

            } catch (error) {

                console.log(
                    '⚠️ Previous sticky message could not be removed.'
                );

            }

        }

        // ----------------------------------------------
        // SEND NEW STICKY
        // ----------------------------------------------

        try {

     const stickyMessage = await channel.send({
    embeds: [
        {
            description: message,
            color: 0xFF8C00,
            footer: {
                text: 'Lynwood Factions'
            }
        }
    ]
});

            // ------------------------------------------
            // SAVE STICKY
            // ------------------------------------------

            stickyMessages[channel.id] = {

                channelId: channel.id,
                messageId: stickyMessage.id,
                createdBy: interaction.user.id,
                message: message,
                createdAt: new Date().toISOString()

            };

            saveSticky(stickyMessages);

            // ------------------------------------------
            // CONFIRM
            // ------------------------------------------

            return interaction.reply({

                content:
                    `✅ Sticky message created in ${channel}.`,

                ephemeral: true

            });

        } catch (error) {

            console.error(
                '❌ Could not create sticky message:',
                error
            );

            return interaction.reply({

                content:
                    '❌ I could not create the sticky message. Make sure I have **Send Messages**, **Manage Messages**, and **Read Message History** permissions.',

                ephemeral: true

            });

        }

    }


    // ==================================================
    // /unsticky
    // ==================================================

    if (interaction.commandName === 'unsticky') {

        // ----------------------------------------------
        // CHECK PERMISSION
        // ----------------------------------------------

        if (!interaction.member.permissions.has('ManageMessages')) {

            return interaction.reply({
                content:
                    '❌ You need the **Manage Messages** permission to use `/unsticky`.',
                ephemeral: true
            });

        }

        const channel = interaction.channel;

        // ----------------------------------------------
        // CHECK FOR STICKY
        // ----------------------------------------------

        const sticky = stickyMessages[channel.id];

        if (!sticky) {

            return interaction.reply({
                content:
                    '⚠️ There is no sticky message configured in this channel.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // DELETE STICKY
        // ----------------------------------------------

        try {

            const stickyMessage =
                await channel.messages.fetch(
                    sticky.messageId
                );

            await stickyMessage.delete().catch(() => {});

        } catch (error) {

            console.log(
                '⚠️ Sticky message was already gone.'
            );

        }

        // ----------------------------------------------
        // REMOVE FROM MEMORY
        // ----------------------------------------------

        delete stickyMessages[channel.id];

        saveSticky(stickyMessages);

        // ----------------------------------------------
        // CONFIRM
        // ----------------------------------------------

        return interaction.reply({

            content:
                '✅ Sticky message removed from this channel.',

            ephemeral: true

        });

    }


    // ==================================================
    // /gangadd
    // ==================================================

    if (interaction.commandName === 'gangadd') {

        const targetUser =
            interaction.options.getMember('user');

        // ----------------------------------------------
        // TARGET NOT FOUND
        // ----------------------------------------------

        if (!targetUser) {

            return interaction.reply({
                content:
                    '❌ I could not find that member in the server.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND LEADER'S GANG
        // ----------------------------------------------

        const leaderGang =
            getLeaderGang(interaction.member);

        // ----------------------------------------------
        // NOT A GANG LEADER
        // ----------------------------------------------

        if (!leaderGang) {

            await sendGangLog({
                guild: interaction.guild,
                action: 'Unauthorized Attempt',
                leader: interaction.member,
                target: targetUser,
                gang: 'None',
                success: false,
                reason:
                    'User attempted to use /gangadd without a registered Gang Leader role.'
            });

            return interaction.reply({
                content:
                    '❌ **You are not authorized to use this command.**\n\n' +
                    'You must have a registered **Gang Leader** role.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // DON'T ALLOW SELF
        // ----------------------------------------------

        if (targetUser.id === interaction.user.id) {

            await sendGangLog({
                guild: interaction.guild,
                action: 'Addition Denied',
                leader: interaction.member,
                target: targetUser,
                gang: leaderGang.name,
                success: false,
                reason:
                    'Gang leader attempted to add themselves.'
            });

            return interaction.reply({
                content:
                    '❌ You cannot use `/gangadd` on yourself.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // CHECK ALL 13 GANG ROLES
        // ----------------------------------------------

        let currentGang = null;

        for (const [gangKey, gang] of Object.entries(GANGS)) {

            if (
                targetUser.roles.cache.has(
                    gang.gangRole
                )
            ) {

                currentGang = gang;
                break;

            }

        }

        // ----------------------------------------------
        // ALREADY IN A GANG
        // ----------------------------------------------

        if (currentGang) {

            await sendGangLog({
                guild: interaction.guild,
                action: 'Addition Denied',
                leader: interaction.member,
                target: targetUser,
                gang: leaderGang.name,
                success: false,
                reason:
                    `Member is already assigned to ${currentGang.name}.`
            });

            return interaction.reply({
                content:
                    `❌ This member is already assigned to **${currentGang.name}**.\n\n` +
                    `They must be removed from their current gang before joining another gang.`,
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND GANG ROLE
        // ----------------------------------------------

        const gangRole =
            interaction.guild.roles.cache.get(
                leaderGang.gangRole
            );

        if (!gangRole) {

            await sendGangLog({
                guild: interaction.guild,
                action: 'Failed Add',
                leader: interaction.member,
                target: targetUser,
                gang: leaderGang.name,
                success: false,
                reason:
                    'Gang role could not be found.'
            });

            return interaction.reply({
                content:
                    `❌ The **${leaderGang.name}** role could not be found.\n\n` +
                    `Check the gang role ID in \`index.js\`.`,
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // CHECK BOT ROLE HIERARCHY
        // ----------------------------------------------

        if (
            gangRole.position >=
            interaction.guild.members.me.roles.highest.position
        ) {

            await sendGangLog({
                guild: interaction.guild,
                action: 'Failed Add',
                leader: interaction.member,
                target: targetUser,
                gang: leaderGang.name,
                success: false,
                reason:
                    'Bot role is not above the gang role.'
            });

            return interaction.reply({
                content:
                    '❌ I cannot assign this role because my bot role is not high enough in the Discord role hierarchy.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // ADD GANG ROLE
        // ----------------------------------------------

        try {

            await targetUser.roles.add(
                gangRole,
                `Added to ${leaderGang.name} by ${interaction.user.tag}`
            );

            // ------------------------------------------
            // LOG SUCCESS
            // ------------------------------------------

            await sendGangLog({
                guild: interaction.guild,
                action: 'Member Added',
                leader: interaction.member,
                target: targetUser,
                gang: leaderGang.name
            });

            // ------------------------------------------
            // SUCCESS MESSAGE
            // ------------------------------------------

            await interaction.reply({

                content:
                    `✅ ${targetUser} has been added to **${leaderGang.name}**.\n\n` +
                    `👑 **Leader:** ${interaction.user}\n` +
                    `👤 **Member:** ${targetUser}\n` +
                    `🏴 **Gang:** ${leaderGang.name}`,

                ephemeral: true

            });

            console.log(
                `[GANG ADD] ${interaction.user.tag} added ${targetUser.user.tag} to ${leaderGang.name}`
            );

        } catch (error) {

            console.error(error);

            await sendGangLog({
                guild: interaction.guild,
                action: 'Failed Add',
                leader: interaction.member,
                target: targetUser,
                gang: leaderGang.name,
                success: false,
                reason:
                    'Discord rejected the role assignment.'
            });

            await interaction.reply({
                content:
                    '❌ I could not give that role. Make sure the bot has **Manage Roles** permission and its role is above the gang role.',
                ephemeral: true
            });

        }

    }


    // ==================================================
    // /gangremove
    // ==================================================

    if (interaction.commandName === 'gangremove') {

        const targetUser =
            interaction.options.getMember('user');

        // ----------------------------------------------
        // TARGET NOT FOUND
        // ----------------------------------------------

        if (!targetUser) {

            return interaction.reply({
                content:
                    '❌ I could not find that member in the server.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND LEADER GANG
        // ----------------------------------------------

        const leaderGang =
            getLeaderGang(interaction.member);

        // ----------------------------------------------
        // NOT A LEADER
        // ----------------------------------------------

        if (!leaderGang) {

            await sendGangLog({
                guild: interaction.guild,
                action: 'Unauthorized Attempt',
                leader: interaction.member,
                target: targetUser,
                gang: 'None',
                success: false,
                reason:
                    'User attempted to use /gangremove without a registered Gang Leader role.'
            });

            return interaction.reply({
                content:
                    '❌ **You are not authorized to use this command.**\n\n' +
                    'You must have a registered **Gang Leader** role.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // CHECK MEMBER HAS GANG ROLE
        // ----------------------------------------------

        if (
            !targetUser.roles.cache.has(
                leaderGang.gangRole
            )
        ) {

            return interaction.reply({
                content:
                    `⚠️ ${targetUser} is not a member of **${leaderGang.name}**.`,
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND ROLE
        // ----------------------------------------------

        const gangRole =
            interaction.guild.roles.cache.get(
                leaderGang.gangRole
            );

        if (!gangRole) {

            return interaction.reply({
                content:
                    `❌ The **${leaderGang.name}** role could not be found.`,
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // CHECK BOT ROLE
        // ----------------------------------------------

        if (
            gangRole.position >=
            interaction.guild.members.me.roles.highest.position
        ) {

            return interaction.reply({
                content:
                    '❌ I cannot remove this role because my bot role is not high enough in the Discord role hierarchy.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // REMOVE ROLE
        // ----------------------------------------------

        try {

            await targetUser.roles.remove(
                gangRole,
                `Removed from ${leaderGang.name} by ${interaction.user.tag}`
            );

            // ------------------------------------------
            // SEND LOG
            // ------------------------------------------

            await sendGangLog({
                guild: interaction.guild,
                action: 'Member Removed',
                leader: interaction.member,
                target: targetUser,
                gang: leaderGang.name
            });

            // ------------------------------------------
            // SUCCESS MESSAGE
            // ------------------------------------------

            await interaction.reply({

                content:
                    `✅ ${targetUser} has been removed from **${leaderGang.name}**.\n\n` +
                    `👑 **Leader:** ${interaction.user}\n` +
                    `👤 **Member:** ${targetUser}\n` +
                    `🏴 **Gang:** ${leaderGang.name}`,

                ephemeral: true

            });

            console.log(
                `[GANG REMOVE] ${interaction.user.tag} removed ${targetUser.user.tag} from ${leaderGang.name}`
            );

        } catch (error) {

            console.error(error);

            await sendGangLog({
                guild: interaction.guild,
                action: 'Failed Remove',
                leader: interaction.member,
                target: targetUser,
                gang: leaderGang.name,
                success: false,
                reason:
                    'Discord rejected the role removal.'
            });

            await interaction.reply({
                content:
                    '❌ I could not remove that role. Check my role position and permissions.',
                ephemeral: true
            });

        }

    }


    // ==================================================
    // /ganginfo
    // ==================================================

    if (interaction.commandName === 'ganginfo') {

        const leaderGang =
            getLeaderGang(interaction.member);

        // ----------------------------------------------
        // NOT A LEADER
        // ----------------------------------------------

        if (!leaderGang) {

            return interaction.reply({
                content:
                    '❌ You are not registered as a gang leader.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND GANG ROLE
        // ----------------------------------------------

        const gangRole =
            interaction.guild.roles.cache.get(
                leaderGang.gangRole
            );

        if (!gangRole) {

            return interaction.reply({
                content:
                    `❌ The **${leaderGang.name}** role could not be found.`,
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // GET MEMBERS
        // ----------------------------------------------

        await interaction.guild.members.fetch();

        const members = interaction.guild.members.cache.filter(
            member => member.roles.cache.has(leaderGang.gangRole)
        );

        let memberList = '';

        if (members.size === 0) {

            memberList =
                'No members currently have this role.';

        } else {

            memberList = members
                .map(member => `• ${member}`)
                .join('\n');

        }

        // ----------------------------------------------
        // MESSAGE LIMIT
        // ----------------------------------------------

        if (memberList.length > 3500) {

            memberList =
                memberList.substring(0, 3500) +
                '\n...and more members.';

        }

        // ----------------------------------------------
        // SEND INFO
        // ----------------------------------------------

        await interaction.reply({

            content:
                `🏴 **${leaderGang.name} Gang Information**\n\n` +
                `👑 **Leader:** ${interaction.user}\n` +
                `👥 **Members:** ${members.size}\n\n` +
                `**Gang Members:**\n${memberList}`,

            ephemeral: true

        });

    }

    // ==================================================
    // /ganglist
    // ==================================================

    if (interaction.commandName === 'ganglist') {

        const gangs = Object.values(GANGS).filter(
            gang =>
                gang.leaderRole &&
                gang.gangRole
        );

        if (gangs.length === 0) {

            return interaction.reply({
                content:
                    '🏴 There are currently no registered factions.',
                ephemeral: true
            });

        }

        const gangList = gangs
            .map((gang, index) => {

                const leaderRole =
                    interaction.guild.roles.cache.get(
                        gang.leaderRole
                    );

                const gangRole =
                    interaction.guild.roles.cache.get(
                        gang.gangRole
                    );

                return (
                    `**${index + 1}. ${gang.name}**\n` +
                    `👑 Leader Role: ${
                        leaderRole
                            ? `<@&${gang.leaderRole}>`
                            : 'Not Found'
                    }\n` +
                    `👥 Members: ${
                        gangRole
                            ? gangRole.members.size
                            : 0
                    }`
                );

            })
            .join('\n\n');

        const gangListEmbed = {

            color: 0xFF8C00,

            title:
                '🏴 LYNWOOD FACTIONS • GANG LIST',

            description:
                'Here is the current list of registered factions.\n\n' +
                gangList,

            footer: {
                text:
                    `Lynwood Factions • ${gangs.length} Registered Faction${
                        gangs.length === 1 ? '' : 's'
                    }`
            },

            timestamp:
                new Date().toISOString()

        };

        return interaction.reply({

            embeds: [gangListEmbed],

            ephemeral: true

        });

    }

    // ==================================================
    // /gangleader
    // ==================================================

    if (interaction.commandName === 'gangleader') {

        const gangs = Object.values(GANGS).filter(
            gang =>
                gang.leaderRole &&
                gang.gangRole
        );

        if (gangs.length === 0) {

            return interaction.reply({
                content:
                    '🏴 There are currently no registered factions.',
                ephemeral: true
            });

        }

        const leaderList = gangs
            .map((gang, index) => {

                const leaderRole =
                    interaction.guild.roles.cache.get(
                        gang.leaderRole
                    );

                if (!leaderRole) {

                    return (
                        `**${index + 1}. ${gang.name}**\n` +
                        `👑 Leader Role: Not Found\n` +
                        `👤 Leader: Not Found`
                    );

                }

                const leaders = leaderRole.members;

                const leaderMentions = leaders.size > 0
                    ? leaders.map(member => `${member}`).join(', ')
                    : 'No leader assigned';

                return (
                    `**${index + 1}. ${gang.name}**\n` +
                    `👑 Leader: ${leaderMentions}`
                );

            })
            .join('\n\n');

        const leaderEmbed = {

            color: 0xFF8C00,

            title:
                '👑 LYNWOOD FACTIONS • GANG LEADERS',

            description:
                'Here are the current registered faction leaders.\n\n' +
                leaderList,

            footer: {
                text:
                    `Lynwood Factions • ${gangs.length} Registered Faction${
                        gangs.length === 1 ? '' : 's'
                    }`
            },

            timestamp:
                new Date().toISOString()

        };

        return interaction.reply({

            embeds: [leaderEmbed],

            ephemeral: true

        });

    }

    // ==================================================
    // /gangtransfer
    // ==================================================

    if (interaction.commandName === 'gangtransfer') {

        const targetUser =
            interaction.options.getMember('user');

        // ----------------------------------------------
        // TARGET NOT FOUND
        // ----------------------------------------------

        if (!targetUser) {

            return interaction.reply({
                content:
                    '❌ I could not find that member in the server.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND CURRENT LEADER'S GANG
        // ----------------------------------------------

        const leaderGang =
            getLeaderGang(interaction.member);

        // ----------------------------------------------
        // NOT A GANG LEADER
        // ----------------------------------------------

        if (!leaderGang) {

            await sendGangLog({
                guild: interaction.guild,
                action: 'Unauthorized Attempt',
                leader: interaction.member,
                target: targetUser,
                gang: 'None',
                success: false,
                reason:
                    'User attempted to use /gangtransfer without a registered Gang Leader role.'
            });

            return interaction.reply({
                content:
                    '❌ You are not authorized to transfer faction leadership.\n\n' +
                    'You must be a registered **Gang Leader**.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // DON'T ALLOW SELF
        // ----------------------------------------------

        if (targetUser.id === interaction.user.id) {

            return interaction.reply({
                content:
                    '❌ You cannot transfer leadership to yourself.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // CHECK TARGET IS IN THE GANG
        // ----------------------------------------------

        if (
            !targetUser.roles.cache.has(
                leaderGang.gangRole
            )
        ) {

            return interaction.reply({
                content:
                    `❌ ${targetUser} is not currently a member of **${leaderGang.name}**.\n\n` +
                    'The new leader must already be a member of the faction.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND LEADER ROLE
        // ----------------------------------------------

        const leaderRole =
            interaction.guild.roles.cache.get(
                leaderGang.leaderRole
            );

        if (!leaderRole) {

            return interaction.reply({
                content:
                    `❌ The **${leaderGang.name} Leader** role could not be found.\n\n` +
                    'Check the Leader Role ID in `index.js`.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // CHECK BOT ROLE HIERARCHY
        // ----------------------------------------------

        const botMember =
            interaction.guild.members.me;

        if (
            leaderRole.position >=
            botMember.roles.highest.position
        ) {

            return interaction.reply({
                content:
                    '❌ I cannot transfer the Leader role because my bot role is not high enough in the Discord role hierarchy.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // TRANSFER LEADERSHIP
        // ----------------------------------------------

        try {

            // Remove Leader role from current leader
            await interaction.member.roles.remove(
                leaderRole,
                `Gang leadership transferred to ${targetUser.user.tag}`
            );

            // Give Leader role to new leader
            await targetUser.roles.add(
                leaderRole,
                `Gang leadership transferred by ${interaction.user.tag}`
            );

            // ------------------------------------------
            // LOG SUCCESS
            // ------------------------------------------

            await sendGangLog({
                guild: interaction.guild,
                action: 'Leadership Transferred',
                leader: interaction.member,
                target: targetUser,
                gang: leaderGang.name
            });

            // ------------------------------------------
            // SUCCESS MESSAGE
            // ------------------------------------------

            return interaction.reply({

                content:
                    `✔️ **Gang Leadership Transferred**\n\n` +
                    `🏴 **Faction:** ${leaderGang.name}\n` +
                    `👑 **Previous Leader:** ${interaction.user}\n` +
                    `🔐 **New Leader:** ${targetUser}\n\n` +
                    `${targetUser} is now the registered leader of **${leaderGang.name}**.`,

                ephemeral: true

            });

        } catch (error) {

            console.error(
                '❌ Gang transfer error:',
                error
            );

            // ------------------------------------------
            // LOG FAILURE
            // ------------------------------------------

            await sendGangLog({
                guild: interaction.guild,
                action: 'Failed Transfer',
                leader: interaction.member,
                target: targetUser,
                gang: leaderGang.name,
                success: false,
                reason:
                    'Discord rejected the Leader role transfer.'
            });

            return interaction.reply({

                content:
                    '❌ I could not complete the leadership transfer. Make sure I have **Manage Roles** permission and my bot role is above the Leader role.',

                ephemeral: true

            });

        }

    }

});

// ======================================================
// AUTO-STICKY MESSAGE SYSTEM
// ======================================================

client.on('messageCreate', async message => {

    // Ignore bots
    if (message.author.bot) return;

    // Only work inside servers
    if (!message.guild) return;

    // !newgangs — Faction Staff Only
    if (message.content === '!newgangs') {

        const FACTION_STAFF_ROLE_ID = '1545272829891837973';

        if (!message.member.roles.cache.has(FACTION_STAFF_ROLE_ID)) {

            const deniedMessage = await message.reply({
                content:
                    '❌ You do not have permission to use `!newgangs`.\n\n' +
                    'Only **Faction Staff** can use this command.'
            });

            setTimeout(() => {
                deniedMessage.delete().catch(() => {});
            }, 5000);

            return;
        }

        await message.delete().catch(() => {});

        const newGangEmbed = {
            color: 0xFF8C00,

            
            title: '🏴 LYNWOOD FACTIONS • NEW GANG',

            description:
                'Interested in bringing your faction into the city?\n\n' +
                'Please **fill out every section below** with accurate information. ' +
                'Make sure all submitted content is **TOS-friendly**.\n\n' +
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',

            fields: [
                {
                    name: '🏴 Faction Name:',
                     value: '\u200B',
                    inline: false
                },
                {
                    name: '🖼️ Gang Logo:',
                     value: '\u200B',
                    inline: false
                },
                {
                    name: '🎨 Faction Color',
                    value: 'Provide the **HEX code** and an **image showing the color**.',
                    inline: false
                },
                {
                    name: '📍 Block',
                    value: 'Provide the block/location you are requesting.',
                    inline: true
                },
                {
                    name: '👑 Co-Leaders:',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '👥 Member Count You\'re Bringing',
                    value: 'How many members are you bringing into the city?',
                    inline: false
                },
                {
                    name: '💲 Gang Tier Purchased',
                    value: 'The gang tier you purchased.',
                    inline: false
                },
                {
                    name: '📋 Previous WL Gang Experience',
                    value:
                        'Have you had a **WL\'d gang** before in your FiveM experience?\n\n' +
                        '**Answer:** Yes / No',
                    inline: false
                },
                {
                    name: '📜 Rules Agreement',
                    value:
                        'Will you follow our **Faction & Server rules at all times?**\n\n' +
                        '**Answer:** Yes / No',
                    inline: false
                }
            ],

            footer: {
                text: 'Lynwood Factions • Gang Applications'
            },

            timestamp: new Date().toISOString()
        };

        await message.channel.send({
            embeds: [newGangEmbed]
        });

        return;
    }

    // YOUR EXISTING STICKY CODE CONTINUES HERE

    const sticky = stickyMessages[message.channel.id];

    // No sticky configured for this channel
    if (!sticky) return;

    try {

        // ----------------------------------------------
        // DELETE OLD STICKY
        // ----------------------------------------------

        try {

            const oldSticky =
                await message.channel.messages.fetch(
                    sticky.messageId
                );

            await oldSticky.delete().catch(() => {});

        } catch (error) {

            // Old sticky was already deleted
        }

        // ----------------------------------------------
        // SEND STICKY AGAIN
        // ----------------------------------------------

        const newSticky =
            await message.channel.send({

                embeds: [
                    {
                        title: '📌 STICKY MESSAGE',
                        description: sticky.message,
                        color: 0xFF8C00
                    }
                ]

            });

        // ----------------------------------------------
        // UPDATE MESSAGE ID
        // ----------------------------------------------

        stickyMessages[message.channel.id].messageId =
            newSticky.id;

        saveSticky(stickyMessages);

    } catch (error) {

        console.error(
            '❌ Auto-sticky error:',
            error
        );

    }

});


// ======================================================
// LOGIN
// ======================================================

if (!process.env.TOKEN) {

    console.error(
        '❌ TOKEN is missing from your .env file.'
    );

} else {

    client.login(process.env.TOKEN);

}


// ======================================================
// REGISTER COMMANDS
// ======================================================

registerCommands();