function setState(elem, stateName, callback) {
	let style;

	function onAnimationEnd(){
		callback();
		elem.removeEventListener('animationend', onAnimationEnd);
	}

	elem.classList.add(`_${stateName}`);

	style = getComputedStyle(elem, null);

	if (style.getPropertyValue('animation-name') === 'none') {
		callback();
	} else {
		elem.addEventListener('animationend', onAnimationEnd);
	}
}

document.addEventListener('DOMContentLoaded', () => {

	let button = document.getElementById('button');
	let elem = document.getElementById('elem');

	button.addEventListener('click', () => {
		setState(elem, 'opened', () => {
			console.log("ended");
		});
	});

});