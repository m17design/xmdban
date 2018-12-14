// change log

// 0.08.14 move apikey into xmdban.config.js 
// 0.06.15 json as input and retuen parameters

phantom.outputEncoding="utf8";

var config = require('./xmdban.config.js').config;

var pageDoubanJson = require('webpage').create(); 

var JSONPath = require('jsonpath-plus');
var execFile = require("child_process").execFile; 

var douban_ID = [];

fnIpTest = function(fnDone)
{
	var pageIpTest = require('webpage').create();	
pageIpTest.settings.userAgent = 'Windows / Firefox 56 [Desktop]: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0';
pageIpTest.customHeaders = {    "Referer": "https://www.google.com/","Accept-Language":"zh-CN,cn;q=0.5","Accept-Charset":"utf-8;q=0.7" };
	pageIpTest.open("http://icanhazip.com/", function(status) {
  if (status !== 'UNDEF') {
    console.log('UNDEF');
  } 
  else 
  {
  	console.log( pageIpTest.plainText.replace("\n","") );
	}
	fnDone();
 });
}

fnIpV4Test = function(fnDone)
{
	var pageIpTest = require('webpage').create();	
pageIpTest.settings.userAgent = 'Windows / Firefox 56 [Desktop]: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0';
pageIpTest.customHeaders = {    "Referer": "https://www.google.com/","Accept-Language":"zh-CN,cn;q=0.5","Accept-Charset":"utf-8;q=0.7" };
	pageIpTest.open("http://ipv4.icanhazip.com/", function(status) {
  if (status !== 'success') {
    console.log('UNDEF');
  } 
  else 
  {
  	console.log( pageIpTest.plainText.replace("\n","") );
  }
	pageIpTest.close();
	fnDone();
 });
}

fnIpV6Test = function(fnDone)
{
	var pageIpTest = require('webpage').create();	
pageIpTest.settings.userAgent = 'Windows / Firefox 56 [Desktop]: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0';
pageIpTest.customHeaders = {    "Referer": "https://www.google.com/","Accept-Language":"zh-CN,cn;q=0.5","Accept-Charset":"utf-8;q=0.7" };
		
	pageIpTest.open("http://ipv6.icanhazip.com/", function(status) {
  if (status !== 'success') {
    console.log('UNDEF');
  } 
  else 
  {
  	console.log( pageIpTest.plainText.replace("\n",""));
     }
	pageIpTest.close();
//console.log("closed");
	fnDone();
 });
}

//fnIpTest();
//fnIpV4Test();
//fnIpV6Test();


// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh  "{\"id_tmdb\":\"12225\"}"
// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh  "{\"id_tmdb\":\"12225\",\"media_type\":\"tvshow\"}"
// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh  "{\"id_tmdb\":\"12225\",\"media_type\":\"episode\"}"
// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh  "{\"id_tmdb\":\"12225/season/1/episode/1\",\"media_type\":\"episode\"}"
// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh  "{\"id_tmdb\":\"12225/season/1/episode/1\"}"

// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh  "{\"id_tmdb\":\"400020\",\"media_type\":\"movie\"}"
// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh  "{\"id_tmdb\":\"529783\",\"media_type\":\"movie\"}"
// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh  "{\"id_tmdb\":\"529783\"}"     // movie must have media_type 

// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh   529783
// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh   79766/season/1/episode/29
// /usr/lib/node_modules/xmdban/id_tmdb2douban.sh   79766/season/-1/episode/-1

fnIDxTMDB2IMDB = function(input_json, fnCallbackFinal )
{
  var	addressTMDB;
	var pageTMDB = require('webpage').create();
  var tempMediaType, tempTmdbSeason, tempTmdbEpisode, tempTmdbID, tempImdbId ;
  var result = new Object();
  console.log( config.tmdb.apiUrl ); 
  if (typeof(input_json) == 'string'){
    	 tmdb_id_input = input_json ;
    	 result.id_tmdb = input_json ;
    	 if (tmdb_id_input.indexOf("/season/") == -1 && tmdb_id_input.indexOf("/episode/") == -1 ) 
    	 {
    	 	tempMediaType = "movie";
    	 	result.media_type = tempMediaType;
    	 }	
   	 
    }
    else 
    {
 		   console.log (JSON.stringify(input_json));
    	 tmdb_id_input = input_json.id_tmdb;
       tempMediaType = input_json.media_type ; 
    	result = input_json;
    }	 

  if ( tempMediaType == "movie")
  {
		addressTMDB = config.tmdb.apiUrl +  "movie/";
		addressTMDB +=  tmdb_id_input;  	
	}
	else
		{
			addressTMDB = config.tmdb.apiUrl +  "tv/" ;
			if (tmdb_id_input.indexOf("/season/") != -1 && tmdb_id_input.indexOf("/episode/") != -1 )
			{
				var temp_tmdb_episode_array = tmdb_id_input.split("/");
		// no imdb id for season, only for tv and for episode
				tempTmdbID = temp_tmdb_episode_array[0];
				tempTmdbSeason = temp_tmdb_episode_array[2];
				tempTmdbEpisode = temp_tmdb_episode_array[4];
			}
			if 		(tempTmdbSeason == "-1" && tempTmdbEpisode == "-1")	addressTMDB += tempTmdbID;
			else addressTMDB +=  tmdb_id_input;
	}
	
	addressTMDB +=  config.tmdb.externalIds + "?" + config.tmdb.apiKey;
  console.log (addressTMDB);
 	pageTMDB.settings.userAgent = config.tmdb.userAgent;
	pageTMDB.customHeaders = config.tmdb.customHeaders;
	pageTMDB.open(addressTMDB,function(status){
  if (status !== 'success') 
  {
 // 	console.log ("not connect to TMDB");
  }
  else
  {
			var tempTMDBResultString =  pageTMDB.plainText;
			var TMDBResultJson = JSON.parse(tempTMDBResultString);			
//			tempImdbID = 	JSONPath("$.imdb_id",TMDBResultJson);		 	// if no external_ids for episode then search 
			tempImdbID = 	TMDBResultJson.imdb_id;		 	// if no external_ids for episode then search 

		
			console.log (typeof(tempImdbID) );
		//	console.log ("tempImdbID[" +  tempImdbID + "]");
			pageTMDB.close();
			if (tempImdbID != "" && typeof(tempImdbID) == "string") {
				  result.id_imdb = tempImdbID
			 		fnCallbackFinal(result);						
			}	
			else 
			{	
			//		console.log ("no imdb id" + " " + tempTmdbSeason + " " +  typeof(tempTmdbSeason));
					if (tempMediaType != "movie") 
					{
						

						addressTMDB = config.tmdb.apiUrl + "tv/" + tempTmdbID; 
						addressTMDB +=  config.tmdb.externalIds + "?" + config.tmdb.apiKey;

				//		console.log ("for tv show:" +  addressTMDB);
					pageTMDB = require('webpage').create();
						pageTMDB.open(addressTMDB,function(status){
 						 if (status !== 'success') 
						  {
					//	  	console.log ("not connect to TMDB " + addressTMDB);
						  }
						  else
						  {	
						  		tempTMDBResultString =  pageTMDB.plainText;
									TMDBResultJson = JSON.parse(tempTMDBResultString);			
									tempImdbID = 	TMDBResultJson.imdb_id;		 	// if no external_ids for episode then search 
						//			console.log ("tv:" + tempImdbID);
									fnImdbIdSeEpToImdbId (tempImdbID,	tempTmdbSeason,	tempTmdbEpisode, tmdb_id_input, fnCallbackFinal);
						  }					
							});
			//			fnIDxTMDB2IMDB (+"/season/-1/episode/-1",fnCallbackFinal);
						//	console.log ("xxx");
					}
  		}
  }
			
	}
	);
} 

