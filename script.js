require.config({
	paths: {
		ramda: "ramda.min",
		jquery: "jquery.min"
	}
});

require(['ramda', 'jquery'], function(_, $){
	var temperature_celisius = 0;
	var temperature_fahrenheit = 0;

	// Get user IP
	var getIp = new XMLHttpRequest();
	getIp.open('GET', 'http://ipinfo.io/json', true);
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
			document.getElementById('loading').style.visibility = 'hidden';
			displayContent(response);

	  var handler = function() {
	  	return;
	  }

		var snackbarContainer = document.querySelector('#snackbar');
		var data = {
		  message: 'There was an error getting the current weather.',
		  timeout: 2000,
		  actionHandler: handler,
		  actionText: 'Refresh'
		};

    snackbarContainer.MaterialSnackbar.showSnackbar(data);
		}

		// execute when data isn't ready
		function dataLost() {
			alert('There was an error when trying to get data, please try again!');
		}
	}

	function displayContent(weather){
		var temperature = weather.main.temp;
		temperature_celisius = Math.trunc(parseInt(temperature, 10) - 273.15);
		temperature_fahrenheit = Math.trunc(parseInt(temperature, 10) * 9/5 - 459.67);
		var weatherParams = weather.weather[0];
		var id = weatherParams.id;
		var description = weatherParams.description;
		var cityName = weather.name;

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

	function addClassToBody(weatherId) {
		var id = Math.floor(weatherId / 100) * 100;
		document.body.className += " _"+id;
	}

	function addClickHandlers(){
		var elem = document.getElementById('temperature');
		elem.onclick = function() {
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
		}
	}
});
