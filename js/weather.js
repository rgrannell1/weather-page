
( function () {
	'use strict'
} )()

var colour = {
	white: 
		"#ecf0f1",
	blue: 
		"#2980b9",
	yellow: 
		"#f39c12",
	black: 
		"#2c3e50",
	red: 
		"#e74c3c",
}

var draw = {
	time: function () {

		var time = ( function () {
			
			this.date = new Date()
			this.hours = date.getHours() + ""
			this.mins = date.getMinutes() + ""

			if (this.mins.length === 1) {
				this.mins = "0" + this.mins
			}

			if (this.hours > 12) {
				var end = "pm"
				this.hours = this.hours - 12
			} else {
				var end = "am"
			}

			return this.hours + ":" + this.mins + " " + end
		} )()

		$('#weather-time').text(time)
	},
	weather: ( function () {

		var degreeSymbol = '\u00B0'

		return function (weather) {

			var celcius = Math.floor(weather.temp - 273.15)
			
			if (celcius < 0) {
				this.background = colour.white
				this.color = colour.black

			} else if (celcius < 10) {
				this.background = colour.blue
				this.color = colour.white
			
			} else if (celcius < 18) {
				this.background = colour.yellow
				this.color = colour.white

			} else if (celcius >= 18) {
				this.background = colour.red
				this.color = colour.white
			}

			$('#weather-city').text(weather.place)
			$('#weather-temp').text(celcius + degreeSymbol)

			$('html').
				css('background-color', this.background)
			$('html').
				css('color', this.color)
		}
	} )()
}

// --------------------- send a request to openweathermap.

var get_weather = function (location) {

	$.ajax({
		type: 'GET',
		dataType: 'jsonp',
		url: 
			'http://api.openweathermap.org/data/2.5/weather?lat=' + 
			location.latitude + "&lon=" + location.longitude,
		success: function (weather) {

			draw.weather({
				temp: weather.main.temp.toFixed(1),
				code:
					weather.weather[0].id,
				place: 
					location.location
			})
		},
		error: function (data) {
			console.log(data.statusText)
		}
	})
}


var timer = function (seconds) {

	var unixTime = function () {
		return Math.round(new Date().getTime() / 1000.0);
	}

	var genesis = unixTime();
	
	return function () {
		var existedFor = unixTime() - genesis;
		return existedFor > seconds;
	}
}

var intervals = {
	shouldDraw: 1000 * 5,
	shouldRequest: timer(20)
}

var updatePage = function () {

	draw.time()

	if (intervals.shouldRequest()) {

		intervals.shouldRequest = timer(20)

		get_weather({
			latitude: 55,
			longitude: 55,
			location: "Galway City, Ireland."
		})
	}
}

updatePage()
setInterval(updatePage, intervals.shouldDraw )