fnImdbIdSeEpToImdbId = function(imdb_id_input,season_input,episode_input,tmdb_id_input, fnCallbackFinal)
{
//	https://m.imdb.com/title/tt0426769/episodes/?season=4
 var addressIMDB = "https://m.imdb.com/title/" + imdb_id_input + "/episodes/?season=" + season_input + "&ref_=m_ttep_ep_ep" + episode_input;
 var tempImdbID;
 var tempEpisode = parseInt(episode_input);
//	console.log (addressIMDB);
	var pageIMDB = require('webpage').create();	

  pageIMDB.settings.userAgent = config.imdb.userAgent;
	pageIMDB.customHeaders = config.imdb.customHeaders;
	pageIMDB.open(addressIMDB, function(status) {
  if (status !== 'success') {
   // console.log('FAIL to load the address');
  } 
  else
  {
  		var tempTestEP ;
//console.log(pageIMDB.title );
			tempTestEP = 	pageIMDB.evaluate( function(episode_input) {
			  		var epSuffix ="m_ttep_ep_ep" + episode_input;
			var links =	 document.querySelectorAll("#eplist  > div > a");
			var idx = parseInt(episode_input)-1;
				var imdbLink=links[idx].getAttribute("href");
				var etest = imdbLink.split ("=");  
				if (epSuffix == etest[1]) return etest[0].replace("/title/","").replace("?ref_","")
			return null;
			  },episode_input);	
		console.log("tempTestEP; " + tempTestEP );	
		result = new Object();
		result.id_imdb = tempTestEP;
		result.id_tmdb = tmdb_id_input;
		result.id_imdb_link = imdb_id_input;
		result.season = season_input;
		result.episode = episode_input;
		result.media_type = "episode";
 		fnCallbackFinal(result);				
  }
	}
	);
	

}

fnDoubanSearch = function(input_json, fnCallbackFinal ) 
// /usr/lib/node_modules/xmdban/search_douban.sh "{\"q\":\"search?q=Nancy&\",\"count\":20,\"id\":[]}"
// /usr/lib/node_modules/xmdban/search_douban.sh "{\"q\":\"in_theaters?\",\"count\":20,\"id\":[]}"
// {"q":"search?q=Nancy&","count":20,"id":[]}
// {"q":"in_theaters?","count":20, "id":[]}
{
		var pageDoubanSearch = require('webpage').create(); 
        pageDoubanSearch.settings.userAgent = config.douban.userAgent;
				pageDoubanSearch.customHeaders = config.douban.customHeaders;

		var	tempAddressDoubanSearch = config.douban.apiUrl + input_json.q + "count=" + input_json.count + "&start=" + input_json.id.length + "&" + config.douban.apiKey;
//		console.log (tempAddressDoubanSearch);	
					
   	pageDoubanSearch.open(tempAddressDoubanSearch, function(status) {
  	if (status !== 'success') {
    	console.log('{\"status\":\"FAIL to load douban search json\"}');
//    	return;
  	}
   	else 
  	{
			var tempDoubanSearchResultString =  pageDoubanSearch.plainText;
			var doubanSearchResultJson = JSON.parse(tempDoubanSearchResultString);			
		//		console.log (doubanSearchResultJson.total.toString());
			var 	doubanIdArray  = JSONPath("$.subjects[*].id",doubanSearchResultJson);	
		//	console.log (doubanIdArray.length);
		//	console.log (doubanIdArray.toString());
		  input_json.id = input_json.id.concat (doubanIdArray);
		  input_json.total =  doubanSearchResultJson.total;
	//	tempTotal = parseInt(  JSONPath("$.total",doubanSearchResultJson));
			pageDoubanSearch.close();
		}

	//console.log (input_json.id.length + " " + input_json.total );
		if (input_json.id.length < input_json.total  )
		{
			var tout = Math.floor(Math.random() * 1000); 
	//	console.log ("delay:" + tout);
			setTimeout(fnDoubanSearch(input_json,fnCallbackFinal) ,tout);
		}
		else
		{	
			console.log (JSON.stringify(input_json));
			fnCallbackFinal (input_json);
		}
		return;
	});
}

