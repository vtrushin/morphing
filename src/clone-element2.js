// import {setStyles, setAttributes, createElement, removeAttributes} from './utils/element';
// import {stylesToCssText} from './utils/styles';
import cloneTextNode from './clone/text-node';
import cloneElement from './clone/element';
import cloneTextAreaElement from './clone/text-area-element';

function createPseudoElement(style) {
	const content = style.getPropertyValue('content');

	if (['', 'none', 'normal'].includes(content)) {
		return null;
	}

	return {
		node: document.createElement('span'),
		style: style
	};
}

export default function clone(element) {
	let i = 0;
	const rules = {};

	function process(element, context) {
		const oneDepthElement = (
			cloneTextNode() ||
			cloneTextAreaElement()
		);

		if (oneDepthElement) {

		} else {
			// const cloned = cloneElement(element, context);
			Array.from(element.childNodes).forEach(process);
		}
	}

	process(element);
}
