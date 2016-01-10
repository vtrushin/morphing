// import defaultStyles from './default-computed-styles';

function getComputedStyleCssText(style) {
	let cssText = '';
	if (style.cssText != '') {
		return style.cssText;
	}
	for (let i = 0; i < style.length; i++) {
		cssText += style[i] + ": " + style.getPropertyValue(style[i]) + "; ";
	}
	return cssText;
}

let isIE = 'currentStyle' in HTMLElement.prototype;
let defaultStyles = {};

export default class GhostElementsBuilder {

	constructor() {
		this.elementsCount = 0;
		this.styles = '';
		this.styleEl = document.createElement('style');
		this.styleEl.type = 'text/css';
		document.head.appendChild(this.styleEl);

		if (isIE) {
			let div = document.createElement('div');
			let fragment = document.createDocumentFragment();
			fragment.appendChild(div);
			let styles = window.getComputedStyle(div);
			// let styles = div.currentStyle;
			for (let i = 0; i < styles.length; i ++) {
				let prop = styles[i];
				let value = styles[prop];
				defaultStyles[prop] = value;
			}
		}
	}

	create(el, excludedElList = []) {
		let childElementsCount = 0;

		let process = (_el) => {
			let clone = _el.cloneNode(false);
			let childNode = _el.childNodes[0];
			let computedStyle = window.getComputedStyle(_el);
			let cssClassName = `el${this.elementsCount}${childElementsCount}`;

			clone.setAttribute('data-class', clone.className);
			// clone.removeAttribute('class');
			clone.className = cssClassName;
			clone.removeAttribute('id');

			// clone.style.transformStyle = 'flat';

			// Save scroll position
			if (computedStyle.overflow === 'auto' || computedStyle.overflow === 'scroll') {
				clone.style.overflow = 'hidden';
				clone.dataset.scrollTop = _el.scrollTop;
				clone.dataset.scrollLeft = _el.scrollLeft;
			}

			if (childNode && childNode.nodeType === 3 && childNode.textContent.replace(/\s+/g, '') !== '') {
				clone.textContent = childNode.textContent;
			}

			if (isIE) {
				let styles = '';
				let count = 0;
				for (let i = 0; i < computedStyle.length; i ++) {
					let prop = computedStyle[i];
					let value = computedStyle[prop];
					if (defaultStyles[prop] !== value) {
						count ++;
						styles += `${prop}: ${value}; `;
					}
				}
				this.styles += `.${cssClassName} { ${styles} }`;
			} else {
				this.styles += `.${cssClassName} { ${getComputedStyleCssText(computedStyle)} }`;
			}

			childElementsCount ++;

			if (excludedElList.indexOf(_el) !== -1 && excludedElList[excludedElList.indexOf(_el)] !== el) {
				clone.style.visibility = 'hidden';
				clone.textContent = '';
			} else {
				for (let i = 0; i < _el.children.length; i ++) {
					// if (excludedElList.indexOf(childEl) !== -1) return;
					clone.appendChild(process(_el.children[i]));
				}
				/*Array.from(_el.children).forEach(childEl => {
				 // if (excludedElList.indexOf(childEl) !== -1) return;
				 clone.appendChild(process(childEl));
				 });*/
			}

			return clone;
		};

		// console.time('timer');

		let parent = process(el);

		let clientRect = el.getBoundingClientRect();

		let styles = {
			position: 'absolute',
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

		// console.timeEnd('timer');

		this.elementsCount ++;

		return parent;
	}

	applyStyles() {
		this.styleEl.textContent = this.styles;
	}

	clear() {
		document.head.removeChild(this.styleEl);
	}
}