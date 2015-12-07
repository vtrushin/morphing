export default function animateElements(animationList, duration, easing, callback, isReverse) {
	var length = animationList.length;
	var finishedCount = 0;

	var settings = {
		duration: duration,
		easing: easing,
		direction: 'alternate',
		fill: 'backwards'
	};

	function onEachAfter() {
		finishedCount ++;
		if (finishedCount == length && callback) {
			callback();
		}
	}

	animationList.forEach(animation => {
		var frames = isReverse
			? [ animation.toObj, animation.fromObj ]
			: [ animation.fromObj, animation.toObj ]
		;

		let player = animation.el.animate(frames, settings);
		player.onfinish = onEachAfter;
		//player.pause();
	});

}