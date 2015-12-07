import createGhostElement from './create-ghost-element';
import getTransformClientRectDiff from './get-transform-diff';
import animateElements from './animate-elements';

class Morph {
	static getDefaultSettings() {
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
		}
	}

	constructor(settings) {
		this.settings = Object.assign(Morph.getDefaultSettings(), settings);
		this.createAnimationLayer();
	}

	createAnimationLayer() {
		if (this.parentEl) return;

		this.parentEl = document.createElement('div');
		this.parentEl.className = 'morph-container';

		let fromObj = this.settings.fromObj;
		let toObj = this.settings.toObj;
		// let { fromObj, toObj } = this.settings;
		let excludeFromElList = [];
		let excludeToElList = [];

		this.morphItems = [];

		this.coverTransform = {
			fromObj: {},
			toObj: {}
		};

		let mainAnimation = {
			fromObj: {},
			toObj: {}
		};

		if (this.settings.actionType === 'copy') {
			toObj.el.classList.remove(toObj.classHidden);

			this.coverTransform.fromObj.height = fromObj.el.parentElement.offsetHeight;
			this.coverTransform.toObj.height = toObj.el.parentElement.offsetHeight + 10;

			this.settings.childElConfigs.forEach(config => {
				let fromEl = fromObj.el.querySelector(config.fromEl);
				let toEl = toObj.el.querySelector(config.toEl);

				console.log(fromEl, toEl);

				this.morphItems.push({
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

			this.settings.childElConfigs.forEach(config => {
				this.morphItems.push({
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

			this.settings.childElConfigs.forEach((config, i) => {
				this.morphItems[i].toObj.el = createGhostElement(toObj.el.querySelector(config.toEl));
			});

			mainAnimation.toObj.el = createGhostElement(toObj.el, excludeToElList);

			fromObj.el.classList.remove(fromObj.classHidden);
			toObj.el.classList.add(toObj.classHidden);

			this.settings.childElConfigs.forEach((config, i) => {
				this.morphItems[i].fromObj.el = createGhostElement(fromObj.el.querySelector(config.fromEl));
			});

			mainAnimation.fromObj.el = createGhostElement(fromObj.el, excludeFromElList);
		}

		this.morphItems.unshift(mainAnimation);

		this.morphItems.forEach(animation => {
			let el = document.createElement('div');
			el.className = 'morph-animation';
			el.appendChild(animation.fromObj.el);
			el.appendChild(animation.toObj.el);
			this.parentEl.appendChild(el);
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


	reCalculate() {
		this.animationList = [];

		this.morphItems.forEach(morphItem => {
			let _fromElClientRect = morphItem.fromObj.el.getBoundingClientRect();
			let _toElClientRect = morphItem.toObj.el.getBoundingClientRect();

			let fromTransform = getTransformClientRectDiff(_fromElClientRect, _toElClientRect);
			let toTransform = getTransformClientRectDiff(_toElClientRect, _fromElClientRect);

			morphItem.fromObj.el.style.transformOrigin = 'center center';
			morphItem.toObj.el.style.transformOrigin = 'center center';

			this.animationList.push({
				el: morphItem.fromObj.el,
				fromObj: {
					transform: 'translate(0, 0) scale(1, 1)',
					opacity: 1
				},
				toObj: {
					transform: `
						translate(${fromTransform.offsetX}px, ${fromTransform.offsetY}px)
						scale(${fromTransform.scaleX}, ${fromTransform.scaleY})
					`,
					opacity: 0
				}
			});

			this.animationList.push({
				el: morphItem.toObj.el,
				fromObj: {
					transform: `
						translate(${toTransform.offsetX}px, ${toTransform.offsetY}px)
						scale(${toTransform.scaleX}, ${toTransform.scaleY})
					`,
					opacity: 0
				},
				toObj: {
					transform: 'translate(0, 0) scale(1, 1)',
					opacity: 1
				}
			});

		});
	}


	animate(callback) {
		if (this.isAnimating || !this.atStart) return;

		this.isAnimating = true;
		this.parentEl.style.display = 'block';

		animateElements(this.animationList, this.settings.animationTime, this.settings.animationEasing, () => {
			this.settings.toObj.el.classList.remove(this.settings.toObj.classHidden);
			this.parentEl.style.display = 'none';
			this.isAnimating = false;
			this.atStart = false;

			if (callback) {
				callback();
			}
		});
	}

	reverse() {
		if (this.isAnimating || this.atStart) return;

		this.isAnimating = true;
		this.parentEl.style.display = 'block';
		this.settings.toObj.el.classList.add(this.settings.toObj.classHidden);

		animateElements(this.animationList, this.settings.animationTime, this.settings.animationEasing, () => {
			this.settings.fromObj.el.classList.remove(this.settings.fromObj.classHidden);
			this.parentEl.style.display = 'none';
			this.isAnimating = false;
			this.atStart = true;
		}, true);
	}

	removeAnimationLayer() {
		this.parentEl.remove();
	}

}