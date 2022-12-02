import data from "../generated-data/AllDetails.js";
import saveToFile from "./SaveToFile.js";
import { pharmacist } from "./Interfaces";

let finalResult: pharmacist[] = [];
for (let i = 0; i < data.length; i++) {
  if (data[i].city !== "") {
    const {
      name,
      legalName,
      tradeName,
      codeCity,
      city,
      category,
      address,
      phone,
      fax,
      pharmacists,
    } = data[i];
    let pharmacyName: string = name;
    const pharmacistCount = pharmacists.length;
    if (name === "") {
      pharmacyName = tradeName;
    }
    if (pharmacists.length === 0) {
      finalResult.push({
        pharmacyName,
        legalName,
        tradeName,
        codeCity,
        city,
        category,
        address,
        phone,
        fax,
        pharmacistCount,
        fullName: "",
        role: "",
        inscriptionDate: "",
        section: "",
      });
    } else {
      for (let j = 0; j < pharmacists.length; j++) {
        const { fullName, role, inscriptionDate, section } = pharmacists[j];
        finalResult.push({
          pharmacyName,
          legalName,
          tradeName,
          codeCity,
          city,
          category,
          address,
          phone,
          fax,
          pharmacistCount,
          fullName,
          role,
          inscriptionDate,
          section,
        });
      }
    }
  }
}

saveToFile(finalResult, "CleanData");
