const fetch = require('node-fetch');
const fs = require('fs');

/* use google api to get usernames from spreadsheet and fill array */
let usernames = ['jonathanoppenheimer'];
let urls = {
	instagram_urls: [],
};

async function find() {
	for (let i of usernames) {
		await fetch('https://www.instadp.com/fullsize/' + i)
			.then((res) => res.text())
			.then((body) => {
				if (body.includes('<img class="picture" src="')) {
					// remove everything after the html tag for the pfp
					let temp_pos = body.split('<img class="picture" src="').pop();
					// only keep everything before the closing quote
					let pic_url = temp_pos.substring(0, temp_pos.indexOf('"'));

					urls.instagram_urls.push({
						[i]: pic_url,
					});
				}
			});
	}
}

find().then(() => {
	// the node run command must be run in this directory for the path to work
	fs.writeFileSync('../_data/instagram_urls.json', JSON.stringify(urls, null, 4));
});
