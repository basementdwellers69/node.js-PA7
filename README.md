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
- [ ] Create logic to implement triangle strip mesh.
- [ ] Implement V.0.1.1 features to main.
- [ ] create function to save mesh.
- [ ] create function to rotate by the camera, not the mesh (unnecessary, maybe ?).

## CHANGELOG

- v.0.1.1 - added view selected polygon function (10/20/20-7.47 PM)
  * user can view selected polygon (from list of polygon) on hover.
  * seperated ui control function to another file.
  
- v.0.1.0 - all week 1 criteria already implemented (10/19/20-5.18 PM)
  * Added add/delete polygons Feature.
  * next UI update will be v.1.0.0 (i hope so).
  
- v.0.0.6 - implement main function v.0.0.5, and use it in main **User Interface** (10/19/2020-12.53PM)

- v.0.0.5 - bug fixes (10/19/20-3.40AM).

- v.0.0.4 - updated main function (10/19/20-00.21AM).
  * Added choose Model control Function.


- v.0.0.3 - changed main function (10/18/20-5.05PM).
  * more crappy Mouse/keyboard event for controls (W,A,S,D/ ARROWS to move, W,A,S,D/ ARROWS + Right Click to rotate, Z-X to zoom);
  * Add load mesh function;
  * better stepping transformation.
  * add a cube and pyramid mesh in JSON.
  
  
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
