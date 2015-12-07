function getAngleFromClientRect(x1, y1, x2, y2) {
	// http://stackoverflow.com/questions/28365489/how-to-get-the-rotation-of-degree-with-getboundingclientrect
	return Math.round(Math.atan2(y2 - y1 , x2 - x1) * (180 / (4 * Math.atan(1))));
}

window.addEventListener('load', () => {

	let child = document.querySelector('.child');
	let childShadow = document.querySelector('.child-shadow');

	let clientRect = child.getBoundingClientRect();


	let _clientRect = {
		left: child.clientLeft,
		top: child.clientTop,
		width: child.clientWidth,
		height: child.clientHeight
	};

	childShadow.style.left = clientRect.left + 'px';
	childShadow.style.top = clientRect.top + 'px';
	childShadow.style.transformOrigin = '0 50%';
	childShadow.style.transform = 'rotate(-20deg)';


	let a = document.createElement('div');
	a.style.position = 'absolute';
	a.style.left = clientRect.left + 'px';
	a.style.top = clientRect.top + 'px';
	a.style.width = clientRect.width + 'px';
	a.style.height = clientRect.height + 'px';
	a.style.background = 'rgba(0, 0, 0, .2)';

	document.body.appendChild(a);

	// let x = clientRect.left - child.clientLeft + child.scrollLeft;

	console.log(_clientRect, clientRect);

	/*console.log(getAngleFromClientRect(
		_clientRect.top,
		_clientRect.left,
		clientRect.top,
		clientRect.left
	));*/

	/*console.log(child.clientWidth);

	console.log(clientRect);
	console.log(x);*/

});