class IconPoint {
	constructor(pOwner, pSettings) {
		// The position of the icon point
		this._x = this._y = 0;
		this._position = { x: 0, y: 0 };
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

	setPointRotated() {
		// cx, cy - center of square coordinates
		// x, y - coordinates of a corner point of the square
		// theta is the angle of rotation

		const cx = (this.owner.x + this.owner.xIconOffset) + (this.iconSize.width * this.owner.anchor.x);
		const cy = (this.owner.y + this.owner.yIconOffset) + (this.iconSize.height * this.owner.anchor.y);

		// We take away 1 from the position of the owner because we don't want to point to start inside the bounds, so to use true coordinates of 1-iconSize for the point, we must start outside of the bounds.
		// Otherwise we would have to use 0-iconSize-1 for the points coordinates
		const point = { x: (this.owner.x - 1 + this.owner.xIconOffset) + this.rawPixelsPoint.x, y: (this.owner.y - 1 + this.owner.yIconOffset) + this.rawPixelsPoint.y };

		// translate point to origin
		const tempX = point.x - cx;
		const tempY = point.y - cy;

		// now apply rotation
		const rotatedX = tempX*Math.cos(this.owner.angle) - tempY*(-Math.sin(this.owner.angle));
		const rotatedY = tempX*(-Math.sin(this.owner.angle)) + tempY*Math.cos(this.owner.angle);

		// translate back
		const x = rotatedX + cx;
		const y = rotatedY + cy;

		this._x = x;
		this._y = y;
		this._position.x = x;
		this._position.y = y;
	}

	setPoint(pPoint, pUseRawPixels) {
		if (pUseRawPixels) {
			this.rawPixelsPoint.x = parseInt(pPoint.x);
			this.rawPixelsPoint.y = parseInt(pPoint.y);
		} else {
			this.rawPixelsPoint.x = parseInt(pPoint.x * this.iconSize.width);
			this.rawPixelsPoint.y = parseInt(pPoint.y * this.iconSize.height);
		}
	}

	get x() {
		this.setPointRotated();
		return this._x;
	}

	get y() {
		this.setPointRotated();
		return this._y;
	}

	get position() {
		this.setPointRotated();
		return this._position;
	}
}

export { IconPoint };