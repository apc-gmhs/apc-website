'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = require('./google_secret.json');

let members = {
	members: [],
};

async function fill() {
	const doc = new GoogleSpreadsheet('SPREADSHEET KEY HERE');
	await promisify(doc.useServiceAccountAuth)(creds);
	const info = await promisify(doc.getInfo)();
	const sheet = info.worksheets[0];
	let data = await promisify(sheet.getRows)({
		offset: 1,
	});

	for (let row of data) {
		let url = await find(row.ifyestotheabovequestionwhatisyourinstagramtag);
		members.members.push({
			imagepath: url,
			label: row.role,
			name: row.whatisyourname,
			desc: row.whatwouldyoulikeyourbiotobe35wordsorless,
		});
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
	fs.writeFileSync('_data/formatted.json', JSON.stringify(members, null, 4));
});
