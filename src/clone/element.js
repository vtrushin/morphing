import {removeAttributes} from '../utils/element';
import {stylesToCssText} from '../utils/styles';

const ignoredHtmlTags = new Set([
	'br', 'style', 'script', 'template'
]);

export default function cloneElement(element, parent, contextRect) {
	if (!(element instanceof HTMLElement) || ignoredHtmlTags.has(element.tagName.toLowerCase())) {
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

	let left, top;
	if (parent) {
		let parentClientRect = parent.getBoundingClientRect();
		left = clientRect.left - parentClientRect.left - parent.clientLeft;
		top = clientRect.top - parentClientRect.top - parent.clientTop;
	} else {
		left = clientRect.left;
		top = clientRect.top;
	}

	Object.assign(styles, {
		position: parent ? 'absolute' : 'fixed',
		left: left + 'px',
		top: top + 'px',
		width: clientRect.width + 'px',
		height: clientRect.height + 'px',
		boxSizing: 'border-box',
		margin: 0,
		// pointerEvents: 'none'
	});

	// Save scroll position
	if (['auto', 'scroll'].includes(computedStyle.overflow)) {
		styles.overflow = 'hidden';
		Object.assign(dataset, {
			scrollLeft: element.scrollLeft,
			scrollTop: element.scrollTop
		});
	}

	return {
		node: cloned,
		css: cssText + ';' + stylesToCssText(styles),
		attributes: {
			dataset
		}
	};
}
