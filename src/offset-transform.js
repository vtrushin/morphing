export default (from, to) => ({
	offsetX: (to.left + to.width / 2) - (from.left + from.width / 2),
	offsetY: (to.top + to.height / 2) - (from.top + from.height / 2),
	scaleX: to.width / from.width,
	scaleY: to.height / from.height
});
