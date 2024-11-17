import { Logger } from './vendor/logger.min.mjs';

interface PositionalPoint {
    x: number; 
    y: number; 
    useRawPixels?: boolean;
}

interface Offset {
    x: number;
    y: number;
}

interface Bounds {
    width: number; 
    height: number;
}

interface Anchor {
    x: number; 
    y: number;
}

/**
 * The IconPoint class  
 * A point that exists inside/outside a virtual rectangle. The point's position inside/outside of the rectangle is maintained when the rectangle is rotated.
 * @example <caption>Example usage of this class</caption>
 * // Create a rectangle at the position of (0,0)
 * const rectangle = { x: 0, y: 0 };
 * // Make the dimensions of the rectangle 100x50
 * const bounds = { width: 100, height: 50 };
 * // Create a point at the top left corner of the rectangle
 * const point = { x: 1, y: 1, useRawPixels: true };
 * // Create an icon point that will track the point on this rectangle when it moves/rotates
 * const tlPoint = new IconPoint(rectangle, bounds, point);
 */
export class IconPoint {
    /**
     * Static offset to use when none is passed.
     */
    static defaultOffset: Offset = { x: 0, y: 0 };
    /**
     * Static anchor to use when none is passed. Default value of 0.5 signifies the anchor stars in the middle.
     */
    static defaultAnchor: Anchor = { x: 0.5, y: 0.5 };
	/**
	 * The version of the module.
	 */
	version = "VERSION_REPLACE_ME";
    /** The logger module this module uses to log errors / logs
     * @private
     * @type {Logger}
     */
    private logger: typeof Logger;
    /**
     * An object storing the raw pixel position  
     * @private
     * @type {PositionalPoint}
     * @prop {number} x - The raw x pixel position of this point
     * @prop {number} y - The raw y pixel position of this point 
     */
    rawPixelsPoint: PositionalPoint = { x: 0, y: 0 };
    /**
     * An object storing the position of the rectangle  
     * @private
     * @type {PositionalPoint}
     * @prop {number} x - The x position of the rectangle  
     * @prop {number} y - The y position of the rectangle  
     */
    positionalPoint: PositionalPoint | null = null;
    /**
     * An object storing the point's position with rotation taken into account.  
     * @private
     * @type {PositionalPoint}
     * @prop {number} x - The x position of the rectangle  
     * @prop {number} y - The y position of the rectangle  
     */
    point: PositionalPoint = { x: 0, y: 0 };
    /**
     * An object storing the rectangle's size.  
     * @private
     * @type {Bounds}
     * @prop {number} width - The width of the rectangle  
     * @prop {number} height - The height of the rectangle  
     */
    bounds: Bounds = { width: 32, height: 32 };
    /**
     * @param {PositionalPoint} pPoint - The rectangle this icon point exists inside/outside of   
     * @prop {number} pPoint.x - The x coordinate of the rectangle  
     * @prop {number} pPoint.y - The y coordinate of the rectangle  
     * @param {Bounds} pBounds - The size of the rectangle  
     * @prop {number} pBounds.width - The width of the rectangle
     * @prop {number} pBounds.height - The height of the rectangle  
     * @param {PositionalPoint} pIconPoint - The point that exists inside/outside the rectangle. This is in relative positioning to the rectangle  
     * @prop {number} pIconPoint.x - The x coordinate of the point inside/outside the rectangle  
     * @prop {number} pIconPoint.y - The y coordinate of the point inside/outside the rectangle  
     * @prop {boolean} [pIconPoint.useRawPixels=false] - Whether or not this point is defined in raw pixels or in a normalized 0-1 range  
     */
    constructor(pPoint: PositionalPoint, pBounds: Bounds, pIconPoint: PositionalPoint) {
        // Check if the rectangle is a valid type
        if (typeof pPoint === 'object' && typeof pBounds === 'object' && pBounds.constructor === Object) {
            // Check if the rectangle has valid properties (x,y,width,height)
            if (typeof pPoint.x === 'number' && typeof pPoint.y === 'number' && typeof pBounds.width === 'number' && typeof pBounds.height === 'number') {
                this.positionalPoint = pPoint;
                this.bounds.width = pBounds.width;
                this.bounds.height = pBounds.height;
            } else {
                this.logger.prefix('Icon-Point-Module').error('Invalid properties on pPoint or pBounds!');
            }
        }
        // Check if the point is a valid type
        if (typeof pIconPoint === 'object' && pIconPoint.constructor === Object) {
            // Check if the point has valid properties
            if (typeof pIconPoint.x === 'number' && typeof pIconPoint.y === 'number') {
                this.setPoint(pIconPoint);	
            } else {
                this.logger.prefix('Icon-Point-Module').error('Parameter of wrong type: pPoint.point.x or pPoint.point.y is not a number!');
            }
        }

        this.logger = new Logger();
        this.logger.registerType('Icon-Point-Module', '#ff6600');
    }
    /**
     * Gets the new point's position inside a rectangle after taking pAngle into account
     * @param {number} [pAngle=0] - Rotation of the rectangle this point exists inside/outside of in radians
     * @param {Offset} [pOffset={ x: 0, y: 0 }] - The offset of the rectangle
     * @prop {number} pOffset.x - The x offset of the rectangle
     * @prop {number} pOffset.y - The y offset of the rectangle
     * @example <caption>Example usage of this method</caption>
     * // Create a rectangle at the position of (0,0)
     * const rectangle = { x: 0, y: 0 };
     * // Make the dimensions of the rectangle 100x50
     * const bounds = { width: 100, height: 50 };
     * // Create a point at the top left corner of the rectangle
     * const point = { x: 1, y: 1, useRawPixels: true };
     * // Create an icon point that will track the point on this rectangle when it moves/rotates
     * const tlPoint = new IconPoint(rectangle, bounds, point);
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
     * console.log(tlPoint.getPoint(undefined, rectangleOffsets)) // { x: 125, y: 25 } This shows that the point has moved to the updated position based on the offsets of the rectangle
     * 
     * // Applying some rotation to the rectangle
     * const angle = Math.PI;
     * // Verify the point is where it should be after rotating the rectangle by `angle`
     * console.log(tlPoint.getPoint(angle)) // {x: 200, y: 50.00000000000001} This shows that the point has moved to the updated position after the rectangle had been rotated by `angle`.
     * 
     * @returns {object} The point inside/outside of the rectangle after rotating.  
     */
    getPoint(pAngle: number=0, pOffset: Offset = IconPoint.defaultOffset, pAnchor: Anchor = IconPoint.defaultAnchor): PositionalPoint | void {
        if (!this.positionalPoint) return;
        // cx, cy - center of square coordinates 
        // x, y - coordinates of a corner point of the square
        // angle is the angle of rotation
        const cx = (this.positionalPoint.x + pOffset.x) + this.bounds.width * pAnchor.x;
        const cy = (this.positionalPoint.y + pOffset.y) + this.bounds.height * pAnchor.y;
        // We take away 1 from the position of the rectangle because we don't want to point to start inside the boundaries of the rectangle
        // Otherwise we would have to use 0 to (rectangle.xy-1) for the points coordinates
        const pointX = (this.positionalPoint.x + pOffset.x - 1) + this.rawPixelsPoint.x;
        const pointY = (this.positionalPoint.y + pOffset.y - 1) + this.rawPixelsPoint.y;
        // translate point to origin
        const tempX = pointX - cx;
        const tempY = pointY - cy;
        // now apply rotation
        const rotatedX = tempX * Math.cos(pAngle) - tempY * -Math.sin(pAngle);
        const rotatedY = tempX * -Math.sin(pAngle) + tempY * Math.cos(pAngle);
        // translate back
        const x = rotatedX + cx;
        const y = rotatedY + cy;
        this.point.x = x;
        this.point.y = y;
        return this.point;
    }
    /**
     * Sets the static point and defines the raw pixels value
     * @private
     * @param {PositionalPoint} pPoint - The point that exists inside/outside the rectangle  
     * @prop {number} pPoint.x - The x coordinate of the point inside/outside the rectangle  
     * @prop {number} pPoint.y - The y coordinate of the point inside/outside the rectangle  
     */
    setPoint(pPoint: PositionalPoint) {
        this.rawPixelsPoint.x = pPoint.useRawPixels ? pPoint.x : pPoint.x * this.bounds.width;
        this.rawPixelsPoint.y = pPoint.useRawPixels ? pPoint.y : pPoint.y * this.bounds.height;
    }
}