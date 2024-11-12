const TAU = 2.0*Math.PI;

class Camera {
    // construct a camera instance using the supplied aspect ratio
    constructor( aspectRatio ){
        // prepare the camera information
        
        //    needs negative  [   -x,   -y,   -z ]
        this.offset = [ -0.0, -0.0, -2.3 ];
        this.fov_y = 1.2*TAU/7.0;
        this.z_near = 0.5;
        this.z_far = 50.0;
        this.aspect = aspectRatio;
        
        // build the matrices

        // initialise the projection matrix
        this.projectionMatrix = mat4.create();

        // === handle view ===
        this.buildViewMatrix();

        // === handle projection ===
        this.buildProjectionMatrix();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    buildViewMatrix(){
        // init as identity
        this.viewMatrix = mat4.create();
        
        mat4.translate(
            this.viewMatrix,
            this.viewMatrix,
            this.offset,
            // [-0.0, 0.0, -6.0],
        );
    }
    buildProjectionMatrix(){
        // init as identity
        this.projectionMatrix = mat4.create();

        // first arg as the destination to receive result
        mat4.perspective(this.projectionMatrix, this.fov_y, this.aspect, this.z_near, this.z_far);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    update( deltaTime, aspectRatio ) { 
        // .. erm
        if(aspectRatio != this.aspect ){
            // ...
            this.aspect = aspectRatio;
            // this.buildViewMatrix();
            this.buildProjectionMatrix();
            // console.log("rebuilt projection matrix");
        }
    }

    getProjectionMatrix(){
        return this.projectionMatrix;
    }

    getViewMatrix(){
        return this.viewMatrix;
    }

    set_offset(new_offset_float_array){
        this.offset = new_offset_float_array;
        this.buildViewMatrix();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}

// ############################################################################################
// ############################################################################################
// ############################################################################################


export { Camera };