fuImdbTop250 = function()
{
}

fnWebScrapingDouban = function (id_input, fnCallbackFinal )
// /usr/lib/node_modules/xmdban/info_douban.sh "{\"id_douban\":\"27052289\",\"id_imdb\":\"tt533\",\"id_imdb_link\":\"tt0891457\"}"
// /usr/lib/node_modules/xmdban/info_douban.sh 27052289 tt533 tt0891457
{
	//	console.log( "fnDoubanScraping:" + id_input);
		var pageDouban, webpage;
		var imdb_id_input, imdb_id_link_input;
		var tempDoubanLink,	
				tempDoubanVA,	
				tempDoubanVS2,	
				tempDoubanID,	
				tempDoubanYear,	
//			tempDoubanSubType,	
				tempDoubanDirectors,
				tempDoubanTitleOriginal,
				tempIMDB,
				tempDoubanTitle,
				tempDoubanTitleAKA,
				tempDoubanCountries,
				tempDoubanPremieredCN;		
//		var result =	 {
//			"id_douban":null, 
//			"id_imdb":null, 
//			"id_imdb_link":null, 
//			"year_douban":null, 
//			"title_douban":null, 
//			"title_original_douban":null, 
//			"title_aka_douban":null, 
//			"director_douban":null, 
//			"rating_douban":null, 
//			"votes_douban":null, 
//			"country_douban":null, 
//			"in_theaters_cn":null, 
//			"release_theaters_cn":null };	
var result = new Object();
				
    webpage = require("webpage");
    if (typeof(id_input) == 'string'){
    	tempDoubanID = id_input ;
    }
    else 
    {
    	  tempDoubanID = id_input.id_douban;
    	  imdb_id_input = id_input.id_imdb;
    	  imdb_id_link_input = id_input.id_imdb_link;
    }	  
//    console.log ("fnWebScrapingDouban::" + tempDoubanID + " " + imdb_id_input + " " + imdb_id_link_input )
		tempDoubanLink = "https://movie.douban.com/subject/" + tempDoubanID + "/" ;
	  pageDouban = webpage.create();
   	pageDouban.settings.userAgent = config.douban.userAgent;
		pageDouban.customHeaders =config.douban.customHeaders;
	//	console.log (tempDoubanLink);		
		pageDouban.open ( tempDoubanLink ,function(status) {
						if (status !== 'success') {
									pageDouban.close(); 
									return  tempDoubanLink + " not success";
						}
				   	else 
				  	{
					//			console.log ("Douban Page Loaded...");	
				        var tempDoubanInfo = pageDouban.evaluate( function() { 
									var infomation =  document.getElementById('info');
									return	infomation.innerHTML ;
								});

								if ( tempDoubanInfo != null)
								{
										var imdb_re = /(http:\/\/www.imdb.com\/title\/tt\d+(\.\d)*)/i;
										var imdb_res = 	tempDoubanInfo.match(imdb_re);
					//				console.log ("imdb_res  " + imdb_res) ; 
										if (imdb_res !== null) tempIMDB = imdb_res[0].replace("http://www.imdb.com/title/",""); else tempIMDB = undefined;
								}
								
					//		console.log ("IMDB:" + tempIMDB);
								
								if (tempIMDB == imdb_id_input || tempIMDB == imdb_id_link_input || (typeof(imdb_id_input) == "undefined" &&  typeof(imdb_id_link_input)== "undefined" ) ||  typeof(tempIMDB) == "undefined" )				  		
				  			{
			  				tempDoubanTitle = pageDouban.title.replace(" (\u8c46\u74e3)","");
						  	tempDoubanTitleOriginal = pageDouban.evaluate( 	function() { var o2 = document.querySelector("html>body>div#wrapper>div#content>h1>span");return o2.innerText; });
								if (tempDoubanTitleOriginal != tempDoubanTitle ) tempDoubanTitleOriginal = tempDoubanTitleOriginal.replace( tempDoubanTitle + " " ,"");
					//			console.log ( tempDoubanTitleOriginal +  " " + tempDoubanTitle);
							
								tempDoubanDirectors = pageDouban.evaluate( function() { var dt2 = document.querySelector('div#info span span.attrs'); return dt2.innerText; }); 
								if ( tempDoubanDirectors != null) tempDoubanDirectors = tempDoubanDirectors.toString().replace (/,/g , " / "); else  tempDoubanDirectors = undefined;
				//				console.log ("DoubanDirectors:" + tempDoubanDirectors);


				      	tempDoubanYear = pageDouban.evaluate( function() { var ye = document.querySelector('span.year'); return ye.innerText; }); 
				        tempDoubanYear = tempDoubanYear.replace("(","").replace(")",""); 
					  // 		console.log (tempDoubanYear);  
					    		
					    	tempDoubanVA  = pageDouban.evaluate( function() { var va = document.querySelector('strong.rating_num'); return va.innerText; });
								tempDoubanVS2 = pageDouban.evaluate( function() { var vs2 = document.querySelector('span[property=v\\3Avotes]'); return vs2.innerText; });
						//		console.log (tempDoubanVA + " " + tempDoubanVS2);  
											
									if ( tempDoubanInfo != null)
									{											
										var aka_re = /又名(.*?)<br/ ;
										//var aka_re = /又名/ ;
										//  /<span class="pl">又名:(.*?)<br\/>/ 
										// <span class="pl">又名:(.*?)<br/>
										var aka_res = tempDoubanInfo.match(aka_re);
	//										console.log ( aka_res  ); 		
										if (aka_res !== null) tempDoubanTitleAKA = aka_res[0].replace("又名:</span> ","").replace("<br",""); else tempDoubanTitleAKA = undefined;

							//			console.log (tempDoubanTitleAKA + "  aka_res  " + aka_res  ); 	
						
										var cn_match = /地区:(.*?)<br/ ;
										var cn_res = tempDoubanInfo.match(cn_match);
								//		console.log (cn_res);
											tempDoubanCountries = cn_res[0].replace("地区:</span> ","").replace("<br","");
											
										var cnp_match = /initialReleaseDate(.*?)中国大陆/;
										var cnp_res = tempDoubanInfo.match(cnp_match);	
								//		console.log(cnp_res);
									//	tempDoubanPremieredCN = cnp_res[0].replace("initialReleaseDate\" content=\"","").replace("(中国大陆","");
								//		if (cnp_res != null) tempDoubanPremieredCN = cnp_res[0].substring(29,39); else tempDoubanPremieredCN= undefined;
//										if (cnp_res != null) tempDoubanPremieredCN = cnp_res[0].replace("initialReleaseDate\" content=\"","").replace("(中国大陆",""); else tempDoubanPremieredCN= undefined;
										if (cnp_res != null) tempDoubanPremieredCN = cnp_res[0].replace("initialReleaseDate\" content=\"","").substring(0,10); else tempDoubanPremieredCN= undefined;
								//		console.log (tempDoubanPremieredCN);
									}
							}
								
				if ( tempDoubanID != "" && typeof(tempDoubanID) != 'undefined' ) {  		if (tempIMDB == imdb_id_input || tempIMDB == imdb_id_link_input || (typeof(imdb_id_input) == "undefined" &&  typeof(imdb_id_link_input)== "undefined" ) ||  typeof(tempIMDB) == "undefined" )		 result.id_douban = tempDoubanID;}
				if ( tempIMDB != "" && typeof(tempIMDB) != 'undefined' ) { if (tempIMDB == imdb_id_link_input ) result.id_imdb_link = tempIMDB; else if(tempIMDB == imdb_id_input || (typeof(imdb_id_input) == "undefined" &&  typeof(imdb_id_link_input)== "undefined" ))  result.id_imdb = tempIMDB; }
				if ( tempDoubanYear != "" && typeof(tempDoubanYear) != 'undefined' ) { result.year_douban = tempDoubanYear; }
				if ( tempDoubanTitle != "" && typeof(tempDoubanTitle) != 'undefined' ) { result.title_douban = tempDoubanTitle;}
				if ( tempDoubanTitleOriginal != "" && typeof(tempDoubanTitleOriginal) != 'undefined' ) {result.title_original_douban = tempDoubanTitleOriginal; }
				if ( tempDoubanTitleAKA != "" && typeof(tempDoubanTitleAKA) != 'undefined' ) {result.title_aka_douban = tempDoubanTitleAKA;} 

				if ( tempDoubanCountries != "" && typeof(tempDoubanCountries) != 'undefined' ) { result.country_douban = tempDoubanCountries;  }
				if ( tempDoubanPremieredCN != "" && typeof(tempDoubanPremieredCN) != 'undefined' ) {result.release_theaters_cn = tempDoubanPremieredCN;}

				if ( tempDoubanVA != "" && typeof(tempDoubanVA) != 'undefined' &&  tempDoubanVA != 0) { result.votes_douban = tempDoubanVS2 ; result.rating_douban = tempDoubanVA; }
				if ( tempDoubanDirectors != "" && typeof(tempDoubanDirectors) != 'undefined')  {result.director_douban = tempDoubanDirectors; }

				console.log ( JSON.stringify(result))	;			
				 pageDouban.close(); 
				 fnCallbackFinal (result);				
				}
				});
}

