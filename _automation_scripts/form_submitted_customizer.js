  
"use strict";

const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const GoogleSpreadsheet = require("google-spreadsheet");
const { promisify } = require("util");
const creds = JSON.parse(process.env.GOOGLE_DRIVE_JSON);
let members_file = path.join(__dirname, "..", "_data", "members.json");
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
		let url = await find(row.ifyestotheabovequestionwhatisyourinstagramtag, row.whatisyourname);
		let member = members.members.find((elem) => elem['name'] == row.whatisyourname);

		if (!url) {
			url = '/assets/images/pfp/default_pfp.png';
		}

		if (member) {
			member.imagepath = url;
			member.label = row.role;
			member.desc = row.whatwouldyoulikeyourbiotobe35wordsorless;
		}
	}
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function find(username, name) {
	let pic_url;
	if (username == '[USE_HARDCOPY]') {
		pic_url = `/assets/images/pfp/${name.replace(' ', '_')}.jpg`;
	} else if (username == '[HAMSTER]') {
		pic_url = '/assets/images/pfp/hamster.jpg';
	} else {
		await sleep(1000);
		
		await fetch(`https://www.instagram.com/web/search/topsearch/?context=user&count=10&query=${username.toLowerCase()}`)
			.then((res) => res.text())
			.then((body) => {
				let json = JSON.parse(body);
				pic_url =  json.users[0].user.profile_pic_url;
		});
	}
	return pic_url;
}

fill().then(() => {
	fs.writeFileSync(members_file, JSON.stringify(members, null, 4));
});
