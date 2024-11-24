
// ############################################################################################
// ############################################################################################
// ############################################################################################

import { Scene_Object } from "/ogl/core/scene_objects/scene_object.js";

const TAU = 2.0*Math.PI;

// ############################################################################################
// ############################################################################################
// ############################################################################################

export class Perspective_Camera extends Scene_Object {
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * construct a camera instance using the supplied aspect ratio
     *      then call the super's constructor
     */
    constructor( gl_context, aspect_ratio ){
        super(gl_context);
        // now handle the aspect ratio
        this.set_aspect_ratio( aspect_ratio );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * used to prepare references and settings, ***minimal calculations*** and
     *      ***no function calls*** should be performed during this stage
     */
    initialise_pre_event(){
        super.initialise_pre_event();

        this.fov_y = 1.2*TAU/7.0;
        this.z_near = 0.5;
        this.z_far = 50.0;
        this.aspect_ratio = 640.0/480.0;
    }
    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * used for initalising matrices and large setting information
     *      function calls are fine but should be limited as
     *      bloating this could cause excessive object creation
     *      overhead if we're creating and destroying objects often
     * 
     * this is where attribute locations are determined and the model shape is made
     *      which is handled by their respective functions
     */
    initialise_on_event(){
        super.initialise_on_event();

        // initialise the projection matrix
        this.view_matrix = mat4.create();
        this.projection_matrix = mat4.create();
        this.temp_view_projection = mat4.create();

        //    needs negative              [ -x,   -y,   -z   ]
        this.translation = vec3.fromValues( -0.0, -0.0, -2.3 );
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    get_projection_matrix(){
        // identity
        mat4.identity(this.projection_matrix);

        // first arg as the destination to receive result
        mat4.perspective(this.projection_matrix, this.fov_y, this.aspect_ratio, this.z_near, this.z_far);
        return this.projection_matrix;
    }
    get_view_matrix(){
        mat4.identity(this.view_matrix);

        mat4.translate(
            this.view_matrix,
            this.view_matrix,
            this.translation,
        );
        return this.view_matrix;
    }
    get_view_projection_matrix(){
        mat4.identity(this.temp_view_projection);

        // (static) multiply(out, a, b) → {mat4}
        // (static) invert(out, a) → {mat4}
        // (static) fromMat4(out, a) → {mat3}
        // (static) transpose(out, a) → {mat4}
        // (static) transpose(out, a) → {mat3}

        mat4.multiply( this.temp_view_projection, this.get_projection_matrix(), this.get_view_matrix());
        // mat4.multiply( parent_matrix, view_matrix, projection_matrix);

        return this.temp_view_projection;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    set_offset( x, y, z){
        this.translation = vec3.fromValues( x, y, z );

        // done, send back
        return this;
    }
    // now handle the aspect ratio
    set_aspect_ratio( aspect_ratio ){
        this.aspect_ratio = aspect_ratio;

        // done, send back
        return this;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################



    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * #### !! REPLACEMENT !!
     * 
     * operations performed on this object each frame with respect to the time scale provided
     *      by `delta_time` parameter
     */
    update_self( delta_time ){
        let new_aspect_ratio = this.gl_context.canvas.width/this.gl_context.canvas.height;
        
        // rebuild only when it's different
        if(new_aspect_ratio != this.aspect_ratio ){
            // now handle the aspect ratio
            this.set_aspect_ratio( new_aspect_ratio );
        }
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}

// ############################################################################################
// ############################################################################################
// ############################################################################################
