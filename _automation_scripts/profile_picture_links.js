const fetch = require("node-fetch");
const fs = require('fs');

/* use google api to get usernames from spreadsheet and fill array */
let usernames = [''];
let urls = {
    instagram_urls: [] 
};

for (let i of usernames) {
    fetch('https://www.instadp.com/fullsize/' + i)
        .then(res => res.text())
        .then(body => {
            if(body.includes("<img class=\"picture\" src=\""))
            {
                let temp_pos = body.split('<img class=\"picture\" src=\"').pop();
                let pic_url = temp_pos.substring(0, temp_pos.indexOf("\""));

                urls.instagram_urls.push({[i]: pic_url}); 
                var json = JSON.stringify(urls)
                fs.writeFileSync("_data/" + "instagram_urls.json", json, 'utf8', null, 4); 
            }
        })
}