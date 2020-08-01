let request = require('request');
let fs = require('fs');
let sqlite = require('sqlite3').verbose();
let SZIP = require('node-stream-zip'); //use this
require('../../../config.txt');
let defs = require('./table.json');

var testResult;
/**
var apiKey = "YOUR-API-KEY-HERE";

var xhr = new XMLHttpRequest();
xhr.open("GET", "https://www.bungie.net/platform/Destiny/Manifest/InventoryItem/1274330687/", true);
xhr.setRequestHeader("X-API-Key", apiKey);

xhr.onreadystatechange = function(){
 if(this.readyState === 4 && this.status === 200){
  var json = JSON.parse(this.responseText);
  console.log(json.Response.data.inventoryItem.itemName); //Gjallarhorn
 }
}

xhr.send();
*/

var configSettings = {
	apiKey: '4e04440a43d34b23a4891f3164ef7d4d',  // <-- Add your Bungie API Key here.
	authURL: 'https://www.bungie.net/en/OAuth/Authorize/33692/', // <-- Add your Authorization URL here.
	originHeader: 'https://www.vorpalbunnie.github.io/' // <-- Add your origin header value here.
};

//var baseRequest = request.defaults({headers: {'X-API-Key':configSettings.apiKey}});



function makeRequest(button) {
	var xhttp = new XMLHttpRequest();
	var URL = getURL(button);
	xhttp.open("GET", URL, true);
	xhttp.setRequestHeader('X-API-Key', configSettings.apiKey);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(null);
	testResult = xhttp;
	console.log(xhttp);
	document.getElementById("paragraph").innerHTML = xhttp.responseText;
};
var manifest_json;
var manifest_mobile;
var en_path_json;
var en_path_mobile;

function manifestButton(){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", 'https://www.bungie.net/Platform/Destiny2/Manifest/', true);
	xhttp.setRequestHeader('X-API-Key', configSettings.apiKey);
	xhttp.send();
	xhttp.onreadystatechange = function(){
 		if(this.readyState === 4 && this.status === 200){
 			var json = JSON.parse(this.responseText);
			console.log(json);
			en_path_json = json.Response.jsonWorldContentPaths.en;
  			console.log(en_path_json);
			//console.log(json.Response.data.inventoryItem.itemName); //Gjallarhorn
 		}
	}
}

function getManifestJson(){

	let outStream = fs.createWriteStream('manifest_json.zip');

	request(options)
	.on('response', function(res, body){
		console.log(res.statusCode);
	}).pipe(outStream)
	.on('finish', function(){
		let zip = new SZIP({
			file: './manifest_json.zip',
			storeEntries: true
		});

		zip.on('ready', function(){
			zip.extract(en_path_json, './manifest_json.content', function(err,count){
				if(err) console.log(err);
			});
		});
	});

}

//queries manifes.content, can be modified to accept parameters
//mostly just to demo that this can use the .content file 
//as a sqlite db for queries
function queryManifestJson(){
	let db = new sqlite.Database('manifest_json.content');


	db.serialize(function(){
		
		let query = "SELECT name FROM sqlite_master WHERE type='table'";

		db.each(query, function(err, row){
			if(err) throw err;

			console.log(row);
		});
	});
}



function getURL(button){
  switch(button){
    case "test-button":
      return "https://www.bungie.net/platform/Destiny/Manifest/InventoryItem/1274330687/";
    default:
     return "https://www.bungie.net/Platform/Destiny2/Stats/PostGameCarnageReport/6708842102/";
  };

};


</script>
