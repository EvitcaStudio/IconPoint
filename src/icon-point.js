class IconPoint {
	/**
	 * 
	 * @param {object} pOwner The owner of this icon point  
	 * @param {object} pSettings The settings that this icon point will use  
	 */
	constructor(pOwner, pSettings) {
		// The iconSize of the icon this point exists in
		this.iconSize = { width: 32, height: 32 };
		// The rawPixels point
		this.rawPixelsPoint = { x: 0, y: 0 };
		// The owner of this icon point
		this.owner = pOwner;

		// Check if pSettings is a valid type
		if (pSettings && typeof(pSettings) === 'object' && pSettings.constructor === Object) {
			// Check if the iconSize is a valid type
			if (pSettings.iconSize && typeof(pSettings.iconSize) === 'object' && pSettings.iconSize.constructor === Object) {
				// Check if the iconSize properties are of the valid type
				if (typeof(pSettings.iconSize.width) === 'number' && typeof(pSettings.iconSize.height) === 'number') {
					this.iconSize.width = parseInt(pSettings.iconSize.width);
					this.iconSize.height = parseInt(pSettings.iconSize.height);
				} else {
					console.error('Parameter of wrong type: pSettings.iconSize.width or pSettings.iconSize.height is not a number!');
				}
			}

			// Check if the point is a valid type
			if (pSettings.point && typeof(pSettings.point) === 'object' && pSettings.point.constructor === Object) {
				if (typeof(pSettings.point.x) === 'number' && typeof(pSettings.point.y) === 'number') {
					this.setPoint(pSettings.point, pSettings.useRawPixels);	
				} else {
					console.error('Parameter of wrong type: pSettings.point.x or pSettings.point.y is not a number!');
				}
			}
		}
	}
	/**
	 * @description Gets the new point's position inside a rectangle after taking pAngle into account
	 * 
	 * @param {number} pAngle - Angle in radians
	 * @param {object} pAnchor - The center point of the icon
	 */
	getPointRotated(pAngle, pAnchor = { x: 0.5, y: 0.5 }) {
		// cx, cy - center of square coordinates
		// x, y - coordinates of a corner point of the square
		// theta is the angle of rotation

		const cx = (this.owner.x + this.owner.xIconOffset) + (this.iconSize.width * pAnchor.x);
		const cy = (this.owner.y + this.owner.yIconOffset) + (this.iconSize.height * pAnchor.y);

		// We take away 1 from the position of the owner because we don't want to point to start inside the bounds, so to use true coordinates of 1-iconSize for the point, we must start outside of the bounds.
		// Otherwise we would have to use 0-iconSize-1 for the points coordinates
		const point = { x: (this.owner.x - 1 + this.owner.xIconOffset) + this.rawPixelsPoint.x, y: (this.owner.y - 1 + this.owner.yIconOffset) + this.rawPixelsPoint.y };

		// translate point to origin
		const tempX = point.x - cx;
		const tempY = point.y - cy;

		// now apply rotation
		const rotatedX = tempX*Math.cos(pAngle) - tempY*(-Math.sin(pAngle));
		const rotatedY = tempX*(-Math.sin(pAngle)) + tempY*Math.cos(pAngle);

		// translate back
		const x = rotatedX + cx;
		const y = rotatedY + cy;
		return { x: x, y: y };
	}
	/**
	 * @description Sets the static point and defines the raw pixels value
	 * 
	 * @param {object} pPoint - The static point in the icon
	 * @param {boolean} pUseRawPixels - Whether or not this point is defined in raw pixels
	 */
	setPoint(pPoint, pUseRawPixels) {
		if (pUseRawPixels) {
			this.rawPixelsPoint.x = parseInt(pPoint.x);
			this.rawPixelsPoint.y = parseInt(pPoint.y);
		} else {
			this.rawPixelsPoint.x = Math.max(parseInt(pPoint.x * this.iconSize.width), 1);
			this.rawPixelsPoint.y = Math.max(parseInt(pPoint.y * this.iconSize.height), 1);
		}
	}
}
