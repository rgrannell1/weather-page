
( function () {
	'use strict'
} )()








var colour = {
	clouds: 
		"#ecf0f1",
	peterRiver: 
		"#3498db",
	yellow: 
		"#f39c12",
	midnightBlue: 
		"#2c3e50",
	alizarin: 
		"#e74c3c",
}





var redraw = {
	time: function () {

		var time = ( function () {
			
			this.date = new Date()
			this.hours = date.getHours() + ""
			this.mins = date.getMinutes() + ""

			if (this.mins.length === 1) {
				this.mins = "0" + this.mins
			}

			if (this.hours > 12) {
				var suffix = "pm"
				this.hours = this.hours - 12
			} else {
				var suffix = "am"
			}

			return this.hours + ":" + this.mins + " " + suffix
		} )()

		$('#weather-time').text(time)
	},
	weather: ( function () {

		var degreeSymbol = '\u00B0'

		return function (weather) {

			var celcius = Math.floor(weather.temp - 273.15)
			
			if (celcius < 0) {
				this.backColour = colour.clouds
				this.fontColour = colour.midnightBlue

			} else if (celcius < 10) {
				this.backColour = colour.peterRiver
				this.fontColour = colour.clouds
			
			} else if (celcius < 18) {
				this.backColour = colour.yellow
				this.fontColour = colour.clouds

			} else if (celcius >= 18) {
				this.backColour = colour.alizarin
				this.fontColour = colour.clouds
			}

			$('#weather-city').text(weather.place)
			$('#weather-temp').text(celcius + degreeSymbol)

			$('html').
				css('background-color', this.backColour)
			$('html *	').
				css('color', this.fontColour)
		}
	} )()
}










// --------------------- send a request to openweathermap.

var request = {
	isOnline:
		function () {
			return navigator.onLine	
		},
	getWeather:
		function (location) {
			/*
				AJAX get the weather from openweathermap.
			*/

			var openWeatherURL = 'http://api.openweathermap.org/data/2.5/weather?lat=' + 
					location.latitude + 
					"&lon=" + 
					location.longitude



			if (request.isOnline()) {
				$.ajax({
					type: 'GET',
					dataType: 'jsonp',
					url: openWeatherURL,
					success: function (weather) {

						redraw.weather({
							temp: 
								weather.main.temp.toFixed(1),
							code:
								weather.weather[0].id,
							place: 
								location.location
						})

					},
					error: function (msg) {
						// log a grizzly error.

						console.log(msg.statusText)
					}
				})				
			} else {
				console.log("not currently connected to the internet, friend :/")
			}
	}
}

var stopwatch = function (seconds) {
	// construct a 

	var unixTime = function () {
		return Math.round(new Date().getTime() / 1000.0)
	}



	var genesis = unixTime()
	
	return function () {
		var existedFor = unixTime() - genesis
		return existedFor > seconds
	}
}

var intervals = {
	shouldDraw: 
		1000 * 5,
	shouldRequest: 
		stopwatch(20),
	starting:
		true
}

var redrawPage = function () {

	redraw.time()
	console.log(1)

	if (intervals.shouldRequest() || intervals.starting) {

		intervals.starting = false
		intervals.shouldRequest = stopwatch(20)

		request.getWeather({
			latitude: 55,
			longitude: 55,
			location: "Galway City, Ireland."
		})
	}
}

redrawPage()
setInterval(redrawPage, intervals.shouldDraw )
