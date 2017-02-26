// import position from './_position';
import {stylesToCssText} from '../utils/styles';

export default function cloneTextNode(node, contextClientRect) {
	if (!(node instanceof Text) || node.textContent.trim() === '') {
		return null;
	}

	// const parentClientRect = parent.getBoundingClientRect();
	const clonedText = node.cloneNode(false);
	const range = document.createRange();
	range.selectNodeContents(node);
	const clientRect = range.getBoundingClientRect();
	const wrapper = document.createElement('span');
	wrapper.appendChild(clonedText);

	return {
		element: wrapper,
		clientRect: {
			left: clientRect.left - contextClientRect.left,
			top: clientRect.top - contextClientRect.top,
			width: clientRect.width,
			height: clientRect.height
		},
		/*position: {
			// left: textClientRect.left - parentClientRect.left - parent.clientLeft,
			left: ,
			// top: textClientRect.top - parentClientRect.top - parent.clientTop,
			top: clientRect.top - contextPosition.top
			/!*clientLeft: 0,
			clientTop: 0*!/
		},*/
		/*css: stylesToCssText({
			position: 'absolute',
			left: textClientRect.left - parentClientRect.left - parent.clientLeft + 'px',
			top: textClientRect.top - parentClientRect.top - parent.clientTop + 'px',
			width: textClientRect.width + 'px',
			height: textClientRect.height + 'px'
		})*/
	};
}
