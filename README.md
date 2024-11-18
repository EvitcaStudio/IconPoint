# IconPoint
A class that manages a point that exists inside/outside a virtual rectangle. The point's position inside/outside of the rectangle is maintained when the rectangle is rotated.

## Installation

### ES Module

```js
import { IconPoint } from './icon-point.mjs';
```

### IIFE (Immediately Invoked Function Expression)

```js
<script src="icon-point.js"></script>;
// ...
window.IconPointBundle.IconPoint;
```

# Example
```js
// Create a rectangle at the position of (0,0)
const rectangle = { x: 0, y: 0 };
// Make the dimensions of the rectangle 100x50
const bounds = { width: 100, height: 50 };
// Create a point at the top left corner of the rectangle
const point = { x: 1, y: 1 };
// Create an icon point that will track the point on this rectangle when it moves/rotates
const tlPoint = new IconPoint(rectangle, bounds, point);

// Verify the point is where it should be
console.log(tlPoint.getPoint()) // { x: 0, y: 0 } This shows that the point is at the position (0,0) which is the top left position of the rectangle

// Changing the position of the rectangle
rectangle.x += 100;
// Verify the point is where it should be after the rectangle changes positions
console.log(tlPoint.getPoint()) // { x: 100, y: 0 } This shows that the point has moved to the updated position of the rectangle

// Applying some offsets to the rectangle
const rectangleOffsets = { x: 25, y: 25 };  
// Verify the point is where it should be after offsets have been applied to the rectangle
console.log(tlPoint.getPoint(undefined, rectangleOffsets)) // { x: 125, y: 25 } This shows that the point has moved to the updated position based on the offsets of the rectangle

// Applying some rotation to the rectangle
const angle = Math.PI;
// Verify the point is where it should be after rotating the rectangle by `angle`
console.log(tlPoint.getPoint(angle)) // {x: 200, y: 50.00000000000001} This shows that the point has moved to the updated position after the rectangle had been rotated by `angle`.
```
