
import { Sphere } from "./objects/sphere.js";
import { Camera } from "/webgl1/old_common/camera/old_camera.js";

const TAU = 2.0*Math.PI;

export class Scene_Sphere {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor( gl_context, aspectRatio ){
        // .. local references to gl and program info
        this.gl_context = gl_context;
        
        this.sphere = new Sphere( this.gl_context );
        this.camera = new Camera( this.gl_context,aspectRatio );

        this.camera.set_offset([ -0.0, -0.0, -4.3 ]);
    }

    update( deltaTime, aspectRatio ){
        // this.triangle.update(deltaTime);
        this.camera.update(deltaTime, aspectRatio);
        this.sphere.update(deltaTime);
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        // this.triangle.draw();
        this.sphere.draw( this.camera.getViewMatrix(), this.camera.getProjectionMatrix() );
    }
}