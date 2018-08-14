const handlers = {};

const ignoredElements = new Map();

const observer = new MutationObserver(onDomChange);

function onDomChange() {
	ignoredElements.forEach((selector, el) => {
		if (!el.matches(selector)) {
			ignoredElements.delete(el);
		}
	});

	Object.entries(handlers).forEach(([selector, fn]) => {
		document.querySelectorAll(selector).forEach(el => {
			if (el && !ignoredElements.has(el)) {
				ignoredElements.set(el, selector);
				fn(el);
			}
		});
	});
}

function set(newHandlers) {
	Object.entries(newHandlers).forEach(([selector, fn]) => {
		handlers[selector] = fn;
	});
}

function trigger() {
	onDomChange();
}

function stopObserve() {
	observer.disconnect();
}

function startObserve() {
	observer.observe(document.body, {
		attributes: true,
		childList: true,
		subtree: true
	});
}

startObserve();

export default {
	set,
	trigger,
	// startObserve,
	// stopObserve
};
