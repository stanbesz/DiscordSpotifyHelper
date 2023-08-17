
const { SlashCommandBuilder } = require('discord.js');
const {google} = require("googleapis");
const { spreadsheetId } = require('../config.json');

const AFTER_TABLE_HEAD = 1;
const INDEX_ADJUSTMMENT = 1;
const TABLE_HEAD = 0;
const MONTH_PRICE = 3;

const getMonth = (element)=>{
	let resultName='';
	switch (element){
		case 0: resultName="януари";break;
		case 1: resultName="февруари";break;
		case 2: resultName="март";break;
		case 3: resultName="април";break;
		case 4: resultName="май";break;
		case 5: resultName="юни";break;
		case 6: resultName="юли";break;
		case 7: resultName="август";break;
		case 8: resultName="септември";break;
		case 9: resultName="октомври";break;
		case 10: resultName="ноември";break;
		case 11: resultName="декември";break;
	}
	return resultName;
}

const checkIfVerji = function(name){
	if(name!=="Вержи"){
		return name;
	}
	else{
		return "Вержи (but she pays for Netflix so no money is owed)";
	}
}

const orderData = async function(googleData){
	//console.log(googleData.length);
	let answer = "";
    const relevantDate = `${getMonth(new Date().getMonth())}-${new Date().getFullYear()}`;
	//console.log(relevantDate);
	const foundIndex = await googleData[TABLE_HEAD].indexOf(relevantDate);
	//console.log(foundIndex);
	for(let i = AFTER_TABLE_HEAD;i<googleData.length;++i){
		if(googleData[i].length<foundIndex+INDEX_ADJUSTMMENT){
			answer=answer+(`${checkIfVerji(googleData[i][0])} owes ${((foundIndex+INDEX_ADJUSTMMENT)-googleData[i].length)*MONTH_PRICE}BGN\n`)
		}
		else if(googleData[i].length>foundIndex+INDEX_ADJUSTMMENT){
			answer=answer+(`${checkIfVerji(googleData[i][0])} has prepaid for ${googleData[i].length-(foundIndex+INDEX_ADJUSTMMENT)} months\n`);
		}
		else if(googleData[i].length===foundIndex+INDEX_ADJUSTMMENT){
			answer=answer+(`${checkIfVerji(googleData[i][0])} has paid for exactly up to this month!\n`);
		}
		else{
			console.log("Something is wrong!");
		}
	}
	console.log(answer);
	return answer;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('table_results')
		.setDescription('Return information about the table.'),
	async execute(interaction) {
		const auth = new google.auth.GoogleAuth({
			keyFile:"credentials.json",
			scopes: "https://www.googleapis.com/auth/spreadsheets",
		});
		//Create client instance for auth
		const client = await auth.getClient();

		//INstance of Google Sheets API
		const googleSheets = google.sheets({version:"v4",auth:client});

		//Get metadata about spreadsheet
		const metaData = await googleSheets.spreadsheets.get({
			auth,
			spreadsheetId
		});

		const getRows = await googleSheets.spreadsheets.values.get({
			auth,
			spreadsheetId,
			range:"Spotify_sheet!1:6",
		})
		await interaction.reply(`Command **/${interaction.commandName}** was run by **${interaction.user.username}**\n--------------------------------------\n***${await orderData(getRows.data.values)}***`);
	},
};