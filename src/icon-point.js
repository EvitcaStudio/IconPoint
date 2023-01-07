/** 
 * @file A point that exists inside/outside a virtual rectangle. The point's position inside/outside of the rectangle is maintained when the rectangle is rotated. 
 * 
 * @version 1.1.0
 * @author doubleactii
 * @copyright
 * @license
 * IconPoint is free software, available under the terms of a MIT style License.
 * Copyright (c) 2022 Evitca Studio
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * This software cannot be sold by itself. It must be used in a project and the project itself can be sold. In the case it is not, you the "user" of this software are breaking the license and agreeing to forfeit its usage.
 * Neither the name “EvitcaStudio” or "IconPoint" nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
/**
 * The IconPoint class  
 * A point that exists inside/outside a virtual rectangle. The point's position inside/outside of the rectangle is maintained when the rectangle is rotated.
 * @example <caption>Example usage of this class</caption>
 * // Create a rectangle at the position of (0,0)
 * const rectangle = { x: 0, y: 0 };
 * // Make the dimensions of the rectangle 100x50
 * const rectangleSize = { width: 100, height: 50 };
 * // Create a point at the top left corner of the rectangle
 * const point = { x: 1, y: 1, useRawPixels: true };
 * // Create an icon point that will track the point on this rectangle when it moves/rotates
 * const tlPoint = new IconPoint(rectangle, rectangleSize, point);
 */
