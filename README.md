# IconPoint
A point that exists inside/outside a virtual rectangle. The point's position inside/outside of the rectangle is maintained when the rectangle is moved/rotated.  

# [Documentation](https://evitcastudio.github.io/IconPoint/) 📖

This plugin provides an easy way to keep track of points on moving / rotating rectangles

# Sample usage 
In this example it shows off how to retrieve the point after moving/rotating/offseting the rectangle the point exists inside/outside of.
```js
// Create a rectangle at the position of (0,0)
const rectangle = { x: 0, y: 0 };
// Make the dimensions of the rectangle 100x50
const rectangleSize = { width: 100, height: 50 };
// Create a point at the top left corner of the rectangle
const point = { x: 1, y: 1, useRawPixels: true };
// Create an icon point that will track the point on this rectangle when it moves/rotates
const tlPoint = new IconPoint(rectangle, rectangleSize, point);

// Verify the point is where it should be
console.log(tlPoint.getPoint()) // { x: 0, y: 0 } This shows that the point is at the position (0,0) which is the top left position of the rectangle

// Changing the position of the rectangle
rectangle.x += 100;
// Verify the point is where it should be after the rectangle changes positions
console.log(tlPoint.getPoint()) // { x: 100, y: 0 } This shows that the point has moved to the updated position of the rectangle

// Applying some offsets to the rectangle
const rectangleOffsets = { x: 25, y: 25 };  
// Verify the point is where it should be after offsets have been applied to the rectangle
console.log(tlPoint.getPoint(undefined, rectangleOffsets)) // { x: 125, y: 25 } This shows that the point has moved to the updated posiiton based on the offsets of the rectangle

// Applying some rotation to the rectangle
const theta = Math.PI;
// Verify the point is where it should be after rotating the rectangle by `theta`
console.log(tlPoint.getPoint(theta)) // {x: 200, y: 50.00000000000001} This shows that the point has moved to the updated position after the rectangle had been rotated by `theta`.
```

# Support ✊
If this plugin has helped you in any way please consider giving it a ⭐!

# License ⚖️
Copyright © 2023 [EvitcaStudio](https://github.com/EvitcaStudio)  
The license is located [here](https://github.com/EvitcaStudio/IconPoint/blob/main/LICENSE.md).
