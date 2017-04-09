import {setStyles, setAttributes, createElement, removeAttributes} from '../utils/element';
// import {stylesToCssText} from './utils/styles';
import cloneTextNode from './text-node';
import cloneElement from './element';
import cloneTextAreaElement from './text-area-element';

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

function parseCssPxValue(value) {
	return Number(value.replace('px', ''));
}

export default function clone(element) {
	let i = 0;
	let css = '';

	function process(element, contextElement) {
		let cloned = null;
		const clonedOneLevelElement = (
			cloneTextNode(element, contextElement) ||
			cloneTextAreaElement(element, contextElement)
		);

		if (clonedOneLevelElement) {
			cloned = clonedOneLevelElement;
		} else {
			const clonedDeepElement = cloneElement(element, contextElement);
			if (clonedDeepElement) {
				Array.from(element.childNodes).forEach(child => {
					const clonedChild = process(child, clonedDeepElement);
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

		if (cloned.computedStyle) {
			setStyles(cloned.element, cloned.computedStyle.cssText);
		}

		let styles = {
			width: cloned.clientRect.width + 'px',
			height: cloned.clientRect.height + 'px',
			boxSizing: 'border-box',
			margin: 0,
			// pointerEvents: 'none'
		};

		let position;
		let left = cloned.clientRect.left;
		let top = cloned.clientRect.top;

		if (contextElement) {
			position = 'absolute';
			left -= contextElement.clientRect.left - contextElement.element.clientLeft;
			top -= contextElement.clientRect.top - contextElement.element.clientTop;

			if (contextElement.computedStyle) {
				left -= parseCssPxValue(contextElement.computedStyle.borderLeftWidth);
				top -= parseCssPxValue(contextElement.computedStyle.borderTopWidth);
			}
		} else {
			position = 'fixed';
			left += 300;
		}

		Object.assign(styles, {
			position,
			left: left + 'px',
			top: top + 'px'
		});

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

	let cloned = process(element, null);

	/*const style = document.createElement('style');
	style.textContent = css;

	process_.appendChild(style);*/

	// console.log(cloned);

	return cloned;
}