globalThis.IconPoint = class {
	/**
	 * 
	 * @param {object} pRectanglePosition - The rectangle this icon point exists inside/outside of   
	 * @param {number} pRectanglePosition.x - The x coordinate of the rectangle  
	 * @param {number} pRectanglePosition.y - The y coordinate of the rectangle  
	 * @param {object} pRectangleSize - The size of the rectangle  
	 * @param {number} pRectangleSize.width - The width of the rectangle
	 * @param {number} pRectangleSize.height - The height of the rectangle  
	 * @param {object} pPoint - The point that exists inside/outside the rectangle. This is in relative positioning to the rectangle  
	 * @param {number} pPoint.x - The x coordinate of the point inside/outside the rectangle  
	 * @param {number} pPoint.y - The y coordinate of the point inside/outside the rectangle  
	 * @param {boolean} [pPoint.useRawPixels=false] - Whether or not this point is defined in raw pixels or in a normalized 0-1 range  
	 */
	constructor(pRectanglePosition, pRectangleSize, pPoint) {
		/**
		 * An object storing the raw pixel position  
		 * 
		 * @private
		 * @type {object} rawPixelsPoint - The object storing the raw pixel position of the point
		 * @type {number} rawPixelsPoint.x - The raw x pixel position of this point
		 * @type {number} rawPixelsPoint.y - The raw y pixel position of this point 
		 */
		this.rawPixelsPoint = { x: 0, y: 0 };
		/**
		 * An object storing the position of the rectangle  
		 * 
		 * @private
		 * @type {object} rectangle - The object storing the position of the rectangle
		 * @type {number} rectangle.x - The x position of the rectangle  
		 * @type {number} rectangle.y - The y position of the rectangle  
		 */
		this.rectangle = null;
		/**
		 * An object storing the raw pixel position  
		 * 
		 * @private
		 * @type {object} rectangleSize - The object storing the dimensions of the rectangle
		 * @type {number} rectangleSize.width - The width of the rectangle  
		 * @type {number} rectangleSize.height - The height of the rectangle  
		 */
		this.rectangleSize = { width: 32, height: 32 };
		// Check if the rectangle is a valid type
		if (typeof(pRectanglePosition) === 'object' && typeof(pRectangleSize) === 'object' && pRectangleSize.constructor === Object) {
			// Check if the rectangle has valid properties (x,y,width,height)
			if (typeof(pRectanglePosition.x) === 'number' && typeof(pRectanglePosition.y) === 'number' && typeof(pRectangleSize.width) === 'number' && typeof(pRectangleSize.height) === 'number') {
				this.rectangle = pRectanglePosition;
				this.rectangleSize.width = pRectangleSize.width;
				this.rectangleSize.height = pRectangleSize.height;
			} else {
				console.error('Invalid properties on pRectanglePosition or pRectangleSize!');
			}
		}
		// Check if the point is a valid type
		if (typeof(pPoint) === 'object' && pPoint.constructor === Object) {
			// Check if the point has valid properties
			if (typeof(pPoint.x) === 'number' && typeof(pPoint.y) === 'number') {
				this.setPoint(pPoint);	
			} else {
				console.error('Parameter of wrong type: pPoint.point.x or pPoint.point.y is not a number!');
			}
		}
	}
	/**
	 * @description Gets the new point's position inside a rectangle after taking pTheta into account
	 * 
	 * @param {number} [pTheta=0] - Rotation of the rectangle this point exists inside/outside of in radians
	 * @param {object} [pOffset={ x: 0, y: 0 }] - The offset of the rectangle
	 * @param {number} pOffset.x - The x offset of the rectangle
	 * @param {number} pOffset.y - The y offset of the rectangle
	 * @example <caption>Example usage of this method</caption>
	 * // Create a rectangle at the position of (0,0)
	 * const rectangle = { x: 0, y: 0 };
	 * // Make the dimensions of the rectangle 100x50
	 * const rectangleSize = { width: 100, height: 50 };
	 * // Create a point at the top left corner of the rectangle
	 * const point = { x: 1, y: 1, useRawPixels: true };
	 * // Create an icon point that will track the point on this rectangle when it moves/rotates
	 * const tlPoint = new IconPoint(rectangle, rectangleSize, point);
	 * 
	 * // Verify the point is where it should be
	 * console.log(tlPoint.getPoint()) // { x: 0, y: 0 } This shows that the point is at the position (0,0) which is the top left position of the rectangle
	 * 
	 * // Changing the position of the rectangle
	 * rectangle.x += 100;
	 * // Verify the point is where it should be after the rectangle changes positions
	 * console.log(tlPoint.getPoint()) // { x: 100, y: 0 } This shows that the point has moved to the updated position of the rectangle
	 * 
	 * // Applying some offsets to the rectangle
	 * const rectangleOffsets = { x: 25, y: 25 };  
	 * // Verify the point is where it should be after offsets have been applied to the rectangle
	 * console.log(tlPoint.getPoint(undefined, rectangleOffsets)) // { x: 125, y: 25 } This shows that the point has moved to the updated posiiton based on the offsets of the rectangle
	 * 
	 * // Applying some rotation to the rectangle
	 * const theta = Math.PI;
	 * // Verify the point is where it should be after rotating the rectangle by `theta`
	 * console.log(tlPoint.getPoint(theta)) // {x: 200, y: 50.00000000000001} This shows that the point has moved to the updated position after the rectangle had been rotated by `theta`.
	 * 
	 * @returns {object} The point inside/outside of the rectangle after rotating.  
	 */
	getPoint(pTheta=0, pOffset = { x: 0, y: 0 }) {
		// cx, cy - center of square coordinates
		// x, y - coordinates of a corner point of the square
		// theta is the angle of rotation
		const cx = (this.rectangle.x + pOffset.x) + (this.rectangleSize.width / 2);
		const cy = (this.rectangle.y + pOffset.y) + (this.rectangleSize.height / 2);
		// We take away 1 from the position of the rectangle because we don't want to point to start inside the boundaries of the rectangle
		// Otherwise we would have to use 0 to (rectangle.xy-1) for the points coordinates
		const point = { x: (this.rectangle.x + pOffset.x - 1) + this.rawPixelsPoint.x, y: (this.rectangle.y + pOffset.y - 1) + this.rawPixelsPoint.y };
		// translate point to origin
		const tempX = point.x - cx;
		const tempY = point.y - cy;
		// now apply rotation
		const rotatedX = tempX*Math.cos(pTheta) - tempY*(-Math.sin(pTheta));
		const rotatedY = tempX*(-Math.sin(pTheta)) + tempY*Math.cos(pTheta);
		// translate back
		const x = rotatedX + cx;
		const y = rotatedY + cy;
		return { x: x, y: y };
	}
	/**
	 * @description Sets the static point and defines the raw pixels value
	 * 
	 * @private
	 * @param {object} pPoint - The point that exists inside/outside the rectangle  
	 * @param {number} pPoint.x - The x coordinate of the point inside/outside the rectangle  
	 * @param {number} pPoint.y - The y coordinate of the point inside/outside the rectangle  
	 */
	setPoint(pPoint) {
		this.rawPixelsPoint.x = pPoint.useRawPixels ? parseInt(pPoint.x) : Math.max(parseInt(pPoint.x * this.rectangleSize.width), 1);
		this.rawPixelsPoint.y = pPoint.useRawPixels ? parseInt(pPoint.y) : Math.max(parseInt(pPoint.y * this.rectangleSize.height), 1);
	}
}
