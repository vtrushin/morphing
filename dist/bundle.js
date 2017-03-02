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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(4), __webpack_require__(5), __webpack_require__(11), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports, _element, _cloneElement, _offsetTransform, _animateElements) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(4), __webpack_require__(6), __webpack_require__(8), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports, _element, _textNode, _element2, _textAreaElement) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.default = clone;

		var _textNode2 = _interopRequireDefault(_textNode);

		var _element3 = _interopRequireDefault(_element2);

		var _textAreaElement2 = _interopRequireDefault(_textAreaElement);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		/*function createPseudoElement(style) {
	 	const content = style.getPropertyValue('content');
	 	if (['', 'none', 'normal'].includes(content)) {
	 		return null;
	 	}
	 	return {
	 		node: document.createElement('span'),
	 		style: style
	 	};
	 }*/

		function parseCssPxValue(value) {
			return Number(value.replace('px', ''));
		}
		// import {stylesToCssText} from './utils/styles';
		function clone(element) {
			let i = 0;
			let css = '';

			function process(element, contextElement) {
				let cloned = null;
				const clonedOneLevelElement = (0, _textNode2.default)(element, contextElement) || (0, _textAreaElement2.default)(element, contextElement);

				if (clonedOneLevelElement) {
					cloned = clonedOneLevelElement;
				} else {
					const clonedDeepElement = (0, _element3.default)(element, contextElement);
					if (clonedDeepElement) {
						Array.from(element.childNodes).forEach(child => {
							const clonedChild = process(child, clonedDeepElement);
							if (clonedChild) {
								clonedDeepElement.element.appendChild(clonedChild);
							}
						});
						cloned = clonedDeepElement;
					}
				}

				if (!cloned) {
					return null;
				}

				if (cloned.computedStyle) {
					(0, _element.setStyles)(cloned.element, cloned.computedStyle.cssText);
				}

				let styles = {
					width: cloned.clientRect.width + 'px',
					height: cloned.clientRect.height + 'px',
					boxSizing: 'border-box',
					margin: 0
				};

				let position;
				let left = cloned.clientRect.left;
				let top = cloned.clientRect.top;

				if (contextElement) {
					position = 'absolute';
					left -= contextElement.clientRect.left - contextElement.element.clientLeft;
					top -= contextElement.clientRect.top - contextElement.element.clientTop;

					if (contextElement.computedStyle) {
						left -= parseCssPxValue(contextElement.computedStyle.borderLeftWidth);
						top -= parseCssPxValue(contextElement.computedStyle.borderTopWidth);
					}
				} else {
					position = 'fixed';
					left += 300;
				}

				Object.assign(styles, {
					position,
					left: left + 'px',
					top: top + 'px'
				});

				(0, _element.setStyles)(cloned.element, styles);

				if (cloned.styles) {
					(0, _element.setStyles)(cloned.element, cloned.styles);
				}

				/*const className = `morph-el-${i}`;
	   css += `
	   	.${className} {
	   		${cloned.css}
	   	}
	   `;
	   i ++;
	   cloned.node.className = className;*/
				return cloned.element;
			}

			let cloned = process(element, null);

			/*const style = document.createElement('style');
	  style.textContent = css;
	  	process_.appendChild(style);*/

			// console.log(cloned);

			return cloned;
		}
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.default = cloneTextNode;
		function cloneTextNode(node) {
			if (!(node instanceof Text) || node.textContent.trim() === '') {
				return null;
			}

			const clonedText = node.cloneNode(false);
			const range = document.createRange();
			range.selectNodeContents(node);
			const clientRect = range.getBoundingClientRect();
			const wrapper = document.createElement('span');
			wrapper.appendChild(clonedText);

			return {
				element: wrapper,
				clientRect
			};
		}
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports, _element) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.default = cloneElement;


		const ignoredHtmlTags = new Set(['br', 'style', 'script', 'template']);

		function isIgnoredElement(element) {
			return ignoredHtmlTags.has(element.tagName.toLowerCase());
		}

		function cloneElement(element) {
			if (!(element instanceof HTMLElement) || isIgnoredElement(element)) {
				return null;
			}

			const clientRect = element.getBoundingClientRect();
			const cloned = element.cloneNode(false);
			const computedStyle = window.getComputedStyle(element);
			const dataset = {};
			const styles = {};

			if (element.className) {
				dataset.class = element.className;
			}

			(0, _element.removeAttributes)(cloned, ['id', 'class']);

			// Save scroll position
			if (['auto', 'scroll'].includes(computedStyle.overflow)) {
				styles.overflow = 'hidden';
				Object.assign(dataset, {
					scrollLeft: element.scrollLeft,
					scrollTop: element.scrollTop
				});
			}

			return {
				element: cloned,
				clientRect,
				styles,
				computedStyle,
				attributes: {
					dataset
				}
			};
		}
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports, _element) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.default = cloneTextAreaElement;

		var _element2 = _interopRequireDefault(_element);

		function _interopRequireDefault(obj) {
			return obj && obj.__esModule ? obj : {
				default: obj
			};
		}

		function cloneTextAreaElement(element) {
			return element instanceof HTMLTextAreaElement ? (0, _element2.default)(element) : null;
		}
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
			value: true
		});
		exports.default = animateElements;
		function animateElements(list, duration = 2000, easing = 'ease', callback, isReverse) {
			const settings = {
				duration,
				easing,
				direction: 'alternate',
				fill: 'backwards'
			};

			const keyframeEffects = list.map(animation => {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ]);