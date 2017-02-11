import cloneElement from './element';

export default function cloneTextAreaElement(element, parent) {
	if (!(element instanceof HTMLTextAreaElement)) {
		return null;
	}

	return cloneElement(element, parent);
}
