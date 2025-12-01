# Matt's Serve Robotics Live Map


## The project has two parts

### Server
- First, `cd` to `/server` and run `npm install` and then `npm start`. This will start the server to generate the robot coordinates and supply the frontend with an array of robot positions to render.

### Front-end
- Once the server is running, from the root `/`, run `npm install` to install all project packages. Then, run `npm start` to start the front-end of the project.


### Front-end
- Built with React, it uses open streetmap to generate the map tiles.  
- Uses React Leaflet to generate a popover visible on hover of each robot to show its number and geo positioning.