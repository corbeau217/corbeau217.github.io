
import { Can } from "./objects/can.js";
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

        // camera changes
        this.camera_change_timer = 0.0; // how long since last
        this.camera_change_interval = 4.0; // in seconds
        
        // we'll roll a position somewhere within this range
        this.camera_offset_range = {
            minimum: { x: -0.7, y: -0.5, z: -1.7, },
            maximum: { x:  0.7, y:  0.5, z: -6.7, },
        };
        // prepare one
        this.generate_next_camera_offset();
        
        this.can = new Can( this.gl_context );
        this.camera = new Camera( this.gl_context,aspectRatio );
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    // lerp means that:
    //   when we have `t` as 0, it will be the left value, and 1 will take the right value
    // 
    // left is the minimum and right is the maximum of a range (usually)
    //      if `t` is 0.5, then it should be right in the middle of the range created
    lerp(left_value, right_value, t){
        return (1.0-t)*left_value + (t)*right_value;
    }
    generate_next_camera_offset(){
        // this is the 't' value for our lerp function between minimum and maximums
        const offset_t = {
            x: Math.random(),
            y: Math.random(),
            z: Math.random(),
        };

        // generate the vector using our random values
        this.next_camera_offset = [
            this.lerp( this.camera_offset_range.minimum.x, this.camera_offset_range.maximum.x, offset_t.x),
            this.lerp( this.camera_offset_range.minimum.y, this.camera_offset_range.maximum.y, offset_t.y),
            this.lerp( this.camera_offset_range.minimum.z, this.camera_offset_range.maximum.z, offset_t.z),
        ];
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    update_camera( deltaTime ){
        // add delta time to our camera change timer
        if(deltaTime > 0){
            this.camera_change_timer += deltaTime;
        }
        // when we've gone past the change timeout
        if(this.camera_change_timer >= this.camera_change_interval) {
            // also start the timer again, keeping any extra we went over
            this.camera_change_timer = this.camera_change_timer % this.camera_change_interval;
            // lastly tell camera
            this.camera.set_offset(this.next_camera_offset);
            // reroll
            this.generate_next_camera_offset();
        }
    }

    update( deltaTime, aspectRatio ){
        // console.log(deltaTime);
        this.update_camera(deltaTime);
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