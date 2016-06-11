(function () {
	// Get user IP
	var getIp = new XMLHttpRequest();
	getIp.open('GET', 'http://ipinfo.io/json',true);
	getIp.onload = success;
	getIp.onerror = error;
	getIp.send();

	function error() {
		alert('Can not get your ip address');
	}

	function success(position) {
		var request = new XMLHttpRequest();

		// url to get data from the free API
		var location = JSON.parse(getIp.responseText).loc.split(',');
		var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
							location[0] +
							'&lon=' +
							location[1] +
							'&APPID=79565f7203b09794f3f049346c2cb9d4';

		// request configuration
		request.open('GET', url, true);
		request.onload = dataReceived;
		request.onerror = dataLost;
		request.send();

		// execute when data is ready
		function dataReceived() {
			var response = JSON.parse(request.responseText);
			changeColors(response);
			displayContent(response);
		}

		// execute when data isn't ready
		function dataLost() {
			alert('There was an error when trying to get data, please try again!');
		}
	}

	function displayContent(weather){
		var weatherParams = weather.weather[0];
		var temperature = weather.main.temp;
		var temperature_celisius = Math.trunc(parseInt(temperature, 10) - 273.15);
		var temperature_fahrenheit = Math.trunc(parseInt(temperature, 10) * 9/5 - 459.67);
		var id = weatherParams.id;
		var description = weatherParams.description;
		var cityName = weather.name;

		addElementToPage({element: "div", tagName: "class", attribute: "weather-icon wi wi-owm-" + id});
		addElementToPage({element: "div", tagName: "id", attribute: "description", content: description});
		addElementToPage({element: "div", tagName: "id", attribute: "temperature", content: temperature_celisius});
		addElementToPage({element: "div", tagName: "id", attribute: "city-name", content: cityName});
	}

	function addElementToPage(params) {
		var element = document.createElement(params.element);
		element.setAttribute(params.tagName, params.attribute);
		if (params.content){
			var text = document.createTextNode(params.content);
			element.appendChild(text);
		}
		document.getElementById("today-weather").appendChild(element);
	}

	function changeColors(weather) {
		var id = weather.weather[0].id;
		addClassToBody(id);
	}

	function addClassToBody(weatherId) {
		var id = Math.floor(weatherId / 100) * 100;
		document.body.className += " _"+id;
	}
}());
