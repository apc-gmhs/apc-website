'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = {
	"type": "service_account",
	"project_id": "instagram-username-array-fill",
	"private_key_id": "f75addbc4e72df6ff38dfe501c808501f6a3645d",
	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtLc8tgkT6gHUH\nYFFmZXmaYIyGlSVx4bzUngsGHsjKA0Q/RfYAdOCqLKz99LNvGy2jnRNTZYDhkYdP\nQs6Dgh6WIdKhbGK9tnI/ZrNtufvTqDGbH81E5//guj/2ZEgtsCAdIQqfT+t1bnRg\nG2aPZ53j29/bterZATZFPTq5/hMWZHhQMizKHPd1D7zUNvb5SMi4eNKblirX2JTw\nKBvBoDsaTZs+lbPF99FSUxMFH8n7HY0gTD0HN/2HOijlBT7zI46Ft5kEc+Eqwo0r\njrOLincW7PDLGbznwOhMr59nkZx4gSE1OYvRV8LlJz2J1MFFWsFC0JdVXroe97CJ\nu5+CCzEnAgMBAAECggEACAh388R3LqeGxjDRlc5fNaoE2rlQY1f1SmeKW15SMgy0\nvbqhDqRdR4eK/ry7FgxMsao3m0a6E7yMakDPE4qVoKExBAvjCKnN4uMAr7ZQ2CCV\nLHztKKUaWXJKRUOhlXz2AGPn+jva0DevbkXXHA/SYx9v4uEtY6OKwOt2Lep7OC6d\nV58kqcr/EUJtyZ/fETmKBFZd48ygBvcDzUVo+OL1P0M9vekbQINcwMMlOTo928NA\nXPW0MIFdPFUupNe42F5SwoLsqnRgau9gRlP2OJxdpTHPO1P9v94f+Kvcq2RNjY9E\ndoItJdHDEw9EqcmaMfK7ZzEnwkrW++JJbkk31fouAQKBgQDc7PaUrCl3+rrh0UUI\ndpOnfvF5RK7LZoXk/kZ554RXxcjRDgcD3LvOWCpRhOXOd9EUtCwA3fFwrJJtXTc0\nWhr6VPQJZP0Y+QqWvfUzY9XC/fkAhAyz/oM9bZvlBgY7adwQ94/y60T7xM1P/IYO\nLAwbsrjFHlvFAGedTTWiiI18OQKBgQDIrElheEDmMXKT7u6BSAvDFnb+Na52C61m\n03aqFGN0qLAoaJH1KgZY3IaRTRJP5Dc9HtCku6vLBuotNm05v4DnqDN2Pl2dIuo3\n+AWUp3zvQBKOKSMs9w/e2LDrn3EGoG2mqOSS1f8qbPQ5luKTIv9gAujAaKU1OhOr\ncNkCborYXwKBgQCzAPlGOzyabzhu8e36ToGSzGOBe6oZOmewxGp8KZ9sst/kq3X5\npicxqPQY+xJsuV5aZSXmSe5v+hPmswmgzIVhYeYdmosMafUvcJi1W+X+yWOxDE1y\npfzWj/Ipnjj8eOiLgttK22AYkzw73AMOhpgE9UmKxe9bbtmFdeLIX9Yr2QKBgFpt\n8R+ATlatf8GUUVxm+A3w6KyDyludxYVp07avO2ZNwhxjiyqcxoFy1x1RSug/onjj\nkwg5HiB+vDalqTD10IQUMySc1BjErCGOng0wMMer6vCvLw/LQhadNZToo8llsCQD\nRgW5c6RNtvzgtrexdL1yciqKvbAvvL9sOg6ze9QnAoGBALoasrmSyPa0TRGWN4hH\n78RNpm+ih1c5SeVePp70GPgeYPT9TdrgDKojU13DMeaDw+iHGFRo1fNpPIeCMWoh\nIWsppK5jx4LeoQwLLt368Jscn9kzJ7kkBeWSVxQg6Y/wF2rR8TkQV68X6L1HjS4/\n2mm35V2vetmEvMJUcFhznJgW\n-----END PRIVATE KEY-----\n",
	"client_email": "apc-gmhs@instagram-username-array-fill.iam.gserviceaccount.com",
	"client_id": "104194090607523840842",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/apc-gmhs%40instagram-username-array-fill.iam.gserviceaccount.com"
  }
  
let members_file = path.join(__dirname, '..', '_data', 'members.json');
let members = require(members_file);

async function fill() {
	const doc = new GoogleSpreadsheet('1vKzBWgMmJelUf7nCLCsYhi_CbjRdeO3mBagff0onf08');
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
	
		/*await fetch(`https://www.instagram.com/${username.toLowerCase()}/?__a=1`)
			.then((res) => res.text())
			.then((body) => {
				console.log(username);
				console.log(body);
				let json = JSON.parse(body);
				pic_url = json.graphql.user.profile_pic_url_hd;
			}); */
	}

	return pic_url;
}

fill().then(() => {
	fs.writeFileSync(members_file, JSON.stringify(members, null, 4));
});
