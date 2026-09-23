require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes,
    ChannelType,
} = require('discord.js');

const fs = require('fs');
const path = require('path');

// ======================================================
// DATA DIRECTORY
// ======================================================

const DATA_DIR = '/app/data';

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {
        recursive: true
    });
}

// ======================================================
// DATA FILES
// ======================================================

const STICKY_FILE =
    path.join(DATA_DIR, 'sticky.json');

const STRIKE_FILE =
    path.join(DATA_DIR, 'factionStrikes.json');

const MONEY_FILE =
    path.join(DATA_DIR, 'factionMoney.json');

const TRANSACTION_FILE =
    path.join(DATA_DIR, 'factionTransactions.json');

const FACTIONS_FILE =
    path.join(DATA_DIR, 'factions.json');

const ACTIVITY_FILE =
    path.join(DATA_DIR, 'activity.json');

const GANG_THREADS_FILE =
    path.join(DATA_DIR, 'gangThreads.json');

const FLAG_THREADS_FILE =
    path.join(DATA_DIR, 'flagThreads.json');

const PROBATION_FILE =
    path.join(DATA_DIR, 'probation.json');

// ======================================================
// INITIALIZE PERSISTENT DATA
// ======================================================

const SEED_DIR = path.join(__dirname, 'seed-data');

const DATA_FILES = [
    'factions.json',
    'factionMoney.json',
    'factionStrikes.json',
    'factionTransactions.json',
    'activity.json',
    'sticky.json'
];

for (const file of DATA_FILES) {

    const persistentFile =
        path.join(DATA_DIR, file);

    const seedFile =
        path.join(SEED_DIR, file);

    if (
        !fs.existsSync(persistentFile) &&
        fs.existsSync(seedFile)
    ) {

        fs.copyFileSync(
            seedFile,
            persistentFile
        );

        console.log(
            `✅ Initialized persistent file: ${file}`
        );
    }
}

// ======================================================
// STICKY SYSTEM
// ======================================================

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
// FACTION STRIKE SYSTEM
// ======================================================

function loadFactionStrikes() {

    if (!fs.existsSync(STRIKE_FILE)) {
        return {};
    }

    try {

        return JSON.parse(
            fs.readFileSync(STRIKE_FILE, 'utf8')
        );

    } catch (error) {

        console.error(
            '❌ Could not read factionStrikes.json:',
            error
        );

        return {};

    }

}

function saveFactionStrikes(data) {

    fs.writeFileSync(
        STRIKE_FILE,
        JSON.stringify(data, null, 2)
    );

}

const factionStrikes = loadFactionStrikes();

// ======================================================
// FACTION MONEY SYSTEM
// ======================================================

function loadFactionMoney() {

    if (!fs.existsSync(MONEY_FILE)) {
        return {};
    }

    try {

        return JSON.parse(
            fs.readFileSync(MONEY_FILE, 'utf8')
        );

    } catch (error) {

        console.error(
            '❌ Could not read factionMoney.json:',
            error
        );

        return {};

    }

}

function saveFactionMoney(data) {

    fs.writeFileSync(
        MONEY_FILE,
        JSON.stringify(data, null, 2)
    );

}

const factionMoney = loadFactionMoney();

// ======================================================
// FACTION TRANSACTION SYSTEM
// ======================================================

function loadFactionTransactions() {

    if (!fs.existsSync(TRANSACTION_FILE)) {
        return {};
    }

    try {

        return JSON.parse(
            fs.readFileSync(TRANSACTION_FILE, 'utf8')
        );

    } catch (error) {

        console.error(
            '❌ Could not read factionTransactions.json:',
            error
        );

        return {};

    }

}

function saveFactionTransactions(data) {

    fs.writeFileSync(
        TRANSACTION_FILE,
        JSON.stringify(data, null, 2)
    );

}

const factionTransactions = loadFactionTransactions();

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

const GANG_FORUM_CATEGORY_ID = process.env.GANG_FORUM_CATEGORY_ID;

const FLAG_FORUM_CHANNEL_ID =
    process.env.FLAG_FORUM_CHANNEL_ID;

const BLOCK_FORUM_CHANNEL_ID = '1549677487955382302';

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

// ======================================================
// FACTION CONFIGURATION
// ======================================================

function loadFactions() {

    if (!fs.existsSync(FACTIONS_FILE)) {

        console.error(
            '❌ factions.json was not found.'
        );

        return {};

    }

    try {

        const data = JSON.parse(
            fs.readFileSync(
                FACTIONS_FILE,
                'utf8'
            )
        );

        if (
            !data ||
            typeof data !== 'object' ||
            Array.isArray(data)
        ) {

            console.error(
                '❌ factions.json must contain a JSON object.'
            );

            return {};

        }

        return data;

    } catch (error) {

        console.error(
            '❌ Could not read factions.json:',
            error
        );

        return {};

    }

}

function saveFactions(data) {

    try {

        fs.writeFileSync(
            FACTIONS_FILE,
            JSON.stringify(
                data,
                null,
                2
            )
        );

        return true;

    } catch (error) {

        console.error(
            '❌ Could not save factions.json:',
            error
        );

        return false;

    }

}

// ======================================================
// PROBATION SYSTEM
// ======================================================

function loadProbation() {

    if (!fs.existsSync(PROBATION_FILE)) {
        return {};
    }

    try {

        return JSON.parse(
            fs.readFileSync(
                PROBATION_FILE,
                'utf8'
            )
        );

    } catch (error) {

        console.error(
            '❌ Could not read probation.json:',
            error
        );

        return {};

    }

}

function saveProbation(data) {

    try {

        fs.writeFileSync(
            PROBATION_FILE,
            JSON.stringify(
                data,
                null,
                2
            )
        );

        return true;

    } catch (error) {

        console.error(
            '❌ Could not save probation.json:',
            error
        );

        return false;

    }

}

// ==================================================
// PROBATION AUTO EXPIRATION
// ==================================================

const probationTimers = new Map();

async function expireProbation(client, userId) {

    const probationData =
        loadProbation();

    const probation =
        probationData[userId];

    // No probation record exists
    if (!probation) {
        probationTimers.delete(userId);
        return;
    }

    const expiresAt =
        Number(probation.expiresAt);

    // Not expired yet
    if (expiresAt > Date.now()) {

        scheduleProbationExpiration(
            client,
            userId,
            expiresAt
        );

        return;
    }

    // ----------------------------------------------
    // REMOVE PROBATION ROLE
    // ----------------------------------------------

    for (
        const guild
        of client.guilds.cache.values()
    ) {

        try {

            const member =
                await guild.members
                    .fetch(userId)
                    .catch(() => null);

            if (
                member &&
                member.roles.cache.has(
                    probation.roleId
                )
            ) {

                await member.roles.remove(
                    probation.roleId,
                    'Probation period expired'
                );

            }

        } catch (error) {

            console.error(
                `❌ Failed to remove probation role from ${userId}:`,
                error
            );

        }

    }

    // ----------------------------------------------
    // REMOVE FROM PROBATION DATA
    // ----------------------------------------------

    delete probationData[userId];

    saveProbation(
        probationData
    );

    probationTimers.delete(
        userId
    );

    console.log(
        `✅ Probation expired for user ${userId}.`
    );

}


// ==================================================
// SCHEDULE PROBATION EXPIRATION
// ==================================================

function scheduleProbationExpiration(
    client,
    userId,
    expiresAt
) {

    // Clear an existing timer
    if (
        probationTimers.has(userId)
    ) {

        clearTimeout(
            probationTimers.get(userId)
        );

    }

    const delay =
        Math.max(
            0,
            Number(expiresAt) - Date.now()
        );

    const timer =
        setTimeout(
            () => {

                expireProbation(
                    client,
                    userId
                );

            },
            delay
        );

    probationTimers.set(
        userId,
        timer
    );

}

const GANGS = loadFactions();


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
    .setName('creategang')
    .setDescription('Create a new gang in the faction database.')
    .addStringOption(option =>
        option
            .setName('name')
            .setDescription('The name of the gang.')
            .setRequired(true)
            .setMaxLength(50)
    )
    .addStringOption(option =>
        option
            .setName('color')
            .setDescription('Gang role color in HEX format. Example: #FF0000')
            .setRequired(true)
            .setMaxLength(7)
    )

    .addUserOption(option =>

        option

            .setName('user')

            .setDescription(
                'The user who will become the faction owner.'
            )

            .setRequired(true)

    ),

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
        .setName('activity')
        .setDescription('Record faction activity.')
        .addStringOption(option =>
            option
                .setName('faction')
                .setDescription('The faction this activity belongs to.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('action')
                .setDescription('Describe the faction activity.')
                .setRequired(true)
                .setMaxLength(1000)
        ),

    new SlashCommandBuilder()
        .setName('inactive')
        .setDescription('Show factions with no recent activity.'),

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
        ),

        new SlashCommandBuilder()
    .setName('gangblock')
    .setDescription('Assign or change a faction block.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction you want to assign a block to.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('block')
            .setDescription('The block/location to assign.')
            .setRequired(true)
            .setMaxLength(100)
    )

    .addAttachmentOption(option =>
    option
        .setName('image')
        .setDescription('Image showing the faction block')
        .setRequired(false)
),

   new SlashCommandBuilder()
    .setName('gangtier')
    .setDescription('Assign or change a faction tier.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction you want to assign a tier to.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('tier')
            .setDescription('The tier to assign to the faction.')
            .setRequired(true)
            .setMaxLength(50)
    ),

    new SlashCommandBuilder()
    .setName('gangrename')
    .setDescription('Rename a faction.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction you want to rename.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('name')
            .setDescription('The new faction name.')
            .setRequired(true)
            .setMaxLength(50)
    ),

new SlashCommandBuilder()
    .setName('strikeadd')
    .setDescription('Add a strike to a faction.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction receiving the strike.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setDescription('Reason for the faction strike.')
            .setRequired(true)
            .setMaxLength(500)
    ),

new SlashCommandBuilder()
    .setName('strikeinfo')
    .setDescription('View a faction\'s current strikes.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction to view.')
            .setRequired(true)
    ),

new SlashCommandBuilder()
    .setName('strikelist')
    .setDescription('View factions with active strikes.'),

new SlashCommandBuilder()
    .setName('strikehistory')
    .setDescription('View previous faction strikes.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction to view strike history for.')
            .setRequired(true)
    ),

new SlashCommandBuilder()
    .setName('strikeremove')
    .setDescription('Remove a strike from a faction.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction to remove the strike from.')
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName('strike')
            .setDescription('The strike number to remove.')
            .setRequired(true)
            .setMinValue(1)
    ),

new SlashCommandBuilder()
    .setName('strikeclear')
    .setDescription('Clear all strikes from a faction.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction whose strikes you want to clear.')
            .setRequired(true)
    ),

new SlashCommandBuilder()
    .setName('gangmoney')
    .setDescription('View your faction money.'),

new SlashCommandBuilder()
    .setName('gangpayment')
    .setDescription('Record a payment to a faction.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction receiving the payment.')
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName('amount')
            .setDescription('The amount being paid.')
            .setRequired(true)
            .setMinValue(1)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setDescription('Reason for the payment.')
            .setRequired(true)
    ),

new SlashCommandBuilder()
    .setName('gangpayout')
    .setDescription('Record a payout from a faction.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction making the payout.')
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName('amount')
            .setDescription('The amount being paid out.')
            .setRequired(true)
            .setMinValue(1)
    )
    .addStringOption(option =>
        option
            .setName('reason')
            .setDescription('Reason for the payout.')
            .setRequired(true)
    ),

new SlashCommandBuilder()
    .setName('gangtransactions')
    .setDescription('View faction transaction history.')
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction to view transactions for.')
            .setRequired(true)
    ),

new SlashCommandBuilder()
        .setName('activitylog')
        .setDescription('View faction activity history.')
        .addStringOption(option =>
            option
                .setName('faction')
                .setDescription('Faction to view. Leave blank for all factions.')
                .setRequired(false)
        ),

new SlashCommandBuilder()
        .setName('factionstats')
        .setDescription('View faction statistics.')
        .addStringOption(option =>
            option
                .setName('faction')
                .setDescription('Faction to view.')
                .setRequired(true)
        ),

new SlashCommandBuilder()
    .setName('giveleaderrole')
    .setDescription('Give a faction leader role to a member.')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('The member who will receive the leader role.')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('faction')
            .setDescription('The faction whose leader role will be given.')
            .setRequired(true)
    ),

      new SlashCommandBuilder()
    .setName('create-gangthread')
    .setDescription('Create a private faction Forum with all required faction threads.')
    .addStringOption(option =>
        option
            .setName('gangname')
            .setDescription('The faction name.')
            .setRequired(true)
            .setMaxLength(50)
    ),

    new SlashCommandBuilder()
    .setName('create-flagthread')
    .setDescription('Create a faction flag identifier in the Flag Forum.')
    .addStringOption(option =>
        option
            .setName('gangname')
            .setDescription('The faction name.')
            .setRequired(true)
            .setMaxLength(50)
    )
    .addStringOption(option =>
        option
            .setName('color')
            .setDescription('Faction color in HEX format. Example: #FF0000')
            .setRequired(true)
            .setMaxLength(7)
    )
    .addStringOption(option =>
        option
            .setName('image')
            .setDescription('Direct link to the faction image.')
            .setRequired(true)
    ),

    new SlashCommandBuilder()
    .setName('removegang')
    .setDescription('Remove a gang from the faction database and delete its Discord roles.')
    .addStringOption(option =>
        option
            .setName('gangname')
            .setDescription('The faction you want to remove.')
            .setRequired(true)
            .setMaxLength(50)
    ),

    new SlashCommandBuilder()
    .setName('removeflagthread')
    .setDescription('Remove a faction Flag Identifier thread.')
    .addStringOption(option =>
        option
            .setName('gangname')
            .setDescription('The faction whose flag identifier should be removed.')
            .setRequired(true)
            .setMaxLength(50)
    ),

    new SlashCommandBuilder()
    .setName('probationlist')
    .setDescription('View all active probation roles.'),

    new SlashCommandBuilder()
    .setName('probationadd')
    .setDescription('Place a member on a 2-day probation.')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('The member to place on probation.')
            .setRequired(true)
    ),

    new SlashCommandBuilder()
    .setName('blockthread')
    .setDescription('Create a faction Block thread')
    .addStringOption(option =>
        option
            .setName('gangname')
            .setDescription('The faction this Block thread belongs to')
            .setRequired(true)
    )
    .addStringOption(option =>
        option
            .setName('threadname')
            .setDescription('Name of the Block thread')
            .setRequired(true)
    )
    .addAttachmentOption(option =>
        option
            .setName('image')
            .setDescription('Upload the image for this Block thread')
            .setRequired(true)
    ),

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

