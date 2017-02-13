// import {setStyles, setAttributes, createElement, removeAttributes} from './utils/element';
// import {stylesToCssText} from './utils/styles';
import cloneTextNode from './clone/text-node';
import cloneElement from './clone/element';
import cloneTextAreaElement from './clone/text-area-element';

/*function createPseudoElement(style) {
	const content = style.getPropertyValue('content');

	if (['', 'none', 'normal'].includes(content)) {
		return null;
	}

	return {
		node: document.createElement('span'),
		style: style
	};
}*/

export default function clone(element) {
	let i = 0;
	let css = '';

	function process(element, context) {
		let cloned = null;
		const clonedWithoutChild = (
			cloneTextNode(element, context) ||
			cloneTextAreaElement(element, context)
		);

		if (clonedWithoutChild) {
			cloned = clonedWithoutChild;
		} else {
			const clonedWithChild = cloneElement(element, context);
			if (clonedWithChild) {
				Array.from(element.childNodes).forEach(child => {
					const childCloned = process(child, clonedWithChild.node);
					if (childCloned) {
						clonedWithChild.node.appendChild(childCloned);
					}
				});
				cloned = clonedWithChild;
			}
		}

		if (cloned) {
			const className = `morph-el-${i}`;
			css += `
				.${className} {
					${cloned.css}
				}
			`;
			i ++;
			cloned.node.className = className;
			return cloned.node;
		} else {
			return null;
		}
	}

	let process_ = process(element);

	const style = document.createElement('style');
	style.textContent = css;

	process_.appendChild(style);

	return process_;
}
