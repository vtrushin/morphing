import createGhostElement from './create-ghost-element';
import getTransformClientRectDiff from './get-transform-diff';
import animateElements from './animate-elements';

export default class Morph {

	static getDefaultSettings() {
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
		}
	}

	constructor(settings) {
		this.settings = Object.assign(Morph.getDefaultSettings(), settings);
		this.createAnimationLayer();
	}

	createAnimationLayer() {
		if (this.morphEl) return;

		this.morphEl = document.createElement('div');
		this.morphEl.className = 'morph-container';

		let fromObj = this.settings.from;
		let toObj = this.settings.to;
		// let { fromObj, toObj } = this.settings;
		let excludeFromElList = [];
		let excludeToElList = [];

		this.morphItems = [];

		this.coverTransform = {
			from: {},
			to: {}
		};

		let mainAnimation = {
			from: {},
			to: {}
		};

		if (this.settings.actionType === 'copy') {
			toObj.el.classList.remove(toObj.classHidden);

			this.coverTransform.from.height = fromObj.el.parentElement.offsetHeight;
			this.coverTransform.to.height = toObj.el.parentElement.offsetHeight + 10;

			this.settings.children.forEach(config => {
				let fromEl = fromObj.el.querySelector(config.from);
				let toEl = toObj.el.querySelector(config.to);

				this.morphItems.push({
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

			this.settings.children.forEach(config => {
				this.morphItems.push({
					from: {},
					to: {}
				});
				excludeFromElList.push(fromObj.el.querySelector(config.from));
				excludeToElList.push(toObj.el.querySelector(config.to));
			});


			this.coverTransform.from.height = fromObj.el.parentElement.offsetHeight;

			this.settings.children.forEach((config, i) => {
				this.morphItems[i].from.el = createGhostElement(fromObj.el.querySelector(config.from), excludeFromElList);
			});

			mainAnimation.from.el = createGhostElement(fromObj.el, excludeFromElList);

			fromObj.el.classList.add(fromObj.classHidden);
			toObj.el.classList.remove(toObj.classHidden);

			this.coverTransform.to.height = toObj.el.parentElement.offsetHeight;

			this.settings.children.forEach((config, i) => {
				this.morphItems[i].to.el = createGhostElement(toObj.el.querySelector(config.to), excludeToElList);
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

		this.morphItems.forEach(animation => {
			let el = document.createElement('div');
			el.className = 'morph-animation';
			el.appendChild(animation.from.el);
			el.appendChild(animation.to.el);
			this.morphEl.appendChild(el);
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


	reCalculate() {
		this.animationList = [];

		this.morphItems.forEach(morphItem => {
			let _fromElClientRect = morphItem.from.el.getBoundingClientRect();
			let _toElClientRect = morphItem.to.el.getBoundingClientRect();

			let fromTransform = getTransformClientRectDiff(_fromElClientRect, _toElClientRect);
			let toTransform = getTransformClientRectDiff(_toElClientRect, _fromElClientRect);

			morphItem.from.el.style.transformOrigin = 'center center';
			morphItem.to.el.style.transformOrigin = 'center center';

			this.animationList.push({
				el: morphItem.from.el,
				from: {
					transform: 'translate(0, 0) scale(1, 1)',
					opacity: 1
				},
				to: {
					transform: `
						translate(${fromTransform.offsetX}px, ${fromTransform.offsetY}px)
						scale(${fromTransform.scaleX}, ${fromTransform.scaleY})
					`,
					opacity: 0
				}
			});

			this.animationList.push({
				el: morphItem.to.el,
				from: {
					transform: `
						translate(${toTransform.offsetX}px, ${toTransform.offsetY}px)
						scale(${toTransform.scaleX}, ${toTransform.scaleY})
					`,
					opacity: 0
				},
				to: {
					transform: 'translate(0, 0) scale(1, 1)',
					opacity: 1
				}
			});

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

			Array.from(el.children).forEach(childEl => {
				eachChild(childEl);
			});
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

		this.settings.from.el.parentElement.style.height = this.settings.from.el.parentElement.clientHeight + 'px';

		//this.settings.from.el.classList.add(this.settings.from.classHidden);

		animateElements(this.animationList, this.settings.duration, this.settings.easingFunction, () => {
			this.settings.to.el.classList.remove(this.settings.to.classHidden);


			//this.settings.from.el.classList.remove(this.settings.from.classHidden);
			this.settings.from.el.parentElement.style.height = '';


			if (this.settings.actionType === 'move') {
				this.settings.from.el.classList.add(this.settings.from.classHidden);
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
		this.settings.to.el.classList.add(this.settings.to.classHidden);

		animateElements(this.animationList, this.settings.duration, this.settings.easingFunction, () => {
			this.settings.from.el.classList.remove(this.settings.from.classHidden);
			this.morphEl.style.display = 'none';
			this._isAnimating = false;
			this.atStart = true;
		}, true);
	}

	clear() {
		this.morphEl.remove();
	}

	isAnimating() {
		return this._isAnimating;
	}

}