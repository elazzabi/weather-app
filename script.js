(function () {
	// Get Geolocation from browser
	window.navigator.geolocation.getCurrentPosition(success, error);

	function error() {
		document.alert('It seems that access to your location is blocked. Please allow this page to access to your position and refresh the page!');
	}

	function success(position) {
		var request = new XMLHttpRequest();

		// url to get data from the free API
		var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
							position.coords.latitude +
							'&lon=' +
							position.coords.longitude +
							'&APPID=79565f7203b09794f3f049346c2cb9d4';

		// request configuration
		request.open('GET', url, true);
		request.onload = dataReceived;
		request.onerror = dataLost;
		request.send();

		// execute when data is ready
		function dataReceived() {
			var response = JSON.parse(request.responseText);
			displayContent(response);
		}

		// execute when data isn't ready
		function dataLost() {
			document.alert('There was an error when trying to get data, please try again!');
		}
	}

	function displayContent(weather){
		
	}
}());