function get_zipcode_list() {
	return ['1', '2', '3'];
}

function get_forecast_by_zipcode(zipcode) {
	switch(zipcode) {
		case '1':
			return { 
				temperature: "60",
				humidity: "20%",
				weather: "sunny"
			}
		case '2':
			return {
				temperature: "80",
				humidity: "100%",
				weather: "rain"
			}
		case '3':
			return {
				temperature: "10",
				humidity: "100%",
				weather: "snowing"
			}
	}
}