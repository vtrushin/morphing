function createFlattenCopyOfElement(el) {
	let cover = document.createElement('div');
	let clientRect = el.getBoundingClientRect();

	let coverLeft = clientRect.left;
	let coverTop = clientRect.top;

	function process(_el) {
		let clone = _el.cloneNode(false);
		let clientRect = _el.getBoundingClientRect();
		let childNode = _el.childNodes[0];
		let computedStyle = window.getComputedStyle(_el);

		clone.dataset.cssClass = clone.className;
		clone.removeAttribute('class');
		clone.removeAttribute('id');

		if (childNode && childNode.nodeType === 3 && childNode.textContent.replace(/\s+/g, '') !== '') {
			clone.textContent = childNode.textContent;
		}

		for (let i = 0, len = computedStyle.length; i < len; i ++) {
			let prop = computedStyle[i];
			clone.style[prop] = computedStyle[prop];
		}

		let stylesToAdd = {
			position: 'absolute',
			width: clientRect.width + 'px',
			height: clientRect.height + 'px',
			left: clientRect.left - coverLeft + 'px',
			top: clientRect.top - coverTop + 'px',
			boxSizing: 'border-box',
			transition: '',
			animation: '',
			margin: 0
		};

		Object.keys(stylesToAdd).forEach(style => {
			clone.style[style] = stylesToAdd[style];
		});

		cover.appendChild(clone);

		Array.from(_el.children).forEach(childEl => {
			process(childEl);
		});

		return clone;
	}

	cover.style.position = 'absolute';
	cover.style.left = clientRect.left + 'px';
	cover.style.top = clientRect.top + 'px';
	cover.style.width = clientRect.width + 'px';
	cover.style.height = clientRect.height + 'px';
	cover.style.boxSizing = 'border-box';

	process(el);

	return cover;
}


export default createFlattenCopyOfElement;