fnWebScrapingIMDB = function(input_json , fnCallbackFinal) 
// /usr/lib/node_modules/xmdban/info_imdb.sh  "{\"id_imdb\":\"tt0891457\"}"
// /usr/lib/node_modules/xmdban/info_imdb.sh  "{\"id_imdb\":\"tt1393605\"}"
// /usr/lib/node_modules/xmdban/info_imdb.sh tt0891457
// /usr/lib/node_modules/xmdban/info_imdb.sh  "{\"id_imdb\":\"tt0426769\"}"
//tt1032571
//tt1032550
// tt4191702 Norman (2016)
// tt0091954 Sid & Nancy (1986)
// tt6509058 Nancy (2018)

{

    if (typeof(input_json) == 'string'){
    	  imdb_id_input = input_json ;
    }
    else 
    {
//    	console.log (JSON.stringify(input_json));
    	  imdb_id_input = input_json.id_imdb;
    }	 
    
	
	
	var tempOGTitle, tempOGType, tempCR, tempYear, tempTitle, tempSubTitle,  tempEpisodeTitle ,  tempEpisodeDate, tempTV ,tempEpisode, tempSeason, tempImdbVA, tempImdbVS;
	var addressIMDB = "https://m.imdb.com/title/" + imdb_id_input + "/";
	console.log (addressIMDB);
	var pageIMDB = require('webpage').create();	

          	pageIMDB.settings.userAgent = config.tmdb.userAgent;
						pageIMDB.customHeaders = config.tmdb.customHeaders;

	pageIMDB.open(addressIMDB, function(status) {
  if (status !== 'success') {
    console.log('{\"result\":\"FAIL to load the address\"}');
  } 
  else 
  {
//	console.log (addressIMDB);
	var result =  new Object();
//	console.log (typeof(result));
	result.id_imdb = imdb_id_input;
	tempOGTitle = pageIMDB.evaluate( function() { var og2 = document.querySelector('meta[property=og\\3Atitle]'); return og2.getAttribute('content'); });
	tempOGType = pageIMDB.evaluate( function() { var og2 =  document.querySelector('meta[property=og\\3Atype]'); return og2.getAttribute('content'); });
//	tempCR = pageIMDB.evaluate( function() { var og2 =  document.querySelector('meta[ itemprop=contentRating]'); return og2.getAttribute('content'); });
//tempCR = "Rated " + tempCR;
//application/ld+json
var tempCRjsonString = pageIMDB.evaluate( function() { var og2 =  document.querySelector('html head script[type=application\\2Fld\\2Bjson]'); var j = og2.innerText; return j;});
var tempCRjson = JSON.parse(tempCRjsonString);
tempCR = tempCRjson.contentRating
//console.log(tempCR3.contentRating);
//console.log("og:Title:" + tempOGTitle);
//console.log("og:Type: " + tempOGType);
//console.log("Content Rating:	[" + tempCR + "]");
// var tempUserRate = pageIMDB.evaluate( function() { var ur = document.querySelector("span.inline-block,.text-left,.vertically-middle"); return ur;});
var tempUserRate = pageIMDB.evaluate( function() { var ur = document.querySelector("div#ratings-bar div" ); return ur.innerText;});
//console.log('tR:' + tempUserRate);
	tempUserRate = tempUserRate.replace (",","");

var	tempUR3 = tempUserRate.split(/[\n,\r,\\/]/);

	if (tempUserRate != "Needs 5\nratings") {
	tempImdbVA = tempUR3[0];
	tempImdbVS = tempUR3[2];
	}
	else
	{
//			console.log ( "--" + tempUserRate + "--");
	}

//console.log(tempUserRate.innerText);
//console.log("rate   :" + tempImdbVA);
//console.log("votes  :" + tempImdbVS);

    if (tempOGType == "video.episode") 
    {
 tempTV =  	pageIMDB.evaluate( function() { var tv =  document.querySelectorAll('section#titleOverview a.btn-full.bg-solid-gray'); return tv[0].getAttribute("href"); });
 tempTV = tempTV.replace("/title/","").replace("/?ref_=m_tt_ov_inf","");
 tempSeason = pageIMDB.evaluate( function() { var og2 =  document.querySelectorAll('section#titleOverview div#episodesBar span strong'); return og2[0].innerText; });
tempEpisode = pageIMDB.evaluate( function() { var og2 =  document.querySelectorAll('section#titleOverview div#episodesBar span strong'); return og2[1].innerText; });

tempSeason = tempSeason.replace("Season\n" ,"" )
tempEpisode = tempEpisode.replace ("Episode\n", "" )

 tempEpisodeTitle = pageIMDB.evaluate( function() { var ur = document.querySelector("section#titleOverview div div h1").innerText; return ur;});  //.media,.overview-top
 tempEpisodeDate = pageIMDB.evaluate( function() { var sh = document.querySelector("section#titleOverview div div h1 small").innerText; return sh;});

tempEpisodeTitle = tempEpisodeTitle.replace (tempEpisodeDate,"");

tempTitle = pageIMDB.evaluate( function() { var og2 =  document.querySelector('section#titleOverview a strong'); return og2.innerText; });
tempYear = pageIMDB.evaluate( function() { var og2 =  document.querySelector('section#titleOverview a small'); return og2.innerText; });
tempTitle = tempTitle.replace (" " + tempYear,"");
tempTitle = tempTitle.replace (tempYear,"");
	   	
    	}
    	else 
    	{
tempTitle = pageIMDB.evaluate( function() { var ur = document.querySelector("section#titleOverview div div h1").innerText; return ur;});  //.media,.overview-top
console.log (tempTitle);
tempSubTitle = pageIMDB.evaluate( function() { var sh = document.querySelector("section#titleOverview div div h1 small").innerText; return sh;});
tempTitle = tempTitle.replace (" " + tempSubTitle,"");
tempTitle = tempTitle.replace (tempSubTitle,"");
tempYear = pageIMDB.evaluate( function() { var sh = document.querySelector("section#titleOverview div div h1 small.sub-header").innerText; return sh;});
tempTitle = tempTitle.replace (" " + tempYear,"");
tempTitle = tempTitle.replace (tempYear,"");
//console.log ( " XXd" + tempTitle.charCodeAt ( tempTitle.length -1 ) + "XXd");
    	}

//	console.log("title   :" + tempTitle);
	console.log("Year    :" + tempYear);
	console.log("SubTitle    :" + tempSubTitle);

//	console.log("Season  :" +tempSeason );
//	console.log("Episode :" +tempEpisode);

//	console.log("AirDate :" +tempEpisodeDate );
//	console.log("Ep Title:" +tempEpisodeTitle);

 if (tempOGType == "video.movie") 	{ result.media_type = "movie";  } 
 else if (tempOGType == "video.tv_show")  	{ result.media_type = "tvshow"; } 
 	else if (tempOGType == "video.episode") { result.media_type = "episode"; 
	if (typeof (tempTV)!= 'undefined')	{result.id_imdb_link = tempTV;}
 	if ( typeof(tempSeason)!= 'undefined' ){ result.season = tempSeason  }
	if ( typeof(tempEpisode)!= 'undefined' ){ result.episode = tempEpisode }
//	if ( typeof(tempEpisodeDate) != 'undefined' ){ mysql_option_imdb_prefix  += " , season = \"" + tempEpisodeData +"\"";}
	if ( typeof(tempEpisodeTitle)!= 'undefined' ){ result.episode_title_imdb = tempEpisodeTitle.substring(0,tempEpisodeTitle.length-1) ; }	
 		}
 if (tempYear != "") {	result.year_imdb =  tempYear.replace("(","").replace(")","").replace(/^\s+|\s+$/g,'') ; 	}
 if ( tempTitle != "") { result.title_imdb = tempTitle ;  }
 if ( tempImdbVA != "" &&  tempImdbVA != "Coming" && typeof(tempImdbVA) != 'undefined' ) { result.rating_imdb = tempImdbVA ;}
 if ( tempImdbVS != "" && typeof(tempImdbVS) != 'undefined' ) { result.votes_imdb = tempImdbVS ;}
// if ( tempCR != "Rated null" && tempCR != "Rated NOT RATED" && tempCR != ""  ) { result.rating_mpaa =  tempCR ;}
 if ( tempCR != "Rated null" && tempCR != ""  ) { result.rating_mpaa =  tempCR ;}
 
	console.log (JSON.stringify(result));
fnCallbackFinal (result);
}
	pageIMDB.close();
}
);
}


