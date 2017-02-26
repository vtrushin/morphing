import position from './_position';
import {removeAttributes} from '../utils/element';
// import {stylesToCssText} from '../utils/styles';

const ignoredHtmlTags = new Set([
	'br', 'style', 'script', 'template'
]);

function isIgnoredElement(element) {
	return ignoredHtmlTags.has(element.tagName.toLowerCase());
}

export default function cloneElement(element, contextClientRect) {
	if (!(element instanceof HTMLElement) || isIgnoredElement(element)) {
		return null;
	}

	const clientRect = element.getBoundingClientRect();
	const cloned = element.cloneNode(false);
	const computedStyle = window.getComputedStyle(element);
	const {cssText} = computedStyle;
	const dataset = {};
	const styles = {};

	if (element.className) {
		dataset.class = element.className;
	}

	removeAttributes(cloned, ['id', 'class']);

	/*const [left, top] = contextBoundingBox
		? [clientRect.left - contextBoundingBox.left, clientRect.top - contextBoundingBox.top]
		: [clientRect.left, clientRect.top];*/

	let left, top;
	if (contextClientRect) {
		// let parentClientRect = parent.getBoundingClientRect();
		// left = clientRect.left - parentClientRect.left - parent.clientLeft;
		left = clientRect.left - contextClientRect.left/* - contextClientRect.clientLeft*/;
		// top = clientRect.top - parentClientRect.top - parent.clientTop;
		top = clientRect.top - contextClientRect.top/* - contextClientRect.clientTop*/;
	} else {
		left = clientRect.left;
		top = clientRect.top;
	}

	/*Object.assign(styles, {
		position: parent ? 'absolute' : 'fixed',
		left: left + 'px',
		top: top + 'px',
		width: clientRect.width + 'px',
		height: clientRect.height + 'px',
		boxSizing: 'border-box',
		margin: 0,
		// pointerEvents: 'none'
	});*/

	// Save scroll position
	if (['auto', 'scroll'].includes(computedStyle.overflow)) {
		styles.overflow = 'hidden';
		Object.assign(dataset, {
			scrollLeft: element.scrollLeft,
			scrollTop: element.scrollTop
		});
	}

	return {
		element: cloned,
		clientRect: {
			left,
			top,
			width: clientRect.width,
			height: clientRect.height
		},
		styles,
		cssText,
		// css: cssText + ';' + stylesToCssText(styles),
		attributes: {
			dataset
		}
	};
}
