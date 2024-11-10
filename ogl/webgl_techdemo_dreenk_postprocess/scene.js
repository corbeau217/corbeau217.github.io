
import { Camera } from "./objects/camera.js";
import { Can } from "./objects/can.js";

const TAU = 2.0*Math.PI;

class Scene {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor( gl_context ){
        // .. local references to gl and program info
        this.gl_context = gl_context;
        // this.programInfo = programInfo;
        
        this.aspectRatio = gl_context.canvas.clientWidth / gl_context.canvas.clientHeight;

        // generate the camera
        this.camera = new Camera(this.aspectRatio);
        // here's where we call the "routine" that builds all the objs we'll be drawing
        // buffers = initBuffers(gl,CIRCLE_POINTS);
        this.can = new Can( this.gl_context );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    update( deltaTime ){
        this.aspectRatio = this.gl_context.canvas.clientWidth / this.gl_context.canvas.clientHeight;
        this.camera.update(deltaTime,this.aspectRatio);
        this.can.update(deltaTime);
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        // clear canvas before we start drawing on it
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT);
        this.gl_context.clear(this.gl_context.DEPTH_BUFFER_BIT);

        this.can.draw( this.camera.getViewMatrix(), this.camera.getProjectionMatrix() );
    }
}


  





export { Scene }; // que pasa? modules?