fnIDxIMDB2TMDB = function(input_json ,  fnCallbackFinal) 
// /usr/lib/node_modules/xmdban/idxImdb2Tmdb.sh  "{\"id_imdb\":\"tt0426769\"}"
// /usr/lib/node_modules/xmdban/idxImdb2Tmdb.sh  "{\"id_imdb\":\"tt1393605\"}"

{
	  var imdb_id_input, imdb_id_link_input;
	  var result = new Object();
    if (typeof(input_json) == 'string'){
    	  imdb_id_input = input_json ;
    	  result.id_imdb = input_json ;
    }
    else 
    {
   	console.log (JSON.stringify(input_json));
   	result = input_json;
    	  imdb_id_input = input_json.id_imdb;
    	  if (typeof(input_json.id_imdb_link) != 'undefined' ) imdb_id_link_input = input_json.id_imdb_link; 
    }	 	

  var	addressTMDB = config.tmdb.apiUrl + "find/" + imdb_id_input + "?" + config.tmdb.apiKey + "&external_source=imdb_id";
  var tempTmdbYear, tempTmdbTitleOriginal, tempTmdbID ,tempTmdbType ,tempPoster, tempBackdrop;
	var pageTMDB = require('webpage').create();
 	pageTMDB.settings.userAgent = config.tmdb.userAgent;
	pageTMDB.customHeaders = config.tmdb.customHeaders;
	console.log (addressTMDB);
	pageTMDB.open(addressTMDB,function(status){
  if (status !== 'success') 
  {
  	console.log ("not connect to TMDB");
  }
  else
  {
//  	result = new Object();
//		console.log ("connected to TMDB");
			var tempTMDBResultString =  pageTMDB.plainText;
			var TMDBResultJson = JSON.parse(tempTMDBResultString);	
//					console.log (JSON.stringify(TMDBResultJson));
		//console.log ("connected3 to TMDB");

		
				if (TMDBResultJson.movie_results.length != 0) {
					tempTmdbType =  "movie";	
					tempTmdbID = 	TMDBResultJson.movie_results[0].id;	
					tempTmdbYear = TMDBResultJson.movie_results[0].release_date;	
					tempTmdbTitleOriginal =  TMDBResultJson.movie_results[0].original_title;
					tempPoster = TMDBResultJson.movie_results[0].poster_path;
					tempBackdrop = TMDBResultJson.movie_results[0].backdrop_path;

			 	}
			 	else if (TMDBResultJson.tv_results.length != 0) {
					tempTmdbType = "tvshow";
					tempTmdbID = 	TMDBResultJson.tv_results[0].id;	
					tempTmdbYear = TMDBResultJson.tv_results[0].first_air_date;	
					tempTmdbTitleOriginal =  TMDBResultJson.tv_results[0].original_name;	
					tempPoster = TMDBResultJson.tv_results[0].poster_path;
					tempBackdrop = TMDBResultJson.tv_results[0].backdrop_path;
			 	}
			 	else if (TMDBResultJson.tv_episode_results.length != 0)  {
			 	//	https://www.themoviedb.org/tv/79766-nelly-nora/season/1/episode/2
				 	tempTmdbType = "episode";
				 	tempTmdbID = 	TMDBResultJson.tv_episode_results[0].show_id + "/season/" + TMDBResultJson.tv_episode_results[0].season_number + "/episode/" + TMDBResultJson.tv_episode_results[0].episode_number;	
			 	}			 	


	result.id_imdb = imdb_id_input;
	if (typeof(imdb_id_link_input) != 'undefined' )  result.id_imdb_link = imdb_id_link_input; 
	if (typeof(tempTmdbType ) != 'undefined' ) 	result.media_type = tempTmdbType;	
	
 if ( tempTmdbID != "" && typeof(tempTmdbID) != 'undefined' ) 										{	result.id_tmdb = tempTmdbID;}
 if ( tempTmdbYear != "" && typeof(tempTmdbYear) != 'undefined' ) 								{	result.year_tmdb = tempTmdbYear.toString().substring(0,4);}
 if ( tempTmdbTitleOriginal!= "" && typeof(tempTmdbTitleOriginal) != 'undefined' ){	result.title_original_tmdb = tempTmdbTitleOriginal; 	}
 if ( tempPoster != "" && typeof(tempPoster) != 'undefined' ) 								{	result.poster_tmdb = tempPoster.substring(1,tempPoster.length);}
 if ( tempBackdrop != "" && typeof(tempBackdrop) != 'undefined' ) 						{	result.backdrop_tmdb = tempBackdrop.substring(1,tempBackdrop.length);}

	console.log (JSON.stringify(result));

	if (typeof(result.id_tmdb) != 'undefined' && typeof(result.title_original_tmdb) != 'undefined')	
	{
			fnCallbackFinal (result); 
	}	
	else if (typeof(result.id_tmdb) != 'undefined' && typeof(result.title_original_tmdb) == 'undefined')
	{
		console.log ( 'id_tmdb without title_original_tmdb ');
		if (typeof(result.id_tmdb)== "string")
		{
		  var	tempTmdbT = result.id_tmdb.split("/")[0];
		  console.log (tempTmdbT);
		  
			if (result.media_type != "movie")
			{
				 tempTmdbT = config.tmdb.apiUrl + "tv/" + tempTmdbT; 
			}
			else 
			{
					tempTmdbT = config.tmdb.apiUrl + "movie/" + tempTmdbT;
			}
			var	addressTmdbT = tempTmdbT + "?" + config.tmdb.apiKey;
			console.log (addressTmdbT);
			var pageTmdbT = require('webpage').create();
 	pageTmdbT.settings.userAgent = config.tmdb.userAgent;
	pageTmdbT.customHeaders = config.tmdb.customHeaders;
	pageTmdbT.open(addressTmdbT,function(status){
		if (status !== 'success') {
			  console.log ("fail dl:" + pageTmdbT);
				fnCallbackFinal (result);
			}
		else {
				var TmdbTResult = JSON.parse(pageTmdbT.plainText);			
			  if ( typeof(TmdbTResult.original_name) == "string") result.title_original_tmdb = TmdbTResult.original_name;
			  if ( typeof(TmdbTResult.release_date) == "string") result.year_tmdb = TmdbTResult.release_date.substring(0,4);
			  else if (typeof(TmdbTResult.first_air_date) ) result.year_tmdb = TmdbTResult.first_air_date.substring(0,4);
			  fnCallbackFinal (result);
			}	
			pageTmdbT.close();
		
		});
			
			}
		else
			{
				fnCallbackFinal (result);
			}
	}	
	else 	
	{
		console.log ( 'no id_tmdb or title_original_tmdb ');
		if (typeof(imdb_id_link_input)=="string") {
		jsonTvshow = new Object();
		jsonTvshow.id_imdb = imdb_id_link_input; 
		fnIDxIMDB2TMDB (jsonTvshow , function(result){
				console.log (imdb_id_input + " " + imdb_id_link_input);
				console.log (input_json.id_imdb);
				console.log (input_json.media_type);

	//			resultEpi = new Object();
		resultEpi = input_json;
		//		resultEpi.id_imdb = input_json.id_imdb;
		//		resultEpi.id_imdb_link = input_json.id_imdb_link;
	//			resultEpi.season = input_json.season;
	//			resultEpi.episode = input_json.episode;
				resultEpi.id_tmdb = result.id_tmdb + "/season/" + input_json.season + "/episode/" + input_json.episode;
				resultEpi.year_tmdb = result.year_tmdb ;
					resultEpi.title_original_tmdb = result.title_original_tmdb ;
				console.log ("JSON.stringify(resultEpi)");	
				console.log (JSON.stringify(resultEpi));	
				fnCallbackFinal (resultEpi); 
		}); 
		}
		else 
		{	
			console.log ("imdb_id_link_input:" + imdb_id_link_input);
			fnCallbackFinal (result); 
		}	
	}
	// else if no episode_title_tmdb
	
	  }
   	pageTMDB.close(); 
}
);
}

