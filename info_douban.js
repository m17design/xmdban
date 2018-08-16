var system = require('system');

if (system.args[1][0] == "{") id_input = JSON.parse (system.args[1]);
else {
var tempJsonString = "{";
if (system.args.length > 1) tempJsonString += "\"id_douban\":\"" + system.args[1] + "\"";
if (system.args.length > 2)  tempJsonString += ",\"id_imdb\":\"" + system.args[2] + "\""; 
if (system.args.length > 3)  tempJsonString += ",\"id_imdb_link\":\"" + system.args[3] + "\""; 
tempJsonString += "}";
//console.log (tempJsonString);
id_input = JSON.parse(tempJsonString);	
}
//console.log (id_input.toString);
//console.log (JSON.stringify(id_input));

//console.log (typeof (id_input));
var doubanScrapingSingle = require('./xmdban.js').webScrapingDouban;
doubanScrapingSingle (id_input , function(){phantom.exit();});
