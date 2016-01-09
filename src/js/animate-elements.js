export default function animateElements(animationList, duration, easing, callback, isReverse) {
	let settings = {
		duration: duration,
		easing: easing,
		direction: 'alternate',
		fill: 'backwards'
	};

	let keyframeEffects = animationList.map(animation => {
		let frames = isReverse
			? [ animation.to, animation.from ]
			: [ animation.from, animation.to ]
		;
		return new KeyframeEffect(animation.el, frames, settings);
	});

	let groupEffect = new GroupEffect(keyframeEffects);
	let player = document.timeline.play(groupEffect);

	if (callback) {
		player.onfinish = callback;
	}
}