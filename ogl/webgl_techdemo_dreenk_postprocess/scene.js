
import { Triangle } from "./objects/triangle.js";
import { Can } from "./objects/can.js";
import { Camera } from "./objects/camera.js";

const TAU = 2.0*Math.PI;

class Scene {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor( gl_context, aspectRatio ){
        // .. local references to gl and program info
        this.gl_context = gl_context;

        // generate triangle
        // this.triangle = new Triangle( this.gl_context );
        this.can = new Can( this.gl_context );
        this.camera = new Camera( this.gl_context,aspectRatio );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    update( deltaTime, aspectRatio ){
        // this.triangle.update(deltaTime);
        this.camera.update(deltaTime, aspectRatio);
        this.can.update(deltaTime);
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        // this.triangle.draw();
        this.can.draw( this.camera.getViewMatrix(), this.camera.getProjectionMatrix() );
    }
}

export { Scene }; // que pasa? modules?