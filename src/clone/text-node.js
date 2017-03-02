export default function cloneTextNode(node) {
	if (!(node instanceof Text) || node.textContent.trim() === '') {
		return null;
	}

	const clonedText = node.cloneNode(false);
	const range = document.createRange();
	range.selectNodeContents(node);
	const clientRect = range.getBoundingClientRect();
	const wrapper = document.createElement('span');
	wrapper.appendChild(clonedText);

	return {
		element: wrapper,
		clientRect
	};
}
