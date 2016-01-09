export default function createCSSClass(cssClass) {
	let style = document.createElement('style');
	style.type = 'text/css';
	//style.innerHTML = `${selector} {${styles}`;
	style.textContent = cssClass;

	//let stylesText = '';

	document.getElementsByTagName('head')[0].appendChild(style);
}