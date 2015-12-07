export default function getTransformClientRectDiff(aCR, bCR) {
	return {
		offsetX: (bCR.left + bCR.width / 2) - (aCR.left + aCR.width / 2),
		offsetY: (bCR.top + bCR.height / 2) - (aCR.top + aCR.height / 2),
		scaleX: bCR.width / aCR.width,
		scaleY: bCR.height / aCR.height
	}
}