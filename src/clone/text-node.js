import {stylesToCssText} from '../utils/styles';

export default function cloneTextNode(node, parent/*, contextRect*/) {
	if (!(node instanceof Text) || node.textContent.trim() === '') {
		return null;
	}

	const parentClientRect = parent.getBoundingClientRect();
	const range = document.createRange();
	range.selectNodeContents(node);
	const textClientRect = range.getBoundingClientRect();
	const textWrapper = document.createElement('span');
	textWrapper.appendChild(node.cloneNode(false));

	return {
		node: textWrapper,
		css: stylesToCssText({
			position: 'absolute',
			left: textClientRect.left - parentClientRect.left - parent.clientLeft + 'px',
			top: textClientRect.top - parentClientRect.top - parent.clientTop + 'px',
			width: textClientRect.width + 'px',
			height: textClientRect.height + 'px'
		})
	};
}
