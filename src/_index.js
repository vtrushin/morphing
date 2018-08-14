// import GhostElementsBuilder from './ghost-elements-builder';
import { createElement } from './utils/element';
import cloneElement from './clone/index';
// import createInlinedElementClone from './create-inlined-element-clone';
import getTransformClientRectDiff from './offset-transform';
import animateElements from './animate-elements';

/*const defaultSettings = {
	type: 'copy',
	// src: null,
	// dist: null,
	src: {
		el: null,
		classHidden: null
	},
	dist: {
		el: null,
		classHidden: null
	},
	partials: [],
	// context: null,
	duration: 300,
	easing: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
	autoClear: false
};

export function mix(srcEl, distEl) {
	let srcClientRect = srcEl.getBoundingClientRect();
	let distClientRect = distEl.getBoundingClientRect();

	let srcTransform = getTransformClientRectDiff(srcClientRect, distClientRect);
	let distTransform = getTransformClientRectDiff(distClientRect, srcClientRect);

	srcEl.style.transformOrigin = 'center center';
	distEl.style.transformOrigin = 'center center';

	return {
		src: {
			transform: `
				translate(${srcTransform.offsetX}px, ${srcTransform.offsetY}px)
				scale(${srcTransform.scaleX}, ${srcTransform.scaleY})
			`,
			opacity: 0
		},
		dist: {
			transform: `
				translate(${distTransform.offsetX}px, ${distTransform.offsetY}px)
				scale(${distTransform.scaleX}, ${distTransform.scaleY})
			`,
			opacity: 0
		}
	};
}*/

// window.cloneElement = cloneElement;

window.Morph = class Morph {
	constructor(settings) {
		this.settings = Object.assign({}, defaultSettings, settings);
		// this.ghostElementsBuilder = new GhostElementsBuilder();
	}

	from(element) {
		this.from = cloneElement(element);
		return this;
	}

	to(element) {
		this.to = cloneElement(element);
		return this;
	}

	animate() {

		document.body.appendChild(this.from);
		document.body.appendChild(this.to);

		const effect = mix(this.from, this.to);

		const srcAnimation = {};
		const distAnimation = {};

		srcAnimation.from = {};
		srcAnimation.to = effect.src;
		Object.keys(effect.src).forEach(cssProp => {
			srcAnimation.from[cssProp] = window.getComputedStyle(this.from).getPropertyValue(cssProp);
		});

		distAnimation.from = effect.dist;
		distAnimation.to = {};
		Object.keys(effect.dist).forEach(cssProp => {
			distAnimation.to[cssProp] = window.getComputedStyle(this.to).getPropertyValue(cssProp);
		});

		const animationList = [
			{
				el: this.from,
				from: srcAnimation.from,
				to: srcAnimation.to
			},
			{
				el: this.to,
				from: distAnimation.from,
				to: distAnimation.to
			}
		];

		animateElements(animationList);
	}

	setDestinationElement(element, partials) {

	}
};
