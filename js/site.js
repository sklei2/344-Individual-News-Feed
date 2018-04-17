
class newsItem {
	constructor(xmlItem, sport) {
		this.title = xmlItem.querySelector("title").firstChild.nodeValue
		this.description = xmlItem.querySelector("description").firstChild.nodeValue;
		this.link = xmlItem.querySelector("link").firstChild.nodeValue;
		this.pubDate = xmlItem.querySelector("pubDate").firstChild.nodeValue;
		this.sport = sport;
	}
}

window.addEventListener('load', function() {

	// enum variable for our sports
	var sport_enum = Object.freeze({
		MLB: 1,
		NBA: 2,
		NFL: 3,
		NHL: 4,
	});
	
	// Setup our initial data
	var newsFeed = [];
	var espnUrl = "http://www.espn.com/espn/rss/";
	var afterSportUrl = "/news"

	var checkboxes = {
		MLB: document.getElementById("mlb-checkbox"),
		NBA: document.getElementById("nba-checkbox"),
		NFL: document.getElementById("nfl-checkbox"),
		NHL: document.getElementById("nhl-checkbox"),
	}

	// Setup the initial data to read all the RSS feeds
	var finishedSports = {};

	function readRSSCallback(sport) {
		finishedSports[sport] = 1;
		if (Object.keys(finishedSports).length >= Object.keys(sport_enum).length) {
			loadNewsFeed();
		}
	}

	for (key in checkboxes) {
		var checkbox = checkboxes[key];
		checkbox.addEventListener("change", filterChangeHandler);
		checkbox.checked = true;

		loadRSSFeed(espnUrl + key + afterSportUrl, sport_enum[key], readRSSCallback)
	}
	
	// RSS Handlers

	function loadRSSFeed(url, sport, callback) {
		document.getElementById("rss-reader").innerText = "Loading RSS Feed";
		$.get({
			url: url,
			success: function(data) {
				loadRSSData(data, sport);
				if (callback) {
					callback(sport);
				}
			}
		});
	}
	
	function loadRSSData(data, sport) {
		var items = data.querySelectorAll("item");
		for (var i = 0; i < items.length; i++) {
			var item = new newsItem(items[i], sport);
			addNewsItem(item);
		}
	}

	function removeSportData(sport) {
		newsFeed = newsFeed.filter(item => item.sport != sport);
	}

	function addNewsItem(item) {
		newsFeed.push(item);
	}

	// Drawing HTML

	function appendNewsItems(items) {
		var html = document.getElementById("rss-reader").innerHTML
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var line = '<div class="item">';
			line += "<h2>" + item.title + "</h2>";
			line += '<p><i>'+ item.pubDate +'</i> - <a href="'+ item.link + '" target="_blank">See original</a></p>';
			//title and description are always the same (for some reason) so I'm only including one
			//line += "<p>"+description+"</p>";
			line += "</div>";
			
			html += line;
		}
		document.getElementById("rss-reader").innerHTML = html;
	}

	function loadNewsFeed() {
		var html = "";
		for (var i = 0; i < newsFeed.length; i++) {
			var item = newsFeed[i];
			var line = '<div class="item">';
			line += "<h2>" + item.title + "</h2>";
			line += '<p><i>'+ item.pubDate +'</i> - <a href="'+ item.link + '" target="_blank">See original</a></p>';
			//title and description are always the same (for some reason) so I'm only including one
			//line += "<p>"+description+"</p>";
			line += "</div>";
			
			html += line;
		}
		document.getElementById("rss-reader").innerHTML = html;	
	}

	// Handlers

	function filterChangeHandler(event) {
		var hello = 'hello';
	}

});
