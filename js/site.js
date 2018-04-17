
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

	var sport_enum = Object.freeze({
		MLB: 1,
		NBA: 2,
		NFL: 3,
		NHL: 4,
	});
	
	var newsFeed = [];
	var espnUrl = "http://www.espn.com/espn/rss/";
	var afterSportUrl = "/news"

	var checkboxes = {
		mlbCheckbox: document.getElementById("mlb-checkbox"),
		nbaCheckbox: document.getElementById("nba-checkbox"),
		nflCheckbox: document.getElementById("nfl-checkbox"),
		nhlCheckbox: document.getElementById("nhl-checkbox"),
	}

	for (key in checkboxes) {
		checkboxes[key].addEventListener("change", filterChangeHandler);
	}
	
	function loadRSSFeed(url, sport) {
		document.getElementById("rss-reader").innerText = "Loading RSS Feed";
		$.get({
			url: url,
			success: function(data) {
				loadRSSData(data, sport);
				loadNewsFeed();
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
