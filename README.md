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
- [ ] Implement V.0.2.2 features to main.


## CHANGELOG
- v.0.2.2 - added view normal on polygon lists
  * added this feature cause apparently it is on the pA-7 docs.
  * the normal isn't updated in real time cause its too much of a hassle

- v.0.2.1 - added delete overlapping mesh on save(11/1/20-12.45 AM)
  * still buggy but we don't have anytime to fix it. (plus i'm lazy lol)

-- added backface culling to main(10/29/20-1.24 AM)

- v.0.2.0 - added save mesh, and change mesh color features(10/28/20-8.02 PM)
  * New update is added in v.0.0.3-1 folder (check the desc) of the folder

- v.0.1.3 - added z rotation, backface culling, and fix some bugs (10/24/20-3.16 AM)
  * z rotation by using "q" and "e" key press. (just like we discussed before).
  * added backface culling feature with a toggle button in the menu.
  * fixing the bugs on models.js and cube.json due to the added backface culling features.

- EXPERIMENTAL FEATURES - mouse click to change polygon points (10/22/20-10.21 AM)
  * hover to choose which polygon to control.
  * click on the polygon point to choose which point to control.
  * pressing the tilde key (usually the key before key "1") will confirm the selection.
  * click on anywhere in canvas. and click the tilde key while still clicking on canvas.
  * z position cannot be changed at the moment.

- v.0.1.2 - added edit existing polygon function (10/22/20-12.07 AM)
  * to edit existing polygon simply click on the polygon list u want to edit.
  * polygon input and the button will automatically change.

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