fnIDxIMDB2Douban = function (input_json, fnCallbackFinal)
{
	var keywordDoubanSearch = "chiphell" ;

	mFnMatchImdb = function(input_match) {
//	console.log ("mFnMatchImdb checked:" + input_match.checked + " " + input_match.id.length)
		if (input_match.checked < input_match.id.length  )
		{
			
			var tempDo = new Object(); 
			tempDo.id_douban = input_match.id[input_match.checked];
			if (typeof(input_match.id_imdb)=="string") tempDo.id_imdb =  input_match.id_imdb;
			if (typeof(input_match.id_imdb_link)=="string") tempDo.id_imdb_link = input_match.id_imdb_link;
			
			var tout = Math.floor(Math.random() * 500); 
			
			console.log ("mFnMatchImdb checked:" + input_match.checked + " " + JSON.stringify(tempDo) + "  delay:" + tout );
			
			setTimeout( fnWebScrapingDouban(tempDo, function(returnDoubanInfo){
		//		 console.log (JSON.stringify(returnDoubanInfo));
		//		console.log (input_match.id_imdb + " " + returnDoubanInfo.id_imdb + " " + (input_match.id_imdb == returnDoubanInfo.id_imdb) );
		//		console.log (input_match.id_imdb_link + " " + returnDoubanInfo.id_imdb + " " + (input_match.id_imdb_link == returnDoubanInfo.id_imdb) );
					if ((typeof(returnDoubanInfo.id_imdb) == "string" && returnDoubanInfo.id_imdb == input_match.id_imdb) 
					||	(typeof(returnDoubanInfo.id_imdb) == "string" && returnDoubanInfo.id_imdb == input_match.id_imdb_link)
					||	(typeof(returnDoubanInfo.id_imdb_link) == "string" && returnDoubanInfo.id_imdb_link == input_match.id_imdb_link)
					||	(typeof(returnDoubanInfo.id_imdb_link) == "string" && returnDoubanInfo.id_imdb_link == input_match.id_imdb)
					)
					{
					//		var copy = Object.assign(input_match, returnDoubanInfo);
		//			console.log (Object.keys(input_match));
		//			console.log (Object.keys(returnDoubanInfo));
					
					//		console.log (JSON.stringify(copy));
				delete	input_match.q ;
		//	delete		input_match.count ;
		//	delete		input_match.total;
				delete		input_match.id;
				delete  	input_match.checked ;
		//	console.log (Object.keys(input_match));
					
					var keys = 	Object.keys(returnDoubanInfo);
	  for (var nextKey=0;nextKey<keys.length;nextKey++) {
					var	k = keys[nextKey];
			//		console.log (k);
				input_match	[k] = returnDoubanInfo [k];
    }
				
							fnCallbackFinal (input_match);
					}
					else
					{
						input_match.checked = input_match.checked + 1;
						 mFnMatchImdb (input_match);
					}		
				}
				) ,tout);
		}
		else
		{	
			console.log ("all douban ids checked but none match"); 
//			console.log (JSON.stringify(input_match));
				delete	input_match.q ;
				delete		input_match.id;
				delete  	input_match.checked ;			
			
			fnCallbackFinal (input_match);
		}
		
	};

	mFnSearchDouban  = function(input_json){
   console.log ("mFnSearchDouban");
   console.log (input_json.media_type);
   console.log (input_json.id_imdb + " " + typeof(input_json.title_imdb));
   console.log (input_json.title_original_tmdb + "  " + typeof(input_json.title_original_tmdb));
   console.log (input_json.title_imdb + "  " + typeof(input_json.title_imdb));
   console.log (input_json.year_tmdb);
   
 	if (input_json.title_original_tmdb != "" && typeof(input_json.title_original_tmdb) == 'string' )
 	{
 		keywordDoubanSearch = input_json.title_original_tmdb ;
 	}
 	else if (input_json.title_imdb != "" && typeof(input_json.title_imdb) == 'string' )
 	{
 		keywordDoubanSearch = input_json.title_imdb ;
 	}	

	
	if (input_json.media_type == "episode" || 	input_json.media_type == "tvshow" ) { keywordDoubanSearch = "\u7535\u89c6\u5267\u0020" +  keywordDoubanSearch   ;}
	if ( typeof(input_json.season) == "string" )
	{
	  var chinese1to9= "\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d";
	  tempSeasonNum = parseInt(input_json.season);
  	keywordDoubanSearch += "\u0020\u7b2c" +  chinese1to9.charAt( tempSeasonNum -1 ) + "\u5b63"; 
	}
	if (input_json.media_type == "movie")
  {
  	keywordDoubanSearch += " (" + input_json.year_imdb + ")";
  }	
  
	console.log ( "keyword:" + keywordDoubanSearch);
	keywordDoubanSearch = encodeURIComponent( keywordDoubanSearch );  	 // what is encodeURI
	keywordDoubanSearch = "search?q=" + keywordDoubanSearch + "&";
	console.log ( "keyword:" + keywordDoubanSearch);
	var qObject =  {"q":"","count":20,"id":[]};
	qObject.q = keywordDoubanSearch;
	
	var input_json_keys = 	Object.keys(input_json);
	//	console.log(input_json_keys);
	  for (var nextKey=0;nextKey<input_json_keys.length;nextKey++) {
  //			console.log(input_json_keys[nextKey]);         
    qObject[input_json_keys[nextKey]] = input_json[input_json_keys[nextKey]];
    }

 // if (typeof(input_json.id_imdb)=="string") qObject.id_imdb = input_json.id_imdb;
 // if (typeof(input_json.id_imdb_link)=="string") qObject.id_imdb_link = input_json.id_imdb_link;
  
	console.log (JSON.stringify(qObject));
  fnDoubanSearch (qObject,function(resultDoubanTitle){
  delete		resultDoubanTitle.count;
  delete		resultDoubanTitle.total;
  	resultDoubanTitle.checked = 0;
  	console.log(JSON.stringify(resultDoubanTitle));
		console.log ("result id count " + qObject.id.length)
  	mFnMatchImdb (resultDoubanTitle);
  	});
};
		
// get tmdb_original_title / year_imdb / media_type
//	
	fnWebScrapingIMDB (input_json,function(output_json){
		  console.log (output_json.title_imdb);
		  console.log ("id_imdb_link:"  +  output_json.id_imdb_link);
		fnIDxIMDB2TMDB (output_json, mFnSearchDouban);
	}  );
// search tmdb_original_title + year_tmdb    					match id_imdb 
// search "电视剧" + tmdb_original_title + "第N季"    match id_imdb  id_imdb_link
}

