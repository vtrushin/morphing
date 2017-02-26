import {setStyles, setAttributes, createElement, removeAttributes} from './utils/element';
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

	function process(element, contextClientRect) {
		let cloned = null;
		const clonedOneLevelElement = (
			cloneTextNode(element, contextClientRect) ||
			cloneTextAreaElement(element, contextClientRect)
		);

		if (clonedOneLevelElement) {
			cloned = clonedOneLevelElement;
		} else {
			const clonedDeepElement = cloneElement(element, contextClientRect);
			if (clonedDeepElement) {
				Array.from(element.childNodes).forEach(child => {
					const clonedChild = process(child, clonedDeepElement.clientRect);
					if (clonedChild) {
						clonedDeepElement.element.appendChild(clonedChild);
					}
				});
				cloned = clonedDeepElement;
			}
		}

		if (!cloned) {
			return null;
		}

		/*if (cloned.cssText) {
			setStyles(cloned.element, cloned.cssText);
		}*/

		let styles = {
			position: contextClientRect ? 'absolute' : 'fixed',
			left: cloned.clientRect.left + (contextClientRect ? 0 : 300) + 'px',
			top: cloned.clientRect.top + 'px',
			width: cloned.clientRect.width + 'px',
			height: cloned.clientRect.height + 'px',
			// height: element.getBoundingClientRect().height,
			boxSizing: 'border-box',
			margin: 0,
			// pointerEvents: 'none'
		};

		console.log(element, styles);

		setStyles(cloned.element, styles);

		if (cloned.styles) {
			setStyles(cloned.element, cloned.styles);
		}

		/*const className = `morph-el-${i}`;
		css += `
			.${className} {
				${cloned.css}
			}
		`;
		i ++;
		cloned.node.className = className;*/
		return cloned.element;
	}

	let cloned = process(element);

	/*const style = document.createElement('style');
	style.textContent = css;

	process_.appendChild(style);*/

	// console.log(cloned);

	return cloned;
}
