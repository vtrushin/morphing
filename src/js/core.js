import GhostElementsBuilder from './ghost-elements-builder';
import getTransformClientRectDiff from './get-transform-diff';
import animateElements from './animate-elements';
import * as transitionEffects from './transitionEffects';

export default class Morph {

	static getDefaultSettings() {
		return {
			type: 'copy', // copy | move | hide
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
			autoClear: true
		}
	}

	constructor(settings) {
		console.time('constructor');
		this.settings = Object.assign(Morph.getDefaultSettings(), settings);
		this.ghostElementsBuilder = new GhostElementsBuilder();
		this.morphEl = document.createElement('div');
		this.morphEl.className = 'morph-container';

		this.init();
		console.timeEnd('constructor');
	}

	init() {
		let src = this.settings.src;
		let dist = this.settings.dist;

		let excludeSrcElList = [];
		let excludeDistElList = [];

		this.morphItems = [];

		let partials = this.settings.partials.map(setting => {
			return {
				srcEl: src.el.querySelector(setting.src),
				distEl: dist.el.querySelector(setting.dist)
			};
		});

		partials.forEach(partial => {
			let morphItem = {
				src: {},
				dist: {}
			};
			this.morphItems.push(morphItem);
			excludeSrcElList.push(partial.srcEl);
			excludeDistElList.push(partial.distEl);
		});

		/*this.coverTransform = {
			src: {},
			dist: {}
		};*/

		let mainMorph = {
			src: {},
			dist: {}
		};

		if (this.settings.type === 'copy') {
			dist.el.classList.remove(dist.classHidden);

			// this.coverTransform.src.height = src.el.parentElement.offsetHeight;
			// this.coverTransform.dist.height = dist.el.parentElement.offsetHeight + 10;

			partials.forEach((partial, i) => {
				let morphItem = this.morphItems[i];
				morphItem.src.el = this.ghostElementsBuilder.create(partial.srcEl);
				morphItem.dist.el = this.ghostElementsBuilder.create(partial.distEl);
			});

			mainMorph.src.el = this.ghostElementsBuilder.create(src.el, excludeSrcElList);
			mainMorph.dist.el = this.ghostElementsBuilder.create(dist.el, excludeDistElList);

			dist.el.classList.add(dist.classHidden);


		} else if (this.settings.type === 'move') {

			// this.coverTransform.src.height = src.el.parentElement.offsetHeight;

			partials.forEach((partial, i) => {
				this.morphItems[i].src.el = this.ghostElementsBuilder.create(partial.srcEl, excludeSrcElList);
			});

			mainMorph.src.el = this.ghostElementsBuilder.create(src.el, excludeSrcElList);

			src.el.classList.add(src.classHidden);
			dist.el.classList.remove(dist.classHidden);

			// this.coverTransform.dist.height = dist.el.parentElement.offsetHeight;

			partials.forEach((partial, i) => {
				this.morphItems[i].dist.el = this.ghostElementsBuilder.create(partial.distEl, excludeDistElList);
			});

			mainMorph.dist.el = this.ghostElementsBuilder.create(dist.el, excludeDistElList);
		}

		this.morphItems.unshift(mainMorph);

		this.morphItems.forEach(morphItem => {
			let el = document.createElement('div');
			el.className = 'morph-animation';
			el.appendChild(morphItem.src.el);
			el.appendChild(morphItem.dist.el);
			this.morphEl.appendChild(el);
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

	reCalculate() {
		this.animationList = [];

		this.morphItems.forEach(morphItem => {
			let srcEl = morphItem.src.el;
			let distEl = morphItem.dist.el;

			let effectFn = Morph.effects.mix;
			let effect;

			let srcAnimation = {};
			let distAnimation = {};

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
			Object.keys(effect.src).forEach(cssProp => {
				srcAnimation.from[cssProp] = window.getComputedStyle(srcEl).getPropertyValue(cssProp);
			});

			distAnimation.from = effect.dist;
			distAnimation.to = {};
			Object.keys(effect.dist).forEach(cssProp => {
				distAnimation.to[cssProp] = window.getComputedStyle(srcEl).getPropertyValue(cssProp);
			});

			this.animationList.push(
				{
					el: srcEl,
					from: srcAnimation.from,
					to: srcAnimation.to
				},
				{
					el: distEl,
					from: distAnimation.from,
					to: distAnimation.to
				}
			);
		});
	}

	_fixScrollPosition() {
		function eachChild(el) {
			if (el.dataset.scrollTop) {
				el.scrollTop = el.dataset.scrollTop;
			}

			if (el.dataset.scrollLeft) {
				el.scrollLeft = el.dataset.scrollLeft;
			}

			Array.from(el.children).forEach(eachChild);
		}

		this.animationList.forEach(animation => {
			eachChild(animation.el);
		});
	}

	animate(callback) {
		if (this._isAnimating || !this.atStart) return;

		this._isAnimating = true;
		this.morphEl.style.display = 'block';

		this._fixScrollPosition();

		this.settings.src.el.parentElement.style.height = this.settings.src.el.parentElement.clientHeight + 'px';

		//this.settings.from.el.classList.add(this.settings.from.classHidden);
		this.settings.dist.el.classList.add(this.settings.dist.classHidden);

		animateElements(this.animationList, this.settings.duration, this.settings.easingFunction, () => {
			this.settings.dist.el.classList.remove(this.settings.dist.classHidden);

			//this.settings.from.el.classList.remove(this.settings.from.classHidden);
			this.settings.src.el.parentElement.style.height = '';

			if (this.settings.actionType === 'move') {
				this.settings.src.el.classList.add(this.settings.src.classHidden);
			}

			this.morphEl.style.display = 'none';
			this._isAnimating = false;
			this.atStart = false;

			if (this.settings.autoClear) {
				this.clear();
			}

			if (callback) {
				callback();
			}
		});
	}

	reverse() {
		if (this._isAnimating || this.atStart) return;

		this._isAnimating = true;
		this.morphEl.style.display = 'block';
		this.settings.dist.el.classList.add(this.settings.dist.classHidden);

		animateElements(this.animationList, this.settings.duration, this.settings.easingFunction, () => {
			this.settings.src.el.classList.remove(this.settings.src.classHidden);
			this.morphEl.style.display = 'none';
			this._isAnimating = false;
			this.atStart = true;
		}, true);
	}

	clear() {
		this.settings.context.removeChild(this.morphEl);
		this.ghostElementsBuilder.clear();
	}

	isAnimating() {
		return this._isAnimating;
	}

}

Morph.effects = transitionEffects;