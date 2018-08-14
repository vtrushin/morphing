import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { cloneElement } from './clone-element';
import Toaster, { animationClasses as toasterAnimationClasses } from './components/toaster/index';
import morphing from './morphing';

// const Index = () => {
// 	return <div>Hello React!</div>;
// };

class Index extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			opened: false
		};
	}

	render() {
		const { opened } = this.state;

		return (
			<div>
				<button onClick={() => this.handleClick()}>Add / Remove</button>
				{ opened && (
					<Fragment>
						<Toaster left={10}>
							Popup text
						</Toaster>
						<Toaster left={120}>
							Popup text 2
						</Toaster>
						<Toaster left={250}>
							Popup text 2
						</Toaster>
					</Fragment>
				) }
			</div>
		);
	}

	handleClick() {
		const { opened } = this.state;

		this.setState({
			opened: !opened
		});
	}
}


morphing.set({
	[toasterAnimationClasses.shown]: el => {
		const clonedEl = cloneElement(el);

		const styleEl = document.createElement('style');
		styleEl.setAttribute('type', 'text/css');

		el.classList.add('morphing-hidden');

		styleEl.textContent = (`
			.morphing-hidden {
				visibility: hidden !important;
			}
		`);

		document.head.appendChild(styleEl);
		document.body.appendChild(clonedEl);

		const keyFrames = [
			{ transform: 'translateY(calc(100% + 10px))' },
			{ transform: 'translateY(0)' }
		];

		const animation = clonedEl.animate(keyFrames, {
			duration: 300,
			easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
		});

		const onFinish = () => {
			animation.removeEventListener('finish', onFinish);

			document.head.removeChild(styleEl);
			document.body.removeChild(clonedEl);
			el.classList.remove('morphing-hidden');
		};

		animation.addEventListener('finish', onFinish);
	},
	[toasterAnimationClasses.hidden]: el => {
		const clonedEl = cloneElement(el);

		const styleEl = document.createElement('style');
		styleEl.setAttribute('type', 'text/css');

		document.head.appendChild(styleEl);
		document.body.appendChild(clonedEl);

		const keyFrames = [
			{ transform: 'translateY(0)' },
			{ transform: 'translateY(calc(100% + 10px))' }
		];

		const animation = clonedEl.animate(keyFrames, {
			duration: 300,
			easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
		});

		const onFinish = () => {
			animation.removeEventListener('finish', onFinish);

			document.head.removeChild(styleEl);
			document.body.removeChild(clonedEl);
		};

		animation.addEventListener('finish', onFinish);
	}
});


ReactDOM.render(<Index />, document.getElementById('index'));
