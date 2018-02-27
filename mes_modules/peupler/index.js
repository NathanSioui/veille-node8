"use strict";

const tableau = require("./tableaux.js");
let aNoms = tableau.tabNoms;
let aPrenoms = tableau.tabPrenoms;
let aDomaines = tableau.tabDomaines;
let aTermis = tableau.tabTermis;


const genere_telephone = ()=>{

	let sTelephone = "";
	let max = 9;

	for(let i = 0; i<10; i++){
		let num = Math.floor(Math.random()* max);
		sTelephone += num.toString();

		if(i==2 || i==5){
			sTelephone += "-";
		}
	}

	return sTelephone;
}

//////////////////////////////////////////////////////////////////////////

const genere_email = ()=>{

	let sEmail = "";

	let num = Math.floor(Math.random()* aDomaines.length);
	sEmail += aDomaines[num];
	num = Math.floor(Math.random()* aTermis.length);
	sEmail += aTermis[num];

	return sEmail;
}


///////////////////////////////////////////////////////////////////////////////

const peupler_json = () => {

let maxNom = aNoms.length;
	let maxPrenom = aPrenoms.length;

	let json = "[";

	for(let i=0;i<10;i++){

		json += "{";
		let pos = Math.floor(Math.random()*maxPrenom);
		let sPrenom = aPrenoms[pos];
		json += '"prenom":"'+sPrenom+'",';
		pos = Math.floor(Math.random()*maxNom);
		let sNom = aNoms[pos];
		json += '"nom":"'+sNom+'","telephone":"'+genere_telephone()+'", "email":"'+sPrenom+'.'+sNom+'@'+genere_email()+'"}';

		if(i<9){
			json+=",";
		}
		
	}

	json+="]";

	return JSON.parse(json);
}

module.exports = peupler_json


