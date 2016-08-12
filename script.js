require.config({
	paths: {
		ramda: "https://cdnjs.cloudflare.com/ajax/libs/ramda/0.22.1/ramda.min",
		jquery: "https://code.jquery.com/jquery-3.1.0.min"
	}
});

require(['ramda', 'jquery'], function(_, $){
	var temperature_celisius = 0;
	var temperature_fahrenheit = 0;

	var getJSON = _.curry(function(callback, url) {
		$.getJSON(url, callback);
	});

	var weatherRequestUrl = function(loc){
		return 'http://api.openweathermap.org/data/2.5/weather?lat=' + loc[0] + '&lon=' + loc[1] + '&APPID=79565f7203b09794f3f049346c2cb9d4';
	};

	var splitLocation = function(loc) {
		return loc.split(',');
	};

	var getLocation = _.compose(splitLocation, _.prop('loc'));

	var removeChild = _.curry(function(id, x) {
		$(id).remove();
		return x;
	});

	function displayContent(weather){
		var temperature = weather.main.temp;
		var cityName = weather.name;
		temperature_celisius = Math.trunc(parseInt(temperature, 10) - 273.15);
		temperature_fahrenheit = Math.trunc(parseInt(temperature, 10) * 9/5 - 459.67);
		var weatherParams = weather.weather[0];
		var id = weatherParams.id;
		var description = weatherParams.description;

		addElementToPage({element: "div", tagName: "class", attribute: "weather-icon wi wi-owm-" + id});
		addElementToPage({element: "div", tagName: "id", attribute: "description", content: description});
		addElementToPage({element: "div", tagName: "id", attribute: "temperature", content: temperature_celisius});
		document.getElementById('temperature').setAttribute('class', 'celisius');
		addElementToPage({element: "div", tagName: "id", attribute: "city-name", content: cityName});

		addClickHandlers();
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

	function addClickHandlers(){
		var elem = document.getElementById('temperature');
		$('#temperature').on('click', function() {
			var elemClassList = elem.classList;
			var isCelisius = elemClassList.contains('celisius');
			if (isCelisius) {
				document.getElementById('temperature').textContent = temperature_fahrenheit;
				elemClassList.remove('celisius');
				elemClassList.add('fahrenheit');
			} else {
				document.getElementById('temperature').textContent = temperature_celisius;
				elemClassList.remove('fahrenheit');
				elemClassList.add('celisius');
			}
		})
	}

	var handleWeatherRequest = _.compose(displayContent, removeChild("#loading"));

	var handleIp = _.compose(getJSON(handleWeatherRequest), weatherRequestUrl, getLocation);

	app = _.compose(getJSON(handleIp));

	app('http://ipinfo.io/json');
});
