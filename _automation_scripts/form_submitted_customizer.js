'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = JSON.parse(process.env.GOOGLE_DRIVE_JSON)
let members_file = path.join(__dirname, '..', '_data', 'members.json');
let members = require(members_file);

async function fill() {
	const doc = new GoogleSpreadsheet(process.env.MEMBERS_SPREADSHEET_KEY);
	await promisify(doc.useServiceAccountAuth)(creds);
	const info = await promisify(doc.getInfo)();
	const sheet = info.worksheets[0];
	let data = await promisify(sheet.getRows)({
		offset: 1,
	});

	for (let row of data) {
		let url = await find(row.ifyestotheabovequestionwhatisyourinstagramtag);
		let member = members.members.find(elem => elem['name'] == row.whatisyourname);

		if (member) {
			member.imagepath = url;
			member.label = row.role;
			member.desc = row.whatwouldyoulikeyourbiotobe35wordsorless;
		}
	}
}

async function find(username) {
	let pic_url;
	await fetch('https://www.instadp.com/fullsize/' + username)
		.then((res) => res.text())
		.then((body) => {
			if (body.includes('<img class="picture" src="')) {
				// remove everything after the html tag for the pfp
				let temp_pos = body.split('<img class="picture" src="').pop();
				// only keep everything before the closing quote
				pic_url = temp_pos.substring(0, temp_pos.indexOf('"'));
			}
		});
	return pic_url;
}

fill().then(() => {
	fs.writeFileSync(members_file, JSON.stringify(members, null, 4));
});
