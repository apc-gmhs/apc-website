var fs = require("fs");

var keepUsers = [
  "Ella Reithinger",
  "Sean Young",
  "Danny Oppenheimer",
  "Samuel Klemic",
  "Abby Quade",
  "Anuragi Thapliya",
  "Peter Villa",
  "Sequoia Wyckoff",
];

var data = fs.readFileSync("../_data/members.json");
var json = JSON.parse(data);
let length = data.length;

for (i = keepUsers.length; i < length; i++) {
  delete json.members[i];
}

var temp = JSON.stringify(json);
for (i = keepUsers.length; i < length; i++) {
  temp = temp.replace("null,", "");
}
temp = temp.replace(",null", "");
json = JSON.parse(temp);

fs.writeFileSync("../_data/members.json", JSON.stringify(json, null, 2));