function getFactionStrikes(gangKey) {
    if (!factionStrikes[gangKey]) {
        factionStrikes[gangKey] = [];
    }

    return factionStrikes[gangKey];
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

client.once('ready', async () => {

    console.log('======================================');
    console.log(`Bot Online: ${client.user.tag}`);
    console.log(`Server ID: ${GUILD_ID}`);
    console.log(`Gang Log Channel: ${GANG_LOG_CHANNEL_ID}`);
    console.log('Gang Management System Ready');
    console.log('======================================');

    // ----------------------------------------------
    // LOAD ACTIVE PROBATION TIMERS
    // ----------------------------------------------

    try {

        await loadActiveProbationTimers();

        console.log(
            '✅ Active probation timers loaded.'
        );

    } catch (error) {

        console.error(
            '❌ Failed to load probation timers:',
            error
        );

    }

});

// ----------------------------------------------
// LOAD ACTIVE PROBATION TIMERS
// ----------------------------------------------

async function loadActiveProbationTimers() {

    const probationData =
        loadProbation();

    for (
        const [userId, probation]
        of Object.entries(probationData)
    ) {

        if (
            !probation ||
            !probation.expiresAt
        ) {

            continue;

        }

        const expiresAt =
            Number(probation.expiresAt);

        if (
            expiresAt <= Date.now()
        ) {

            await expireProbation(
                client,
                userId
            );

        } else {

            scheduleProbationExpiration(
                client,
                userId,
                expiresAt
            );

        }

    }

}

console.log(
    `🕐 Loaded ${Object.keys(loadProbation()).length} probation record(s).`
);

// ======================================================
// SELECTIVE COMMAND LOGGER
// ======================================================

const LOGGED_COMMANDS = new Set([
    'creategang',
    'gangleader',
    'gangtransfer',
    'giveleaderrole',
    'activitylog',
    'strikeadd',
    'strikeinfo',
    'strikelist',
    'strikehistory',
    'strikeremove',
    'strikeclear',
    'gangblock',
    'gangtier',
    'gangrename',
    'create-gangthread',
    'create-flagthread',
    'removegang'
]);

async function logSelectedCommand(interaction) {

    if (!LOGGED_COMMANDS.has(interaction.commandName)) {
        return;
    }

    try {

        if (!GANG_LOG_CHANNEL_ID) {
            console.error(
                '❌ GANG_LOG_CHANNEL_ID is not configured.'
            );
            return;
        }

        const logChannel =
            interaction.guild.channels.cache.get(
                GANG_LOG_CHANNEL_ID
            );

        if (!logChannel) {
            console.error(
                '❌ Command log channel could not be found.'
            );
            return;
        }

        const options = interaction.options.data
            .map(option => {

                let value = option.value;

                if (option.user) {
                    value =
                        `${option.user.tag} (${option.user.id})`;
                }

                if (option.member) {
                    value =
                        `${option.member.user.tag} (${option.member.user.id})`;
                }

                return `**${option.name}:** \`${value}\``;

            })
            .join('\n');

        await logChannel.send({

            embeds: [
                {
                    title: '⚙️ Command Logs',

                    color: 0x5865F2,

                    fields: [
                        {
                            name: 'Command',
                            value:
                                `\`/${interaction.commandName}\``,
                            inline: true
                        },
                        {
                            name: 'User',
                            value:
                                `${interaction.user} (\`${interaction.user.id}\`)`,
                            inline: true
                        },
                        {
                            name: 'Channel',
                            value:
                                `${interaction.channel}`,
                            inline: true
                        },
                        {
                            name: 'Options',
                            value:
                                options || 'None'
                        }
                    ],

                    footer: {
                        text:
                            'Lynwood Factions • Faction Logs'
                    },

                    timestamp:
                        new Date().toISOString()
                }
            ]

        });

    } catch (error) {

        console.error(
            '❌ Failed to send faction command log:',
            error
        );

    }

}

// ======================================================
// SLASH COMMAND HANDLER
// ======================================================

client.on('interactionCreate', async interaction => {

    // Make sure this is a slash command
    if (!interaction.isChatInputCommand()) return;

    // Make sure command is being used inside a server
    if (!interaction.guild) return;

    // Log selected faction commands
    await logSelectedCommand(interaction);

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
// /create-gangthread
// ==================================================

if (interaction.commandName === 'create-gangthread') {

    // ----------------------------------------------
    // CONFIGURATION
    // ----------------------------------------------

    const FACTION_STAFF_ROLE_ID =
        '1545272829891837973';

    // ----------------------------------------------
    // CHECK FACTION STAFF
    // ----------------------------------------------

    if (
        !interaction.member.roles.cache.has(
            FACTION_STAFF_ROLE_ID
        )
    ) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/create-gangthread`.\n\n' +
                'Only **Faction Staff** can create faction Forums.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET GANG NAME
    // ----------------------------------------------

    const gangName =
        interaction.options
            .getString('gangname')
            .trim();

    if (!gangName) {

        return interaction.reply({
            content:
                '❌ You must provide a valid faction name.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const factionEntry =
        Object.entries(GANGS).find(
            ([, gang]) =>
                gang &&
                gang.name &&
                gang.name.toLowerCase() ===
                gangName.toLowerCase()
        );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find **${gangName}** in the faction database.\n\n` +
                `Make sure the faction has already been created with \`/creategang\`.`,
            ephemeral: true
        });

    }

    const [factionKey, gang] =
        factionEntry;

    // ----------------------------------------------
    // GET GANG ROLE
    // ----------------------------------------------

    const gangRole =
        interaction.guild.roles.cache.get(
            gang.gangRole
        );

    if (!gangRole) {

        return interaction.reply({
            content:
                `❌ I found **${gangName}**, but its gang role could not be found.\n\n` +
                `Faction database slot: \`${factionKey}\``,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // CHECK CATEGORY
    // ----------------------------------------------

    const category =
        interaction.guild.channels.cache.get(
            GANG_FORUM_CATEGORY_ID
        );

    if (!category) {

        return interaction.reply({
            content:
                '❌ The faction Forum category could not be found.\n\n' +
                'Check the `GANG_FORUM_CATEGORY_ID` in the code.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // MAKE SURE IT IS A CATEGORY
    // ----------------------------------------------

    if (
        category.type !== ChannelType.GuildCategory
    ) {

        return interaction.reply({
            content:
                '❌ The configured Gang Forum category ID is not a category channel.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // LOAD EXISTING THREAD DATA
    // ----------------------------------------------

    let gangThreads = {};

    try {

        if (
            fs.existsSync(
                GANG_THREADS_FILE
            )
        ) {

            gangThreads =
                JSON.parse(
                    fs.readFileSync(
                        GANG_THREADS_FILE,
                        'utf8'
                    )
                );

        }

    } catch (error) {

        console.error(
            '❌ Could not load gangThreads.json:',
            error
        );

        return interaction.reply({
            content:
                '❌ I could not load the faction thread database.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // CHECK IF THIS FACTION ALREADY HAS A FORUM
    // ----------------------------------------------

    const existingGang =
        Object.values(gangThreads).find(
            faction =>
                faction &&
                faction.name &&
                faction.name.toLowerCase() ===
                gangName.toLowerCase()
        );

    if (existingGang) {

        const existingChannel =
            interaction.guild.channels.cache.get(
                existingGang.forumChannelId
            );

        if (existingChannel) {

            return interaction.reply({
                content:
                    `❌ **${gangName}** already has a faction Forum:\n${existingChannel}`,
                ephemeral: true
            });

        }

        // Old channel no longer exists.
        // Remove the old database entry.
        delete gangThreads[
            existingGang.forumChannelId
        ];

    }

    // ----------------------------------------------
    // CREATE PRIVATE FORUM CHANNEL
    // ----------------------------------------------

    try {

        const forumChannel =
            await interaction.guild.channels.create({

                name:
                    `${gangName}`,

                type:
                    ChannelType.GuildForum,

                parent:
                    GANG_FORUM_CATEGORY_ID,

                // ----------------------------------
                // PRIVATE ACCESS
                // ----------------------------------

                permissionOverwrites: [

                    // @everyone CANNOT SEE IT
                    {
                        id:
                            interaction.guild.id,

                        deny: [
                            'ViewChannel'
                        ]
                    },

                    // FACTION STAFF CAN SEE IT
                    {
                        id:
                            FACTION_STAFF_ROLE_ID,

                        allow: [
                            'ViewChannel',
                            'SendMessages',
                            'ReadMessageHistory',
                            'SendMessagesInThreads'
                        ]
                    },

                    // FACTION MEMBERS CAN SEE IT
                      {
                        id:
                            gangRole.id,

                        allow: [
                            'ViewChannel',
                            'ReadMessageHistory',
                            'SendMessagesInThreads'
                        ],

                        deny: [
                            'CreatePublicThreads',
                            'CreatePrivateThreads'
                        ]
                    },

                    // BOT CAN SEE / MANAGE IT
                    {
                        id:
                            interaction.client.user.id,

                        allow: [
                            'ViewChannel',
                            'SendMessages',
                            'ReadMessageHistory',
                            'SendMessagesInThreads',
                            'CreatePublicThreads',
                            'ManageThreads',
                            'ManageChannels'
                        ]
                    }

                ],

                reason:
                    `Faction Forum created for ${gangName} by ${interaction.user.tag}`

            });

        // ------------------------------------------
        // CUSTOM THREAD MESSAGES
        // ------------------------------------------

       const threadMessages = {

    '💬 Gang Chat':
        `Use this thread for all official faction communication.`,

    '🎥 Valid RP Clips':
        `Send Valid Gang RP Here for rewards at the end of the month!`,

    '📋 Activity Check':
        `Please Submit Your Activity IC Here (Hosted Events, wars won, activity, etc!)`,

    '📑 Roster Logs':
        `Use our Custom Command Here to add/remove members to your roster.`,

    '🎥 Requested POV Clips':
        `@ faction staff with the clip so we can review it.`

};

        // ------------------------------------------
        // CREATE THE FIVE FORUM POSTS
        // ------------------------------------------

        const createdThreads = {};

        for (
            const [threadName, threadMessage]
            of Object.entries(threadMessages)
        ) {

            const thread =
                await forumChannel.threads.create({

                    name:
                        threadName,

                    message: {
                        content:
                            threadMessage
                    },

                    reason:
                        `Faction Forum post created for ${gangName}`

                });

            createdThreads[
                threadName
            ] = {

                threadId:
                    thread.id,

                threadName:
                    thread.name

            };

        }

        // ------------------------------------------
        // SAVE FORUM DATA
        // ------------------------------------------

        gangThreads[
            forumChannel.id
        ] = {

            factionKey:
                factionKey,

            name:
                gangName,

            gangRoleId:
                gangRole.id,

            forumChannelId:
                forumChannel.id,

            categoryId:
                GANG_FORUM_CATEGORY_ID,

            createdBy:
                interaction.user.id,

            createdAt:
                new Date().toISOString(),

            threads:
                createdThreads

        };

        // ------------------------------------------
        // SAVE TO RAILWAY DATA
        // ------------------------------------------

        fs.writeFileSync(
            GANG_THREADS_FILE,
            JSON.stringify(
                gangThreads,
                null,
                4
            )
        );

        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        return interaction.reply({

            content:
                `✅ **Faction Forum Created Successfully**\n\n` +
                `🏴 **Faction:** ${gangName}\n` +
                `👥 **Gang Role:** ${gangRole}\n` +
                `📂 **Forum:** ${forumChannel}\n\n` +
                `**Created Posts:**\n` +
                `💬 Gang Chat\n` +
                `🎥 Valid RP Clips\n` +
                `📋 Activity Check\n` +
                `📑 Roster Logs\n` +
                `🎥 Requested POV Clips\n\n` +
                `🔒 **Access:** Faction members + Faction Staff`,

            ephemeral:
                true

        });

    } catch (error) {

        console.error(
            '❌ Error creating faction Forum:',
            error
        );

        return interaction.reply({

            content:
                '❌ I could not create the faction Forum.\n\n' +
                'Make sure the bot has permission to **Manage Channels**, **View Channels**, **Send Messages**, and **Manage Threads**.',

            ephemeral:
                true

        });

    }

}

// ==================================================
// /blockthread
// ==================================================

if (interaction.commandName === 'blockthread') {

    // ----------------------------------------------
    // CONFIGURATION
    // ----------------------------------------------

    const FACTION_STAFF_ROLE_ID =
        '1545272829891837973';

    const BLOCK_FORUM_CHANNEL_ID =
        '1549677487955382302';

    // ----------------------------------------------
    // CHECK FACTION STAFF
    // ----------------------------------------------

    if (
        !interaction.member.roles.cache.has(
            FACTION_STAFF_ROLE_ID
        )
    ) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/blockthread`.\n\n' +
                'Only **Faction Staff** can create Block threads.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET OPTIONS
    // ----------------------------------------------

    const gangName =
        interaction.options
            .getString('gangname')
            .trim();

    const threadName =
        interaction.options
            .getString('threadname')
            .trim();

    const blockImage =
        interaction.options.getAttachment(
            'image'
        );

    // ----------------------------------------------
    // VALIDATE THREAD NAME
    // ----------------------------------------------

    if (!threadName) {

        return interaction.reply({
            content:
                '❌ You must provide a thread name.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // VALIDATE IMAGE
    // ----------------------------------------------

    if (!blockImage) {

        return interaction.reply({
            content:
                '❌ You must upload a block image.',
            ephemeral: true
        });

    }

    const validImageTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif'
    ];

    if (
        blockImage.contentType &&
        !validImageTypes.includes(
            blockImage.contentType
        )
    ) {

        return interaction.reply({
            content:
                '❌ The uploaded file must be an image.\n\n' +
                'Supported formats: PNG, JPG, JPEG, WEBP, or GIF.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const factionEntry =
        Object.entries(GANGS).find(
            ([, gang]) =>
                gang &&
                gang.name &&
                gang.name.toLowerCase() ===
                gangName.toLowerCase()
        );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find **${gangName}** in the faction database.`,
            ephemeral: true
        });

    }

    const [
        factionKey,
        gang
    ] = factionEntry;

    // ----------------------------------------------
    // GET BLOCK FORUM
    // ----------------------------------------------

    const blockForum =
        await interaction.guild.channels
            .fetch(
                BLOCK_FORUM_CHANNEL_ID
            )
            .catch(() => null);

    if (!blockForum) {

        return interaction.reply({
            content:
                '❌ The Block Forum could not be found.\n\n' +
                'Check your `BLOCK_FORUM_CHANNEL_ID`.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // MAKE SURE IT IS A FORUM
    // ----------------------------------------------

    if (
        blockForum.type !== ChannelType.GuildForum
    ) {

        return interaction.reply({
            content:
                '❌ The configured Block Forum channel is not a Forum channel.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // LOAD THREAD DATABASE
    // ----------------------------------------------

    let gangThreads = {};

    try {

        if (
            fs.existsSync(
                GANG_THREADS_FILE
            )
        ) {

            gangThreads =
                JSON.parse(
                    fs.readFileSync(
                        GANG_THREADS_FILE,
                        'utf8'
                    )
                );

        }

    } catch (error) {

        console.error(
            '❌ Could not load gangThreads.json:',
            error
        );

        return interaction.reply({
            content:
                '❌ I could not load the faction thread database.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // FIND FACTION DATABASE ENTRY
    // ----------------------------------------------

    let factionThreadEntry =
        Object.entries(gangThreads).find(
            ([, data]) =>
                data &&
                data.factionKey === factionKey
        );

    // ----------------------------------------------
    // CHECK EXISTING BLOCK THREAD
    // ----------------------------------------------

    if (factionThreadEntry) {

        const [
            ,
            factionThreadData
        ] = factionThreadEntry;

        if (
            factionThreadData.blockThreadId
        ) {

            const existingBlockThread =
                await blockForum.threads
                    .fetch(
                        factionThreadData.blockThreadId
                    )
                    .catch(() => null);

            if (existingBlockThread) {

                return interaction.reply({
                    content:
                        `❌ **${gang.name}** already has a Block thread:\n${existingBlockThread}\n\n` +
                        `Delete the existing Block thread first if you want to create a new one.`,
                    ephemeral: true
                });

            }

            // ------------------------------------------
            // OLD THREAD NO LONGER EXISTS
            // ------------------------------------------

            delete factionThreadData.blockThreadId;
            delete factionThreadData.blockThreadName;
            delete factionThreadData.blockForumChannelId;
            delete factionThreadData.blockThreadCreatedBy;
            delete factionThreadData.blockThreadCreatedAt;

        }

    }

    // ----------------------------------------------
    // CREATE BLOCK THREAD
    // ----------------------------------------------

    try {

        const blockThread =
            await blockForum.threads.create({

                name:
                    threadName,

                message: {

    embeds: [
        {
            description:
                `🏘️ **${gangName}**\n\n` +
                `📍 **Block:** ${gang.block || 'Not Assigned'}\n\n` +
                `🖼️ **Block Image:** **${blockImage.name}**`,

            image: {
                url: blockImage.url
            },

            color:
                gang.color || 0xFF8C00

        }
    ]

},

                reason:
                    `Block thread created for ${gang.name} by ${interaction.user.tag}`

            });

        // ----------------------------------------------
        // SAVE BLOCK THREAD
        // ----------------------------------------------

        if (factionThreadEntry) {

            const [
                forumId
            ] = factionThreadEntry;

            gangThreads[
                forumId
            ].blockThreadId =
                blockThread.id;

            gangThreads[
                forumId
            ].blockThreadName =
                blockThread.name;

            gangThreads[
                forumId
            ].blockForumChannelId =
                BLOCK_FORUM_CHANNEL_ID;

            gangThreads[
                forumId
            ].block =
                gang.block || null;

            gangThreads[
                forumId
            ].blockImage =
                blockImage.url;

            gangThreads[
                forumId
            ].blockThreadCreatedBy =
                interaction.user.id;

            gangThreads[
                forumId
            ].blockThreadCreatedAt =
                new Date().toISOString();

        } else {

            // ------------------------------------------
            // CREATE STANDALONE DATABASE ENTRY
            // ------------------------------------------

            gangThreads[
                `block_${factionKey}`
            ] = {

                factionKey:
                    factionKey,

                name:
                    gang.name,

                gangRoleId:
                    gang.gangRole,

                block:
                    gang.block || null,

                blockImage:
                    blockImage.url,

                blockForumChannelId:
                    BLOCK_FORUM_CHANNEL_ID,

                blockThreadId:
                    blockThread.id,

                blockThreadName:
                    blockThread.name,

                blockThreadCreatedBy:
                    interaction.user.id,

                blockThreadCreatedAt:
                    new Date().toISOString()

            };

        }

        // ----------------------------------------------
        // SAVE TO RAILWAY
        // ----------------------------------------------

        fs.writeFileSync(
            GANG_THREADS_FILE,
            JSON.stringify(
                gangThreads,
                null,
                4
            )
        );

        // ----------------------------------------------
        // SUCCESS
        // ----------------------------------------------

        return interaction.reply({

            content:
                `✅ **Block Thread Created Successfully**\n\n` +
                `🏴 **Faction:** ${gang.name}\n` +
                `🏘️ **Thread:** ${blockThread}\n` +
                `📍 **Block:** ${gang.block || 'Not Assigned'}\n` +
                `🖼️ **Image:** Uploaded\n\n` +
                `🔒 **Permissions:**\n` +
                `Faction members can view the thread but cannot reply or create posts.`,

            ephemeral: true

        });

    } catch (error) {

        console.error(
            '❌ Error creating Block thread:',
            error
        );

        return interaction.reply({

            content:
                '❌ I could not create the Block thread.\n\n' +
                'Make sure the bot has **View Channel**, **Send Messages**, **Send Messages in Threads**, **Create Posts**, and **Manage Threads** permissions in the Block Forum.',

            ephemeral: true

        });

    }

}

// ==================================================
// /create-flagthread
// ==================================================

if (interaction.commandName === 'create-flagthread') {

    // ----------------------------------------------
    // FACTION STAFF ONLY
    // ----------------------------------------------

    const FACTION_STAFF_ROLE_ID =
        '1545272829891837973';

    if (
        !interaction.member.roles.cache.has(
            FACTION_STAFF_ROLE_ID
        )
    ) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/create-flagthread`.\n\n' +
                'Only **Faction Staff** can create faction flag identifiers.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET OPTIONS
    // ----------------------------------------------

    const gangName =
        interaction.options
            .getString('gangname')
            .trim();

    const color =
        interaction.options
            .getString('color')
            .trim()
            .toUpperCase();

    const image =
        interaction.options
            .getString('image')
            .trim();

    // ----------------------------------------------
    // VALIDATE COLOR
    // ----------------------------------------------

    if (!/^#[0-9A-F]{6}$/i.test(color)) {

        return interaction.reply({
            content:
                '❌ Invalid color.\n\n' +
                'Use a HEX color such as:\n' +
                '`#FF0000`\n' +
                '`#0066FF`\n' +
                '`#800080`',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // VALIDATE IMAGE URL
    // ----------------------------------------------

    try {

        new URL(image);

    } catch {

        return interaction.reply({
            content:
                '❌ The image link you provided is not a valid URL.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const factions =
        loadFactions();

    const factionEntry =
        Object.entries(factions).find(
            ([, gang]) =>
                gang &&
                gang.name &&
                gang.name.toLowerCase() ===
                gangName.toLowerCase()
        );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find **${gangName}** in the faction database.\n\n` +
                `Make sure the faction has already been created with \`/creategang\`.`,
            ephemeral: true
        });

    }

    const [
        factionKey,
        gang
    ] = factionEntry;

    // ----------------------------------------------
    // GET FLAG FORUM
    // ----------------------------------------------

    const flagForum =
        interaction.guild.channels.cache.get(
            FLAG_FORUM_CHANNEL_ID
        );

    if (!flagForum) {

        return interaction.reply({
            content:
                '❌ I could not find the Flag Forum Channel.\n\n' +
                'Check `FLAG_FORUM_CHANNEL_ID` in your Railway variables.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // MAKE SURE IT IS A FORUM
    // ----------------------------------------------

    if (
        flagForum.type !== ChannelType.GuildForum
    ) {

        return interaction.reply({
            content:
                '❌ The configured Flag Forum ID is not a Forum Channel.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // LOAD EXISTING FLAG DATA
    // ----------------------------------------------

    let flagThreads = {};

    try {

        if (
            fs.existsSync(
                FLAG_THREADS_FILE
            )
        ) {

            flagThreads =
                JSON.parse(
                    fs.readFileSync(
                        FLAG_THREADS_FILE,
                        'utf8'
                    )
                );

        }

    } catch (error) {

        console.error(
            '❌ Could not load flagThreads.json:',
            error
        );

        return interaction.reply({
            content:
                '❌ I could not load the flag thread database.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // CHECK FOR EXISTING FLAG
    // ----------------------------------------------

    const existingFlag =
        Object.values(flagThreads).find(
            flag =>
                flag &&
                flag.name &&
                flag.name.toLowerCase() ===
                gangName.toLowerCase()
        );

    if (existingFlag) {

        const existingThread =
            flagForum.threads.cache.get(
                existingFlag.threadId
            );

        if (existingThread) {

            return interaction.reply({
                content:
                    `❌ **${gangName}** already has a flag identifier:\n${existingThread}`,
                ephemeral: true
            });

        }

        delete flagThreads[
            existingFlag.threadId
        ];

    }

    // ----------------------------------------------
    // CREATE FLAG THREAD
    // ----------------------------------------------

    try {

        const thread =
            await flagForum.threads.create({

                name:
                    gangName,

                message: {

                    embeds: [
                        {
                            title:
                                gangName,

                            color:
                                parseInt(
                                    color.substring(1),
                                    16
                                ),

                            image: {
                                url:
                                    image
                            },

                            footer: {
                                text:
                                    'Lynwood Factions • Flag Identifier'
                            },

                            timestamp:
                                new Date().toISOString()
                        }
                    ]

                },

                reason:
                    `Faction flag identifier created for ${gangName}`

            });

        // ------------------------------------------
        // SAVE FLAG DATA
        // ------------------------------------------

        flagThreads[
            thread.id
        ] = {

            factionKey:
                factionKey,

            name:
                gangName,

            color:
                color,

            image:
                image,

            threadId:
                thread.id,

            forumChannelId:
                flagForum.id,

            createdBy:
                interaction.user.id,

            createdAt:
                new Date().toISOString()

        };

        // ------------------------------------------
        // SAVE TO RAILWAY
        // ------------------------------------------

        fs.writeFileSync(
            FLAG_THREADS_FILE,
            JSON.stringify(
                flagThreads,
                null,
                4
            )
        );

        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        return interaction.reply({

            content:
                `✅ **Flag Identifier Created**\n\n` +
                `🏴 **Faction:** ${gangName}\n` +
                `🎨 **Color:** \`${color}\`\n` +
                `🧵 **Thread:** ${thread}`,

            ephemeral:
                true

        });

    } catch (error) {

        console.error(
            '❌ Error creating flag thread:',
            error
        );

        return interaction.reply({

            content:
                '❌ I could not create the faction flag identifier.\n\n' +
                'Make sure the bot has **View Channel**, **Send Messages**, and **Create Posts** permissions in the Flag Forum.',

            ephemeral:
                true

        });

    }

}
    
// ==================================================
// /creategang
// ==================================================

if (interaction.commandName === 'creategang') {

    // ----------------------------------------------
    // HIGH FACTION STAFF ROLE
    // ----------------------------------------------

    const HIGH_FACTION_STAFF_ROLE_ID = '1550018347804917760';

    if (!interaction.member.roles.cache.has(HIGH_FACTION_STAFF_ROLE_ID)) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/creategang`.\n\n' +
                'Only **High Faction Staff** can create gangs.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET GANG NAME
    // ----------------------------------------------

    const gangName =
    interaction.options.getString('name').trim();

    const gangColor =
    interaction.options.getString('color').trim();

   const ownerUserId =
    interaction.options.getUser('user')?.id;

if (!ownerUserId) {

    return interaction.reply({
        content:
            '❌ You must select a user who will own the faction.',
        ephemeral: true
    });

}

let ownerUser;

try {

    ownerUser =
        await interaction.guild.members.fetch(
            ownerUserId
        );

} catch (error) {

    console.error(
        '❌ Could not fetch faction owner:',
        error
    );

    return interaction.reply({
        content:
            '❌ I could not find the selected user in this server.',
        ephemeral: true
    });

}

// ----------------------------------------------
// VERIFY OWNER USER
// ----------------------------------------------

if (!ownerUser) {

    return interaction.reply({
        content:
            '❌ I could not find the selected user in the server.',
        ephemeral: true
    });

}

if (!gangName) {

        return interaction.reply({
            content:
                '❌ You must provide a valid gang name.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
   // VALIDATE GANG COLOR
   // ----------------------------------------------

const normalizedGangColor =
    gangColor.startsWith('#')
        ? gangColor
        : `#${gangColor}`;

if (
    !/^#[0-9A-Fa-f]{6}$/.test(
        normalizedGangColor
    )
) {

    return interaction.reply({
        content:
            '❌ Invalid color.\n\n' +
            'Please use a valid HEX color such as `#FF0000` or `#5865F2`.',
        ephemeral: true
    });

}

    // ----------------------------------------------
    // LOAD LATEST FACTION DATA
    // ----------------------------------------------

    const factions = loadFactions();

    // ----------------------------------------------
    // CHECK IF GANG ALREADY EXISTS
    // ----------------------------------------------

    const existingGang = Object.values(factions).find(
        gang =>
            gang &&
            gang.name &&
            gang.name.toLowerCase() === gangName.toLowerCase()
    );

    if (existingGang) {

        return interaction.reply({
            content:
                `❌ A faction named **${gangName}** already exists.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // FIND NEXT EMPTY FACTION SLOT
    // ----------------------------------------------

    let factionKey = null;

    for (let i = 1; i <= 12; i++) {

        const key = `Faction${i}`;

        if (
            !factions[key] ||
            !factions[key].name ||
            factions[key].name.trim() === ''
        ) {

            factionKey = key;
            break;

        }

    }

    // ----------------------------------------------
    // NO AVAILABLE SLOTS
    // ----------------------------------------------

    if (!factionKey) {

        return interaction.reply({
            content:
                '❌ All **12 faction slots** are currently being used.\n\n' +
                'Remove an existing faction before creating a new one.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // CREATE DISCORD GANG ROLE
    // ----------------------------------------------

    let gangRole = null;
    let leaderRole = null;

    try {

      gangRole =
    await interaction.guild.roles.create({

        name:
            gangName,

        color:
            normalizedGangColor,

        reason:
            `Gang created by ${interaction.user.tag}`

    });

        // ------------------------------------------
        // CREATE LEADER ROLE
        // ------------------------------------------

        leaderRole =
         await interaction.guild.roles.create({
        name: `${gangName} Leader`,
        color: normalizedGangColor,
        reason:
            `Gang leader role created by ${interaction.user.tag}`
    });

    } catch (error) {

        console.error(
            '❌ Could not create gang roles:',
            error
        );

        // Clean up if only one role was created
        if (gangRole) {
            await gangRole.delete().catch(() => {});
        }

        if (leaderRole) {
            await leaderRole.delete().catch(() => {});
        }

        return interaction.reply({
            content:
                '❌ I could not create the Discord roles for this gang.\n\n' +
                'Make sure the bot has **Manage Roles** permission and that its highest role is above the roles it is trying to create.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
// GET FACTION OWNER ROLE
// ----------------------------------------------

const FACTION_OWNER_ROLE_ID =
    '1478512249936150539';

const factionOwnerRole =
    interaction.guild.roles.cache.get(
        FACTION_OWNER_ROLE_ID
    );

if (!factionOwnerRole) {

    await gangRole.delete().catch(() => {});
    await leaderRole.delete().catch(() => {});

    return interaction.reply({
        content:
            '❌ The **Faction Owner** role could not be found.\n\n' +
            `Check the role ID: \`${FACTION_OWNER_ROLE_ID}\``,
        ephemeral: true
    });

}

// ----------------------------------------------
// CHECK BOT ROLE HIERARCHY
// ----------------------------------------------

const botMember =
    interaction.guild.members.me;

if (!botMember) {

    await gangRole.delete().catch(() => {});
    await leaderRole.delete().catch(() => {});

    return interaction.reply({
        content:
            '❌ I could not verify the bot role hierarchy.',
        ephemeral: true
    });

}

if (
    gangRole.position >=
        botMember.roles.highest.position ||
    leaderRole.position >=
        botMember.roles.highest.position ||
    factionOwnerRole.position >=
        botMember.roles.highest.position
) {

    await gangRole.delete().catch(() => {});
    await leaderRole.delete().catch(() => {});

    return interaction.reply({
        content:
            '❌ I cannot assign the faction roles because my bot role is not above the required roles in the Discord role hierarchy.\n\n' +
            'Move the bot role above the Gang role, Leader role, and Faction Owner role.',
        ephemeral: true
    });

}

    // ----------------------------------------------
    // CREATE FACTION DATABASE ENTRY
    // ----------------------------------------------

    factions[factionKey] = {

    name:
        gangName,

    leaderRole:
        leaderRole.id,

    gangRole:
        gangRole.id,

    color:
        normalizedGangColor,

    block:
        'Not Assigned',

    tier:
        'Not Assigned'

};

    // ----------------------------------------------
    // SAVE TO factions.json
    // ----------------------------------------------

    if (!saveFactions(factions)) {

        // Delete roles if the database could not save
        await gangRole.delete().catch(() => {});
        await leaderRole.delete().catch(() => {});

        return interaction.reply({
            content:
                '❌ I could not save the new faction to `factions.json`.\n\n' +
                'The Discord roles were removed so the faction does not remain partially created.',
            ephemeral: true
        });

    }

        // ----------------------------------------------
    // GIVE OWNER THE REQUIRED ROLES
    // ----------------------------------------------

    try {

        // Give Gang Role
        await ownerUser.roles.add(
            gangRole,
            `Faction owner assigned during creation by ${interaction.user.tag}`
        );

        // Give Leader Role
        await ownerUser.roles.add(
            leaderRole,
            `Faction leader assigned during creation by ${interaction.user.tag}`
        );

        // Give Faction Owner Role
        await ownerUser.roles.add(
            factionOwnerRole,
            `Faction Owner assigned during creation by ${interaction.user.tag}`
        );

    } catch (error) {

        console.error(
            '❌ Could not assign faction owner roles:',
            error
        );

        // Remove anything that may have already been assigned
        await ownerUser.roles.remove(
            gangRole
        ).catch(() => {});

        await ownerUser.roles.remove(
            leaderRole
        ).catch(() => {});

        await ownerUser.roles.remove(
            factionOwnerRole
        ).catch(() => {});

        return interaction.reply({
            content:
                '❌ The faction was created, but I could not assign the required roles to the selected user.\n\n' +
                'Make sure the bot has **Manage Roles** permission and is above the faction roles.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // UPDATE IN-MEMORY GANG DATA
    // ----------------------------------------------

    Object.keys(GANGS).forEach(key => {
        delete GANGS[key];
    });

    Object.assign(GANGS, factions);

    // ----------------------------------------------
    // SUCCESS
    // ----------------------------------------------

    return interaction.reply({
        content:
            `✅ **Gang Created Successfully**\n\n` +
            `🏴 **Faction:** ${gangName}\n` +
            `🗂️ **Database Slot:** \`${factionKey}\`\n\n` +
            `👥 **Gang Role:** ${gangRole}\n` +
            `👑 **Leader Role:** ${leaderRole}\n` +
            `🔐 **Faction Owner:** ${ownerUser}\n` +
            `📍 **Block:** Not Assigned\n` +
            `🏆 **Tier:** Not Assigned\n\n` +
            `The gang has been added to \`factions.json\` and is now connected to the faction system.`,
        ephemeral: true
    });

}

// ==================================================
// /removeflagthread
// ==================================================

if (interaction.commandName === 'removeflagthread') {

    const FACTION_STAFF_ROLE_ID =
        '1545272829891837973';

    // ----------------------------------------------
    // PERMISSION CHECK
    // ----------------------------------------------

    if (
        !interaction.member.roles.cache.has(
            FACTION_STAFF_ROLE_ID
        )
    ) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/removeflagthread`.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET GANG NAME
    // ----------------------------------------------

    const gangName =
        interaction.options
            .getString('gangname')
            .trim();

    // ----------------------------------------------
    // LOAD FLAG DATA
    // ----------------------------------------------

    let flagThreads = {};

    try {

        if (
            fs.existsSync(
                FLAG_THREADS_FILE
            )
        ) {

            flagThreads =
                JSON.parse(
                    fs.readFileSync(
                        FLAG_THREADS_FILE,
                        'utf8'
                    )
                );

        }

    } catch (error) {

        console.error(
            '❌ Could not load flagThreads.json:',
            error
        );

        return interaction.reply({
            content:
                '❌ I could not load the Flag Identifier database.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // FIND FLAG
    // ----------------------------------------------

    const flagEntry =
        Object.entries(flagThreads).find(
            ([, flag]) =>
                flag &&
                flag.name &&
                flag.name.toLowerCase() ===
                gangName.toLowerCase()
        );

    if (!flagEntry) {

        return interaction.reply({
            content:
                `❌ No Flag Identifier was found for **${gangName}**.`,
            ephemeral: true
        });

    }

    const [
        flagDatabaseId,
        flagData
    ] = flagEntry;

    // ----------------------------------------------
    // FIND FORUM
    // ----------------------------------------------

    const flagForum =
        interaction.guild.channels.cache.get(
            flagData.forumChannelId
        );

    let threadDeleted =
        false;

    try {

        if (flagForum) {

            let flagThread =
                flagForum.threads.cache.get(
                    flagData.threadId
                );

            // Try fetching the thread if it isn't cached
            if (!flagThread) {

                try {

                    flagThread =
                        await flagForum.threads.fetch(
                            flagData.threadId
                        );

                } catch {

                    flagThread =
                        null;

                }

            }

            if (flagThread) {

                await flagThread.delete(
                    `Flag Identifier removed for ${gangName} by ${interaction.user.tag}`
                );

                threadDeleted =
                    true;

            }

        }

    } catch (error) {

        console.error(
            '❌ Could not delete Flag Identifier thread:',
            error
        );

        return interaction.reply({
            content:
                `❌ I found the Flag Identifier for **${gangName}**, but I could not delete the Discord thread.\n\n` +
                `Make sure the bot has **Manage Threads** permission in the Flag Forum.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // REMOVE FROM DATABASE
    // ----------------------------------------------

    delete flagThreads[
        flagDatabaseId
    ];

    try {

        fs.writeFileSync(
            FLAG_THREADS_FILE,
            JSON.stringify(
                flagThreads,
                null,
                4
            )
        );

    } catch (error) {

        console.error(
            '❌ Could not save flagThreads.json:',
            error
        );

        return interaction.reply({
            content:
                '⚠️ The Flag Identifier thread was deleted, but I could not update the database.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // LOG
    // ----------------------------------------------

    try {

        const logChannel =
            interaction.guild.channels.cache.get(
                GANG_LOG_CHANNEL_ID
            );

        if (logChannel) {

            await logChannel.send({

                embeds: [
                    {
                        title:
                            '🗑️ Flag Identifier Removed',

                        description:
                            `The Flag Identifier for **${gangName}** has been removed.`,

                        color:
                            0xED4245,

                        fields: [

                            {
                                name:
                                    '⚔️ Faction',

                                value:
                                    gangName,

                                inline:
                                    true
                            },

                            {
                                name:
                                    '❌ Removed By',

                                value:
                                    `${interaction.user}`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    '🏮 Thread',

                                value:
                                    threadDeleted
                                        ? 'Deleted'
                                        : 'Already Deleted',

                                inline:
                                    true
                            }

                        ],

                        footer: {
                            text:
                                'Factions • Flag Identifier Removal'

                        },
                        timestamp:
                            new Date().toISOString()
                    }
                ]

            });

        }

    } catch (error) {

        console.error(
            '❌ Could not log Flag Identifier removal:',
            error
        );

    }

    // ----------------------------------------------
    // SUCCESS
    // ----------------------------------------------

    return interaction.reply({

        content:
            `✅ The Flag Identifier for **${gangName}** has been removed.\n\n` +
            `🧵 Thread deleted: **${threadDeleted ? 'Yes' : 'Already deleted'}**\n` +
            `💾 Database entry removed: **Yes**`,

        ephemeral:
            true

    });

}

    // ==================================================
    // /gangadd
    // ==================================================

    if (interaction.commandName === 'gangadd') {

            // ----------------------------------------------
        // ONLY ALLOW /gangadd INSIDE THE FACTION FORUM
        // ----------------------------------------------

        const channel = interaction.channel;

        // /gangadd must be used inside a Forum post/thread
        if (!channel || !channel.isThread()) {

            return interaction.reply({
                content:
                    '❌ `/gangadd` can only be used inside your faction Forum post.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // GET THE PARENT FORUM
        // ----------------------------------------------

        const parentForum =
            interaction.guild.channels.cache.get(
                channel.parentId
            );

        if (
            !parentForum ||
            parentForum.type !== ChannelType.GuildForum
        ) {

            return interaction.reply({
                content:
                    '❌ `/gangadd` can only be used inside your assigned faction Forum.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND LEADER'S GANG
        // ----------------------------------------------

        const leaderGang =
            getLeaderGang(interaction.member);

        if (!leaderGang) {

            await sendGangLog({
                guild: interaction.guild,
                action: 'Unauthorized Attempt',
                leader: interaction.member,
                target: null,
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
        // LOAD GANG THREAD DATABASE
        // ----------------------------------------------

        let gangThreads = {};

        try {

            if (fs.existsSync(GANG_THREADS_FILE)) {

                gangThreads =
                    JSON.parse(
                        fs.readFileSync(
                            GANG_THREADS_FILE,
                            'utf8'
                        )
                    );

            }

        } catch (error) {

            console.error(
                '❌ Could not load gangThreads.json:',
                error
            );

            return interaction.reply({
                content:
                    '❌ I could not verify your faction Forum.',
                ephemeral: true
            });

        }

    // ----------------------------------------------
    // VERIFY THIS FORUM BELONGS TO THEIR GANG
    // ----------------------------------------------

// Find the actual faction database key
// using the Gang + Leader role IDs.
const leaderGangKey =
    Object.keys(GANGS).find(
        key =>
            GANGS[key] &&
            GANGS[key].gangRole === leaderGang.gangRole &&
            GANGS[key].leaderRole === leaderGang.leaderRole
    );

if (!leaderGangKey) {

    await sendGangLog({
        guild: interaction.guild,
        action: 'Unauthorized Attempt',
        leader: interaction.member,
        target: null,
        gang: leaderGang.name,
        success: false,
        reason:
            'Could not determine the faction database key for the Gang Leader.'
    });

    return interaction.reply({
        content:
            `❌ I could not determine the faction database entry for **${leaderGang.name}**.`,
        ephemeral: true
    });
}

// Find the Forum assigned to this faction
const assignedForum =
    Object.values(gangThreads).find(
        forum =>
            forum &&
            forum.factionKey === leaderGangKey
    );

if (
    !assignedForum ||
    assignedForum.forumChannelId !== parentForum.id
) {

    await sendGangLog({
        guild: interaction.guild,
        action: 'Unauthorized Attempt',
        leader: interaction.member,
        target: null,
        gang: leaderGang.name,
        success: false,
        reason:
            'Gang leader attempted to use /gangadd outside their assigned faction Forum.'
    });

    return interaction.reply({
        content:
            `❌ /gangadd can only be used inside **${leaderGang.name}'s assigned faction Forum**.`,
        ephemeral: true
    });

}

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
        // FIND FACTION MEMBER ROLE
        // ----------------------------------------------

const FACTION_MEMBER_ROLE_ID =
    '1545485022193123451';

const factionMemberRole =
    interaction.guild.roles.cache.get(
        FACTION_MEMBER_ROLE_ID
    );

if (!factionMemberRole) {

    await sendGangLog({
        guild: interaction.guild,
        action: 'Failed Add',
        leader: interaction.member,
        target: targetUser,
        gang: leaderGang.name,
        success: false,
        reason:
            'Faction Member role could not be found.'
    });

    return interaction.reply({
        content:
            '❌ The **Faction Member** role could not be found.\n\n' +
            `Check the role ID: \`${FACTION_MEMBER_ROLE_ID}\``,
        ephemeral: true
    });

}

        // ----------------------------------------------
        // CHECK BOT ROLE HIERARCHY
        // ----------------------------------------------

       const botHighestRole =
    interaction.guild.members.me.roles.highest;

if (
    gangRole.position >= botHighestRole.position ||
    factionMemberRole.position >= botHighestRole.position
) {

    await sendGangLog({
        guild: interaction.guild,
        action: 'Failed Add',
        leader: interaction.member,
        target: targetUser,
        gang: leaderGang.name,
        success: false,
        reason:
            'Bot role is not above the Gang role or Faction Member role.'
    });

    return interaction.reply({
        content:
            '❌ I cannot assign the required roles because my bot role is not high enough in the Discord role hierarchy.',
        ephemeral: true
    });

}

    // ----------------------------------------------
    // ADD GANG + FACTION MEMBER ROLES
    // ----------------------------------------------

    try {

    // Add normal faction/gang role
    await targetUser.roles.add(
        gangRole,
        `Added to ${leaderGang.name} by ${interaction.user.tag}`
    );

    // Add global Faction Member role
    await targetUser.roles.add(
        factionMemberRole,
        `Faction Member assigned by ${interaction.user.tag}`
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
            `🏴 **Gang:** ${leaderGang.name}\n` +
            `🛡️ **Faction Member:** ${factionMemberRole}`,
        ephemeral: false
    });

            console.log(
                `[GANG ADD] ${interaction.user.tag} added ${targetUser.user.tag} to ${leaderGang.name}`
            );

} catch (error) {

    console.error(
        '❌ Gang add role assignment error:',
        error
    );

    // Remove gang role if it was successfully added
    // but the Faction Member role failed.
    await targetUser.roles.remove(
        gangRole
    ).catch(() => {});

    await sendGangLog({
        guild: interaction.guild,
        action: 'Failed Add',
        leader: interaction.member,
        target: targetUser,
        gang: leaderGang.name,
        success: false,
        reason:
            'Discord rejected one or more role assignments.'
    });

    return interaction.reply({
        content:
            '❌ I could not give the required faction roles.\n\n' +
            'Make sure the bot has **Manage Roles** permission and its role is above both the Gang role and **Faction Member** role.',
        ephemeral: true
    });

        }  

    }

// ==================================================
// /removegang
// ==================================================

if (interaction.commandName === 'removegang') {

    // ----------------------------------------------
    // HIGH FACTION STAFF ONLY
    // ----------------------------------------------

    const HIGH_FACTION_STAFF_ROLE_ID =
        '1550018347804917760';

    const FACTION_OWNER_ROLE_ID =
        '1478512249936150539';

    const FACTION_MEMBER_ROLE_ID =
        '1545485022193123451';

    if (
        !interaction.member.roles.cache.has(
            HIGH_FACTION_STAFF_ROLE_ID
        )
    ) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/removegang`.\n\n' +
                'Only **High Faction Staff** can remove gangs.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // DEFER REPLY
    // ----------------------------------------------

    await interaction.deferReply({
        ephemeral: true
    });

    // ----------------------------------------------
    // GET GANG NAME
    // ----------------------------------------------

    const gangName =
        interaction.options
            .getString('gangname')
            .trim();

    // ----------------------------------------------
    // LOAD LATEST FACTION DATA
    // ----------------------------------------------

    const factions =
        loadFactions();

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const factionEntry =
        Object.entries(factions).find(
            ([, gang]) =>
                gang &&
                gang.name &&
                gang.name.toLowerCase() ===
                gangName.toLowerCase()
        );

    if (!factionEntry) {

        return interaction.editReply({
            content:
                `❌ I could not find **${gangName}** in the faction database.`
        });

    }

    const [
        factionKey,
        gang
    ] = factionEntry;

    // ----------------------------------------------
    // SAVE ROLE IDS
    // ----------------------------------------------

    const gangRoleId =
        gang.gangRole;

    const leaderRoleId =
        gang.leaderRole;

    // ----------------------------------------------
    // GET ROLES BEFORE DELETING THEM
    // ----------------------------------------------

    const gangRole =
        gangRoleId
            ? interaction.guild.roles.cache.get(
                gangRoleId
            )
            : null;

    const leaderRole =
        leaderRoleId
            ? interaction.guild.roles.cache.get(
                leaderRoleId
            )
            : null;

    const factionOwnerRole =
        interaction.guild.roles.cache.get(
            FACTION_OWNER_ROLE_ID
        );

    const factionMemberRole =
        interaction.guild.roles.cache.get(
            FACTION_MEMBER_ROLE_ID
        );

    // ==================================================
    // FIND CURRENT FACTION MEMBERS / OWNERS
    // ==================================================

    const factionMembers = [];

    const factionOwners = [];

    // ----------------------------------------------
    // FIND MEMBERS WITH THE GANG ROLE
    // ----------------------------------------------

    if (gangRole) {

        const membersWithGangRole =
            interaction.guild.members.cache.filter(
                member =>
                    member.roles.cache.has(
                        gangRoleId
                    )
            );

        for (
            const member
            of membersWithGangRole.values()
        ) {

            factionMembers.push(member);

            // ------------------------------------------
            // CURRENT OWNER
            // ------------------------------------------

            if (
                leaderRoleId &&
                member.roles.cache.has(
                    leaderRoleId
                )
            ) {

                factionOwners.push(member);

            }

        }

    }

    // ==================================================
    // CHECK BOT ROLE HIERARCHY BEFORE CHANGES
    // ==================================================

    const botMember =
        interaction.guild.members.me;

    if (!botMember) {

        return interaction.editReply({
            content:
                '❌ I could not verify my bot role hierarchy.'
        });

    }

    const botHighestRole =
        botMember.roles.highest;

    if (
        gangRole &&
        gangRole.position >=
        botHighestRole.position
    ) {

        return interaction.editReply({
            content:
                `❌ I cannot delete the **${gangName}** Gang role because my bot role is not high enough in the Discord role hierarchy.`
        });

    }

    if (
        leaderRole &&
        leaderRole.position >=
        botHighestRole.position
    ) {

        return interaction.editReply({
            content:
                `❌ I cannot delete the **${gangName} Leader** role because my bot role is not high enough in the Discord role hierarchy.`
        });

    }

    if (
        factionOwnerRole &&
        factionOwners.some(
            member =>
                factionOwnerRole.position >=
                botHighestRole.position
        )
    ) {

        return interaction.editReply({
            content:
                '❌ I cannot remove the **Faction Owner** role because my bot role is not high enough in the Discord role hierarchy.'
        });

    }

    // ==================================================
    // REMOVE OWNERSHIP ROLES
    // ==================================================

    let factionOwnersRemoved = 0;

    try {

        for (
            const owner
            of factionOwners
        ) {

            // ------------------------------------------
            // REMOVE FACTION OWNER
            // ------------------------------------------

            if (
                factionOwnerRole &&
                owner.roles.cache.has(
                    FACTION_OWNER_ROLE_ID
                )
            ) {

                await owner.roles.remove(
                    factionOwnerRole,
                    `Faction ${gangName} removed by ${interaction.user.tag}`
                );

                factionOwnersRemoved++;

            }

        }

    } catch (error) {

        console.error(
            '❌ Could not remove faction ownership roles:',
            error
        );

        return interaction.editReply({
            content:
                `❌ I could not remove the ownership roles for **${gangName}**.\n\n` +
                `Make sure my bot role is above the **Faction Owner** role.`
        });

    }

    // ==================================================
    // REMOVE FACTION MEMBER ROLE
    // ==================================================

    let factionMembersRemoved = 0;

    try {

        if (factionMemberRole) {

            for (
                const member
                of factionMembers
            ) {

                if (
                    member.roles.cache.has(
                        FACTION_MEMBER_ROLE_ID
                    )
                ) {

                    await member.roles.remove(
                        factionMemberRole,
                        `Faction ${gangName} deleted by ${interaction.user.tag}`
                    );

                    factionMembersRemoved++;

                }

            }

        }

    } catch (error) {

        console.error(
            '⚠️ Could not remove Faction Member roles:',
            error
        );

        // Continue with gang deletion.

    }

    // ==================================================
    // DELETE BLOCK THREAD + NORMAL GANG FORUM
    // ==================================================

    let blockThreadDeleted =
        false;

    let gangThreadDeleted =
        false;

    try {

        if (
            fs.existsSync(
                GANG_THREADS_FILE
            )
        ) {

            const gangThreads =
                JSON.parse(
                    fs.readFileSync(
                        GANG_THREADS_FILE,
                        'utf8'
                    )
                );

            // ==================================================
            // FIND ALL THREAD DATA FOR THIS FACTION
            // ==================================================

            const factionThreadEntries =
                Object.entries(
                    gangThreads
                ).filter(
                    ([, forum]) =>
                        forum &&
                        (
                            forum.factionKey ===
                            factionKey
                        )
                );

            // ==================================================
            // DELETE BLOCK THREAD
            // ==================================================

            for (
                const [
                    entryId,
                    forumData
                ]
                of factionThreadEntries
            ) {

                if (
                    forumData.blockThreadId &&
                    forumData.blockForumChannelId
                ) {

                    try {

                        const blockForum =
                            await interaction.guild.channels
                                .fetch(
                                    forumData.blockForumChannelId
                                )
                                .catch(() => null);

                        if (blockForum) {

                            const blockThread =
                                await blockForum.threads.fetch(
                                    forumData.blockThreadId
                                ).catch(() => null);

                            if (blockThread) {

                                await blockThread.delete(
                                    `Block thread removed with faction ${gangName} by ${interaction.user.tag}`
                                );

                                blockThreadDeleted =
                                    true;

                            }

                        }

                    } catch (error) {

                        console.error(
                            `⚠️ Could not delete Block thread for ${gangName}:`,
                            error
                        );

                    }

                    // ------------------------------------------
                    // REMOVE BLOCK DATA
                    // ------------------------------------------

                    delete gangThreads[
                        entryId
                    ];

                }

            }

            // ==================================================
            // DELETE NORMAL GANG FORUM
            // ==================================================

            const gangThreadEntry =
                Object.entries(
                    gangThreads
                ).find(
                    ([, forum]) =>
                        forum &&
                        forum.factionKey ===
                        factionKey &&
                        forum.forumChannelId
                );

            if (gangThreadEntry) {

                const [
                    forumId,
                    forumData
                ] = gangThreadEntry;

                const forumChannel =
                    await interaction.guild.channels
                        .fetch(
                            forumData.forumChannelId
                        )
                        .catch(() => null);

                if (forumChannel) {

                    await forumChannel.delete(
                        `Faction ${gangName} removed by ${interaction.user.tag}`
                    );

                    gangThreadDeleted =
                        true;

                }

                // ------------------------------------------
                // REMOVE NORMAL FORUM DATA
                // ------------------------------------------

                delete gangThreads[
                    forumId
                ];

            }

            // ==================================================
            // SAVE UPDATED THREAD DATABASE
            // ==================================================

            fs.writeFileSync(
                GANG_THREADS_FILE,
                JSON.stringify(
                    gangThreads,
                    null,
                    4
                )
            );

        }

    } catch (error) {

        console.error(
            '⚠️ Could not remove faction thread data:',
            error
        );

    }

    // ==================================================
    // DELETE GANG + LEADER ROLES
    // ==================================================

    let gangRoleDeleted =
        false;

    let leaderRoleDeleted =
        false;

    try {

        // ----------------------------------------------
        // DELETE GANG ROLE
        // ----------------------------------------------

        if (gangRole) {

            await gangRole.delete(
                `Faction ${gangName} removed by ${interaction.user.tag}`
            );

            gangRoleDeleted =
                true;

        }

        // ----------------------------------------------
        // DELETE LEADER ROLE
        // ----------------------------------------------

        if (leaderRole) {

            await leaderRole.delete(
                `Faction ${gangName} removed by ${interaction.user.tag}`
            );

            leaderRoleDeleted =
                true;

        }

    } catch (error) {

        console.error(
            '❌ Could not delete faction roles:',
            error
        );

        return interaction.editReply({

            content:
                `❌ I could not completely remove **${gangName}**.\n\n` +
                `Make sure the bot has **Manage Roles** permission and that its highest role is above the faction roles.\n\n` +
                `The faction database has **NOT** been changed.`

        });

    }

    // ==================================================
    // REMOVE FROM FACTION DATABASE
    // ==================================================

    delete factions[
        factionKey
    ];

    if (!saveFactions(factions)) {

        return interaction.editReply({

            content:
                `⚠️ The Discord roles were removed, but I could not save the faction database.\n\n` +
                `Faction: **${gangName}**\n` +
                `Database slot: \`${factionKey}\``

        });

    }

    // ==================================================
    // REMOVE FLAG THREAD
    // ==================================================

    let flagThreadDeleted =
        false;

    try {

        if (
            fs.existsSync(
                FLAG_THREADS_FILE
            )
        ) {

            const flagThreads =
                JSON.parse(
                    fs.readFileSync(
                        FLAG_THREADS_FILE,
                        'utf8'
                    )
                );

            const flagEntry =
                Object.entries(flagThreads).find(
                    ([, flag]) =>
                        flag &&
                        flag.name &&
                        flag.name.toLowerCase() ===
                        gangName.toLowerCase()
                );

            if (flagEntry) {

                const [
                    flagThreadId,
                    flagData
                ] = flagEntry;

                const flagForum =
                    interaction.guild.channels.cache.get(
                        flagData.forumChannelId
                    );

                if (flagForum) {

                    const flagThread =
                        flagForum.threads.cache.get(
                            flagData.threadId
                        );

                    if (flagThread) {

                        await flagThread.delete(
                            `Flag identifier removed with faction ${gangName}`
                        );

                        flagThreadDeleted =
                            true;

                    }

                }

                delete flagThreads[
                    flagThreadId
                ];

                fs.writeFileSync(
                    FLAG_THREADS_FILE,
                    JSON.stringify(
                        flagThreads,
                        null,
                        4
                    )
                );

            }

        }

    } catch (error) {

        console.error(
            '⚠️ Could not remove flag thread:',
            error
        );

    }

    // ==================================================
    // LOG REMOVAL
    // ==================================================

    try {

        const logChannel =
            interaction.guild.channels.cache.get(
                GANG_LOG_CHANNEL_ID
            );

        if (logChannel) {

            await logChannel.send({

                embeds: [
                    {

                        title:
                            '🗑️ Faction Removed',

                        description:
                            `**${gangName}** has been completely removed from the faction system.`,

                        color:
                            0xED4245,

                        fields: [

                            {
                                name:
                                    '🏷️ Faction',

                                value:
                                    gangName,

                                inline:
                                    true
                            },

                            {
                                name:
                                    '👤 Removed By',

                                value:
                                    `${interaction.user}`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    '📁 Database Slot',

                                value:
                                    factionKey,

                                inline:
                                    true
                            },

                            {
                                name:
                                    '👥 Gang Role',

                                value:
                                    gangRoleDeleted
                                        ? 'Deleted'
                                        : 'Not Found',

                                inline:
                                    true
                            },

                            {
                                name:
                                    '👑 Leader Role',

                                value:
                                    leaderRoleDeleted
                                        ? 'Deleted'
                                        : 'Not Found',

                                inline:
                                    true
                            },

                            {
                                name:
                                    '👑 Faction Owners',

                                value:
                                    `${factionOwnersRemoved} removed`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    '🛡️ Faction Members',

                                value:
                                    `${factionMembersRemoved} removed`,

                                inline:
                                    true
                            },

                            {
                                name:
                                    '🧵 Gang Forum',

                                value:
                                    gangThreadDeleted
                                        ? 'Deleted'
                                        : 'Not Found',

                                inline:
                                    true
                            },

                            {
                                name:
                                    '🏘️ Block Thread',

                                value:
                                    blockThreadDeleted
                                        ? 'Deleted'
                                        : 'Not Found',

                                inline:
                                    true
                            },

                            {
                                name:
                                    '🏴 Flag Identifier',

                                value:
                                    flagThreadDeleted
                                        ? 'Deleted'
                                        : 'Not Found',

                                inline:
                                    true
                            }

                        ],

                        footer: {
                            text:
                                'Lynwood Factions • Faction Removed'
                        },

                        timestamp:
                            new Date().toISOString()

                    }
                ]

            });

        }

    } catch (error) {

        console.error(
            '❌ Could not log faction removal:',
            error
        );

    }

    // ==================================================
    // SUCCESS
    // ==================================================

    return interaction.editReply({

        content:
            `✅ **${gangName}** has been completely removed.\n\n` +
            `🗑️ Faction database entry removed\n` +
            `👥 Gang role deleted: ${gangRoleDeleted ? 'Yes' : 'No'}\n` +
            `👑 Gang Leader role deleted: ${leaderRoleDeleted ? 'Yes' : 'No'}\n` +
            `👑 Faction Owner removed: ${factionOwnersRemoved}\n` +
            `🔐 Faction Member removed: ${factionMembersRemoved}\n` +
            `✍️ Gang Forum deleted: ${gangThreadDeleted ? 'Yes' : 'No'}\n` +
            `🏘️ Block thread deleted: ${blockThreadDeleted ? 'Yes' : 'No'}\n` +
            `🏴 Flag identifier cleaned up: ${flagThreadDeleted ? 'Yes' : 'No'}`

    });

}
    // ==================================================
// /gangremove
// ==================================================

if (interaction.commandName === 'gangremove') {

    const FACTION_MEMBER_ROLE_ID =
        '1545485022193123451';

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
    // FIND FACTION MEMBER ROLE
    // ----------------------------------------------

    const factionMemberRole =
        interaction.guild.roles.cache.get(
            FACTION_MEMBER_ROLE_ID
        );

    if (!factionMemberRole) {

        return interaction.reply({
            content:
                '❌ The **Faction Member** role could not be found.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // CHECK BOT ROLE HIERARCHY
    // ----------------------------------------------

    const botHighestRole =
        interaction.guild.members.me.roles.highest;

    if (
        gangRole.position >=
            botHighestRole.position ||
        factionMemberRole.position >=
            botHighestRole.position
    ) {

        return interaction.reply({
            content:
                '❌ I cannot remove the required roles because my bot role is not high enough in the Discord role hierarchy.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // REMOVE BOTH ROLES
    // ----------------------------------------------

    try {

        // ------------------------------------------
        // REMOVE GANG ROLE
        // ------------------------------------------

        await targetUser.roles.remove(
            gangRole,
            `Removed from ${leaderGang.name} by ${interaction.user.tag}`
        );

        // ------------------------------------------
        // REMOVE FACTION MEMBER ROLE
        // ------------------------------------------

        await targetUser.roles.remove(
            factionMemberRole,
            `Faction Member role removed by ${interaction.user.tag}`
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
                `🏴 **Gang:** ${leaderGang.name}\n` +
                `🛡️ **Faction Member:** Removed`,

            ephemeral: true

        });

        console.log(
            `[GANG REMOVE] ${interaction.user.tag} removed ${targetUser.user.tag} from ${leaderGang.name} and removed Faction Member role`
        );

    } catch (error) {

        console.error(
            '❌ Error removing gang member roles:',
            error
        );

        await sendGangLog({
            guild: interaction.guild,
            action: 'Failed Remove',
            leader: interaction.member,
            target: targetUser,
            gang: leaderGang.name,
            success: false,
            reason:
                'Discord rejected one or more role removals.'
        });

        // ------------------------------------------
        // ERROR MESSAGE
        // ------------------------------------------

        return interaction.reply({
            content:
                '❌ I could not completely remove that member. Check my role position and permissions.',
            ephemeral: true
        });

    }

}

// ==================================================
// /probationadd
// ==================================================

if (interaction.commandName === 'probationadd') {

    // ----------------------------------------------
    // FACTION STAFF ONLY
    // ----------------------------------------------

    const FACTION_STAFF_ROLE_ID =
        '1545272829891837973';

    if (
        !interaction.member.roles.cache.has(
            FACTION_STAFF_ROLE_ID
        )
    ) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/probationadd`.\n\n' +
                'Only **Faction Staff** can place members on probation.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET TARGET MEMBER
    // ----------------------------------------------

    const targetMember =
        interaction.options.getMember('user');

    if (!targetMember) {

        return interaction.reply({
            content:
                '❌ I could not find that member in the server.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // PROBATION ROLE
    // ----------------------------------------------

    const PROBATION_ROLE_ID =
        '1478512307809292318';

    const probationRole =
        interaction.guild.roles.cache.get(
            PROBATION_ROLE_ID
        );

    if (!probationRole) {

        return interaction.reply({
            content:
                '❌ The probation role could not be found.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // CHECK BOT ROLE HIERARCHY
    // ----------------------------------------------

    const botMember =
        interaction.guild.members.me;

    if (
        !botMember ||
        probationRole.position >=
            botMember.roles.highest.position
    ) {

        return interaction.reply({
            content:
                '❌ I cannot manage the probation role because it is above my highest role.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // LOAD PROBATION DATA
    // ----------------------------------------------

    const probationData =
        loadProbation();

    // ----------------------------------------------
    // 2 DAY EXPIRATION
    // ----------------------------------------------

    const now =
        Date.now();

    const TWO_DAYS =
        2 * 24 * 60 * 60 * 1000;

    const expiresAt =
        now + TWO_DAYS;

    // ----------------------------------------------
    // GIVE PROBATION ROLE
    // ----------------------------------------------

    try {

        await targetMember.roles.add(
            probationRole,
            `2-day probation added by ${interaction.user.tag}`
        );

    } catch (error) {

        console.error(
            '❌ Failed to add probation role:',
            error
        );

        return interaction.reply({
            content:
                '❌ I could not give the member the probation role. Check my **Manage Roles** permission and role hierarchy.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // SAVE PROBATION DATA
    // ----------------------------------------------

    probationData[targetMember.id] = {

        roleId:
            PROBATION_ROLE_ID,

        expiresAt:
            expiresAt

    };

    const saved =
        saveProbation(
            probationData
        );

    if (!saved) {

        // Remove the role if the data could not
        // be saved so the probation does not
        // become unsynchronized.

        await targetMember.roles.remove(
            probationRole,
            'Probation data failed to save'
        ).catch(() => {});

        return interaction.reply({
            content:
                '❌ The probation role was added, but I could not save the probation data. The role has been removed.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // SUCCESS
    // ----------------------------------------------

    return interaction.reply({

        embeds: [

            {
                color: 0xFF8C00,

                title:
                    '🕐 LYNWOOD FACTIONS • PROBATION ADDED',

                description:
                    `👤 **Member:** ${targetMember}\n` +
                    `🏷️ **Role:** ${probationRole}\n` +
                    `⏳ **Duration:** 2 days\n` +
                    `📅 **Expires:** <t:${Math.floor(expiresAt / 1000)}:F>`,

                footer: {
                    text:
                        'Lynwood Factions • Probation'
                },

                timestamp:
                    new Date().toISOString()
            }

        ],

        ephemeral: false

    });

}

// ==================================================
// /probationlist
// ==================================================

if (interaction.commandName === 'probationlist') {

    // ----------------------------------------------
    // FACTION STAFF ONLY
    // ----------------------------------------------

    const FACTION_STAFF_ROLE_ID =
        '1545272829891837973';

    if (
        !interaction.member.roles.cache.has(
            FACTION_STAFF_ROLE_ID
        )
    ) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/probationlist`.\n\n' +
                'Only **Faction Staff** can view probation members.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // LOAD PROBATION DATA
    // ----------------------------------------------

    const probationData =
        loadProbation();

    const now =
        Date.now();

    // ----------------------------------------------
    // REMOVE EXPIRED PROBATIONS
    // ----------------------------------------------

    const activeProbations = [];

    for (
        const [userId, probation]
        of Object.entries(probationData)
    ) {

        if (
            !probation ||
            !probation.expiresAt
        ) {
            continue;
        }

        if (
            Number(probation.expiresAt) <= now
        ) {
            continue;
        }

        activeProbations.push({
            userId,
            ...probation
        });

    }

    // ----------------------------------------------
    // SAVE CLEANED DATA
    // ----------------------------------------------

    const cleanedProbationData = {};

    for (
        const probation
        of activeProbations
    ) {

        cleanedProbationData[
            probation.userId
        ] = {

            roleId:
                probation.roleId,

            expiresAt:
                probation.expiresAt

        };

    }

    saveProbation(
        cleanedProbationData
    );

    // ----------------------------------------------
    // NO ACTIVE PROBATIONS
    // ----------------------------------------------

    if (
        activeProbations.length === 0
    ) {

        return interaction.reply({

            embeds: [

                {
                    color: 0xFF8C00,

                    title:
                        '🕐 LYNWOOD FACTIONS • PROBATION LIST',

                    description:
                        'There are currently **no active probation members**.',

                    footer: {
                        text:
                            'Lynwood Factions • Probation List'
                    },

                    timestamp:
                        new Date().toISOString()
                }

            ],

            ephemeral: true

        });

    }

    // ----------------------------------------------
    // BUILD PROBATION LIST
    // ----------------------------------------------

    const probationList =
        activeProbations.map(
            (probation, index) => {

                const member =
                    interaction.guild.members.cache.get(
                        probation.userId
                    );

                const role =
                    interaction.guild.roles.cache.get(
                        probation.roleId
                    );

                const expiresAt =
                    Number(
                        probation.expiresAt
                    );

                const remaining =
                    Math.max(
                        0,
                        expiresAt - now
                    );

                const totalMinutes =
                    Math.floor(
                        remaining / 60000
                    );

                const days =
                    Math.floor(
                        totalMinutes / 1440
                    );

                const hours =
                    Math.floor(
                        (totalMinutes % 1440) / 60
                    );

                const minutes =
                    totalMinutes % 60;

                let timeRemaining = '';

                if (days > 0) {

                    timeRemaining +=
                        `${days} day${days === 1 ? '' : 's'}`;

                }

                if (hours > 0) {

                    if (timeRemaining) {
                        timeRemaining += ', ';
                    }

                    timeRemaining +=
                        `${hours} hour${hours === 1 ? '' : 's'}`;

                }

                if (
                    minutes > 0 ||
                    !timeRemaining
                ) {

                    if (timeRemaining) {
                        timeRemaining += ', ';
                    }

                    timeRemaining +=
                        `${minutes} minute${minutes === 1 ? '' : 's'}`;

                }

                return (

                    `**${index + 1}.** ` +

                    `👤 **Member:** ${
                        member
                            ? `${member}`
                            : `<@${probation.userId}>`
                    }\n` +

                    `🏷️ **Role:** ${
                        role
                            ? `<@&${probation.roleId}>`
                            : 'Role Deleted'
                    }\n` +

                    `⏳ **Time Remaining:** ${timeRemaining}\n` +

                    `📅 **Expires:** <t:${
                        Math.floor(
                            expiresAt / 1000
                        )
                    }:F>`

                );

            }
        ).join('\n\n');

    // ----------------------------------------------
    // SEND PROBATION LIST
    // ----------------------------------------------

    return interaction.reply({

        embeds: [

            {
                color: 0xFF8C00,

                title:
                    '🕐 LYNWOOD FACTIONS • PROBATION LIST',

                description:
                    `There are **${activeProbations.length}** active probation member${
                        activeProbations.length === 1
                            ? ''
                            : 's'
                    }.\n\n` +
                    probationList,

                footer: {
                    text:
                        'Lynwood Factions • Probation List'
                },

                timestamp:
                    new Date().toISOString()
            }

        ],

        ephemeral: true

    });

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
                `📍 **Block:** ${leaderGang.block || 'Not Assigned'}\n` +
                `🏆 **Tier:** ${leaderGang.tier || 'Not Assigned'}\n` +
                `👥 **Members:** ${members.size}\n\n` +
                `**Gang Members:**\n${memberList}`,

            ephemeral: true

        });

    }

// ==================================================
// /ganglist
// ==================================================

if (interaction.commandName === 'ganglist') {

    // ----------------------------------------------
    // LOAD REGISTERED GANGS
    // ----------------------------------------------

    const gangs = Object.values(loadFactions()).filter(
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

    // ----------------------------------------------
    // FETCH ALL SERVER MEMBERS
    // ----------------------------------------------
    // This is important after a Railway redeploy.
    // It refreshes Discord.js' member cache so
    // gangRole.members.size is accurate.

    try {

        await interaction.guild.members.fetch();

    } catch (error) {

        console.error(
            '❌ Could not fetch guild members for /ganglist:',
            error
        );

        return interaction.reply({
            content:
                '❌ I could not load the server members. Please try again.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // BUILD GANG LIST
    // ----------------------------------------------

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

            const memberCount =
                gangRole
                    ? gangRole.members.size
                    : 0;

            return (
                `**${index + 1}. ${gang.name}**\n` +

                `👑 Leader Role: ${
                    leaderRole
                        ? `<@&${gang.leaderRole}>`
                        : 'Not Found'
                }\n` +

                `👥 Member Role: ${
                    gangRole
                        ? `<@&${gang.gangRole}>`
                        : 'Not Found'
                }\n` +

                `👤 Members: **${memberCount}**`
            );

        })
        .join('\n\n');

    // ----------------------------------------------
    // EMBED
    // ----------------------------------------------

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

    // ----------------------------------------------
    // SEND
    // ----------------------------------------------

    return interaction.reply({

        embeds: [
            gangListEmbed
        ],

        ephemeral: false

    });

}

// ==================================================
// /gangleader
// ==================================================

if (interaction.commandName === 'gangleader') {

    const latestFactions = loadFactions();

    const gangs = Object.values(latestFactions).filter(
        gang =>
            gang &&
            gang.name &&
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

    // Make sure Discord.js has the current guild members
    await interaction.guild.members.fetch().catch(() => null);

    const leaderList = (
        await Promise.all(
            gangs.map(async (gang, index) => {

                const leaderRole =
                    await interaction.guild.roles.fetch(
                        gang.leaderRole
                    ).catch(() => null);

                if (!leaderRole) {

                    return (
                        `**${index + 1}. ${gang.name}**\n` +
                        `👑 Leader Role: Not Found\n` +
                        `👤 Leader: Not Found`
                    );

                }

                // Find members who currently have this leader role
                const leaders =
                    interaction.guild.members.cache.filter(
                        member =>
                            member.roles.cache.has(
                                gang.leaderRole
                            )
                    );

                const leaderMentions =
                    leaders.size > 0
                        ? leaders
                            .map(member => `${member}`)
                            .join(', ')
                        : 'No leader assigned';

                return (
                    `**${index + 1}. ${gang.name}**\n` +
                    `👑 Leader: ${leaderMentions}`
                );

            })
        )
    ).join('\n\n');

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

    const FACTION_OWNER_ROLE_ID =
        '1478512249936150539';

    const FACTION_MEMBER_ROLE_ID =
        '1545485022193123451';

    // ----------------------------------------------
    // ACKNOWLEDGE COMMAND IMMEDIATELY
    // ----------------------------------------------

    await interaction.deferReply({
        ephemeral: true
    });

    const targetUser =
        interaction.options.getMember('user');

    // ----------------------------------------------
    // CHECK TARGET
    // ----------------------------------------------

    if (!targetUser) {

        return interaction.editReply({
            content:
                '❌ I could not find that member in the server.'
        });

    }

    // ----------------------------------------------
    // FIND CURRENT LEADER'S GANG
    // ----------------------------------------------

    const leaderGang =
        getLeaderGang(interaction.member);

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

        return interaction.editReply({
            content:
                '❌ You are not authorized to transfer faction leadership.\n\n' +
                'You must be a registered **Gang Leader**.'
        });

    }

    // ----------------------------------------------
    // CANNOT TRANSFER TO YOURSELF
    // ----------------------------------------------

    if (
        targetUser.id === interaction.user.id
    ) {

        return interaction.editReply({
            content:
                '❌ You cannot transfer leadership to yourself.'
        });

    }

    // ----------------------------------------------
    // TARGET MUST ALREADY BE IN THE GANG
    // ----------------------------------------------

    if (
        !targetUser.roles.cache.has(
            leaderGang.gangRole
        )
    ) {

        return interaction.editReply({
            content:
                `❌ ${targetUser} is not currently a member of **${leaderGang.name}**.\n\n` +
                'The new leader must already be a member of the faction.'
        });

    }

    // ----------------------------------------------
    // GET GANG ROLE
    // ----------------------------------------------

    const gangRole =
        interaction.guild.roles.cache.get(
            leaderGang.gangRole
        );

    if (!gangRole) {

        return interaction.editReply({
            content:
                `❌ The **${leaderGang.name}** Gang role could not be found.`
        });

    }

    // ----------------------------------------------
    // GET LEADER ROLE
    // ----------------------------------------------

    const leaderRole =
        interaction.guild.roles.cache.get(
            leaderGang.leaderRole
        );

    if (!leaderRole) {

        return interaction.editReply({
            content:
                `❌ The **${leaderGang.name} Leader** role could not be found.`
        });

    }

    // ----------------------------------------------
    // GET FACTION OWNER ROLE
    // ----------------------------------------------

    const factionOwnerRole =
        interaction.guild.roles.cache.get(
            FACTION_OWNER_ROLE_ID
        );

    if (!factionOwnerRole) {

        return interaction.editReply({
            content:
                '❌ The **Faction Owner** role could not be found.'
        });

    }

    // ----------------------------------------------
    // GET FACTION MEMBER ROLE
    // ----------------------------------------------

    const factionMemberRole =
        interaction.guild.roles.cache.get(
            FACTION_MEMBER_ROLE_ID
        );

    if (!factionMemberRole) {

        return interaction.editReply({
            content:
                '❌ The **Faction Member** role could not be found.'
        });

    }

    // ----------------------------------------------
    // BOT ROLE HIERARCHY
    // ----------------------------------------------

    const botMember =
        interaction.guild.members.me;

    if (!botMember) {

        return interaction.editReply({
            content:
                '❌ I could not verify the bot role hierarchy.'
        });

    }

    if (
        leaderRole.position >=
            botMember.roles.highest.position ||

        factionOwnerRole.position >=
            botMember.roles.highest.position ||

        factionMemberRole.position >=
            botMember.roles.highest.position
    ) {

        return interaction.editReply({
            content:
                '❌ I cannot complete the transfer because my bot role is not high enough in the Discord role hierarchy.\n\n' +
                'Make sure my bot role is above the **Leader**, **Faction Owner**, and **Faction Member** roles.'
        });

    }

    // ----------------------------------------------
    // TRANSFER OWNERSHIP
    // ----------------------------------------------

    try {

        // ==========================================
        // REMOVE LEADER ROLE FROM PREVIOUS OWNER
        // ==========================================

        // IMPORTANT:
        // The previous owner KEEPS the Gang role.
        // Only the ownership roles are removed.

        await interaction.member.roles.remove(
            leaderRole,
            `Faction leadership transferred to ${targetUser.user.tag}`
        );

        // ==========================================
        // REMOVE FACTION OWNER ROLE
        // FROM PREVIOUS OWNER
        // ==========================================

        await interaction.member.roles.remove(
            factionOwnerRole,
            `Faction ownership transferred to ${targetUser.user.tag}`
        );

        // ==========================================
        // GIVE LEADER ROLE TO NEW OWNER
        // ==========================================

        await targetUser.roles.add(
            leaderRole,
            `Faction leadership transferred by ${interaction.user.tag}`
        );

        // ==========================================
        // GIVE FACTION OWNER ROLE TO NEW OWNER
        // ==========================================

        await targetUser.roles.add(
            factionOwnerRole,
            `Faction ownership transferred by ${interaction.user.tag}`
        );

        // ==========================================
        // MAKE SURE NEW OWNER HAS GANG ROLE
        // ==========================================

        if (
            !targetUser.roles.cache.has(
                gangRole.id
            )
        ) {

            await targetUser.roles.add(
                gangRole,
                `Faction membership transferred by ${interaction.user.tag}`
            );

        }

        // ==========================================
        // REMOVE FACTION MEMBER ROLE
        // FROM NEW OWNER
        // ==========================================

        if (
            targetUser.roles.cache.has(
                factionMemberRole.id
            )
        ) {

            await targetUser.roles.remove(
                factionMemberRole,
                `Faction Member role removed because ${targetUser.user.tag} became faction owner`
            );

        }

        // ------------------------------------------
        // LOG SUCCESS
        // ------------------------------------------

        await sendGangLog({
            guild: interaction.guild,
            action: 'Leadership Transferred',
            leader: interaction.member,
            target: targetUser,
            gang: leaderGang.name,
            success: true,
            reason:
                'Previous owner kept the Gang role but lost Leader and Faction Owner. New owner received Gang, Leader, and Faction Owner and had Faction Member removed.'
        });

        // ------------------------------------------
        // SUCCESS MESSAGE
        // ------------------------------------------

        return interaction.editReply({
            content:
                `🔒 **Gang Ownership Transferred**\n\n` +
                `⚔️ **Faction:** ${leaderGang.name}\n` +
                `👤 **Previous Owner:** ${interaction.user}\n` +
                `👑 **New Owner:** ${targetUser}\n\n` +

                `**Previous Owner:**\n` +
                `✅ Gang role kept\n` +
                `❌ Leader role removed\n` +
                `❌ Faction Owner role removed\n\n` +

                `**New Owner:**\n` +
                `✅ Gang role\n` +
                `✅ Leader role\n` +
                `✅ Faction Owner role\n` +
                `❌ Faction Member role removed`
        });

    } catch (error) {

        console.error(
            '❌ Gang transfer error:',
            error
        );

        await sendGangLog({
            guild: interaction.guild,
            action: 'Failed Transfer',
            leader: interaction.member,
            target: targetUser,
            gang: leaderGang.name,
            success: false,
            reason:
                'Discord rejected one or more faction role changes.'
        });

        return interaction.editReply({
            content:
                '❌ I could not complete the ownership transfer.\n\n' +
                'Make sure I have **Manage Roles** permission and my bot role is above the **Leader**, **Faction Owner**, and **Faction Member** roles.'
        });

    }

}

// ==================================================
// /gangblock
// ==================================================

if (interaction.commandName === 'gangblock') {

    // ----------------------------------------------
    // HIGH FACTION STAFF ROLE
    // ----------------------------------------------

    const HIGH_FACTION_STAFF_ROLE_ID =
        '1550018347804917760';

    if (
        !interaction.member.roles.cache.has(
            HIGH_FACTION_STAFF_ROLE_ID
        )
    ) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/gangblock`.\n\n' +
                'Only **High Faction Staff** can assign or change faction blocks.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET OPTIONS
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

    const newBlock =
        interaction.options.getString('block');

    const blockImage =
        interaction.options.getAttachment('image');

    // ----------------------------------------------
    // CHECK BLOCK IMAGE
    // ----------------------------------------------

    if (blockImage) {

        const validImageTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/gif'
        ];

        if (
            blockImage.contentType &&
            !validImageTypes.includes(
                blockImage.contentType
            )
        ) {

            return interaction.reply({
                content:
                    '❌ The block image must be a valid image file.\n\n' +
                    'Accepted formats: **PNG, JPG, JPEG, WEBP, GIF**.',
                ephemeral: true
            });

        }

    }

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const factionEntry =
        Object.entries(GANGS).find(
            ([key, gang]) =>
                gang &&
                gang.name &&
                gang.name.toLowerCase() ===
                factionName.toLowerCase()
        );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    const [
        gangKey,
        gang
    ] = factionEntry;

    // ----------------------------------------------
    // SAVE OLD BLOCK
    // ----------------------------------------------

    const oldBlock =
        gang.block || 'Not Assigned';

    // ----------------------------------------------
    // SAVE OLD IMAGE
    // ----------------------------------------------

    const oldBlockImage =
        gang.blockImage || null;

    // ----------------------------------------------
    // UPDATE BLOCK
    // ----------------------------------------------

    gang.block =
        newBlock;

    // ----------------------------------------------
    // UPDATE BLOCK IMAGE
    // ----------------------------------------------

    if (blockImage) {

        gang.blockImage =
            blockImage.url;

    }

    // ----------------------------------------------
    // SAVE FACTION DATA
    // ----------------------------------------------

    if (!saveFactions(GANGS)) {

        return interaction.reply({
            content:
                '❌ The block was changed, but I could not save the faction data.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // BUILD CONFIRMATION
    // ----------------------------------------------

    const response = {

        content:
            `🏘️ **Faction Block Updated**\n\n` +
            `🏴 **Faction:** ${gang.name}\n` +
            `📍 **Previous Block:** ${oldBlock}\n` +
            `🏡 **New Block:** ${newBlock}\n\n` +
            `❤️ **Changed By:** ${interaction.user}`,

        ephemeral:
            true

    };

    // ----------------------------------------------
    // SHOW NEW IMAGE
    // ----------------------------------------------

    if (gang.blockImage) {

        response.embeds = [
            {
                title:
                    `🏘️ ${gang.name} Block`,
                description:
                    `📍 **Block:** ${newBlock}`,
                image: {
                    url:
                        gang.blockImage
                },
                color:
                    0xFF8C00,
                footer: {
                    text:
                        'Lynwood Factions • Block Information'
                }
            }
        ];

    }

    // ----------------------------------------------
    // CONFIRM
    // ----------------------------------------------

    return interaction.reply(
        response
    );

}

    // ==================================================
    // /gangtier
    // ==================================================

if (interaction.commandName === 'gangtier') {

    // ----------------------------------------------
    // HIGH FACTION STAFF ROLE
    // ----------------------------------------------

    const HIGH_FACTION_STAFF_ROLE_ID = '1550018347804917760';

    if (!interaction.member.roles.cache.has(HIGH_FACTION_STAFF_ROLE_ID)) {

        return interaction.reply({
            content:
                '🔒 You do not have permission to use `/gangtier`.\n\n' +
                'Only **Staff** can assign or change faction tiers.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET OPTIONS
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

    const newTier =
        interaction.options.getString('tier');

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const factionEntry = Object.entries(GANGS).find(
        ([key, gang]) =>
            gang.name.toLowerCase() === factionName.toLowerCase()
    );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    const [gangKey, gang] = factionEntry;

    // ----------------------------------------------
    // SAVE OLD TIER
    // ----------------------------------------------

    const oldTier =
        gang.tier || 'Not Assigned';

    // ----------------------------------------------
// UPDATE TIER
// ----------------------------------------------

gang.tier = newTier;

// ----------------------------------------------
// SAVE FACTION DATA
// ----------------------------------------------

if (!saveFactions(GANGS)) {

    return interaction.reply({
        content:
            '❌ The tier was changed, but I could not save the faction data.',
        ephemeral: true
    });

}

    // ----------------------------------------------
    // CONFIRM
    // ----------------------------------------------

    return interaction.reply({
        content:
            `✅ **Faction Tier Updated**\n\n` +
            `🏴 **Faction:** ${gang.name}\n` +
            `🏆 **Previous Tier:** ${oldTier}\n` +
            `🔐 **New Tier:** ${newTier}\n\n` +
            `👤 **Changed By:** ${interaction.user}`,
        ephemeral: true
    });

}

        // ==================================================
        // /gangtransfer
        // ==================================================

if (interaction.commandName === 'gangtransfer') {

    // ----------------------------------------------
    // HIGH FACTION STAFF ROLE
    // ----------------------------------------------

    const HIGH_FACTION_STAFF_ROLE_ID = '1478512230734499932';

    if (!interaction.member.roles.cache.has(HIGH_FACTION_STAFF_ROLE_ID)) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/gangtransfer`.\n\n' +
                'Only **High Faction Staff** can transfer factions.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET OPTIONS
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

    const newLeader =
        interaction.options.getMember('leader');

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const factionEntry = Object.entries(GANGS).find(
        ([key, gang]) =>
            gang.name.toLowerCase() === factionName.toLowerCase()
    );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    const [gangKey, gang] = factionEntry;

    // ----------------------------------------------
    // CHECK NEW LEADER
    // ----------------------------------------------

    if (!newLeader) {

        return interaction.reply({
            content:
                '❌ I could not find that member in the server.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // CHECK IF SAME PERSON
    // ----------------------------------------------

    if (newLeader.id === interaction.user.id) {

        return interaction.reply({
            content:
                '❌ You cannot transfer the faction to yourself.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // FIND LEADER ROLE
    // ----------------------------------------------

    const leaderRole =
        interaction.guild.roles.cache.get(
            gang.leaderRole
        );

    if (!leaderRole) {

        return interaction.reply({
            content:
                `❌ The **${gang.name}** Leader role could not be found.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // CHECK BOT ROLE HIERARCHY
    // ----------------------------------------------

    if (
        leaderRole.position >=
        interaction.guild.members.me.roles.highest.position
    ) {

        return interaction.reply({
            content:
                '❌ I cannot manage the Leader role because my bot role is not high enough in the Discord role hierarchy.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // REMOVE LEADER ROLE FROM CURRENT LEADERS
    // ----------------------------------------------

    const currentLeaders =
        interaction.guild.members.cache.filter(
            member =>
                member.roles.cache.has(gang.leaderRole)
        );

    try {

        for (const member of currentLeaders.values()) {

            await member.roles.remove(
                leaderRole,
                `Faction transfer for ${gang.name} by ${interaction.user.tag}`
            );

        }

        // ------------------------------------------
        // GIVE LEADER ROLE TO NEW LEADER
        // ------------------------------------------

        await newLeader.roles.add(
            leaderRole,
            `Transferred ${gang.name} leadership to ${newLeader.user.tag}`
        );

        // ------------------------------------------
        // SUCCESS MESSAGE
        // ------------------------------------------

        return interaction.reply({
            content:
                `✍️ **Faction Transferred Successfully**\n\n` +
                `🏴 **Faction:** ${gang.name}\n` +
                `👑 **New Leader:** ${newLeader}\n` +
                `📍 **Block:** ${gang.block || 'Not Assigned'}\n` +
                `🏆 **Tier:** ${gang.tier || 'Not Assigned'}\n\n` +
                `👤 **Transferred By:** ${interaction.user}`,
            ephemeral: true
        });

    } catch (error) {

        console.error(
            '❌ Gang transfer error:',
            error
        );

        return interaction.reply({
            content:
                '❌ I could not complete the faction transfer. Check the bot permissions and role hierarchy.',
            ephemeral: true
        });

    }

}

       // ==================================================
       // /gangrename
       // ==================================================

if (interaction.commandName === 'gangrename') {

    // ----------------------------------------------
    // HIGH FACTION STAFF ROLE
    // ----------------------------------------------

    const HIGH_FACTION_STAFF_ROLE_ID = '1550018347804917760';

    if (!interaction.member.roles.cache.has(HIGH_FACTION_STAFF_ROLE_ID)) {

        return interaction.reply({
            content:
                '🔒 You do not have permission to use `/gangrename`.\n\n' +
                'Only **High Faction Staff** can rename factions.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET OPTIONS
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

    const newName =
        interaction.options.getString('name');

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const factionEntry = Object.entries(GANGS).find(
        ([key, gang]) =>
            gang.name.toLowerCase() === factionName.toLowerCase()
    );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `🚫 I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    const [gangKey, gang] = factionEntry;

    // ----------------------------------------------
    // CHECK IF NAME ALREADY EXISTS
    // ----------------------------------------------

    const nameAlreadyExists = Object.values(GANGS).some(
        existingGang =>
            existingGang.name.toLowerCase() === newName.toLowerCase()
    );

    if (nameAlreadyExists) {

        return interaction.reply({
            content:
                `🔐 A faction named **${newName}** already exists.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // SAVE OLD NAME
    // ----------------------------------------------

    const oldName = gang.name;

    // ----------------------------------------------
// RENAME FACTION
// ----------------------------------------------

gang.name = newName;

// ----------------------------------------------
// SAVE FACTION DATA
// ----------------------------------------------

if (!saveFactions(GANGS)) {

    return interaction.reply({
        content:
            '❌ The faction name was changed, but I could not save the faction data.',
        ephemeral: true
    });

}
    // ----------------------------------------------
    // CONFIRM
    // ----------------------------------------------

    return interaction.reply({
        content:
            `✔️ **Faction Renamed Successfully**\n\n` +
            `🏴 **Previous Name:** ${oldName}\n` +
            `🏴 **New Name:** ${newName}\n` +
            `📍 **Block:** ${gang.block || 'Not Assigned'}\n` +
            `🏆 **Tier:** ${gang.tier || 'Not Assigned'}\n\n` +
            `⚙️ **Renamed By:** ${interaction.user}`,
        ephemeral: true
    });

}

// ==================================================
// /strikeadd
// ==================================================

if (interaction.commandName === 'strikeadd') {

    // ----------------------------------------------
    // HIGH FACTION STAFF ROLE
    // ----------------------------------------------

    const HIGH_FACTION_STAFF_ROLE_ID = '1550018347804917760';

    if (!interaction.member.roles.cache.has(HIGH_FACTION_STAFF_ROLE_ID)) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/strikeadd`.\n\n' +
                'Only **High Faction Staff** can add faction strikes.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET OPTIONS
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

    const reason =
        interaction.options.getString('reason');

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const factionEntry = Object.entries(GANGS).find(
        ([key, gang]) =>
            gang.name.toLowerCase() === factionName.toLowerCase()
    );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    const [gangKey, gang] = factionEntry;



// ----------------------------------------------
// ADD STRIKE
// ----------------------------------------------

const strike = {
    reason: reason,
    addedBy: interaction.user.id,
    addedByTag: interaction.user.tag,
    addedAt: new Date().toISOString()
};

const strikes = getFactionStrikes(gangKey);

strikes.push(strike);

saveFactionStrikes(factionStrikes);

const strikeNumber = strikes.length;

    return interaction.reply({
        content:
            `⚠️ **Faction Strike Added**\n\n` +
            `🏴 **Faction:** ${gang.name}\n` +
            `❌ **Strike:** #${strikeNumber}\n` +
            `📝 **Reason:** ${reason}\n` +
            `👤 **Added By:** ${interaction.user}\n` +
            `📅 **Date:** <t:${Math.floor(Date.now() / 1000)}:F>`,
        ephemeral: true
    });

}

// ==================================================
// /strikeinfo
// ==================================================

if (interaction.commandName === 'strikeinfo') {

    const factionName =
        interaction.options.getString('faction');

    const factionEntry = Object.entries(GANGS).find(
        ([key, gang]) =>
            gang.name.toLowerCase() === factionName.toLowerCase()
    );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    const [gangKey, gang] = factionEntry;

    const strikes = getFactionStrikes(gangKey);

       if (strikes.length === 0) {

    return interaction.reply({
        content:
            `🚫 **${gang.name}** currently has no active strikes.`,
        ephemeral: true
    });

}

    let strikeList = '';

    strikes.forEach((strike, index) => {

        const timestamp =
            Math.floor(
                new Date(strike.addedAt).getTime() / 1000
            );

        strikeList +=
            `**Strike #${index + 1}**\n` +
            `📝 **Reason:** ${strike.reason}\n` +
            `👤 **Added By:** <@${strike.addedBy}>\n` +
            `📅 **Date:** <t:${timestamp}:F>\n\n`;

    });

    const embed = {

        color: 0xED4245,

        title:
            `⚠️ ${gang.name} • Strike Information`,

        description:
            `**Active Strikes:** ${strikes.length}\n\n` +
            strikeList,

        footer: {
            text:
                `Lynwood Factions • ${gang.name}`
        },

        timestamp:
            new Date().toISOString()

    };

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    });

}

// ==================================================
// /strikelist
// ==================================================

if (interaction.commandName === 'strikelist') {

  const factionsWithStrikes = Object.entries(GANGS).filter(
    ([gangKey, gang]) => {
        const strikes = getFactionStrikes(gangKey);
        return strikes.length > 0;
   }
);

    if (factionsWithStrikes.length === 0) {

        return interaction.reply({
            content:
                '🚫 There are currently no factions with active strikes.',
            ephemeral: true
        });

    }

    let strikeList = '';

    factionsWithStrikes.forEach(([gangKey, gang], index) => {

    const strikes = getFactionStrikes(gangKey);

    strikeList +=
        `**${index + 1}. ${gang.name}**\n` +
        `❌ Active Strikes: **${strikes.length}**\n` +
        `📍 Block: ${gang.block || 'Not Assigned'}\n\n`;

});

    const embed = {

        color: 0xFF8C00,

        title:
            '❌ ACTIVE STRIKES',

        description:
            `Factions currently carrying active strikes:\n\n` +
            strikeList,

        footer: {
            text:
                `Lynwood Factions • ${factionsWithStrikes.length} Faction${factionsWithStrikes.length === 1 ? '' : 's'}`
        },

        timestamp:
            new Date().toISOString()

    };

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    });

}

// ==================================================
// /strikehistory
// ==================================================

if (interaction.commandName === 'strikehistory') {

    const factionName =
        interaction.options.getString('faction');

    const factionEntry = Object.entries(GANGS).find(
        ([key, gang]) =>
            gang.name.toLowerCase() === factionName.toLowerCase()
    );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    const [gangKey, gang] = factionEntry;

    const strikes = getFactionStrikes(gangKey);

     if (strikes.length === 0) {

    return interaction.reply({
        content:
            `📋 **${gang.name}** has no recorded strike history.`,
        ephemeral: true
    });

}

    let history = '';

    strikes.forEach((strike, index) => {

        const timestamp =
            Math.floor(
                new Date(strike.addedAt).getTime() / 1000
            );

        history +=
            `**#${index + 1} — Strike**\n` +
            `📝 **Reason:** ${strike.reason}\n` +
            `👤 **Added By:** <@${strike.addedBy}>\n` +
            `📅 **Date:** <t:${timestamp}:F>\n\n`;

    });

    if (history.length > 3800) {

        history =
            history.substring(0, 3800) +
            '\n...and more history.';

    }

    const embed = {

        color: 0x5865F2,

        title:
            `📋 ${gang.name} • Strike History`,

        description:
            `**Total Recorded Strikes:** ${strikes.length}\n\n` +
            history,

        footer: {
            text:
                `Strike History`
        },

        timestamp:
            new Date().toISOString()

    };

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    });

}

// ==================================================
// /strikeremove
// ==================================================

if (interaction.commandName === 'strikeremove') {

    const FACTION_STAFF_ROLE_ID = '1550018347804917760';

    // ----------------------------------------------
    // CHECK FACTION STAFF
    // ----------------------------------------------

    if (!interaction.member.roles.cache.has(1550018347804917760)) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/strikeremove`.\n\n' +
                'Only **Faction Staff** can remove faction strikes.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET OPTIONS
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

    const strikeNumber =
        interaction.options.getInteger('strike');

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const factionEntry = Object.entries(GANGS).find(
    ([key, gang]) =>
        gang.name.toLowerCase() === factionName.toLowerCase()
);

if (!factionEntry) {

    return interaction.reply({
        content:
            `❌ I could not find a registered faction named **${factionName}**.`,
        ephemeral: true
    });

}

const [gangKey, faction] = factionEntry;

const strikes = getFactionStrikes(gangKey);

    // ----------------------------------------------
    // STRIKE DATA
    // ----------------------------------------------
    // This expects your strike system to store strikes
    // in a factionStrikes object.
    // ----------------------------------------------

   if (strikes.length === 0) {

    return interaction.reply({
        content:
            `⚠️ **${faction.name}** currently has no strikes.`,
        ephemeral: true
    });

}

    // ----------------------------------------------
    // CHECK STRIKE EXISTS
    // ----------------------------------------------

    if (
        strikeNumber < 1 ||
        strikeNumber > strikes.length
    ) {

        return interaction.reply({
            content:
                `❌ **${faction.name}** does not have Strike #${strikeNumber}.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // REMOVE STRIKE
    // ----------------------------------------------

    const removedStrike =
        strikes.splice(strikeNumber - 1, 1)[0];

    // ----------------------------------------------
    // SAVE STRIKES
    // ----------------------------------------------

    saveFactionStrikes(factionStrikes);

    // ----------------------------------------------
    // SUCCESS
    // ----------------------------------------------

    await interaction.reply({
        content:
            `✅ **Strike #${strikeNumber}** has been removed from **${faction.name}**.\n\n` +
            `👮 **Removed By:** ${interaction.user}\n` +
            `🏴 **Faction:** ${faction.name}` +
            `\n⌛ **Remaining Strikes:** ${strikes.length}`,
        ephemeral: true
    });

    console.log(
        `[STRIKE REMOVE] ${interaction.user.tag} removed Strike #${strikeNumber} from ${faction.name}`
    );

}

// ==================================================
// /strikeclear
// ==================================================

if (interaction.commandName === 'strikeclear') {

    const FACTION_STAFF_ROLE_ID = '1550018347804917760';

    // ----------------------------------------------
    // CHECK FACTION STAFF
    // ----------------------------------------------

    if (!interaction.member.roles.cache.has(FACTION_STAFF_ROLE_ID)) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/strikeclear`.\n\n' +
                'Only **Faction Staff** can clear faction strikes.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET FACTION
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

   const factionEntry = Object.entries(GANGS).find(
    ([key, gang]) =>
        gang.name.toLowerCase() === factionName.toLowerCase()
);

if (!factionEntry) {

    return interaction.reply({
        content:
            `❌ I could not find a registered faction named **${factionName}**.`,
        ephemeral: true
    });

}

const [gangKey, faction] = factionEntry;

const strikes = getFactionStrikes(gangKey);

    if (strikes.length === 0) {

    return interaction.reply({
        content:
            `⚠️ **${faction.name}** currently has no active strikes.`,
        ephemeral: true
    });

}

    // ----------------------------------------------
    // CHECK STRIKES
    // ----------------------------------------------

    if (
        !factionStrikes[faction.name] ||
        factionStrikes[faction.name].length === 0
    ) {

        return interaction.reply({
            content:
                `⚠️ **${faction.name}** currently has no active strikes.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // COUNT STRIKES
    // ----------------------------------------------

    const removedCount = strikes.length;

strikes.length = 0;

saveFactionStrikes(factionStrikes);

    // ----------------------------------------------
    // SUCCESS
    // ----------------------------------------------

    await interaction.reply({
        content:
            `✅ All strikes have been cleared from **${faction.name}**.\n\n` +
            `🏴 **Faction:** ${faction.name}\n` +
            `🗑️ **Strikes Removed:** ${removedCount}\n` +
            `👮 **Cleared By:** ${interaction.user}`,
        ephemeral: true
    });

    console.log(
        `[STRIKE CLEAR] ${interaction.user.tag} cleared ${removedCount} strike(s) from ${faction.name}`
    );

}

// ==================================================
// /gangmoney
// ==================================================

if (interaction.commandName === 'gangmoney') {

    const leaderGang =
        getLeaderGang(interaction.member);

    // ----------------------------------------------
    // CHECK LEADER
    // ----------------------------------------------

    if (!leaderGang) {

        return interaction.reply({
            content:
                '❌ You are not registered as a faction leader.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // INITIALIZE FACTION MONEY
    // ----------------------------------------------

    if (
        typeof factionMoney[leaderGang.name] !== 'number'
    ) {

        factionMoney[leaderGang.name] = 0;

        saveFactionMoney(factionMoney);

    }

    const money =
        factionMoney[leaderGang.name];

    // ----------------------------------------------
    // FORMAT MONEY
    // ----------------------------------------------

    const formattedMoney =
        money.toLocaleString('en-US');

    // ----------------------------------------------
    // SEND MONEY INFO
    // ----------------------------------------------

    return interaction.reply({
        content:
            `💰 **${leaderGang.name} Faction Money**\n\n` +
            `🏴 **Faction:** ${leaderGang.name}\n` +
            `💵 **Balance:** $${formattedMoney}`,
        ephemeral: true
    });

}

// ==================================================
// /gangpayment
// ==================================================

if (interaction.commandName === 'gangpayment') {

    const FACTION_STAFF_ROLE_ID = '1550018347804917760';

    // ----------------------------------------------
    // CHECK FACTION STAFF
    // ----------------------------------------------

    if (!interaction.member.roles.cache.has(FACTION_STAFF_ROLE_ID)) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/gangpayment`.\n\n' +
                'Only **Faction Staff** can record faction payments.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET OPTIONS
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

    const amount =
        interaction.options.getInteger('amount');

    const reason =
        interaction.options.getString('reason');

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const faction = Object.values(GANGS).find(
        gang =>
            gang.name.toLowerCase() ===
            factionName.toLowerCase()
    );

    if (!faction) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // INITIALIZE MONEY
    // ----------------------------------------------

    if (
        typeof factionMoney[faction.name] !== 'number'
    ) {

        factionMoney[faction.name] = 0;

    }

    // ----------------------------------------------
    // ADD PAYMENT
    // ----------------------------------------------

    factionMoney[faction.name] += amount;

    saveFactionMoney(factionMoney);

// ----------------------------------------------
// SAVE TRANSACTION
// ----------------------------------------------

if (!factionTransactions[faction.name]) {
    factionTransactions[faction.name] = [];
}

factionTransactions[faction.name].push({

    type: 'Payment',

    amount: amount,

    reason: reason,

    userId: interaction.user.id,

    timestamp: new Date().toISOString()

});

saveFactionTransactions(factionTransactions);

    const newBalance =
        factionMoney[faction.name];

    // ----------------------------------------------
    // FORMAT MONEY
    // ----------------------------------------------

    const formattedAmount =
        amount.toLocaleString('en-US');

    const formattedBalance =
        newBalance.toLocaleString('en-US');

    // ----------------------------------------------
    // SUCCESS MESSAGE
    // ----------------------------------------------

    return interaction.reply({
        content:
            `✔️ **Faction Payment Recorded**\n\n` +
            `🏴 **Faction:** ${faction.name}\n` +
            `💵 **Payment:** +$${formattedAmount}\n` +
            `💰 **New Balance:** $${formattedBalance}\n` +
            `✍️ **Reason:** ${reason}\n` +
            `🔒 **Recorded By:** ${interaction.user}`,
        ephemeral: true
    });

}

// ==================================================
// /gangpayout
// ==================================================

if (interaction.commandName === 'gangpayout') {

    const FACTION_STAFF_ROLE_ID = '1550018347804917760';

    // ----------------------------------------------
    // CHECK FACTION STAFF
    // ----------------------------------------------

    if (!interaction.member.roles.cache.has(FACTION_STAFF_ROLE_ID)) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/gangpayout`.\n\n' +
                'Only **Faction Staff** can record faction payouts.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET OPTIONS
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

    const amount =
        interaction.options.getInteger('amount');

    const reason =
        interaction.options.getString('reason');

    // ----------------------------------------------
    // FIND FACTION
    // ----------------------------------------------

    const faction = Object.values(GANGS).find(
        gang =>
            gang.name.toLowerCase() ===
            factionName.toLowerCase()
    );

    if (!faction) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // INITIALIZE MONEY
    // ----------------------------------------------

    if (typeof factionMoney[faction.name] !== 'number') {

    factionMoney[faction.name] = 0;

    saveFactionMoney(factionMoney);

    // ----------------------------------------------
    // SAVE TRANSACTION
    // ----------------------------------------------

if (!factionTransactions[faction.name]) {
    factionTransactions[faction.name] = [];
}

factionTransactions[faction.name].push({

    type: 'Payout',

    amount: amount,

    reason: reason,

    userId: interaction.user.id,

    timestamp: new Date().toISOString()

});

saveFactionTransactions(factionTransactions);

    }

    const currentBalance =
        factionMoney[faction.name];

    // ----------------------------------------------
    // CHECK BALANCE
    // ----------------------------------------------

    if (amount > currentBalance) {

        return interaction.reply({
            content:
                `❌ **Insufficient faction funds.**\n\n` +
                `🏴 **Faction:** ${faction.name}\n` +
                `💰 **Current Balance:** $${currentBalance.toLocaleString('en-US')}\n` +
                `💸 **Requested Payout:** $${amount.toLocaleString('en-US')}\n\n` +
                `The payout cannot be greater than the faction's current balance.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // REMOVE PAYOUT
    // ----------------------------------------------

    factionMoney[faction.name] -= amount;

    saveFactionMoney(factionMoney);

    const newBalance =
        factionMoney[faction.name];

    // ----------------------------------------------
    // FORMAT MONEY
    // ----------------------------------------------

    const formattedAmount =
        amount.toLocaleString('en-US');

    const formattedBalance =
        newBalance.toLocaleString('en-US');

    // ----------------------------------------------
    // SUCCESS MESSAGE
    // ----------------------------------------------

    return interaction.reply({
        content:
            `☑️ **Faction Payout Recorded**\n\n` +
            `🏴 **Faction:** ${faction.name}\n` +
            `💸 **Payout:** -$${formattedAmount}\n` +
            `💰 **New Balance:** $${formattedBalance}\n` +
            `📝 **Reason:** ${reason}\n` +
            `⚙️ **Recorded By:** ${interaction.user}`,
        ephemeral: true
    });

}

// ==================================================
// /gangtransactions
// ==================================================

if (interaction.commandName === 'gangtransactions') {

    const FACTION_STAFF_ROLE_ID = '1545272829891837973';

    // ----------------------------------------------
    // CHECK FACTION STAFF
    // ----------------------------------------------

    if (!interaction.member.roles.cache.has(FACTION_STAFF_ROLE_ID)) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/gangtransactions`.\n\n' +
                'Only **Faction Staff** can view faction transactions.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET FACTION
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

    const faction = Object.values(GANGS).find(
        gang =>
            gang.name.toLowerCase() ===
            factionName.toLowerCase()
    );

    if (!faction) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET TRANSACTIONS
    // ----------------------------------------------

    const transactions =
        factionTransactions[faction.name] || [];

    // ----------------------------------------------
    // NO TRANSACTIONS
    // ----------------------------------------------

    if (transactions.length === 0) {

        return interaction.reply({
            content:
                `📋 **${faction.name}** currently has no recorded transactions.`,
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET MOST RECENT 20
    // ----------------------------------------------

    const recentTransactions =
        transactions.slice(-20).reverse();

    // ----------------------------------------------
    // BUILD TRANSACTION LIST
    // ----------------------------------------------

    const transactionList =
        recentTransactions.map((transaction, index) => {

            const emoji =
                transaction.type === 'Payment'
                    ? '💵'
                    : '💸';

            const sign =
                transaction.type === 'Payment'
                    ? '+'
                    : '-';

            return (
                `**${index + 1}. ${emoji} ${transaction.type}**\n` +
                `💰 **Amount:** ${sign}$${transaction.amount.toLocaleString('en-US')}\n` +
                `📝 **Reason:** ${transaction.reason}\n` +
                `👮 **Recorded By:** <@${transaction.userId}>\n` +
                `🕒 **Date:** <t:${Math.floor(new Date(transaction.timestamp).getTime() / 1000)}:f>`
            );

        }).join('\n\n');

    // ----------------------------------------------
    // CURRENT BALANCE
    // ----------------------------------------------

    const balance =
        typeof factionMoney[faction.name] === 'number'
            ? factionMoney[faction.name]
            : 0;

    // ----------------------------------------------
    // SEND TRANSACTIONS
    // ----------------------------------------------

    const transactionEmbed = {

        color: 0xFF8C00,

        title:
            `💰 ${faction.name} • TRANSACTION HISTORY`,

        description:
            `**Current Balance:** $${balance.toLocaleString('en-US')}\n\n` +
            transactionList,

        footer: {
            text:
                `Lynwood Factions • Showing ${recentTransactions.length} Most Recent Transaction${recentTransactions.length === 1 ? '' : 's'}`
        },

        timestamp:
            new Date().toISOString()

    };

    return interaction.reply({

        embeds: [
            transactionEmbed
        ],

        ephemeral: true

    });

}

// ======================================================
// /activity
// ======================================================

if (interaction.commandName === 'activity') {

    const FACTION_STAFF_ROLE_ID = '1545272829891837973';

    // ----------------------------------------------
    // HIGH FACTION STAFF ONLY
    // ----------------------------------------------

    if (!interaction.member.roles.cache.has(FACTION_STAFF_ROLE_ID)) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/activity`.\n\n' +
                'Only **Faction Staff** can record faction activity.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET INFORMATION
    // ----------------------------------------------

    const factionInput =
        interaction.options.getString('faction');

    const action =
        interaction.options.getString('action');

    if (!factionInput || !action) {

        return interaction.reply({
            content:
                '❌ You must provide both a faction and an activity.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // ALWAYS LOAD CURRENT FACTION DATA
    // ----------------------------------------------

    const latestFactions = loadFactions();

    const factionEntry =
        Object.entries(latestFactions).find(
            ([key, gang]) =>
                gang &&
                gang.name &&
                gang.name.toLowerCase() ===
                factionInput.toLowerCase()
        );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionInput}**.`,
            ephemeral: true
        });

    }

    const [gangKey, factionData] = factionEntry;

    // ----------------------------------------------
    // LOAD ACTIVITY FILE
    // ----------------------------------------------

    let activities = [];

    if (fs.existsSync(ACTIVITY_FILE)) {

        try {

            const rawData =
                fs.readFileSync(
                    ACTIVITY_FILE,
                    'utf8'
                );

            activities =
                rawData.trim()
                    ? JSON.parse(rawData)
                    : [];

            if (!Array.isArray(activities)) {
                activities = [];
            }

        } catch (error) {

            console.error(
                '❌ Could not read activity.json:',
                error
            );

            return interaction.reply({
                content:
                    '❌ I could not read the faction activity file.',
                ephemeral: true
            });

        }

    }

    // ----------------------------------------------
    // CREATE ACTIVITY RECORD
    // ----------------------------------------------

    const activityRecord = {

        id:
            `${Date.now()}-${interaction.user.id}`,

        faction:
            factionData.name,

        factionKey:
            gangKey,

        recordedBy: {

            id:
                interaction.user.id,

            username:
                interaction.user.tag

        },

        action:
            action,

        timestamp:
            new Date().toISOString()

    };

    // ----------------------------------------------
    // SAVE ACTIVITY
    // ----------------------------------------------

    activities.push(activityRecord);

    try {

        fs.writeFileSync(
            ACTIVITY_FILE,
            JSON.stringify(
                activities,
                null,
                2
            ),
            'utf8'
        );

    } catch (error) {

        console.error(
            '❌ Could not save activity:',
            error
        );

        return interaction.reply({
            content:
                '❌ I could not save the faction activity.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // CONFIRMATION
    // ----------------------------------------------

    const activityEmbed = {

        color: 0xFF8C00,

        title:
            '🏴 FACTIONS • ACTIVITY RECORDED',

        fields: [

            {
                name: '🏴 Faction',
                value:
                    factionData.name,
                inline: true
            },

            {
                name: '👤 Recorded By',
                value:
                    `${interaction.user}`,
                inline: true
            },

            {
                name: '📋 Activity',
                value:
                    action,
                inline: false
            }

        ],

        footer: {
            text:
                'Lynwood Factions • Activity System'
        },

        timestamp:
            new Date().toISOString()

    };

    return interaction.reply({

        embeds: [
            activityEmbed
        ],

        ephemeral: true

    });

}

// ==================================================
// /inactive
// ==================================================

if (interaction.commandName === 'inactive') {

    const FACTION_STAFF_ROLE_ID =
        '1545272829891837973';

    // ----------------------------------------------
    // FACTION STAFF CHECK
    // ----------------------------------------------

    if (!interaction.member.roles.cache.has(
        FACTION_STAFF_ROLE_ID
    )) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/inactive`.\n\n' +
                'Only **Faction Staff** can view inactive factions.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // LOAD CURRENT FACTIONS
    // ----------------------------------------------

    const latestFactions =
        loadFactions();

    const factions =
        Object.values(latestFactions).filter(
            gang =>
                gang &&
                gang.name
        );

    if (factions.length === 0) {

        return interaction.reply({
            content:
                '❌ There are currently no registered factions.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // LOAD ACTIVITY FILE
    // ----------------------------------------------

    let activities = [];

    if (fs.existsSync(ACTIVITY_FILE)) {

        try {

            const rawData =
                fs.readFileSync(
                    ACTIVITY_FILE,
                    'utf8'
                );

            activities =
                rawData.trim()
                    ? JSON.parse(rawData)
                    : [];

            if (!Array.isArray(activities)) {
                activities = [];
            }

        } catch (error) {

            console.error(
                '❌ Could not read activity.json:',
                error
            );

            return interaction.reply({
                content:
                    '❌ I could not read the faction activity file.',
                ephemeral: true
            });

        }

    }

    // ----------------------------------------------
    // CHECK ACTIVITY
    // ----------------------------------------------

    const now =
        Date.now();

    const INACTIVE_DAYS =
        7;

    const DAY_MS =
        1000 * 60 * 60 * 24;

    const inactiveFactions = [];

    for (const gang of factions) {

        const factionActivities =
            activities.filter(
                activity =>
                    activity &&
                    activity.faction &&
                    typeof activity.faction === 'string' &&
                    activity.faction.toLowerCase() ===
                    gang.name.toLowerCase() &&
                    activity.timestamp
            );

        // ------------------------------------------
        // NEVER HAD ACTIVITY
        // ------------------------------------------

        if (factionActivities.length === 0) {

            inactiveFactions.push({
                name:
                    gang.name,

                lastActivity:
                    null
            });

            continue;

        }

        // ------------------------------------------
        // FIND MOST RECENT ACTIVITY
        // ------------------------------------------

        const timestamps =
            factionActivities
                .map(
                    activity =>
                        new Date(
                            activity.timestamp
                        ).getTime()
                )
                .filter(
                    timestamp =>
                        Number.isFinite(timestamp)
                );

        if (timestamps.length === 0) {

            inactiveFactions.push({
                name:
                    gang.name,

                lastActivity:
                    null
            });

            continue;

        }

        const latestActivity =
            Math.max(...timestamps);

        const daysInactive =
            Math.floor(
                (now - latestActivity) /
                DAY_MS
            );

        // ------------------------------------------
        // 7+ DAYS INACTIVE
        // ------------------------------------------

        if (daysInactive >= INACTIVE_DAYS) {

            inactiveFactions.push({

                name:
                    gang.name,

                lastActivity:
                    latestActivity

            });

        }

    }

    // ----------------------------------------------
    // BUILD DESCRIPTION
    // ----------------------------------------------

    let description = '';

    if (inactiveFactions.length === 0) {

        description =
            '✍️ All registered factions have recorded activity within the last **7 days**.';

    } else {

        description =
            inactiveFactions
                .map((faction, index) => {

                    if (!faction.lastActivity) {

                        return (
                            `**${index + 1}. ${faction.name}**\n` +
                            `📋 No activity has ever been recorded.`
                        );

                    }

                    const days =
                        Math.floor(
                            (now - faction.lastActivity) /
                            DAY_MS
                        );

                    const lastActivityTimestamp =
                        Math.floor(
                            faction.lastActivity / 1000
                        );

                    return (
                        `**${index + 1}. ${faction.name}**\n` +
                        `⏰ Inactive for: **${days} days**\n` +
                        `🕒 Last Activity: <t:${lastActivityTimestamp}:F> (<t:${lastActivityTimestamp}:R>)`
                    );

                })
                .join('\n\n');

    }

    // ----------------------------------------------
    // EMBED
    // ----------------------------------------------

    const inactiveEmbed = {

        color:
            0xFF8C00,

        title:
            '🏴 LYNWOOD FACTIONS • INACTIVE FACTIONS',

        description,

        footer: {
            text:
                `Lynwood Factions • ${inactiveFactions.length} Inactive`
        },

        timestamp:
            new Date().toISOString()

    };

    return interaction.reply({

        embeds: [
            inactiveEmbed
        ],

        ephemeral: true

    });

}

// ==================================================
// /activitylog
// ==================================================

if (interaction.commandName === 'activitylog') {

    const FACTION_STAFF_ROLE_ID =
        '1545272829891837973';

    // ----------------------------------------------
    // STAFF CHECK
    // ----------------------------------------------

    if (!interaction.member.roles.cache.has(
        FACTION_STAFF_ROLE_ID
    )) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/activitylog`.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET FACTION
    // ----------------------------------------------

    const factionInput =
        interaction.options.getString('faction');

    // ----------------------------------------------
    // LOAD ACTIVITY DATA
    // ----------------------------------------------

    let activities = [];

    if (fs.existsSync(ACTIVITY_FILE)) {

        try {

            const rawData =
                fs.readFileSync(
                    ACTIVITY_FILE,
                    'utf8'
                );

            activities =
                rawData.trim()
                    ? JSON.parse(rawData)
                    : [];

            if (!Array.isArray(activities)) {
                activities = [];
            }

        } catch (error) {

            console.error(
                '❌ Could not read activity.json:',
                error
            );

            return interaction.reply({
                content:
                    '❌ I could not read the faction activity file.',
                ephemeral: true
            });

        }

    }

    // ----------------------------------------------
    // FILTER FACTION
    // ----------------------------------------------

    if (factionInput) {

        const latestFactions =
            loadFactions();

        const factionEntry =
            Object.entries(latestFactions).find(
                ([key, gang]) =>
                    gang &&
                    gang.name &&
                    gang.name.toLowerCase() ===
                    factionInput.toLowerCase()
            );

        if (!factionEntry) {

            return interaction.reply({
                content:
                    `❌ I could not find a registered faction named **${factionInput}**.`,
                ephemeral: true
            });

        }

        const actualFactionName =
            factionEntry[1].name;

        activities =
            activities.filter(
                activity =>
                    activity.faction &&
                    activity.faction.toLowerCase() ===
                    actualFactionName.toLowerCase()
            );

    }

    // ----------------------------------------------
    // SORT NEWEST FIRST
    // ----------------------------------------------

    activities =
        activities
            .filter(
                activity =>
                    activity &&
                    activity.timestamp
            )
            .sort(
                (a, b) =>
                    new Date(b.timestamp) -
                    new Date(a.timestamp)
            )
            .slice(0, 15);

    // ----------------------------------------------
    // NO RESULTS
    // ----------------------------------------------

    if (activities.length === 0) {

        return interaction.reply({
            content:
                factionInput
                    ? `🚫 No activity has been recorded for **${factionInput}**.`
                    : '❌ No faction activity has been recorded.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // BUILD LOG
    // ----------------------------------------------

    const logText =
        activities
            .map((activity, index) => {

                const unixTimestamp =
                    Math.floor(
                        new Date(
                            activity.timestamp
                        ).getTime() / 1000
                    );

                const recordedBy =
                    activity.recordedBy &&
                    activity.recordedBy.id
                        ? `<@${activity.recordedBy.id}>`
                        : 'Unknown Staff';

                return (
                    `**${index + 1}. ${activity.faction}**\n` +
                    `📋 ${activity.action}\n` +
                    `👤 Recorded By: ${recordedBy}\n` +
                    `🕒 <t:${unixTimestamp}:R>`
                );

            })
            .join('\n\n');

    // ----------------------------------------------
    // EMBED
    // ----------------------------------------------

    const activityEmbed = {

        color: 0xFF8C00,

        title:
            factionInput
                ? `🏴 ACTIVITY LOG • ${factionInput}`
                : '🏴 LYNWOOD FACTIONS • ACTIVITY LOG',

        description:
            logText,

        footer: {
            text:
                'Lynwood Factions • Showing latest 15 activities'
        },

        timestamp:
            new Date().toISOString()

    };

    return interaction.reply({

        embeds: [
            activityEmbed
        ],

        ephemeral: true

    });

}

// ==================================================
// /factionstats
// ==================================================

if (interaction.commandName === 'factionstats') {

    const FACTION_STAFF_ROLE_ID =
        '1545272829891837973';

    // ----------------------------------------------
    // STAFF CHECK
    // ----------------------------------------------

    if (!interaction.member.roles.cache.has(
        FACTION_STAFF_ROLE_ID
    )) {

        return interaction.reply({
            content:
                '❌ You do not have permission to use `/factionstats`.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // GET FACTION
    // ----------------------------------------------

    const factionName =
        interaction.options.getString('faction');

    if (!factionName) {

        return interaction.reply({
            content:
                '❌ You must provide a faction name.',
            ephemeral: true
        });

    }

    // ----------------------------------------------
    // ALWAYS LOAD CURRENT FACTIONS
    // ----------------------------------------------

    const latestFactions =
        loadFactions();

    const factionEntry =
        Object.entries(latestFactions).find(
            ([key, gang]) =>
                gang &&
                gang.name &&
                gang.name.toLowerCase() ===
                factionName.toLowerCase()
        );

    if (!factionEntry) {

        return interaction.reply({
            content:
                `❌ I could not find a registered faction named **${factionName}**.`,
            ephemeral: true
        });

    }

    const [gangKey, faction] =
        factionEntry;

    // ----------------------------------------------
    // FETCH GANG ROLE
    // ----------------------------------------------

    let gangRole = null;

    if (faction.gangRole) {

        gangRole =
            await interaction.guild.roles.fetch(
                faction.gangRole
            ).catch(() => null);

    }

    // ----------------------------------------------
    // FETCH MEMBERS
    // ----------------------------------------------

    let memberCount = 0;

    if (gangRole) {

        // Make sure member cache is populated
        await interaction.guild.members
            .fetch()
            .catch(() => null);

        memberCount =
            interaction.guild.members.cache.filter(
                member =>
                    member.roles.cache.has(
                        faction.gangRole
                    )
            ).size;

    }

    // ----------------------------------------------
    // LOAD ACTIVITY
    // ----------------------------------------------

    let activities = [];

    if (fs.existsSync(ACTIVITY_FILE)) {

        try {

            const rawData =
                fs.readFileSync(
                    ACTIVITY_FILE,
                    'utf8'
                );

            activities =
                rawData.trim()
                    ? JSON.parse(rawData)
                    : [];

            if (!Array.isArray(activities)) {
                activities = [];
            }

        } catch (error) {

            console.error(
                '❌ Could not read activity.json:',
                error
            );

            activities = [];

        }

    }

    const factionActivities =
        activities.filter(
            activity =>
                activity.faction &&
                activity.faction.toLowerCase() ===
                faction.name.toLowerCase()
        );

    // ----------------------------------------------
    // STRIKES
    // ----------------------------------------------

    const strikes =
        getFactionStrikes(gangKey);

    // ----------------------------------------------
    // MONEY
    // ----------------------------------------------

    const balance =
        typeof factionMoney[faction.name] === 'number'
            ? factionMoney[faction.name]
            : 0;

    // ----------------------------------------------
    // FIND LEADERS
    // ----------------------------------------------

    let leaderText =
        'No leader assigned';

    if (faction.leaderRole) {

        await interaction.guild.members
            .fetch()
            .catch(() => null);

        const leaders =
            interaction.guild.members.cache.filter(
                member =>
                    member.roles.cache.has(
                        faction.leaderRole
                    )
            );

        if (leaders.size > 0) {

            leaderText =
                leaders
                    .map(member => `${member}`)
                    .join(', ');

        }

    }

    // ----------------------------------------------
    // DISPLAY
    // ----------------------------------------------

    const statsEmbed = {

        color: 0xFF8C00,

        title:
            `🏴 ${faction.name} • FACTION STATISTICS`,

        fields: [

            {
                name: '👑 Leader',
                value:
                    leaderText,
                inline: false
            },

            {
                name: '👥 Members',
                value:
                    `${memberCount}`,
                inline: true
            },

            {
                name: '📋 Activities',
                value:
                    `${factionActivities.length}`,
                inline: true
            },

            {
                name: '❌ Active Strikes',
                value:
                    `${strikes.length}`,
                inline: true
            },

            {
                name: '💰 Faction Balance',
                value:
                    `$${balance.toLocaleString()}`,
                inline: true
            },

            {
                name: '📍 Block',
                value:
                    faction.block ||
                    'Not Assigned',
                inline: true
            },

            {
                name: '🏆 Tier',
                value:
                    faction.tier ||
                    'Not Assigned',
                inline: true
            },

            {
                name: '🏷️ Faction Role',
                value:
                    faction.gangRole
                        ? `<@&${faction.gangRole}>`
                        : 'Not Assigned',
                inline: false
            },

            {
                name: '👑 Leader Role',
                value:
                    faction.leaderRole
                        ? `<@&${faction.leaderRole}>`
                        : 'Not Assigned',
                inline: false
            }

        ],

        footer: {
            text:
                `Lynwood Factions • ${gangKey}`
        },

        timestamp:
            new Date().toISOString()

    };

    return interaction.reply({

        embeds: [
            statsEmbed
        ],

        ephemeral: true

    });

}

// ==================================================
// /giveleaderrole
// STAFF ONLY
// ==================================================

if (interaction.commandName === 'giveleaderrole') {

    try {

        // ----------------------------------------------
        // STAFF ROLE
        // ----------------------------------------------

        const STAFF_ROLE_ID =
            process.env.STAFF_ROLE_ID;

        if (!STAFF_ROLE_ID) {

            console.error(
                '❌ STAFF_ROLE_ID is missing from Railway Variables.'
            );

            return interaction.reply({
                content:
                    '❌ Staff role is not configured.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // CHECK STAFF PERMISSION
        // ----------------------------------------------

        if (
            !interaction.member.roles.cache.has(
                STAFF_ROLE_ID
            )
        ) {

            return interaction.reply({
                content:
                    '❌ You do not have permission to use `/giveleaderrole`.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // GET USER
        // ----------------------------------------------

        const targetUser =
            interaction.options.getUser('user');

        // ----------------------------------------------
        // GET FACTION
        // ----------------------------------------------

        const factionName =
            interaction.options
                .getString('faction')
                ?.trim();

        if (!targetUser || !factionName) {

            return interaction.reply({
                content:
                    '❌ You must provide both a **user** and a **faction**.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND FACTION
        // ----------------------------------------------

        const factions =
            loadFactions();

        const factionEntry =
            Object.entries(factions).find(
                ([, faction]) =>
                    faction &&
                    faction.name &&
                    faction.name.toLowerCase() ===
                    factionName.toLowerCase()
            );

        if (!factionEntry) {

            return interaction.reply({
                content:
                    `❌ I couldn't find a faction named **${factionName}**.`,
                ephemeral: true
            });

        }

        const [factionKey, faction] =
            factionEntry;

        // ----------------------------------------------
        // CHECK LEADER ROLE
        // ----------------------------------------------

        if (!faction.leaderRole) {

            return interaction.reply({
                content:
                    `❌ **${faction.name}** does not have a leader role assigned.`,
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND MEMBER
        // ----------------------------------------------

        let member;

        try {

            member =
                await interaction.guild.members.fetch(
                    targetUser.id
                );

        } catch (error) {

            console.error(
                '❌ Could not fetch target member:',
                error
            );

            return interaction.reply({
                content:
                    '❌ I could not find that member in the server.',
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // FIND LEADER ROLE
        // ----------------------------------------------

        const leaderRole =
            interaction.guild.roles.cache.get(
                faction.leaderRole
            );

        if (!leaderRole) {

            return interaction.reply({
                content:
                    `❌ The Discord leader role for **${faction.name}** could not be found.`,
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // CHECK BOT ROLE HIERARCHY
        // ----------------------------------------------

        const botMember =
            interaction.guild.members.me;

        if (!botMember) {

            return interaction.reply({
                content:
                    '❌ I could not verify my Discord permissions.',
                ephemeral: true
            });

        }

        if (
            leaderRole.position >=
            botMember.roles.highest.position
        ) {

            return interaction.reply({
                content:
                    `❌ I cannot give **${leaderRole.name}** because my highest role must be above it in the Discord role hierarchy.`,
                ephemeral: true
            });

        }

        // ----------------------------------------------
        // GIVE LEADER ROLE
        // ----------------------------------------------

        await member.roles.add(
            leaderRole,
            `Faction leader role assigned by ${interaction.user.tag}`
        );

        // ----------------------------------------------
        // SUCCESS LOG
        // ----------------------------------------------

        await interaction.reply({
            content:
                `🔓 ${targetUser} has been given the **${leaderRole.name}** role for **${faction.name}**.`,
            ephemeral: true
        });

        console.log(
            `✅ ${interaction.user.tag} gave ${leaderRole.name} to ${targetUser.tag} for ${factionKey}.`
        );

    } catch (error) {

        console.error(
            '❌ /giveleaderrole ERROR:',
            error
        );

        // ----------------------------------------------
        // SAFE ERROR RESPONSE
        // ----------------------------------------------

        if (!interaction.replied && !interaction.deferred) {

            return interaction.reply({
                content:
                    '❌ Something went wrong while giving the leader role. Check the bot console for the exact error.',
                ephemeral: true
            });

        }

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

    // !gangrules
    if (message.content.trim().toLowerCase() === '!gangrules') {

         const FACTION_STAFF_ROLE_ID = '1545272829891837973';

    // Faction Staff only
    if (!message.member.roles.cache.has(FACTION_STAFF_ROLE_ID)) {

        const deniedMessage = await message.reply({
            content:
                '❌ You do not have permission to use `!gangrules`.\n\n' +
                'Only **Faction Staff** can use this command.'
        });

        setTimeout(() => {
            deniedMessage.delete().catch(() => {});
        }, 5000);

        return;
    }

    // Delete the command message
    await message.delete().catch(() => {});

    const gangRulesEmbed = {

        color: 0xFF8C00,

        title:
            '🏴 LYNWOOD FACTIONS • GANG RULES',

        description:
            'Looking for the current **Faction Rules**?\n\n' +
            '📖 **[Click Here to View the Faction Rules](https://docs.google.com/document/d/1wLqhj4ovee_VM6srkhVrAbT-J2M_8O89JqLlJ33S4Y0/edit?usp=sharing)**\n\n' +
            'Please make sure you read and understand all faction rules before participating in faction activities.',

        footer: {
            text:
                'Lynwood • Faction Rules'
        },

        timestamp:
            new Date().toISOString()
    };

    await message.channel.send({
        embeds: [gangRulesEmbed]
    });

    return;
}

// ======================================================
// !claimedflags — Faction Staff Only
// ======================================================

if (
    message.content.trim().toLowerCase() ===
    '!claimedflags'
) {

    // ----------------------------------------------
    // FACTION STAFF ONLY
    // ----------------------------------------------

    const FACTION_STAFF_ROLE_ID =
        '1545272829891837973';

    if (
        !message.member.roles.cache.has(
            FACTION_STAFF_ROLE_ID
        )
    ) {

        const deniedMessage =
            await message.reply({

                content:
                    '❌ You do not have permission to use `!claimedflags`.\n\n' +
                    'Only **Faction Staff** can use this command.'

            });

        setTimeout(() => {

            deniedMessage
                .delete()
                .catch(() => {});

        }, 5000);

        return;

    }

    // ----------------------------------------------
    // GET FLAG FORUM
    // ----------------------------------------------

    const FLAG_FORUM_CHANNEL_ID =
        process.env.FLAG_FORUM_CHANNEL_ID;

    const flagForum =
        message.guild.channels.cache.get(
            FLAG_FORUM_CHANNEL_ID
        );

    if (!flagForum) {

        const errorMessage =
            await message.reply(
                '❌ The Flag Identifier Forum could not be found.'
            );

        setTimeout(() => {

            errorMessage
                .delete()
                .catch(() => {});

        }, 5000);

        return;

    }

    // ----------------------------------------------
    // DELETE COMMAND MESSAGE
    // ----------------------------------------------

    await message
        .delete()
        .catch(() => {});

    // ----------------------------------------------
    // CLAIMED FLAGS EMBED
    // ----------------------------------------------

    const claimedFlagsEmbed = {

        color:
            0xFF8C00,

        title:
            '🚩 LYNWOOD FACTIONS • CLAIMED FLAG IDENTIFIERS',

        description:
            'Looking for the current **Faction Flag Identifiers**?\n\n' +

            '📖 **[Click Here to View the Claimed Flag Identifiers](https://discord.com/channels/1387016155050283100/1549679698563563570)**\n\n' +

            'Please check the current identifiers before selecting one for your faction.\n\n',

        footer: {

            text:
                'Lynwood • Claimed Flag Identifiers'

        },

        timestamp:
            new Date().toISOString()

    };

    // ----------------------------------------------
    // SEND EMBED
    // ----------------------------------------------

    await message.channel.send({

        embeds: [
            claimedFlagsEmbed
        ]

    });

    return;

}

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
                        title: '',
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