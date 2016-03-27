'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function getTransformClientRectDiff(aCR, bCR) {
	return {
		offsetX: bCR.left + bCR.width / 2 - (aCR.left + aCR.width / 2),
		offsetY: bCR.top + bCR.height / 2 - (aCR.top + aCR.height / 2),
		scaleX: bCR.width / aCR.width,
		scaleY: bCR.height / aCR.height
	};
}

function mix(srcEl, distEl) {
	var srcClientRect = srcEl.getBoundingClientRect();
	var distClientRect = distEl.getBoundingClientRect();

	var srcTransform = getTransformClientRectDiff(srcClientRect, distClientRect);
	var distTransform = getTransformClientRectDiff(distClientRect, srcClientRect);

	srcEl.style.transformOrigin = 'center center';
	distEl.style.transformOrigin = 'center center';

	return {
		src: {
			transform: '\n\t\t\t\ttranslate(' + srcTransform.offsetX + 'px, ' + srcTransform.offsetY + 'px)\n\t\t\t\tscale(' + srcTransform.scaleX + ', ' + srcTransform.scaleY + ')\n\t\t\t',
			opacity: 0
		},
		dist: {
			transform: '\n\t\t\t\ttranslate(' + distTransform.offsetX + 'px, ' + distTransform.offsetY + 'px)\n\t\t\t\tscale(' + distTransform.scaleX + ', ' + distTransform.scaleY + ')\n\t\t\t',
			opacity: 0
		}
	};
}

function fade(src) {
	return {};
}

