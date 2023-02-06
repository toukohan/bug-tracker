const fs = require("fs");

const json = require("./MOCK_DATA2.json");

json.forEach((issue) => {
  let date = issue.date.$date;
  issue.date = date;
  console.log(issue.date);
});

fs.writeFileSync("./MOCK_DATA3.json", JSON.stringify(json));
