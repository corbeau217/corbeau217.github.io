// ############################################################################################
// ############################################################################################
// ############################################################################################

import { Camera } from "./perspective_camera.js";

const TAU = 2.0*Math.PI;

// ############################################################################################
// ############################################################################################
// ############################################################################################

export class Orbital_Perspective_Camera extends Camera {
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

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

        // new vector for our rotation
        this.rotation_speed = vec3.fromValues(0.0, 0.2, 0.0);

        // matrix to speed things up
        this.rotation_matrix = mat4.create();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * #### !! replacement !!
     * 
     * @returns view matrix of the camera
     */
    get_view_matrix(){
        mat4.identity(this.view_matrix);

        mat4.translate(
            this.view_matrix,
            this.view_matrix,
            this.translation,
        );

        // (static) multiply(out, a, b) → {mat4}
        mat4.multiply(this.view_matrix, this.view_matrix, this.rotation_matrix);


        // give back view matrix
        return this.view_matrix;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * ### OVERRIDE OF SUPER FUNCTION
     * 
     * operations performed on this object each frame with respect to the time scale provided
     *      by `delta_time` parameter
     */
    update_self( delta_time ){
        super.update_self( delta_time );

        // (static) clone(a) → {vec3}
        // Creates a new vec3 initialized with values from an existing vector 
        
        // (static) scale(out, a, b) → {vec3}
        // Scales a vec3 by a scalar number 

        // (static) add(out, a, b) → {vec3}
        // Adds two vec3's 

        // get speed
        let rotation_factor_vec3 = vec3.clone(this.rotation_speed);
        // scale by time scale
        vec3.scale(rotation_factor_vec3, rotation_factor_vec3, delta_time);

        this.rotate_self( rotation_factor_vec3 );
    }

    /**
     * apply rotation by vec3 containing the "euler angles"
     */
    rotate_self( rotation_factor_vec3 ){
        // ...

        // rotate our rotation matrix using it
        // oh my dog it's our boy Euler, once again
        //                  https://en.wikipedia.org/wiki/Euler_angles#Conversion_to_other_orientation_representations
        //             heck https://en.wikipedia.org/wiki/Gimbal_lock#Loss_of_a_degree_of_freedom_with_Euler_angles
        //             more https://learnopengl.com/Getting-started/Transformations
        //         and more https://eecs.qmul.ac.uk/~gslabaugh/publications/euler.pdf
        // kylo ren: MORE - https://en.wikipedia.org/wiki/Rotation_matrix

        // (static) rotateX(out, a, rad) → {mat4}
        // Rotates a matrix by the given angle around the X axis 

        // (static) rotateY(out, a, rad) → {mat4}
        // Rotates a matrix by the given angle around the Y axis 

        // (static) rotateZ(out, a, rad) → {mat4}
        // Rotates a matrix by the given angle around the Z axis 

        // this.rotation_matrix
        //TODO: suffering
        
        mat4.rotateY(this.rotation_matrix, this.rotation_matrix, rotation_factor_vec3[1]);
        mat4.rotateX(this.rotation_matrix, this.rotation_matrix, rotation_factor_vec3[0]);
        mat4.rotateZ(this.rotation_matrix, this.rotation_matrix, rotation_factor_vec3[2]);
    }
}

// ############################################################################################
// ############################################################################################
// ############################################################################################
