import { Logger } from './vendor/logger';

export interface Point {
    x: number; 
    y: number; 
}

export interface PositionalPoint {
    x: number; 
    y: number; 
    isNormalized?: boolean;
}

export interface Offset {
    x: number;
    y: number;
}

export interface Bounds {
    width: number; 
    height: number;
}

export interface Anchor {
    x: number; 
    y: number;
}

export interface Transform {
    x: number;
    y: number;
}

export interface IconPointExport {
    width: number;
    height: number;
    x: number;
    y: number;
    id: string;
}

/**
 * The IconPoint class.
 * A point that exists inside/outside a virtual rectangle. The point's position inside/outside of the rectangle is maintained when the rectangle is rotated.
 * * @example
 * ```typescript
 * // Create a rectangle at the position of (0,0)
 * const rectangle = { x: 0, y: 0 };
 * // Make the dimensions of the rectangle 100x50
 * const bounds = { width: 100, height: 50 };
 * // Create a point at the top left corner of the rectangle
 * const point = { x: 1, y: 1 };
 * // Create an icon point that will track the point on this rectangle when it moves/rotates
 * const tlPoint = new IconPoint(rectangle, bounds, point);
 * ```
 */
export class IconPoint {
    /**
     * Static offset to use when none is passed.
     */
    static defaultOffset: Offset = { x: 0, y: 0 };
    /**
     * Static anchor to use when none is passed. Default value of 0.5 signifies the anchor starts in the middle.
     */
    static defaultAnchor: Anchor = { x: 0.5, y: 0.5 };
    /**
     * The version of the module.
     */
    static version = "VERSION_REPLACE_ME";
    /** The logger module this module uses to log errors / logs 
     * @internal
     */
    private static logger = new Logger()
    /**
     * An object storing the position of the point that was set. This is the point on the rectangle.  
     * It can be changed at runtime.
     * ________  
     * |       |  
     * |   x   |  
     * |       |  
     * |_______|  
     */
    public iconPoint: Point = { x: 0, y: 0 };
    /**
     * The original point that was set when the IconPoint was created.
     * @internal
     */
    private originalPoint: Point = { x: 0, y: 0 };
    /**
     * An object storing the position of the rectangle.  
     * @internal
     */
    private positionalPoint: Point;
    /**
     * An object storing the point's position with rotation taken into account.  
     * @internal
     */
    private point: Point = { x: 0, y: 0 };
    /**
     * An object storing the rectangle's size.  
     * @internal
     */
    private bounds: Bounds = { width: 32, height: 32 };

    /** The id of this icon point 
     * @internal
     */
    private id: string;

    /**
     * Creates an instance of IconPoint.
     * @param pPoint - The rectangle this icon point exists inside/outside of.
     * @param pBounds - The size of the rectangle.
     * @param pIconPoint - The point that exists inside/outside the rectangle. This is in relative positioning to the rectangle.
     * ## Normalized
     * If you want to specify the point `(50, 50)` in a rectangle that is `100x100` using normalized values you would use `0.5`
     * The calculation will be `0.5 * 100` in both axis, which resolves to `(50, 50)`. This is just an easier way to assign the values.
     * @param pId - An optional ID for this icon point.
     */
    constructor(pPoint: Point, pBounds: Bounds, pIconPoint: PositionalPoint, pId?: string) {
        const { width, height } = pBounds;
        this.bounds.width = width;
        this.bounds.height = height;

        this.positionalPoint = pPoint;
        this.originalPoint = { ...pIconPoint };
        this.id = pId || '';

        IconPoint.logger.registerType('IconPointModule', '#ff6600');

        this.setPoint(pIconPoint);
    }
    
