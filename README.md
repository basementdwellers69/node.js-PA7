# node.js-PA7
an assignment from 3D-CGA class

an application that allows the user to create a polygon mesh. The application must allow the user to:
*	Add/delete a polygon (triangle) surface.
* Edit a polygon.
*	Display the normal of a surface.
*	Save a mesh to a file.
*	Load a mesh from a file.
*	Display a mesh.
*	Rotate the mesh on the main axes.
*	Zoom the mesh in/out. 
*	Perform back face culling on the mesh. The user may toggle the back face culling on and off.
*	Bonus points for user friendliness. Negatives points for extreme user unfriendliness.

The polygons in this application are represented using a list of vertex coordinates.

You may use the built-in procedure for drawing a line.

## TODO:
- add User Interface, buttons and text field to controlling the shape
- create logic to implement triangle strip mesh
- create controller for zoom-in and zoom-out features.

## CHANGELOG
- v.0.0.2 - add UI components and canvas field events(10/17/20-9.12PM).
  * Add Mouse-Event for canvas field to zoom, change the view.
  * Add Tutorial section, and About section.
  * Add library: bootstrap-4, Material-Icons. this library is for ***User Interface***.
  
- v.0.0.1 - Adding some stuff to get started (10/16/20-11.13PM).
  * Implemented basic function (viewing a cube).
  * Implemented crude rotate function.
  * Basic keyboard controls (WASD/ARROWS). **this must have stop func**
  * still not node.js sadly
  * add user interface for start
