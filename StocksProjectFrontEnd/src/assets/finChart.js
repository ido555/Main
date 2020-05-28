var barCount = 60;
var initialDateStr = '01 Apr 2017 00:00 Z';

var ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 250;
var chart = new Chart(ctx, {
	type: 'candlestick',
	data: {
		datasets: [{
			label: 'CHRT - Chart.js Corporation',
			data: [oneBar(Date.now()),oneBar(Date.now()+10000000),oneBar(Date.now()+20000000)]
		}]
	},
	options: {
		scales: {
			x: {
				afterBuildTicks: function(scale) {
					const majorUnit = scale._majorUnit;
					const ticks = scale.ticks;
					const firstTick = ticks[0];
					let i, ilen, val, tick, currMajor, lastMajor;

					val = luxon.DateTime.fromMillis(ticks[0].value);
					if ((majorUnit === 'minute' && val.second === 0)
							|| (majorUnit === 'hour' && val.minute === 0)
							|| (majorUnit === 'day' && val.hour === 9)
							|| (majorUnit === 'month' && val.day <= 3 && val.weekday === 1)
							|| (majorUnit === 'year' && val.month === 0)) {
						firstTick.major = true;
					} else {
						firstTick.major = false;
					}
					lastMajor = val.get(majorUnit);

					for (i = 1, ilen = ticks.length; i < ilen; i++) {
						tick = ticks[i];
						val = luxon.DateTime.fromMillis(tick.value);
						currMajor = val.get(majorUnit);
						tick.major = currMajor !== lastMajor;
						lastMajor = currMajor;
					}
					return ticks;
				}
			}
		}
	}
});

// function getRandomInt(max) {
// 	return Math.floor(Math.random() * Math.floor(max));
// };

// function randomDouble(min, max) {
// 	return Math.random() * (max - min) + min;
// }

function oneBar(date){
	// Date date = 
	return {
		t: date,
		o: 4.5,
		h: 5,
		l: 1.4,
		c: 1.7
	};
}

function randomBar(date, lastClose) {
	// var open = randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
	// var close = randomNumber(open * 0.95, open * 1.05).toFixed(2);
	// var high = randomNumber(Math.max(open, close), Math.max(open, close) * 1.1).toFixed(2);
	// var low = randomNumber(Math.min(open, close) * 0.9, Math.min(open, close)).toFixed(2);
	return {
		t: date.valueOf(),
		o: 1.5,
		h: 2,
		l: 1.4,
		c: 1.7
	};

}

// function getRandomData(dateStr, count) {
// 	var date = luxon.DateTime.fromRFC2822(dateStr);
// 	var data = [randomBar(date, 30),oneBar()];
// 	while (data.length < count) {
// 		date = date.plus({days: 1});
// 		if (date.weekday <= 5) {
// 			data.push(randomBar(date, data[data.length - 1].c));
// 		}
// 	}
// 	return data;
// }

var update = function() {

	var dataset = chart.config.data.datasets[0];

	// candlestick vs ohlc
	var type = document.getElementById('type').value;
	dataset.type = type;

	// linear vs log
	var scaleType = document.getElementById('scale-type').value;
	chart.config.options.scales.y.type = scaleType;

	// color
	var colorScheme = document.getElementById('color-scheme').value;
	if (colorScheme === 'neon') {
		dataset.color = {
			up: '#01ff01',
			down: '#fe0000',
			unchanged: '#999',
		};
	} else {
		delete dataset.color;
	}

	// border
	var border = document.getElementById('border').value;
	var defaultOpts = Chart.defaults.elements[type];
	if (border === 'true') {
		dataset.borderColor = defaultOpts.borderColor;
	} else {
		dataset.borderColor = {
			up: defaultOpts.color.up,
			down: defaultOpts.color.down,
			unchanged: defaultOpts.color.up
		};
	}

	chart.update();
};

// document.getElementById('update').addEventListener('click', update);

// document.getElementById('randomizeData').addEventListener('click', function() {
// 	chart.data.datasets.forEach(function(dataset) {
// 		dataset.data = getRandomData(initialDateStr, barCount);
// 	});
// 	update();
// });