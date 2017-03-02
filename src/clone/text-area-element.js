import cloneElement from './element';

export default function cloneTextAreaElement(element) {
	return element instanceof HTMLTextAreaElement
		? cloneElement(element)
		: null;
}
