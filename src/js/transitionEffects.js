import getTransformClientRectDiff from './get-transform-diff';

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
}

export function fade(src) {
	return {

	}
}

export function slideLeft(src, dist) {
	return {
		src: {
			transform: 'translate(-100%, 0)',
			opacity: 0
		},
		dist: {
			transform: 'translate(100%, 0)',
			opacity: 0
		}
	};
}

export function slideRight(src, dist) {
	return {
		src: {
			transform: 'translate(100%, 0)',
			opacity: 0
		},
		dist: {
			transform: 'translate(-100%, 0)',
				opacity: 0
		}
	};
}