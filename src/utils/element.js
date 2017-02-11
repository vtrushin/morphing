export function setStyles(element, styles = {}) {
	if (typeof styles == 'string') {
		element.style = styles;
	} else {
		Object.keys(styles).forEach(propertyName => {
			element.style[propertyName] = styles[propertyName];
		});
	}

	return element;
}


export function createElement(elementName, attributes = []) {
	const element = document.createElement(elementName);

	return setAttributes(element, attributes);
}


export function setAttributes(element, attributes = []) {
	Object.keys(attributes).forEach(attributeName => {
		if (attributeName === 'style') {
			setStyles(element, attributes[attributeName]);
		} else if (attributeName === 'dataset') {
			setDataset(element, attributes[attributeName]);
		} else {
			element.setAttribute(attributeName, attributes[attributeName]);
		}
	});

	return element;
}

export function setDataset(element, properties = {}) {
	Object.keys(properties).forEach(propertyName => {
		element.dataset[propertyName] = properties[propertyName];
	});

	return element;
}

export function removeAttributes(element, attributeNames = []) {
	attributeNames.forEach(attributeName => {
		element.removeAttribute(attributeName);
	});

	return element;
}
