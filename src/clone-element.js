import { setStyles, setAttributes, createElement, removeAttributes } from './utils/element';

const ignoredHtmlTags = new Set([
	'br', 'style', 'script', 'template'
]);

function cloneTextNode(node, parent) {
	const parentClientRect = parent.getBoundingClientRect();
	const range = document.createRange();
	range.selectNodeContents(node);
	const textClientRect = range.getBoundingClientRect();
	const textWrapper = createElement('span', {
		style: {
			position: 'absolute',
			left: textClientRect.left - parentClientRect.left - parent.clientLeft + 'px',
			top: textClientRect.top - parentClientRect.top - parent.clientTop + 'px',
			width: textClientRect.width + 'px',
			height: textClientRect.height + 'px',
		}
	});
	textWrapper.appendChild(node.cloneNode(false));

	return textWrapper;
}

function cloneTextarea(node, parent) {

}

function createPseudoElement(style) {
	const content = style.getPropertyValue('content');

	if (['', 'none', 'normal'].includes(content)) {
		return null;
	}

	return createElement('span', {
		style: style
	});
}

function cloneElement(element, excludedElements = new Set(), parent) {
	const clientRect = element.getBoundingClientRect();
	const cloned = element.cloneNode(false);
	const style = window.getComputedStyle(element);
	const before = createPseudoElement(window.getComputedStyle(element, '::before'));
	const after = createPseudoElement(window.getComputedStyle(element, '::after'));
	const { cssText } = style;

	if (element.className) {
		cloned.dataset.class = element.className;
	}

	removeAttributes(cloned, ['id', 'class']);

	cloned.style = cssText;

	// Save scroll position
	if (['auto', 'scroll'].includes(style.overflow)) {
		setAttributes(cloned, {
			style: {
				overflow: 'hidden'
			},
			dataset: {
				scrollTop: element.scrollTop,
				scrollLeft: element.scrollLeft
			}
		});
	}

	/*let container;
	// Simulate scroll offset
	if (['auto', 'scroll'].includes(computedStyle.overflow)) {
		const wrapper = document.createElement('div');
		const left = parseInt(-element.scrollLeft);
		const top = parseInt(-element.scrollTop);

		wrapper.style.transform = `translate(${left}px, ${top}px)`;
		cloned.style.overflow = 'hidden';
		cloned.appendChild(wrapper);
		container = wrapper;
	} else {
		container = cloned;
	}*/

	if (before) {
		cloned.appendChild(before);
	}

	if (element.tagName.toLowerCase() !== 'textarea') {
		Array.from(element.childNodes).forEach(childEl => {
			switch (childEl.nodeType) {
				case Node.ELEMENT_NODE:
					const tagName = childEl.tagName.toLowerCase();
					if (ignoredHtmlTags.has(tagName)) {
						break;
					}
					/*if (tagName === 'textarea') {
					 cloned.appendChild(cloneTextarea(childEl, element));
					 break;
					 }*/
					cloned.appendChild(cloneElement(childEl, undefined, element));
					break;

				case Node.TEXT_NODE:
					if (childEl.textContent.trim() !== '') {
						cloned.appendChild(cloneTextNode(childEl, element));
					}
					break;
			}
		});
	}

	if (after) {
		cloned.appendChild(after);
	}

	let left, top;
	if (parent) {
		const parentClientRect = parent.getBoundingClientRect();
		left = clientRect.left - parentClientRect.left - parent.clientLeft;
		top = clientRect.top - parentClientRect.top - parent.clientTop;
	} else {
		left = clientRect.left;
		top = clientRect.top;
	}

	console.log(element, left);

	setStyles(cloned, {
		position: parent ? 'absolute' : 'fixed',
		left: left+ 'px',
		top: top + 'px',
		width: clientRect.width + 'px',
		height: clientRect.height + 'px',
		boxSizing: 'border-box',
		margin: 0,
		// pointerEvents: 'none'
	});

	return cloned;
}


/*function cloneElement(element, excludedElements = new Set(), parent) {
	const clientRect = element.getBoundingClientRect();
	const cloned = element.cloneNode(false);
	const { cssText } = window.getComputedStyle(element);

	if (element.className) {
		cloned.dataset.class = element.className;
	}

	removeAttributes(cloned, ['id', 'class']);

	cloned.style = cssText;

	let left, top;
	if (parent) {
		let parentClientRect = parent.getBoundingClientRect();
		left = clientRect.left - parentClientRect.left - parent.clientLeft;
		top = clientRect.top - parentClientRect.top - parent.clientTop;
	} else {
		left = clientRect.left;
		top = clientRect.top;
	}

	setStyles(cloned, {
		position: parent ? 'absolute' : 'fixed',
		left: left + 'px',
		top: top + 'px',
		width: clientRect.width + 'px',
		height: clientRect.height + 'px',
		boxSizing: 'border-box',
		margin: 0,
		// pointerEvents: 'none'
	});

	return cloned;
}


function cloneElementRecursive(element, excludedElements = new Set()) {
	const cloned = cloneElement(element, excludedElements);

	if (element.tagName.toLowerCase() !== 'textarea') {
		Array.from(element.childNodes).forEach(childEl => {
			switch (childEl.nodeType) {
				case Node.ELEMENT_NODE:
					const tagName = childEl.tagName.toLowerCase();
					if (ignoredHtmlTags.has(tagName)) {
						break;
					}
					/!*if (tagName === 'textarea') {
					 cloned.appendChild(cloneTextarea(childEl, element));
					 break;
					 }*!/
					cloned.appendChild(cloneElement(childEl, undefined, element));
					break;

				case Node.TEXT_NODE:
					if (childEl.textContent.trim() !== '') {
						cloned.appendChild(cloneTextNode(childEl, element));
					}
					break;
			}
		});
	}
}*/

export default (element, excludedElements) => {
	const cloneElement2 = cloneElement(element, excludedElements);
	cloneElement2.style.left = '300px';
	return cloneElement2;
};
