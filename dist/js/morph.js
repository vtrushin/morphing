'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
	'use strict';

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
			var frames = isReverse ? [animation.to, animation.from] : [animation.from, animation.to];

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

			if (computedStyle.overflow === 'auto' || computedStyle.overflow === 'scroll') {
				clone.dataset.scrollTop = _el.scrollTop;
				clone.dataset.scrollLeft = _el.scrollLeft;
			}

			if (childNode && childNode.nodeType === 3 && childNode.textContent.replace(/\s+/g, '') !== '') {
				clone.textContent = childNode.textContent;
			}

			for (var i = 0, len = computedStyle.length; i < len; i++) {
				var prop = computedStyle[i];
				clone.style[prop] = computedStyle[prop];
			}

			if (excludedElList.indexOf(_el) !== -1 && excludedElList[excludedElList.indexOf(_el)] !== el) {
				clone.style.visibility = 'hidden';
				clone.textContent = '';
			} else {
				Array.from(_el.children).forEach(function (childEl) {
					// if (excludedElList.indexOf(childEl) !== -1) return;
					clone.appendChild(process(childEl));
				});
			}

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
					from: {
						el: null,
						classHidden: null
					},
					to: {
						el: null,
						classHidden: null
					},
					children: [],
					duration: 300,
					easingFunction: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
					autoClear: true
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

				if (this.morphEl) return;

				this.morphEl = document.createElement('div');
				this.morphEl.className = 'morph-container';

				var fromObj = this.settings.from;
				var toObj = this.settings.to;
				// let { fromObj, toObj } = this.settings;
				var excludeFromElList = [];
				var excludeToElList = [];

				this.morphItems = [];

				this.coverTransform = {
					from: {},
					to: {}
				};

				var mainAnimation = {
					from: {},
					to: {}
				};

				if (this.settings.actionType === 'copy') {
					toObj.el.classList.remove(toObj.classHidden);

					this.coverTransform.from.height = fromObj.el.parentElement.offsetHeight;
					this.coverTransform.to.height = toObj.el.parentElement.offsetHeight + 10;

					this.settings.children.forEach(function (config) {
						var fromEl = fromObj.el.querySelector(config.from);
						var toEl = toObj.el.querySelector(config.to);

						_this.morphItems.push({
							from: {
								el: createGhostElement(fromEl)
							},
							to: {
								el: createGhostElement(toEl)
							}
						});
						excludeFromElList.push(fromEl);
						excludeToElList.push(toEl);
					});

					mainAnimation.from.el = createGhostElement(fromObj.el, excludeFromElList);
					mainAnimation.to.el = createGhostElement(toObj.el, excludeToElList);

					toObj.el.classList.add(toObj.classHidden);
				} else if (this.settings.actionType === 'move') {

					this.settings.children.forEach(function (config) {
						_this.morphItems.push({
							from: {},
							to: {}
						});
						excludeFromElList.push(fromObj.el.querySelector(config.from));
						excludeToElList.push(toObj.el.querySelector(config.to));
					});

					this.coverTransform.from.height = fromObj.el.parentElement.offsetHeight;

					this.settings.children.forEach(function (config, i) {
						_this.morphItems[i].from.el = createGhostElement(fromObj.el.querySelector(config.from), excludeFromElList);
					});

					mainAnimation.from.el = createGhostElement(fromObj.el, excludeFromElList);

					fromObj.el.classList.add(fromObj.classHidden);
					toObj.el.classList.remove(toObj.classHidden);

					this.coverTransform.to.height = toObj.el.parentElement.offsetHeight;

					this.settings.children.forEach(function (config, i) {
						_this.morphItems[i].to.el = createGhostElement(toObj.el.querySelector(config.to), excludeToElList);
					});

					mainAnimation.to.el = createGhostElement(toObj.el, excludeToElList);

					/*this.coverTransform.from.height = fromObj.el.parentElement.offsetHeight;
     	fromObj.el.classList.add(fromObj.classHidden);
     toObj.el.classList.remove(toObj.classHidden);
     	this.coverTransform.to.height = toObj.el.parentElement.offsetHeight;
     	this.settings.children.forEach((config, i) => {
     	this.morphItems[i].to.el = createGhostElement(toObj.el.querySelector(config.to), excludeToElList);
     });
     	mainAnimation.to.el = createGhostElement(toObj.el, excludeToElList);
     	fromObj.el.classList.remove(fromObj.classHidden);
     toObj.el.classList.add(toObj.classHidden);
     	this.settings.children.forEach((config, i) => {
     	this.morphItems[i].from.el = createGhostElement(fromObj.el.querySelector(config.from), excludeFromElList);
     });
     	mainAnimation.from.el = createGhostElement(fromObj.el, excludeFromElList);*/
				}

				console.log(this.morphItems);

				this.morphItems.unshift(mainAnimation);

				this.morphItems.forEach(function (animation) {
					var el = document.createElement('div');
					el.className = 'morph-animation';
					el.appendChild(animation.from.el);
					el.appendChild(animation.to.el);
					_this.morphEl.appendChild(el);
				});

				document.body.appendChild(this.morphEl);

				this.reCalculate();

				this.morphEl.style.display = 'none';

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
					var _fromElClientRect = morphItem.from.el.getBoundingClientRect();
					var _toElClientRect = morphItem.to.el.getBoundingClientRect();

					var fromTransform = getTransformClientRectDiff(_fromElClientRect, _toElClientRect);
					var toTransform = getTransformClientRectDiff(_toElClientRect, _fromElClientRect);

					morphItem.from.el.style.transformOrigin = 'center center';
					morphItem.to.el.style.transformOrigin = 'center center';

					_this2.animationList.push({
						el: morphItem.from.el,
						from: {
							transform: 'translate(0, 0) scale(1, 1)',
							opacity: 1
						},
						to: {
							transform: '\n\t\t\t\t\t\t\ttranslate(' + fromTransform.offsetX + 'px, ' + fromTransform.offsetY + 'px)\n\t\t\t\t\t\t\tscale(' + fromTransform.scaleX + ', ' + fromTransform.scaleY + ')\n\t\t\t\t\t\t',
							opacity: 0
						}
					});

					_this2.animationList.push({
						el: morphItem.to.el,
						from: {
							transform: '\n\t\t\t\t\t\t\ttranslate(' + toTransform.offsetX + 'px, ' + toTransform.offsetY + 'px)\n\t\t\t\t\t\t\tscale(' + toTransform.scaleX + ', ' + toTransform.scaleY + ')\n\t\t\t\t\t\t',
							opacity: 0
						},
						to: {
							transform: 'translate(0, 0) scale(1, 1)',
							opacity: 1
						}
					});
				});
			}
		}, {
			key: '_fixScrollPosition',
			value: function _fixScrollPosition() {
				function eachChild(el) {
					if (el.dataset.scrollTop) {
						el.scrollTop = el.dataset.scrollTop;
					}

					if (el.dataset.scrollLeft) {
						el.scrollLeft = el.dataset.scrollLeft;
					}

					Array.from(el.children).forEach(function (childEl) {
						eachChild(childEl);
					});
				}
				this.animationList.forEach(function (animation) {
					eachChild(animation.el);
				});
			}
		}, {
			key: 'animate',
			value: function animate(callback) {
				var _this3 = this;

				if (this._isAnimating || !this.atStart) return;

				this._isAnimating = true;
				this.morphEl.style.display = 'block';

				this._fixScrollPosition();

				this.settings.from.el.parentElement.style.height = this.settings.from.el.parentElement.clientHeight + 'px';

				//this.settings.from.el.classList.add(this.settings.from.classHidden);

				animateElements(this.animationList, this.settings.duration, this.settings.easingFunction, function () {
					_this3.settings.to.el.classList.remove(_this3.settings.to.classHidden);

					//this.settings.from.el.classList.remove(this.settings.from.classHidden);
					_this3.settings.from.el.parentElement.style.height = '';

					if (_this3.settings.actionType === 'move') {
						_this3.settings.from.el.classList.add(_this3.settings.from.classHidden);
					}

					_this3.morphEl.style.display = 'none';
					_this3._isAnimating = false;
					_this3.atStart = false;

					if (_this3.settings.autoClear) {
						_this3.clear();
					}

					if (callback) {
						callback();
					}
				});
			}
		}, {
			key: 'reverse',
			value: function reverse() {
				var _this4 = this;

				if (this._isAnimating || this.atStart) return;

				this._isAnimating = true;
				this.morphEl.style.display = 'block';
				this.settings.to.el.classList.add(this.settings.to.classHidden);

				animateElements(this.animationList, this.settings.duration, this.settings.easingFunction, function () {
					_this4.settings.from.el.classList.remove(_this4.settings.from.classHidden);
					_this4.morphEl.style.display = 'none';
					_this4._isAnimating = false;
					_this4.atStart = true;
				}, true);
			}
		}, {
			key: 'clear',
			value: function clear() {
				this.morphEl.remove();
			}
		}, {
			key: 'isAnimating',
			value: function isAnimating() {
				return this._isAnimating;
			}
		}]);

		return Morph;
	})();

	window.Morph = Morph;
})();