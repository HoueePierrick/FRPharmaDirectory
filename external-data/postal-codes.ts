const postOfficeData = require("./laposte_hexasmal.json");

let allPostalCodes: string[] = [];

for (let i = 0; i < postOfficeData.length; i++) {
  allPostalCodes.push(postOfficeData[i].fields.code_commune_insee);
}

allPostalCodes = allPostalCodes.sort();

// console.log(allPostalCodes);
export default allPostalCodes;
