'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function animateElements(animationList, duration, easing, callback, isReverse) {
	var length = animationList.length;
	var finishedCount = 0;

	var settings = {
		duration: duration,
		easing: easing,
		direction: 'alternate',
		fill: 'backwards'
	};

	function onEachAfter() {
		finishedCount++;
		if (finishedCount == length && callback) {
			callback();
		}
	}

	animationList.forEach(function (animation) {
		var frames = isReverse ? [animation.toObj, animation.fromObj] : [animation.fromObj, animation.toObj];

		var player = animation.el.animate(frames, settings);
		player.onfinish = onEachAfter;
		//player.pause();
	});
}

function getTransformClientRectDiff(aCR, bCR) {
	return {
		offsetX: bCR.left + bCR.width / 2 - (aCR.left + aCR.width / 2),
		offsetY: bCR.top + bCR.height / 2 - (aCR.top + aCR.height / 2),
		scaleX: bCR.width / aCR.width,
		scaleY: bCR.height / aCR.height
	};
}

function createGhostElement(el) {
	var excludedElList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	function process(_el) {
		var clone = _el.cloneNode(false);
		var childNode = _el.childNodes[0];
		var computedStyle = window.getComputedStyle(_el);

		clone.setAttribute('data-class', clone.className);
		clone.removeAttribute('class');
		clone.removeAttribute('id');

		if (childNode && childNode.nodeType === 3 && childNode.textContent.replace(/\s+/g, '') !== '') {
			clone.textContent = childNode.textContent;
		}

		for (var i = 0, len = computedStyle.length; i < len; i++) {
			var prop = computedStyle[i];
			clone.style[prop] = computedStyle[prop];
		}

		if (excludedElList.indexOf(_el) !== -1) {
			clone.style.visibility = 'hidden';
		}

		Array.from(_el.children).forEach(function (childEl) {
			// if (excludedElList.indexOf(childEl) !== -1) return;
			clone.appendChild(process(childEl));
		});

		return clone;
	}

	var parent = process(el);
	var clientRect = el.getBoundingClientRect();

	var styles = {
		position: 'fixed',
		width: clientRect.width + 'px',
		height: clientRect.height + 'px',
		left: clientRect.left + 'px',
		top: clientRect.top + 'px',
		boxSizing: 'border-box',
		margin: 0,
		pointerEvents: 'none'
	};

	Object.keys(styles).forEach(function (style) {
		parent.style[style] = styles[style];
	});

	return parent;
}

