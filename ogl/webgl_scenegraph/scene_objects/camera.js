
// ############################################################################################
// ############################################################################################
// ############################################################################################

const TAU = 2.0*Math.PI;

// ############################################################################################
// ############################################################################################
// ############################################################################################

export class Camera {
    // construct a camera instance using the supplied aspect ratio
    constructor( aspectRatio ){
        // prepare the camera information
        
        //    needs negative  [   -x,   -y,   -z ]
        this.offset = vec3.fromValues(-0.0, -0.0, -2.3);
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
        return this.viewMatrix;
    }
    buildProjectionMatrix(){
        // init as identity
        this.projectionMatrix = mat4.create();

        // first arg as the destination to receive result
        mat4.perspective(this.projectionMatrix, this.fov_y, this.aspect, this.z_near, this.z_far);
        return this.projectionMatrix;
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
            this.buildViewMatrix();
        }
    }

    getProjectionMatrix(){
        return this.projectionMatrix;
    }

    getViewMatrix(){
        return this.viewMatrix;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    get_view_projection_matrix(){
        let view_projection = mat4.create();

        // (static) multiply(out, a, b) → {mat4}
        // (static) invert(out, a) → {mat4}
        // (static) fromMat4(out, a) → {mat3}
        // (static) transpose(out, a) → {mat4}
        // (static) transpose(out, a) → {mat3}

        mat4.multiply( view_projection, this.getProjectionMatrix(), this.getViewMatrix());
        // mat4.multiply( parent_matrix, view_matrix, projection_matrix);

        return view_projection;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    set_offset(offset_value_list){
        this.offset = vec3.fromValues(offset_value_list[0],offset_value_list[1],offset_value_list[2]);
        this.buildViewMatrix();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}

// ############################################################################################
// ############################################################################################
// ############################################################################################
