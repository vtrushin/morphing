export function stylesToCssText(styles) {
	const decls = [];

	for (let prop in styles) {
		if (styles.hasOwnProperty(prop)) {
			const value = styles[prop];
			decls.push(`${prop}: ${value}`)
		}
	}

	return decls.join('; ');
}
