const nameSpaces = {
	svg: 'http://www.w3.org/2000/svg'
};

export function setStyles(element, styles = {}) {
	if (typeof styles === 'string') {
		element.style = styles;
	} else {
		Object.keys(styles).forEach(propertyName => {
			element.style[propertyName] = styles[propertyName];
		});
	}

	return element;
}


export function createElement(elementName, attributes = []) {
	const colonPos = elementName.indexOf(':');
	let element;

	if (colonPos !== -1) {
		const ns = nameSpaces[elementName.substring(0, colonPos)];
		element = document.createElementNS(ns, elementName);
	} else {
		element = document.createElement(elementName);
	}

	return setAttributes(element, attributes);
}


export function setAttributes(element, attributes = []) {
	Object.keys(attributes).forEach(attributeName => {
		switch (attributeName) {
			case 'style': {
				setStyles(element, attributes[attributeName]);
				break;
			}
			case 'dataset': {
				setDataset(element, attributes[attributeName]);
				break;
			}
			case 'className': {
				element.setAttribute('class', attributes[attributeName]);
				break;
			}
			default: {
				element.setAttribute(attributeName, attributes[attributeName]);
			}
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
