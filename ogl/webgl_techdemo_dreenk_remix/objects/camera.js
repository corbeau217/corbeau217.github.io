const TAU = 2.0*Math.PI;

class Camera {
    // ...
    constructor( aspectRatio ){
        // prepare the camera information
        
        //    needs negative  [   -x,   -y,   -z ]
        this.CAMERA_OFFSET = [ -0.0, -0.0, -8.0 ];
        this.CAMERA_FOV = 1.2*TAU/7.0;
        this.CAMERA_ZNEAR = 1;
        this.CAMERA_ZFAR = 50.0;
        this.aspect = aspectRatio;
        
        // build the matrices

        // initialise the projection matrix
        this.projectionMatrix = mat4.create();
        // build camera view matrix
        this.viewMatrix = mat4.create();

        // handle view

        
        mat4.translate(
            this.viewMatrix,
            this.viewMatrix,
            this.CAMERA_OFFSET,
            // [-0.0, 0.0, -6.0],
        );

        // handle projection

        // first arg as the destination to receive result
        mat4.perspective(this.projectionMatrix, this.CAMERA_FOV, this.aspect, this.CAMERA_ZNEAR, this.CAMERA_ZFAR);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    update( deltaTime ) { 
        // .. erm
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
}

// ############################################################################################
// ############################################################################################
// ############################################################################################


export { Camera };