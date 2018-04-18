
// enum variable for our sports
var sport_enum = Object.freeze({
	MLB: 1,
	NBA: 2,
	NFL: 3,
	NHL: 4,
});

class newsItem {
	constructor(xmlItem, sport) {
		this.title = xmlItem.querySelector("title").firstChild.nodeValue
		this.description = xmlItem.querySelector("description").firstChild.nodeValue;
		this.link = xmlItem.querySelector("link").firstChild.nodeValue;
		this.pubDate = new Date(xmlItem.querySelector("pubDate").firstChild.nodeValue);
		this.sport = sport;
		this.sportString = getKeyByValue(sport_enum, sport);
		this.isFavorite = false;
	}
}

window.addEventListener('load', function() {	
	
	// Setup our variables data
	var newsFeed = [];
	var favorites = [];
	var viewedFavorites = [];
	var espnUrl = "http://www.espn.com/espn/rss/";
	var afterSportUrl = "/news"
	var feed = "news";

	var checkboxes = {
		MLB: document.getElementById("mlb-checkbox"),
		NBA: document.getElementById("nba-checkbox"),
		NFL: document.getElementById("nfl-checkbox"),
		NHL: document.getElementById("nhl-checkbox"),
	}

	// Setup the initial data to read all the RSS feeds
	resetNewsFeed();
	
	// Setup Click handlers
	var tabs = document.querySelectorAll('.tab');
	for (var key in tabs) {
		tabs[key].addEventListener('click', tabOnClickHandler);
	}

	// RSS Handlers

	function resetNewsFeed() {
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
	}

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

	function addNewsSportData(sport) {
		var sportString = getKeyByValue(sport_enum, sport);
		var url = espnUrl + sportString + afterSportUrl;
		loadRSSFeed(url, sport, function() {
			loadNewsFeed();
		});
	}

	function addFavoriteSportData(sport) {
		var newFavorites = favorites.filter(item => item.sport === sport);
		viewedFavorites = viewedFavorites.concat(newFavorites);
		function comparerFunction(newsItemA, newsItemB) {
			return newsItemB.pubDate - newsItemA.pubDate;
		}
		viewedFavorites.sort(comparerFunction);
		loadFavorites();
	}

	function removeNewsSportData(sport) {
		newsFeed = newsFeed.filter(item => item.sport != sport);
		loadNewsFeed();			
	}

	function removeFavoritesSportData(sport) {
		viewedFavorites = viewedFavorites.filter(item => item.sport != sport);
		loadFavorites();
	}

	function addNewsItem(item) {
		addItem(newsFeed, item);
	}

	function addFavoriteItem(item){
		addItem(favorites, item);
	}

	function addItem(array, item) {
		array.push(item);
		function comparerFunction(newsItemA, newsItemB) {
			return newsItemB.pubDate - newsItemA.pubDate;
		}
		array.sort(comparerFunction);	
	}

	// Drawing HTML

	function appendNewsItems(items) {
		var rssReader = document.getElementById("rss-reader")
		for (var i = 0; i < items.length; i++) {
			var item = items[i];

			var itemDiv = document.createElement('div');
			itemDiv.id = i;
			itemDiv.classList.add('item');

			var sportImage = document.createElement('img');
			sportImage.src = "img/logo_" + item.sportString + ".png";
			sportImage.classList.add('logo-img');
			itemDiv.appendChild(sportImage);

			var title = document.createElement('h2');
			title.innerText = item.title;
			itemDiv.appendChild(title);

			var description = document.createElement('p');
			description.innerText = item.description;
			itemDiv.appendChild(description);

			var dateText = document.createElement('p');
			var italicText = document.createElement('i');
			italicText.innerText = item.pubDate.toLocaleString();
			var link = document.createElement('a');
			link.href = item.link;
			link.target = '_blank';
			link.text = 'See original';
			dateText.appendChild(italicText);
			dateText.innerText = dateText.innerText + ' - ';
			dateText.appendChild(link)
			itemDiv.appendChild(dateText);


			var favoriteStar = document.createElement('span');
			favoriteStar.classList.add('fa', 'fa-star-o');
			if (item.isFavorite) {
				favoriteStar.classList.add('selected');
			}
			favoriteStar.addEventListener('click', favoriteOnClickHandler);
			itemDiv.appendChild(favoriteStar);

			rssReader.appendChild(itemDiv);
		}		
	}

	function loadNewsFeed() {
		var rssReader = document.getElementById("rss-reader");
		if (newsFeed.length > 0) {
			rssReader.innerHTML = "";
			appendNewsItems(newsFeed);	
		} else {
			rssReader.innerHTML = '<h2 style="text-align: center;">No Stories to Show</h2>';
		}		
	}

	function loadFavorites() {
		var rssReader = document.getElementById("rss-reader");
		if (viewedFavorites.length > 0) {
			rssReader.innerHTML = "";
			appendNewsItems(viewedFavorites);
		} else {
			rssReader.innerHTML = '<h2 style="text-align: center;"> No Favorites to Show</h2>';
		}
	}

	// Handlers

	function filterChangeHandler(event) {		
		if (feed === 'news') {
			if (event.target.checked) {
				addNewsSportData(sport_enum[event.target.value]);
			} else {
				removeNewsSportData(sport_enum[event.target.value]);
			}
		} else {
			if (event.target.checked) {
				addFavoriteSportData(sport_enum[event.target.value]);
			} else {
				removeFavoritesSportData(sport_enum[event.target.value]);
			}
		}	
	}

	function favoriteOnClickHandler(event) {
		var index = parseInt(event.target.parentElement.id);
		var item = newsFeed[index];
		if(event.target.classList.contains('selected')) {
			// we're deselecting the favorite
			event.target.classList.remove('selected');			
			favorites.splice(favorites.indexOf(item), 1);
			item.isFavorite = false;
			if (feed === 'favorites') {
				loadFavorites();
			}
		} else {
			// Else we're adding it to our favorites			
			event.target.classList.add('selected');
			addFavoriteItem(item);
			item.isFavorite = true;
		}
	}

	function tabOnClickHandler(event) {		
		if (!event.target.classList.contains('active')) {
			var tabs = document.getElementsByClassName('tab-container')[0];
			for (var i = 0; i < tabs.children.length; i++) {
				tabs.children[i].classList.remove('active');
			}
			feed = event.target.id;
			event.target.classList.add('active');				
			// we load different items based on where we're going
			if (feed === 'favorites') {
				viewedFavorites = favorites;
				loadFavorites();	
			} else {
				resetNewsFeed();				
			}
			// reset checkboxes
			for (var key in checkboxes) {
				checkboxes[key].checked = true;
			}
		}
	}
});

// helpers
function getKeyByValue(obj, value) {
	return Object.keys(obj).find(key => obj[key] == value);
}