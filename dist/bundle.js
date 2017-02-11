/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.setStyles = setStyles;
	exports.createElement = createElement;
	exports.setAttributes = setAttributes;
	exports.setDataset = setDataset;
	exports.removeAttributes = removeAttributes;
	function setStyles(element, styles = {}) {
		if (typeof styles == 'string') {
			element.style = styles;
		} else {
			Object.keys(styles).forEach(propertyName => {
				element.style[propertyName] = styles[propertyName];
			});
		}

		return element;
	}

	function createElement(elementName, attributes = []) {
		const element = document.createElement(elementName);

		return setAttributes(element, attributes);
	}

	function setAttributes(element, attributes = []) {
		Object.keys(attributes).forEach(attributeName => {
			if (attributeName === 'style') {
				setStyles(element, attributes[attributeName]);
			} else if (attributeName === 'dataset') {
				setDataset(element, attributes[attributeName]);
			} else {
				element.setAttribute(attributeName, attributes[attributeName]);
			}
		});

		return element;
	}

	function setDataset(element, properties = {}) {
		Object.keys(properties).forEach(propertyName => {
			element.dataset[propertyName] = properties[propertyName];
		});

		return element;
	}

	function removeAttributes(element, attributeNames = []) {
		attributeNames.forEach(attributeName => {
			element.removeAttribute(attributeName);
		});

		return element;
	}
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(0), __webpack_require__(5), __webpack_require__(6), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports, _element, _cloneElement, _offsetTransform, _animateElements) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.mix = mix;

	var _cloneElement2 = _interopRequireDefault(_cloneElement);

	var _offsetTransform2 = _interopRequireDefault(_offsetTransform);

	var _animateElements2 = _interopRequireDefault(_animateElements);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	// import createInlinedElementClone from './create-inlined-element-clone';
	// import GhostElementsBuilder from './ghost-elements-builder';
	const defaultSettings = {
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

	function mix(srcEl, distEl) {
		let srcClientRect = srcEl.getBoundingClientRect();
		let distClientRect = distEl.getBoundingClientRect();

		let srcTransform = (0, _offsetTransform2.default)(srcClientRect, distClientRect);
		let distTransform = (0, _offsetTransform2.default)(distClientRect, srcClientRect);

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

	window.cloneElement = _cloneElement2.default;

	/*window.Morph = class Morph {
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
 };*/
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	'use strict';

	if (!Array.from) {
		Object.defineProperty(Array, 'from', {
			value: function (object) {
				'use strict';

				return Array.prototype.slice.call(object);
			},
			configurable: true,
			writable: true
		});
	}
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	'use strict';

	if (!Object.assign) {
		Object.defineProperty(Object, 'assign', {
			enumerable: false,
			configurable: true,
			writable: true,
			value: function (target, firstSource) {
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = animateElements;
	function animateElements(animationList, duration = 2000, easing = 'ease', callback, isReverse) {
		const settings = {
			duration,
			easing,
			direction: 'alternate',
			fill: 'backwards'
		};

		const keyframeEffects = animationList.map(animation => {
			const frames = isReverse ? [animation.to, animation.from] : [animation.from, animation.to];
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports, _element) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	const ignoredHtmlTags = new Set(['br', 'style', 'script', 'template']);

	function cloneTextNode(node, parent) {
		const parentClientRect = parent.getBoundingClientRect();
		const range = document.createRange();
		range.selectNodeContents(node);
		const textClientRect = range.getBoundingClientRect();
		const textWrapper = (0, _element.createElement)('span', {
			style: {
				position: 'absolute',
				left: textClientRect.left - parentClientRect.left - parent.clientLeft + 'px',
				top: textClientRect.top - parentClientRect.top - parent.clientTop + 'px',
				width: textClientRect.width + 'px',
				height: textClientRect.height + 'px'
			}
		});
		textWrapper.appendChild(node.cloneNode(false));

		return textWrapper;
	}

	function cloneTextarea(node, parent) {}

	function createPseudoElement(style) {
		const content = style.getPropertyValue('content');

		if (['', 'none', 'normal'].includes(content)) {
			return null;
		}

		return (0, _element.createElement)('span', {
			style: style
		});
	}

	function cloneElement(element, excludedElements = new Set(), parent) {
		const clientRect = element.getBoundingClientRect();
		const cloned = element.cloneNode(false);
		const style = window.getComputedStyle(element);
		const before = createPseudoElement(window.getComputedStyle(element, '::before'));
		const after = createPseudoElement(window.getComputedStyle(element, '::after'));
		const { cssText } = style;

		if (element.className) {
			cloned.dataset.class = element.className;
		}

		(0, _element.removeAttributes)(cloned, ['id', 'class']);

		cloned.style = cssText;

		// Save scroll position
		if (['auto', 'scroll'].includes(style.overflow)) {
			(0, _element.setAttributes)(cloned, {
				style: {
					overflow: 'hidden'
				},
				dataset: {
					scrollTop: element.scrollTop,
					scrollLeft: element.scrollLeft
				}
			});
		}

		/*let container;
  // Simulate scroll offset
  if (['auto', 'scroll'].includes(computedStyle.overflow)) {
  	const wrapper = document.createElement('div');
  	const left = parseInt(-element.scrollLeft);
  	const top = parseInt(-element.scrollTop);
  		wrapper.style.transform = `translate(${left}px, ${top}px)`;
  	cloned.style.overflow = 'hidden';
  	cloned.appendChild(wrapper);
  	container = wrapper;
  } else {
  	container = cloned;
  }*/

		if (before) {
			cloned.appendChild(before);
		}

		if (element.tagName.toLowerCase() !== 'textarea') {
			Array.from(element.childNodes).forEach(childEl => {
				switch (childEl.nodeType) {
					case Node.ELEMENT_NODE:
						const tagName = childEl.tagName.toLowerCase();
						if (ignoredHtmlTags.has(tagName)) {
							break;
						}
						/*if (tagName === 'textarea') {
       cloned.appendChild(cloneTextarea(childEl, element));
       break;
       }*/
						cloned.appendChild(cloneElement(childEl, undefined, element));
						break;

					case Node.TEXT_NODE:
						if (childEl.textContent.trim() !== '') {
							cloned.appendChild(cloneTextNode(childEl, element));
						}
						break;
				}
			});
		}

		if (after) {
			cloned.appendChild(after);
		}

		let left, top;
		if (parent) {
			const parentClientRect = parent.getBoundingClientRect();
			left = clientRect.left - parentClientRect.left - parent.clientLeft;
			top = clientRect.top - parentClientRect.top - parent.clientTop;
		} else {
			left = clientRect.left;
			top = clientRect.top;
		}

		console.log(element, left);

		(0, _element.setStyles)(cloned, {
			position: parent ? 'absolute' : 'fixed',
			left: left + 'px',
			top: top + 'px',
			width: clientRect.width + 'px',
			height: clientRect.height + 'px',
			boxSizing: 'border-box',
			margin: 0
		});

		return cloned;
	}

	/*function cloneElement(element, excludedElements = new Set(), parent) {
 	const clientRect = element.getBoundingClientRect();
 	const cloned = element.cloneNode(false);
 	const { cssText } = window.getComputedStyle(element);
 
 	if (element.className) {
 		cloned.dataset.class = element.className;
 	}
 
 	removeAttributes(cloned, ['id', 'class']);
 
 	cloned.style = cssText;
 
 	let left, top;
 	if (parent) {
 		let parentClientRect = parent.getBoundingClientRect();
 		left = clientRect.left - parentClientRect.left - parent.clientLeft;
 		top = clientRect.top - parentClientRect.top - parent.clientTop;
 	} else {
 		left = clientRect.left;
 		top = clientRect.top;
 	}
 
 	setStyles(cloned, {
 		position: parent ? 'absolute' : 'fixed',
 		left: left + 'px',
 		top: top + 'px',
 		width: clientRect.width + 'px',
 		height: clientRect.height + 'px',
 		boxSizing: 'border-box',
 		margin: 0,
 		// pointerEvents: 'none'
 	});
 
 	return cloned;
 }
 
 
 function cloneElementRecursive(element, excludedElements = new Set()) {
 	const cloned = cloneElement(element, excludedElements);
 
 	if (element.tagName.toLowerCase() !== 'textarea') {
 		Array.from(element.childNodes).forEach(childEl => {
 			switch (childEl.nodeType) {
 				case Node.ELEMENT_NODE:
 					const tagName = childEl.tagName.toLowerCase();
 					if (ignoredHtmlTags.has(tagName)) {
 						break;
 					}
 					/!*if (tagName === 'textarea') {
 					 cloned.appendChild(cloneTextarea(childEl, element));
 					 break;
 					 }*!/
 					cloned.appendChild(cloneElement(childEl, undefined, element));
 					break;
 
 				case Node.TEXT_NODE:
 					if (childEl.textContent.trim() !== '') {
 						cloned.appendChild(cloneTextNode(childEl, element));
 					}
 					break;
 			}
 		});
 	}
 }*/

	exports.default = (element, excludedElements) => {
		const cloneElement2 = cloneElement(element, excludedElements);
		cloneElement2.style.left = '300px';
		return cloneElement2;
	};
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = (from, to) => ({
		offsetX: to.left + to.width / 2 - (from.left + from.width / 2),
		offsetY: to.top + to.height / 2 - (from.top + from.height / 2),
		scaleX: to.width / from.width,
		scaleY: to.height / from.height
	});
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(3);
module.exports = __webpack_require__(1);


/***/ })
/******/ ]);