'use strict';

var listItem = document.querySelector('.list li:nth-child(2)');
var view = document.querySelector('.view');

var timer = 30000;

var animatedObjects = [{
	from: '.title span',
	to: '.title span'
}, {
	from: '.author span',
	to: '.author span'
}, {
	from: '.star',
	to: '.activity span'
}];

function callback() {
	console.log(222);
	view.classList.remove('hidden');
}

function onEachDone(i) {
	console.log(i);
	if (i === animatedObjects.length - 1) {
		callback();
	}
}

var button = document.querySelector('#start');

button.addEventListener('click', function () {

	view.classList.remove('hidden');

	animatedObjects.forEach(function (animObj, i) {
		ramjet.transform(listItem.querySelector(animObj.from), view.querySelector(animObj.to), {
			duration: timer,
			done: function done() {
				view.classList.remove('hidden');
				onEachDone(i);
			}
		});
	});

	view.classList.add('hidden');
});