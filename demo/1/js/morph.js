// import cloneElement from './cloneElement.js';
// import createFlattenCopyOfElement from './createFlattenCopyOfElement.js';

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
				destroyAfterAnimationEnd: true
			};
		}
	}, {
		key: '_getTransformClientRectDiff',
		value: function _getTransformClientRectDiff(aCR, bCR) {
			return {
				offsetX: bCR.left + bCR.width / 2 - (aCR.left + aCR.width / 2),
				offsetY: bCR.top + bCR.height / 2 - (aCR.top + aCR.height / 2),
				scaleX: bCR.width / aCR.width,
				scaleY: bCR.height / aCR.height
			};
		}
	}, {
		key: '_copyElement',
		value: function _copyElement(el) {
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

			var cover = process(el);
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
				cover.style[style] = styles[style];
			});

			return cover;
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

			if (this.coverEl) return;

			this.coverEl = document.createElement('div');
			this.coverEl.className = 'morph-container';

			var fromObj = this.settings.fromObj;
			var toObj = this.settings.toObj;
			// let { fromObj, toObj } = this.settings;
			var excludeFromElList = [];
			var excludeToElList = [];

			this.coverAnimation = {
				fromObj: {},
				toObj: {}
			};
			this.animationList = [];

			this.settings.childElConfigs.forEach(function (config) {
				_this.animationList.push({
					fromObj: {},
					toObj: {}
				});
				excludeFromElList.push(fromObj.el.querySelector(config.fromEl));
				excludeToElList.push(toObj.el.querySelector(config.toEl));
			});

			var mainAnimation = {
				fromObj: {},
				toObj: {}
			};

			this.coverAnimation.fromObj.height = fromObj.el.parentElement.offsetHeight;

			fromObj.el.classList.add(fromObj.classHidden);
			toObj.el.classList.remove(toObj.classHidden);

			this.coverAnimation.toObj.height = toObj.el.parentElement.offsetHeight;

			this.settings.childElConfigs.forEach(function (config, i) {
				_this.animationList[i].toObj.el = Morph._copyElement(toObj.el.querySelector(config.toEl));
			});

			mainAnimation.toObj.el = Morph._copyElement(toObj.el, excludeToElList);

			fromObj.el.classList.remove(fromObj.classHidden);
			toObj.el.classList.add(toObj.classHidden);

			this.settings.childElConfigs.forEach(function (config, i) {
				_this.animationList[i].fromObj.el = Morph._copyElement(fromObj.el.querySelector(config.fromEl));
			});

			mainAnimation.fromObj.el = Morph._copyElement(fromObj.el, excludeFromElList);

			this.animationList.unshift(mainAnimation);

			fromObj.el.classList.add(fromObj.classHidden);
			toObj.el.classList.add(toObj.classHidden);

			// fromObj.el.style.visibility = 'hidden';
			// toObj.el.style.visibility = 'hidden';

			this.animationList.forEach(function (animation) {
				var el = document.createElement('div');
				el.className = 'morph-animation';
				el.appendChild(animation.fromObj.el);
				el.appendChild(animation.toObj.el);
				_this.coverEl.appendChild(el);
				//animation.toObj.el.style.opacity = 0;
			});

			document.body.appendChild(this.coverEl);

			console.log(this.coverAnimation);

			//fromObj.el.style.display = 'none';
			//toObj.el.style.display = 'none';

			this.coverAnimationPlayer = fromObj.el.parentElement.animate([{
				height: this.coverAnimation.fromObj.height + 'px'
			}, {
				height: this.coverAnimation.toObj.height + 'px'
			}], {
				duration: this.settings.animationTime,
				fill: 'forwards'
			});

			this.coverAnimationPlayer.pause();

			this.animationList.forEach(function (animation) {
				var _fromElClientRect = animation.fromObj.el.getBoundingClientRect();
				var _toElClientRect = animation.toObj.el.getBoundingClientRect();

				animation.fromObj.el.style.transformOrigin = 'center center';
				animation.toObj.el.style.transformOrigin = 'center center';

				animation.fromObj.transform = Morph._getTransformClientRectDiff(_fromElClientRect, _toElClientRect);
				animation.fromObj.player = animation.fromObj.el.animate([{
					transform: 'translate(0, 0) scale(1, 1)',
					opacity: 1
				}, {
					transform: '\n\t\t\t\t\t\t\ttranslate(' + animation.fromObj.transform.offsetX + 'px, ' + animation.fromObj.transform.offsetY + 'px)\n\t\t\t\t\t\t\tscale(' + animation.fromObj.transform.scaleX + ', ' + animation.fromObj.transform.scaleY + ')\n\t\t\t\t\t\t',
					opacity: 0
				}], {
					duration: _this.settings.animationTime,
					//easing: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
					fill: 'forwards'
				});

				animation.fromObj.player.pause();
				animation.fromObj.player.addEventListener('finish', function () {
					console.log(3);
				});

				animation.fromObj.player.onfinish = function () {
					console.log(22);
				};

				animation.toObj.transform = Morph._getTransformClientRectDiff(_toElClientRect, _fromElClientRect);
				animation.toObj.player = animation.toObj.el.animate([{
					transform: '\n\t\t\t\t\t\t\ttranslate(' + animation.toObj.transform.offsetX + 'px, ' + animation.toObj.transform.offsetY + 'px)\n\t\t\t\t\t\t\tscale(' + animation.toObj.transform.scaleX + ', ' + animation.toObj.transform.scaleY + ')\n\t\t\t\t\t\t',
					opacity: 0
				}, {
					transform: 'translate(0, 0) scale(1, 1)',
					opacity: 1
				}], {
					duration: _this.settings.animationTime,
					//easing: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
					fill: 'forwards'
				});

				animation.toObj.player.pause();

				console.log(animation.toObj.player);
			});

			console.timeEnd('Morph instantiating');
		}
	}, {
		key: 'animate',
		value: function animate() {
			this.coverAnimationPlayer.play();
			//this.coverAnimationPlayer.currentTime = 0;
			this.animationList.forEach(function (animation) {
				//animation.fromObj.player.currentTime = 0;
				animation.fromObj.player.play();
				animation.toObj.player.play();
			});
		}
	}, {
		key: 'reverse',
		value: function reverse() {
			this.coverAnimationPlayer.reverse();
			this.animationList.forEach(function (animation) {
				animation.fromObj.player.reverse();
				animation.toObj.player.reverse();
			});
		}
	}, {
		key: 'stepTo',
		value: function stepTo(pos) {
			var _this2 = this;

			this.coverAnimationPlayer.pause();
			this.animationList.forEach(function (animation) {
				animation.fromObj.player.pause();
				animation.toObj.player.pause();
			});

			if (pos === 0 || pos === 1) {
				this.settings.fromObj.el.parentElement.height = '';
				this.coverEl.style.display = 'none';
			} else {
				this.coverEl.style.display = 'block';
			}

			if (pos === 0) {
				this.onAtStart();
			} else if (pos === 1) {
				this.onAtEnd();

				//this.settings.
			} else {
				this.settings.fromObj.el.classList.add(this.settings.fromObj.classHidden);
				this.settings.toObj.el.classList.add(this.settings.toObj.classHidden);
			}

			this.coverAnimationPlayer.currentTime = pos * this.settings.animationTime;

			this.animationList.forEach(function (animation) {
				animation.fromObj.player.currentTime = pos * _this2.settings.animationTime;
				animation.toObj.player.currentTime = pos * _this2.settings.animationTime;
			});
		}
	}, {
		key: 'onAtStart',
		value: function onAtStart() {
			this.settings.fromObj.el.classList.remove(this.settings.fromObj.classHidden);
		}
	}, {
		key: 'onAtEnd',
		value: function onAtEnd() {
			this.settings.toObj.el.classList.remove(this.settings.toObj.classHidden);
		}
	}, {
		key: 'removeAnimationLayer',
		value: function removeAnimationLayer() {
			/*this.settings.fromObj.el.style.display = 'block';
			 this.settings.toObj.el.style.display = 'block';*/

			this.coverEl.remove();
			delete this.coverEl;
		}
	}, {
		key: 'step',
		value: function step(position) {}
	}, {
		key: 'onChange',
		value: function onChange(fn) {
			if (!fn) return;
		}
	}]);

	return Morph;
})();