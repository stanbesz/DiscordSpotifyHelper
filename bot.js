const { google } = require('googleapis');
const Discord = require('discord.js');

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.GuildMembers,
  ]
});
const sheetId = '1TVmDGCj3IFqz_AMzp_fs93ga5ACfSP6Pe82ypR9CFZE';
const sheetName = 'Spotify_family_plan';

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('message', async message => {
  console.log('In here');
  if (message.content == '!get-data') {
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetName,
    });
    console.log(res);
    const rows = res.data.values;
    const formattedRows = rows.map(row => row.join(' | ')).join('\n');
    message.channel.send(formattedRows);
  }
});

client.login('MTA4NDEyMzU5MjAzNzUxMTMxOQ.GqGGBr.NJ2Uz6JQsFqualDNopOW_LoKXAYqS2FL2MwdJY');