    /**
     * Gets the new point's position inside a rectangle after taking pAngle into account.
     * @param [pAngle=0] - Rotation of the rectangle this point exists inside/outside of in radians.
     * @param [pOffset] - The offset of the rectangle. Defaults to `IconPoint.defaultOffset`.
     * @param [pAnchor] - The anchor origin of the rectangle. Defaults to `IconPoint.defaultAnchor`.
     * @example
     * ```typescript
     * // Create a rectangle at the position of (0,0)
     * const rectangle = { x: 0, y: 0 };
     * // Make the dimensions of the rectangle 100x50
     * const bounds = { width: 100, height: 50 };
     * // Create a point at the top left corner of the rectangle
     * const point = { x: 1, y: 1 };
     * // Create an icon point that will track the point on this rectangle when it moves/rotates
     * const tlPoint = new IconPoint(rectangle, bounds, point);
     * // Verify the point is where it should be
     * console.log(tlPoint.getPoint()) // { x: 0, y: 0 } This shows that the point is at the position (0,0) which is the top left position of the rectangle
     * // Changing the position of the rectangle
     * rectangle.x += 100;
     * // Verify the point is where it should be after the rectangle changes positions
     * console.log(tlPoint.getPoint()) // { x: 100, y: 0 } This shows that the point has moved to the updated position of the rectangle
     * // Applying some offsets to the rectangle
     * const rectangleOffsets = { x: 25, y: 25 };  
     * // Verify the point is where it should be after offsets have been applied to the rectangle
     * console.log(tlPoint.getPoint(undefined, rectangleOffsets)) // { x: 125, y: 25 } This shows that the point has moved to the updated position based on the offsets of the rectangle
     * // Applying some rotation to the rectangle
     * const angle = Math.PI;
     * // Verify the point is where it should be after rotating the rectangle by `angle`
     * console.log(tlPoint.getPoint(angle)) // {x: 200, y: 50.00000000000001} This shows that the point has moved to the updated position after the rectangle had been rotated by `angle`.
     * ```
     * @returns The point inside/outside of the rectangle after rotating, or void.
     */
    public getPoint(pAngle: number=0, pOffset: Offset = IconPoint.defaultOffset, pAnchor: Anchor = IconPoint.defaultAnchor): Point | void {
        // cx, cy - center of square coordinates 
        // x, y - coordinates of a corner point of the square
        // angle is the angle of rotation
        const cx = (this.positionalPoint.x + pOffset.x) + this.bounds.width * pAnchor.x;
        const cy = (this.positionalPoint.y + pOffset.y) + this.bounds.height * pAnchor.y;
        // We take away 1 from the position of the rectangle because we don't want to point to start inside the boundaries of the rectangle
        // Otherwise we would have to use 0 to (rectangle.xy-1) for the points coordinates
        const pointX = (this.positionalPoint.x + pOffset.x - 1) + this.iconPoint.x;
        const pointY = (this.positionalPoint.y + pOffset.y - 1) + this.iconPoint.y;
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
     * Gets the new point's position inside a rectangle from an external point after taking pAngle into account.
     * @param pExternalPoint - The external point to calculate from.
     * @param pAngle - Rotation of the rectangle this point exists inside/outside of in radians.
     * @param pOffset - The offset of the rectangle. Defaults to `IconPoint.defaultOffset`.
     * @param pAnchor - The anchor origin of the rectangle. Defaults to `IconPoint.defaultAnchor`.
     * @returns - The point inside/outside of the rectangle after rotating, or void.
     */
    public getPointFromExternalPoint(pExternalPoint: Point, pAngle: number=0, pOffset: Offset = IconPoint.defaultOffset, pAnchor: Anchor = IconPoint.defaultAnchor): Point | void {
        // cx, cy - center of square coordinates 
        // x, y - coordinates of a corner point of the square
        // angle is the angle of rotation
        const cx = (pExternalPoint.x + pOffset.x) + this.bounds.width * pAnchor.x;
        const cy = (pExternalPoint.y + pOffset.y) + this.bounds.height * pAnchor.y;
        // We take away 1 from the position of the rectangle because we don't want to point to start inside the boundaries of the rectangle
        // Otherwise we would have to use 0 to (rectangle.xy-1) for the points coordinates
        const pointX = (pExternalPoint.x + pOffset.x - 1) + this.iconPoint.x;
        const pointY = (pExternalPoint.y + pOffset.y - 1) + this.iconPoint.y;
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
     * @param pPoint - The point that exists inside/outside the rectangle.
     * @internal
     */
    private setPoint(pPoint: PositionalPoint): void {
        const { x, y, isNormalized } = pPoint;
        this.iconPoint.x = isNormalized ? x * this.bounds.width : x;
        this.iconPoint.y = isNormalized ? y * this.bounds.height : y;
    }
    
    /**
     * Resets the point to the original point.
     */
    public resetPoint() {
        this.setPoint(this.originalPoint);
    }
    
    /**
     * Updates the bounds of the rectangle this icon point exists inside/outside of.
     * @param pBounds - The bounds to update the rectangle with.
     */
    public updateBounds(pBounds: Bounds): void {
        const { width, height } = pBounds;
        this.bounds.width = width;
        this.bounds.height = height;
    }
    
    /**
     * Transforms the x point.
     * @param pTransformX - The x transform to transform the x point to.
     */
    public transformX(pTransformX: number): void {
        const boundsX = Math.abs(pTransformX * this.bounds.width);
        this.iconPoint.x = boundsX - this.originalPoint.x;
    }
    
    /**
     * Transforms the y point.
     * @param pTransformY - The y transform to transform the y point to.
     */
    public transformY(pTransformY: number): void {
        const boundsY = Math.abs(pTransformY * this.bounds.height);
        this.iconPoint.y = boundsY - this.originalPoint.y;
    }
    
    /**
     * Transforms the point.
     * @param pTransform - The transform to transform the point to.
     */
    public transform(pTransform: Transform): void {
        this.transformX(pTransform.x);
        this.transformY(pTransform.y);
    }
    
    /**
     * Gets the id of this icon point.
     * @returns The id of this point or ''.
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Exports the icon point data.
     * @returns - The exported icon point data.
     */
    public export(): IconPointExport {
        return {
            ...this.bounds,
            ...this.iconPoint,
            id: this.id
        };
    }
}