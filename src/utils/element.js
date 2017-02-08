export function setStyles(element, styles) {
	const properties = Object.keys(styles);

	properties.forEach(propertyName => {
		element.style[propertyName] = styles[propertyName];
	});

	return element;
}


export function createElement(elementName, attributes = []) {
	const element = document.createElement(elementName);

	return setAttributes(element, attributes);
}


export function setAttributes(element, attributes = []) {
	const attributeNames = Object.keys(attributes);

	attributeNames.forEach(attributeName => {
		if (attributeName === 'style') {
			setStyles(element, attributes[attributeName]);
		} else {
			element.setAttribute(attributeName, attributes[attributeName]);
		}
	});

	return element;
}


export function removeAttributes(element, attributeNames) {
	attributeNames.forEach(attributeName => {
		element.removeAttribute(attributeName);
	});

	return element;
}