var Morph = (function () {
	_createClass(Morph, null, [{
		key: 'getDefaultSettings',
		value: function getDefaultSettings() {
			return {
				actionType: 'copy', // copy | move | hide
				fromObj: {
					el: null,
					classHidden: null
				},
				toObj: {
					el: null,
					classHidden: null
				},
				childElConfigs: [],
				animationTime: 300,
				animationEasing: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
				destroyAfterAnimationEnd: true
			};
		}
	}]);

	function Morph(settings) {
		_classCallCheck(this, Morph);

		this.settings = Object.assign(Morph.getDefaultSettings(), settings);
		this.createAnimationLayer();
	}

	_createClass(Morph, [{
		key: 'createAnimationLayer',
		value: function createAnimationLayer() {
			var _this = this;

			if (this.parentEl) return;

			this.parentEl = document.createElement('div');
			this.parentEl.className = 'morph-container';

			var fromObj = this.settings.fromObj;
			var toObj = this.settings.toObj;
			// let { fromObj, toObj } = this.settings;
			var excludeFromElList = [];
			var excludeToElList = [];

			this.morphItems = [];

			this.coverTransform = {
				fromObj: {},
				toObj: {}
			};

			var mainAnimation = {
				fromObj: {},
				toObj: {}
			};

			if (this.settings.actionType === 'copy') {
				toObj.el.classList.remove(toObj.classHidden);

				this.coverTransform.fromObj.height = fromObj.el.parentElement.offsetHeight;
				this.coverTransform.toObj.height = toObj.el.parentElement.offsetHeight + 10;

				this.settings.childElConfigs.forEach(function (config) {
					var fromEl = fromObj.el.querySelector(config.fromEl);
					var toEl = toObj.el.querySelector(config.toEl);

					console.log(fromEl, toEl);

					_this.morphItems.push({
						fromObj: {
							el: createGhostElement(fromEl)
						},
						toObj: {
							el: createGhostElement(toEl)
						}
					});
					excludeFromElList.push(fromEl);
					excludeToElList.push(toEl);
				});

				mainAnimation.fromObj.el = createGhostElement(fromObj.el, excludeFromElList);
				mainAnimation.toObj.el = createGhostElement(toObj.el, excludeToElList);

				toObj.el.classList.add(toObj.classHidden);
			} else if (this.settings.actionType === 'move') {

				this.settings.childElConfigs.forEach(function (config) {
					_this.morphItems.push({
						fromObj: {},
						toObj: {}
					});
					excludeFromElList.push(fromObj.el.querySelector(config.fromEl));
					excludeToElList.push(toObj.el.querySelector(config.toEl));
				});

				this.coverTransform.fromObj.height = fromObj.el.parentElement.offsetHeight;

				fromObj.el.classList.add(fromObj.classHidden);
				toObj.el.classList.remove(toObj.classHidden);

				this.coverTransform.toObj.height = toObj.el.parentElement.offsetHeight;

				this.settings.childElConfigs.forEach(function (config, i) {
					_this.morphItems[i].toObj.el = createGhostElement(toObj.el.querySelector(config.toEl));
				});

				mainAnimation.toObj.el = createGhostElement(toObj.el, excludeToElList);

				fromObj.el.classList.remove(fromObj.classHidden);
				toObj.el.classList.add(toObj.classHidden);

				this.settings.childElConfigs.forEach(function (config, i) {
					_this.morphItems[i].fromObj.el = createGhostElement(fromObj.el.querySelector(config.fromEl));
				});

				mainAnimation.fromObj.el = createGhostElement(fromObj.el, excludeFromElList);
			}

			this.morphItems.unshift(mainAnimation);

			this.morphItems.forEach(function (animation) {
				var el = document.createElement('div');
				el.className = 'morph-animation';
				el.appendChild(animation.fromObj.el);
				el.appendChild(animation.toObj.el);
				_this.parentEl.appendChild(el);
			});

			document.body.appendChild(this.parentEl);

			this.reCalculate();

			this.parentEl.style.display = 'none';

			this.atStart = true;

			/*this.coverAnimationPlayer = fromObj.el.parentElement.animate(
   	[
   		{ height: this.coverTransform.fromObj.height + 'px' },
   		{ height: this.coverTransform.toObj.height + 'px' }
   	],
   	playerSettings
   );*/

			/*this.animationList.push({
   	el: fromObj.el.parentElement,
   	fromObj: { height: this.coverTransform.fromObj.height + 'px' },
   	toObj: { height: this.coverTransform.toObj.height + 'px' }
   });*/

			console.timeEnd('Morph instantiating');
		}
	}, {
		key: 'reCalculate',
		value: function reCalculate() {
			var _this2 = this;

			this.animationList = [];

			this.morphItems.forEach(function (morphItem) {
				var _fromElClientRect = morphItem.fromObj.el.getBoundingClientRect();
				var _toElClientRect = morphItem.toObj.el.getBoundingClientRect();

				var fromTransform = getTransformClientRectDiff(_fromElClientRect, _toElClientRect);
				var toTransform = getTransformClientRectDiff(_toElClientRect, _fromElClientRect);

				morphItem.fromObj.el.style.transformOrigin = 'center center';
				morphItem.toObj.el.style.transformOrigin = 'center center';

				_this2.animationList.push({
					el: morphItem.fromObj.el,
					fromObj: {
						transform: 'translate(0, 0) scale(1, 1)',
						opacity: 1
					},
					toObj: {
						transform: '\n\t\t\t\t\t\ttranslate(' + fromTransform.offsetX + 'px, ' + fromTransform.offsetY + 'px)\n\t\t\t\t\t\tscale(' + fromTransform.scaleX + ', ' + fromTransform.scaleY + ')\n\t\t\t\t\t',
						opacity: 0
					}
				});

				_this2.animationList.push({
					el: morphItem.toObj.el,
					fromObj: {
						transform: '\n\t\t\t\t\t\ttranslate(' + toTransform.offsetX + 'px, ' + toTransform.offsetY + 'px)\n\t\t\t\t\t\tscale(' + toTransform.scaleX + ', ' + toTransform.scaleY + ')\n\t\t\t\t\t',
						opacity: 0
					},
					toObj: {
						transform: 'translate(0, 0) scale(1, 1)',
						opacity: 1
					}
				});
			});
		}
	}, {
		key: 'animate',
		value: function animate(callback) {
			var _this3 = this;

			if (this.isAnimating || !this.atStart) return;

			this.isAnimating = true;
			this.parentEl.style.display = 'block';

			animateElements(this.animationList, this.settings.animationTime, this.settings.animationEasing, function () {
				_this3.settings.toObj.el.classList.remove(_this3.settings.toObj.classHidden);
				_this3.parentEl.style.display = 'none';
				_this3.isAnimating = false;
				_this3.atStart = false;

				if (callback) {
					callback();
				}
			});
		}
	}, {
		key: 'reverse',
		value: function reverse() {
			var _this4 = this;

			if (this.isAnimating || this.atStart) return;

			this.isAnimating = true;
			this.parentEl.style.display = 'block';
			this.settings.toObj.el.classList.add(this.settings.toObj.classHidden);

			animateElements(this.animationList, this.settings.animationTime, this.settings.animationEasing, function () {
				_this4.settings.fromObj.el.classList.remove(_this4.settings.fromObj.classHidden);
				_this4.parentEl.style.display = 'none';
				_this4.isAnimating = false;
				_this4.atStart = true;
			}, true);
		}
	}, {
		key: 'removeAnimationLayer',
		value: function removeAnimationLayer() {
			this.parentEl.remove();
		}
	}]);

	return Morph;
})();