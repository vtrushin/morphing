let listItem = document.querySelector('.list li:nth-child(2)');
let view = document.querySelector('.view');




let timer = 30000;


let animatedObjects = [
	{
		from: '.title span',
		to: '.title span'
	},
	{
		from: '.author span',
		to: '.author span'
	},
	{
		from: '.star',
		to: '.activity span'
	}
];

function callback(){
	console.log(222);
	view.classList.remove('hidden');
}

function onEachDone(i){
	console.log(i);
	if (i === animatedObjects.length - 1) {
		callback();
	}
}

let button = document.querySelector('#start');

button.addEventListener('click', () => {

	view.classList.remove('hidden');

	animatedObjects.forEach((animObj, i) => {
		ramjet.transform(
			listItem.querySelector(animObj.from),
			view.querySelector(animObj.to),
			{
				duration: timer,
				done: () => {
					view.classList.remove('hidden');
					onEachDone(i)
				}
			}
		)
	});

	view.classList.add('hidden');

});





/*
console.log(listItem);

let elA = document.querySelector('#elem');
let elB = document.querySelector('#elem2');

elB.classList.remove('hidden');

ramjet.transform(elA, elB, {
	done: function(){
		elB.classList.remove('hidden');
	},
	duration: 200500
});

elA.classList.add('hidden');
elB.classList.add('hidden');*/
