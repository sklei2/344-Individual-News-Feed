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
			var container = document.getElementById("json-info-container");
			var name = data.name;
			var age = data.age;
			var hometown = data.hometown;
			container.innerText = "Name: " + name + "\nAge: " + age + "\nHometown: " + hometown;

		},
		error: function (data) {
			var container = document.getElementById("json-info-container");
			container.innerText = "Error loading Content";
		}
	});
}