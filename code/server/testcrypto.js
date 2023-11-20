"use strict"
const crypto = require("crypto");

let passwordSTRING = "password1";
let passwordID = "200001";

let hash1 = "78a9b43f33c457b3f12446c7cc4ab6150498ad85c832ec81321ade572350aedfe5903e2cd6252db2b154a747d3a6c2e60a1db3f4578c1f53ccdc96fafcbd9df5";
let hash2 = "";

let salt1 = "e8a1ea50eeaaa38f";
let salt2 = null;

let hashedPassword = crypto.scryptSync(passwordSTRING, salt1, 64).toString('hex');
let hashedPassword2 = crypto.scryptSync(passwordID, salt1, 64).toString('hex');

console.log(hashedPassword);
console.log(hashedPassword2);

if(hashedPassword2 === hash1){
    console.log("valid")
} else {
    console.log("invalid you piece of shit die DIE DIE")
}

