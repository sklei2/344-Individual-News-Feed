window.addEventListener('load', function() {
	
	loadRSSFeed("http://www.espn.com/espn/rss/NHL/news");
	
	function loadRSSFeed(url) {
		document.getElementById("rss-reader").innerText = "Loading RSS Feed";
		$.get({
			url: url,
			success: function(data) {
				loadXML(data);
			}
		});
	}	
	
	function loadXML(obj) {
		var items = obj.querySelectorAll("item");
		var html = "";
		for (var i = 0; i < items.length; i++) {
			var newsItem = items[i];
			var title = newsItem.querySelector("title").firstChild.nodeValue;
			var description = newsItem.querySelector("description").firstChild.nodeValue;
			var link = newsItem.querySelector("link").firstChild.nodeValue;
			var pubDate = newsItem.querySelector("pubDate").firstChild.nodeValue;
			var line = '<div class="item">';
			line += "<h2>"+title+"</h2>";
			line += '<p><i>'+pubDate+'</i> - <a href="'+link+'" target="_blank">See original</a></p>';
			//title and description are always the same (for some reason) so I'm only including one
			//line += "<p>"+description+"</p>";
			line += "</div>";
			
			html += line;
		}
		document.getElementById("rss-reader").innerHTML = html;	
	}

});