function slideLeft(src, dist) {
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

function slideRight(src, dist) {
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

var transitionEffects = Object.freeze({
	mix: mix,
	fade: fade,
	slideLeft: slideLeft,
	slideRight: slideRight
});

// import defaultStyles from './default-computed-styles';

function getComputedStyleCssText(style) {
	var cssText = '';
	if (style.cssText != '') {
		return style.cssText;
	}
	for (var i = 0; i < style.length; i++) {
		cssText += style[i] + ": " + style.getPropertyValue(style[i]) + "; ";
	}
	return cssText;
}

var isIE = ('currentStyle' in HTMLElement.prototype);
var defaultStyles = {};

var GhostElementsBuilder = (function () {
	function GhostElementsBuilder() {
		_classCallCheck(this, GhostElementsBuilder);

		this.elementsCount = 0;
		this.styles = '';
		this.styleEl = document.createElement('style');
		this.styleEl.type = 'text/css';
		document.head.appendChild(this.styleEl);

		//if (isIE) {
		console.log(222);

		var div = document.createElement('div');
		var fragment = document.createDocumentFragment();
		fragment.appendChild(div);
		var styles = window.getComputedStyle(div);
		// let styles = div.currentStyle;
		for (var i = 0; i < styles.length; i++) {
			var prop = styles[i];
			var value = styles[prop];
			defaultStyles[prop] = value;
		}
		//}
	}

	_createClass(GhostElementsBuilder, [{
		key: 'create',
		value: function create(el) {
			var _this = this;

			var excludedElList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

			var childElementsCount = 0;

			var process = function process(_el) {
				var clone = _el.cloneNode(false);
				var childNode = _el.childNodes[0];
				var computedStyle = window.getComputedStyle(_el);
				var cssClassName = 'el' + _this.elementsCount + childElementsCount;

				clone.setAttribute('data-class', clone.className);
				// clone.removeAttribute('class');
				clone.className = cssClassName;
				clone.removeAttribute('id');

				// clone.style.transformStyle = 'flat';

				// Save scroll position
				if (computedStyle.overflow === 'auto' || computedStyle.overflow === 'scroll') {
					clone.style.overflow = 'hidden';
					clone.dataset.scrollTop = _el.scrollTop;
					clone.dataset.scrollLeft = _el.scrollLeft;
				}

				if (childNode && childNode.nodeType === 3 && childNode.textContent.replace(/\s+/g, '') !== '') {
					clone.textContent = childNode.textContent;
				}

				if (isIE) {
					var _styles = '';
					var count = 0;
					for (var i = 0; i < computedStyle.length; i++) {
						var prop = computedStyle[i];
						var value = computedStyle[prop];
						if (defaultStyles[prop] !== value) {
							count++;
							_styles += prop + ': ' + value + '; ';
						}
					}
					_this.styles += '.' + cssClassName + ' { ' + _styles + ' }';
				} else {
					_this.styles += '.' + cssClassName + ' { ' + getComputedStyleCssText(computedStyle) + ' }';
				}

				childElementsCount++;

				if (excludedElList.indexOf(_el) !== -1 && excludedElList[excludedElList.indexOf(_el)] !== el) {
					clone.style.visibility = 'hidden';
					clone.textContent = '';
				} else {
					for (var i = 0; i < _el.children.length; i++) {
						// if (excludedElList.indexOf(childEl) !== -1) return;
						clone.appendChild(process(_el.children[i]));
					}
					/*Array.from(_el.children).forEach(childEl => {
      // if (excludedElList.indexOf(childEl) !== -1) return;
      clone.appendChild(process(childEl));
      });*/
				}

				return clone;
			};

			// console.time('timer');

			var parent = process(el);

			var clientRect = el.getBoundingClientRect();

			var styles = {
				position: 'absolute',
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

			// console.timeEnd('timer');

			this.elementsCount++;

			return parent;
		}
	}, {
		key: 'applyStyles',
		value: function applyStyles() {
			this.styleEl.textContent = this.styles;
		}
	}, {
		key: 'clear',
		value: function clear() {
			document.head.removeChild(this.styleEl);
		}
	}]);

	return GhostElementsBuilder;
})();

function animateElements(animationList, duration, easing, callback, isReverse) {
	var settings = {
		duration: duration,
		easing: easing,
		direction: 'alternate',
		fill: 'backwards'
	};

	var keyframeEffects = animationList.map(function (animation) {
		var frames = isReverse ? [animation.to, animation.from] : [animation.from, animation.to];
		return new KeyframeEffect(animation.el, frames, settings);
	});

	var groupEffect = new GroupEffect(keyframeEffects);
	var player = document.timeline.play(groupEffect);

	if (callback) {
		player.onfinish = callback;
	}
}

var defaultSettings = {
	type: 'copy',
	src: {
		el: null,
		classHidden: null
	},
	dist: {
		el: null,
		classHidden: null
	},
	partials: [],
	context: null,
	duration: 300,
	easing: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
	autoClear: false
};

var Morph = (function () {

	/*static getDefaultSettings() {
 	return {
 		type: 'copy', // copy | move
 		src: {
 			el: null,
 			classHidden: null
 		},
 		dist: {
 			el: null,
 			classHidden: null
 		},
 		partials: [],
 		context: document.body,
 		duration: 300,
 		easing: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
 		autoClear: false
 	}
 }*/

	function Morph(settings) {
		_classCallCheck(this, Morph);

		console.time('constructor');
		this.settings = Object.assign({}, defaultSettings, { context: document.body }, settings);
		this.ghostElementsBuilder = new GhostElementsBuilder();
		this.morphEl = document.createElement('div');
		this.morphEl.className = 'morph-container';
		this.init();
		console.timeEnd('constructor');
	}

	_createClass(Morph, [{
		key: 'init',
		value: function init() {
			var _this2 = this;

			var src = this.settings.src;
			var dist = this.settings.dist;

			var excludeSrcElList = [];
			var excludeDistElList = [];

			this.morphItems = [];

			var partials = this.settings.partials.map(function (setting) {
				return {
					srcEl: src.el.querySelector(setting.src),
					distEl: dist.el.querySelector(setting.dist)
				};
			});

			partials.forEach(function (partial) {
				var morphItem = {
					src: {},
					dist: {}
				};
				_this2.morphItems.push(morphItem);
				excludeSrcElList.push(partial.srcEl);
				excludeDistElList.push(partial.distEl);
			});

			/*this.coverTransform = {
   	src: {},
   	dist: {}
   };*/

			var mainMorph = {
				src: {},
				dist: {}
			};

			if (this.settings.type === 'copy') {
				dist.el.classList.remove(dist.classHidden);

				// this.coverTransform.src.height = src.el.parentElement.offsetHeight;
				// this.coverTransform.dist.height = dist.el.parentElement.offsetHeight + 10;

				partials.forEach(function (partial, i) {
					var morphItem = _this2.morphItems[i];
					morphItem.src.el = _this2.ghostElementsBuilder.create(partial.srcEl);
					morphItem.dist.el = _this2.ghostElementsBuilder.create(partial.distEl);
				});

				mainMorph.src.el = this.ghostElementsBuilder.create(src.el, excludeSrcElList);
				mainMorph.dist.el = this.ghostElementsBuilder.create(dist.el, excludeDistElList);

				dist.el.classList.add(dist.classHidden);
			} else if (this.settings.type === 'move') {

				// this.coverTransform.src.height = src.el.parentElement.offsetHeight;

				partials.forEach(function (partial, i) {
					_this2.morphItems[i].src.el = _this2.ghostElementsBuilder.create(partial.srcEl, excludeSrcElList);
				});

				mainMorph.src.el = this.ghostElementsBuilder.create(src.el, excludeSrcElList);

				src.el.classList.add(src.classHidden);
				dist.el.classList.remove(dist.classHidden);

				// this.coverTransform.dist.height = dist.el.parentElement.offsetHeight;

				partials.forEach(function (partial, i) {
					_this2.morphItems[i].dist.el = _this2.ghostElementsBuilder.create(partial.distEl, excludeDistElList);
				});

				mainMorph.dist.el = this.ghostElementsBuilder.create(dist.el, excludeDistElList);
			}

			this.ghostElementsBuilder.applyStyles();

			this.morphItems.unshift(mainMorph);

			this.morphItems.forEach(function (morphItem) {
				var el = document.createElement('div');
				el.className = 'morph-animation';
				el.appendChild(morphItem.src.el);
				el.appendChild(morphItem.dist.el);
				_this2.morphEl.appendChild(el);
			});

			this.settings.context.appendChild(this.morphEl);

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
		}
	}, {
		key: 'reCalculate',
		value: function reCalculate() {
			var _this3 = this;

			this.animationList = [];

			this.morphItems.forEach(function (morphItem) {
				var srcEl = morphItem.src.el;
				var distEl = morphItem.dist.el;

				var effectFn = Morph.effects.mix;
				var effect = undefined;

				var srcAnimation = {};
				var distAnimation = {};

				if ('effect' in morphItem) {
					if (typeof morphItem.effect === 'string' && morphItem.effect in Morph.effects) {
						effectFn = Morph.effects[morphItem.effect];
					} else if (typeof morphItem.effect === 'function') {
						effectFn = morphItem.effect;
					} else {
						throw new Error('effect param must be string or function');
					}
				}

				effect = effectFn(srcEl, distEl);

				srcAnimation.from = {};
				srcAnimation.to = effect.src;
				Object.keys(effect.src).forEach(function (cssProp) {
					srcAnimation.from[cssProp] = window.getComputedStyle(srcEl).getPropertyValue(cssProp);
				});

				distAnimation.from = effect.dist;
				distAnimation.to = {};
				Object.keys(effect.dist).forEach(function (cssProp) {
					distAnimation.to[cssProp] = window.getComputedStyle(srcEl).getPropertyValue(cssProp);
				});

				_this3.animationList.push({
					el: srcEl,
					from: srcAnimation.from,
					to: srcAnimation.to
				}, {
					el: distEl,
					from: distAnimation.from,
					to: distAnimation.to
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

				Array.from(el.children).forEach(eachChild);
			}

			this.animationList.forEach(function (animation) {
				eachChild(animation.el);
			});
		}
	}, {
		key: 'animate',
		value: function animate(callback) {
			var _this4 = this;

			if (this._isAnimating || !this.atStart) return;

			this._isAnimating = true;
			this.morphEl.style.display = 'block';

			this._fixScrollPosition();

			this.settings.src.el.parentElement.style.height = this.settings.src.el.parentElement.clientHeight + 'px';

			//this.settings.from.el.classList.add(this.settings.from.classHidden);
			this.settings.dist.el.classList.add(this.settings.dist.classHidden);

			animateElements(this.animationList, this.settings.duration, this.settings.easingFunction, function () {
				_this4.settings.dist.el.classList.remove(_this4.settings.dist.classHidden);

				//this.settings.from.el.classList.remove(this.settings.from.classHidden);
				_this4.settings.src.el.parentElement.style.height = '';

				if (_this4.settings.actionType === 'move') {
					_this4.settings.src.el.classList.add(_this4.settings.src.classHidden);
				}

				_this4.morphEl.style.display = 'none';
				_this4._isAnimating = false;
				_this4.atStart = false;

				if (_this4.settings.autoClear) {
					_this4.clear();
				}

				if (callback) {
					callback();
				}
			});
		}
	}, {
		key: 'reverse',
		value: function reverse() {
			var _this5 = this;

			if (this._isAnimating || this.atStart) return;

			this._isAnimating = true;
			this.morphEl.style.display = 'block';
			this.settings.dist.el.classList.add(this.settings.dist.classHidden);

			animateElements(this.animationList, this.settings.duration, this.settings.easingFunction, function () {
				_this5.settings.src.el.classList.remove(_this5.settings.src.classHidden);
				_this5.morphEl.style.display = 'none';
				_this5._isAnimating = false;
				_this5.atStart = true;
			}, true);
		}
	}, {
		key: 'clear',
		value: function clear() {
			this.settings.context.removeChild(this.morphEl);
			this.ghostElementsBuilder.clear();
		}
	}, {
		key: 'isAnimating',
		value: function isAnimating() {
			return this._isAnimating;
		}
	}]);

	return Morph;
})();

Morph.effects = transitionEffects;

if (!Object.assign) {
	Object.defineProperty(Object, 'assign', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function value(target, firstSource) {
			'use strict';
			if (target === undefined || target === null) {
				throw new TypeError('Cannot convert first argument to object');
			}

			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) {
					continue;
				}

				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
			return to;
		}
	});
}

if (!Array.from) {
	Object.defineProperty(Array, 'from', {
		value: function value(object) {
			'use strict';
			return Array.prototype.slice.call(object);
		},
		configurable: true,
		writable: true
	});
}

window.Morph = Morph;