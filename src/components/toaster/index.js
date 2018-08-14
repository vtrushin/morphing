import React from 'react';
import morphing from '../../morphing';
import styles from './style.css';

export const animationClasses = {
	shown: '.' + styles.toaster + '[data-shown-state="shown"]',
	hidden: '.' + styles.toaster + '[data-shown-state="hidden"]'
};

export default class Toaster extends React.Component {
	componentWillUnmount() {
		this.el.dataset.shownState = 'hidden';
		morphing.trigger();
	}

	componentDidMount() {
		this.el.dataset.shownState = 'shown';
	}

	render() {
		const { left, children } = this.props;

		return (
			<div className={styles.toaster} style={{ left }} ref={el => this.el = el}>
				{ children }
			</div>
		);
	}
}
