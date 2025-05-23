
import { Triangle } from "./objects/triangle.js";

const TAU = 2.0*Math.PI;

class Scene {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor( gl_context ){
        // .. local references to gl and program info
        this.gl_context = gl_context;

        // generate triangle
        this.triangle = new Triangle( this.gl_context );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    update( deltaTime ){
        this.triangle.update(deltaTime);
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        this.triangle.draw();
    }
}

export { Scene }; // que pasa? modules?