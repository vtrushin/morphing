export default function animateElements(animationList, duration = 2000, easing = 'ease', callback, isReverse) {
	const settings = {
		duration,
		easing,
		direction: 'alternate',
		fill: 'backwards'
	};

	const keyframeEffects = animationList.map(animation => {
		const frames = isReverse
			? [animation.to, animation.from]
			: [animation.from, animation.to];
		return new KeyframeEffect(animation.el, frames, settings);
	});

	const groupEffect = new GroupEffect(keyframeEffects);
	const player = document.timeline.play(groupEffect);

	if (callback) {
		player.onfinish = callback;
	}

	return new Promise((resolve, reject) => {
		player.onfinish = resolve;
	});
}
