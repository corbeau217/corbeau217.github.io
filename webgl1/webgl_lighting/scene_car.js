
import { Vehicle } from "./objects/vehicle.js";
import { Camera } from "/webgl1/old_common/camera/old_camera.js";

const TAU = 2.0*Math.PI;

export class Scene_Car {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor( gl_context, aspectRatio ){
        // .. local references to gl and program info
        this.gl_context = gl_context;
        
        this.vehicle = new Vehicle( this.gl_context );
        this.camera = new Camera( this.gl_context,aspectRatio );

        this.camera.set_offset([ -0.0, -0.0, -4.3 ]);
    }

    update( deltaTime, aspectRatio ){
        // this.triangle.update(deltaTime);
        this.camera.update(deltaTime, aspectRatio);
        this.vehicle.update(deltaTime);
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        // this.triangle.draw();
        this.vehicle.draw( this.camera.getViewMatrix(), this.camera.getProjectionMatrix() );
    }
}