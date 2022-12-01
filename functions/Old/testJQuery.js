// File to correct JQueries
let legalName = "";
let tradeName = "";
let codeCity = "";
let city = "";
let address = "";
let phone = "";
let fax = "";
let pharmacists = [];

$(".hidden-xs").remove();
let allElems = $(".inlineBlock > p");
const keyData = allElems.map((i, e) => {
  return $(e)
    .text()
    .replace(/ +(?= )/g, "")
    .trim();
});
let cleanDataOne = [];
let cleanDataTwo = [];
for (let i = 0; i < keyData.length; i++) {
  let newPush = keyData[i].split("\n");
  cleanDataOne.push(newPush);
}
for (let i = 0; i < cleanDataOne.length; i++) {
  let newPush = [];
  for (let j = 0; j < cleanDataOne[i].length; j++) {
    if (cleanDataOne[i][j].length > 1) {
      newPush.push(cleanDataOne[i][j].trim());
    }
  }
  cleanDataTwo.push(newPush);
}
// console.log(cleanDataTwo);

for (let i = 0; i < cleanDataTwo.length; i++) {
  if (cleanDataTwo[i][0] === "Raison sociale :") {
    legalName = cleanDataTwo[i][1];
    if (cleanDataTwo[i][2] === "Adresse :") {
      address = cleanDataTwo[i][3] + " " + cleanDataTwo[i][4];
    }
  }
  if (cleanDataTwo[i][0] === "Dén. commerciale :") {
    tradeName = cleanDataTwo[i][1];
    if (cleanDataTwo[i][2] === "Code postal - ville :") {
      codeCity = cleanDataTwo[i][3];
      city = cleanDataTwo[i][4];
    }
  }
  if (cleanDataTwo[i][0] === "Code postal - ville :") {
    codeCity = cleanDataTwo[i][1];
    city = cleanDataTwo[i][2];
  }
  if (cleanDataTwo[i][0] === "Téléphone :") {
    phone = cleanDataTwo[i][1];
  }
  if (cleanDataTwo[i][0] === "Télécopie :") {
    fax = cleanDataTwo[i][1];
  } else if (cleanDataTwo[i].length === 4) {
    let pharmacist = {
      fullName: cleanDataTwo[i][0],
      role: cleanDataTwo[i][1],
      inscriptionDate: cleanDataTwo[i][2].split(" : ")[1],
      section: cleanDataTwo[i][3].split(" : ")[1],
    };
    pharmacists.push(pharmacist);
  }
}

if (tradeName === "") {
  tradeName = legalName;
}

let result = {
  legalName,
  tradeName,
  codeCity,
  city,
  address,
  phone,
  fax,
  pharmacists,
};
