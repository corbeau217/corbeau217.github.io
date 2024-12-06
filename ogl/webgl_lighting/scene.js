
import { TurboFan } from "./objects/turbofan.js";
import { Camera } from "/ogl/old_common/camera/old_camera.js";

const TAU = 2.0*Math.PI;

class Scene {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor( gl_context, aspectRatio ){
        // .. local references to gl and program info
        this.gl_context = gl_context;
        
        this.turbofan = new TurboFan( this.gl_context );
        this.camera = new Camera( this.gl_context,aspectRatio );

        this.camera.set_offset([ -0.0, -0.0, -4.3 ]);
    }

    update( deltaTime, aspectRatio ){
        // this.triangle.update(deltaTime);
        this.camera.update(deltaTime, aspectRatio);
        this.turbofan.update(deltaTime);
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        // this.triangle.draw();
        this.turbofan.draw( this.camera.getViewMatrix(), this.camera.getProjectionMatrix() );
    }
}

export { Scene }; // que pasa? modules?