fnIDxTMDB2Douban = function (input_json, fnCallbackFinal)
{
	fnIDxTMDB2IMDB(input_json,function(result)
	{
		console.log ("fnIDxTMDB2IMDB done.");
		fnIDxIMDB2Douban (result,fnCallbackFinal);
	}
	);
}

fnMysqlUpdate = function (input, fnCallbackFinal)
{
				var mysql_option_douban_prefix = ""; 
				var mysql_option_douban_value = "";
				var mysql_option_douban_suffix = "";
			
		var keys = 	Object.keys(input);
	  for (var nextKey=0;nextKey<keys.length;nextKey++) {
				var	k = keys[nextKey];
				console.log (nextKey + ":" + k + "  " + input[k]);
				if (nextKey!=0 )
    		{
    			mysql_option_douban_prefix += "," ; 
					mysql_option_douban_value += ","		
					mysql_option_douban_suffix += ",";	
    		}
				mysql_option_douban_prefix += k ; 
				mysql_option_douban_value += "\"" + input[k] +"\"";		
				mysql_option_douban_suffix += k + "=VALUES(" + k +")";	
    }
 				var mysql_option = "INSERT INTO " + config.mysql.table + " (" + mysql_option_douban_prefix + ") VALUES (" + mysql_option_douban_value + ") ON DUPLICATE KEY UPDATE " + mysql_option_douban_suffix ; 
   			console.log (mysql_option);
   			
   			
 var	mysqlCMD_update = 
				["-h" + config.mysql.host,
				"-u" + config.mysql.username,
				 "-p" + config.mysql.password,
				 config.mysql.database,
				 "-e",   mysql_option 
				 ] ;

				execFile('mysql', mysqlCMD_update, null, function (err, stdout, stderr) { 	/*	console.log("execFileSTDOUT:", JSON.stringify(stdout)) ; //	console.log("execFileSTDERR:", JSON.stringify(stderr)) ; */ 		});
    
				fnCallbackFinal(input);
	} 

module.exports.ipV6Test = fnIpV6Test;
module.exports.ipV4Test = fnIpV4Test;
module.exports.ipTest = fnIpTest;

module.exports.mysqlUpdate = fnMysqlUpdate;

module.exports.idxTMDB2IMDB = fnIDxTMDB2IMDB;
module.exports.idxIMDB2TMDB = fnIDxIMDB2TMDB;
module.exports.idxIMDB2Douban = fnIDxIMDB2Douban;
module.exports.idxTMDB2Douban = fnIDxTMDB2Douban;

module.exports.webScrapingDouban = fnWebScrapingDouban;
module.exports.webScrapingIMDB = fnWebScrapingIMDB;
module.exports.doubanSearch = fnDoubanSearch;