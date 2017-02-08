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
