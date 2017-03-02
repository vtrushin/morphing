import {removeAttributes} from '../utils/element';

const ignoredHtmlTags = new Set([
	'br', 'style', 'script', 'template'
]);

function isIgnoredElement(element) {
	return ignoredHtmlTags.has(element.tagName.toLowerCase());
}

export default function cloneElement(element) {
	if (!(element instanceof HTMLElement) || isIgnoredElement(element)) {
		return null;
	}

	const clientRect = element.getBoundingClientRect();
	const cloned = element.cloneNode(false);
	const computedStyle = window.getComputedStyle(element);
	const dataset = {};
	const styles = {};

	if (element.className) {
		dataset.class = element.className;
	}

	removeAttributes(cloned, ['id', 'class']);

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
		clientRect,
		styles,
		computedStyle,
		attributes: {
			dataset
		}
	};
}
