window.addEventListener('load', function() {
	
	/**************************
	 * Interaction Handlers
	 **************************/
	
	
});

function loadTextButtonOnClick(event) {
	var textInfoSelector = document.getElementById("text-info-select");
	var value = textInfoSelector.value;
	var url = 'text-files/' + value + '.txt';
	$.get({
		url: url,
		success: function(data) {
			var container = document.getElementById("text-info-container");
			container.innerText = data;
		}
	});
}

function loadGoodJsonButtonOnClick(event) {
	var url = 'json-files/good.json';
	loadJson(url);
}

function loadBadJsonButtonOnClick(event) {
	var url = 'json-files/bad.json';
	loadJson(url);
}

function loadJson(url) {
	$.get({
		url: url,
		success: function(data) {
			var myData = data;
		}
	});
}