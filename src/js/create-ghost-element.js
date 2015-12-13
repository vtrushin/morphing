export default function createGhostElement(el, excludedElList = []) {

	function process(_el) {
		let clone = _el.cloneNode(false);
		let childNode = _el.childNodes[0];
		let computedStyle = window.getComputedStyle(_el);

		clone.setAttribute('data-class', clone.className);
		clone.removeAttribute('class');
		clone.removeAttribute('id');

		if (computedStyle.overflow === 'auto' || computedStyle.overflow === 'scroll') {
			clone.dataset.scrollTop = _el.scrollTop;
			clone.dataset.scrollLeft = _el.scrollLeft;
		}

		if (childNode && childNode.nodeType === 3 && childNode.textContent.replace(/\s+/g, '') !== '') {
			clone.textContent = childNode.textContent;
		}

		for (let i = 0, len = computedStyle.length; i < len; i ++) {
			let prop = computedStyle[i];
			clone.style[prop] = computedStyle[prop];
		}

		if (excludedElList.indexOf(_el) !== -1 && excludedElList[excludedElList.indexOf(_el)] !== el) {
			clone.style.visibility = 'hidden';
			clone.textContent = '';

		} else {
			Array.from(_el.children).forEach(childEl => {
				// if (excludedElList.indexOf(childEl) !== -1) return;
				clone.appendChild(process(childEl));
			});
		}

		return clone;
	}

	let parent = process(el);
	let clientRect = el.getBoundingClientRect();

	let styles = {
		position: 'fixed',
		width: clientRect.width + 'px',
		height: clientRect.height + 'px',
		left: clientRect.left + 'px',
		top: clientRect.top + 'px',
		boxSizing: 'border-box',
		margin: 0,
		pointerEvents: 'none'
	};

	Object.keys(styles).forEach(style => {
		parent.style[style] = styles[style];
	});

	return parent;
}

