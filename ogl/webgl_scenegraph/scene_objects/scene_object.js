// ############################################################################################
// ############################################################################################
// ############################################################################################

export class Scene_Object {
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * construct a new `Coordinate_Frame` scene object, providing it with a WebGL context to use
     * 
     * @warn avoid extending/modifying the constructor in derived objects and instead use the creation
     *      pipeline functions provided
     * 
     * @param {*} gl_context WebGL context for this object to use
     * @param {*} parent_object parent object to attach this object to, leave it as `null` if it's drawn
     *                  directly from the `Canvas_Object`
     */
    constructor( gl_context, parent_object ){
        // before creating the object
        this.fetch_required_resources();
        // construction event
        this.perform_construction_event( gl_context );
        // initialisation event
        this.perform_initialisation_event( parent_object );
    }
    /**
     * ### this function is to be overriden in derived objects to handle the fetching of
     *      information (like textures and shaders)
     */
    fetch_required_resources(){
        // TO BE EXTENDED IN DERIVED OBJECTS
    }

    /**
     * this is called by the constructor directly
     * 
     * ### this function should not be modified to preserve intended flow of the creation pipeline
     */
    perform_construction_event( gl_context ){
        this.construction_pre_event( gl_context );
        this.construction_on_event();
    }
    /**
     * this is called by the constructor directly
     * 
     * ### this function should not be modified to preserve intended flow of the creation pipeline
     */
    perform_initialisation_event( parent_object ){
        this.initialise_pre_event( parent_object );
        this.initialise_on_event();
        this.initialise_post_event();
    }
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * operations that happen before the construction of this object
     *      *[mostly reserved for linking this object to a webgl context]*
     * 
     * ***this should be modified very sparingly as it's before the shader is loaded***
     * 
     * @param {*} gl_context the context this object belongs to
     */
    construction_pre_event( gl_context ){
        this.gl_context = gl_context;
    }
    /**
     * operations that happen during the construction of this object
     *      this is mostly reserved for preparing our shader code to use
     *      in our shader program
     * 
     * at this stage the shader program is not yet setup, and any mesh information
     *      has been deferred to the initialisation event
     */
    construction_on_event(){
        // TO BE EXTENDED IN DERIVED OBJECTS
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    /**
     * used to prepare references and settings, ***minimal calculations*** and
     *      ***no function calls*** should be performed during this stage
     */
    initialise_pre_event( parent_object ){
        // information about location in scene graph
        this.parent = (parent_object!=undefined)?parent_object:null;
        this.children = [];
    }
    /**
     * used for initalising matrices and large setting information
     *      function calls are fine but should be limited as
     *      bloating this could cause excessive object creation
     *      overhead if we're creating and destroying objects often
     * 
     * this is where attribute locations are determined and the model shape is made
     *      which is handled by their respective functions
     */
    initialise_on_event(){
        // our model matrix
        this.model_matrix = mat4.create();
        // how we create the model to ndc matrix when this object is
        //      is drawn by a Canvas_Object
        this.temp_model_to_ndc_matrix = mat4.create();
        this.temp_parent_matrix = mat4.create();
    }
    /**
     * any operation that needs to happen during initialisation
     *      but requires that the object already have information
     *      ready to be used
     * 
     * this is effectively operations which arent part of initialisation
     *      but need to happen before the object is ready to be used
     */
    initialise_post_event(){
        // TO BE EXTENDED IN DERIVED OBJECTS
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * called by *parent object* in the scene graph or `Canvas_Object` responsible for this context
     * 
     * @param {*} delta_time time scale provided by the update caller (usually the web app draw loop)
     */
    update( delta_time ){
        // self then all children
        this.update_self( delta_time );
        this.update_children( delta_time );
    }
    /**
     * when this is drawn regardless of the parent object information
     * @param {*} view_matrix camera view matrix
     * @param {*} projection_matrix camera projection matrix
     */
    draw_as_scene_root( view_matrix, projection_matrix ){
        // --------------------------------------------------------
        // --- quick reference for gl min matrix

        // (static) multiply(out, a, b) → {mat4}
        // (static) invert(out, a) → {mat4}
        // (static) fromMat4(out, a) → {mat3}
        // (static) transpose(out, a) → {mat4}
        // (static) transpose(out, a) → {mat3}

        // --------------------------------------------------------
        // --- clear matrices

        mat4.identity(this.temp_parent_matrix);
        
        // --------------------------------------------------------
        // --- multiply matrices

        mat4.multiply( this.temp_parent_matrix, projection_matrix, view_matrix);

        // --------------------------------------------------------
        // --- perform standard drawing

        this.draw( this.temp_parent_matrix );
    }
    /**
     * TODO: *have a write up somewhere explaining the scene graph in greater detail than below, this is very word mouthful*
     * 
     * @param {*} model_to_parent_matrix transformations go from this model's *model-space* to the *world-space* which the
     *          provided `model_to_parent_matrix` is then applied to. it includes the *view and projection transformations*
     *          provided by the *scene root object* which this object has its transformations descendant from
     */
    draw( model_to_parent_matrix ){
        // --------------------------------------------------------
        // --- quick reference for gl min matrix

        // (static) multiply(out, a, b) → {mat4}
        // (static) invert(out, a) → {mat4}
        // (static) fromMat4(out, a) → {mat3}
        // (static) transpose(out, a) → {mat4}
        // (static) transpose(out, a) → {mat3}

        // --------------------------------------------------------
        // --- clear matrices
        
        // --------------------------------------------------------
        // --- multiply matrices

        mat4.multiply( this.temp_model_to_ndc_matrix, model_to_parent_matrix, this.model_matrix);

        // --------------------------------------------------------
        // --- perform standard drawing
        
        // self then all children
        this.draw_self();
        this.draw_children( this.temp_model_to_ndc_matrix );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * operations performed on this object each frame with respect to the time scale provided
     *      by `delta_time` parameter
     */
    update_self( delta_time ){
        // TO BE EXTENDED IN DERIVED OBJECTS
    }

    /**
     * draw this object using the already prepared `temp_model_to_ndc_matrix`
     */
    draw_self(){
        // TO BE EXTENDED IN DERIVED OBJECTS
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * called by `update( delta_time )` to handle deferring the update of all our child objects
     *          within our *scene graph*
     * 
     * @param {*} delta_time time scale provided by the update caller (usually the web app draw loop)
     */
    update_children( delta_time ){
        // loop through all child elements and call update
        for (let child_index = 0; child_index < this.children.length; child_index++) {
            const child_object = this.children[child_index];

            // make them do their draw
            child_object.update( delta_time );
        }
    }
    /**
     * defer drawing all the child elements for this object within the *scene graph*, and provide them with the matrix
     *          to transform them all the way to **Normalised Device Coordinates** as their model to parent matrix
     * 
     * assumes that  we've already updated the temp model to ndc matrix for them to use
     * 
     * TODO: *have NDC included in a write up about the transformation pipline*
     * 
     */
    draw_children( model_to_parent_matrix ){
        // loop through all child elements and call draw
        for (let child_index = 0; child_index < this.children.length; child_index++) {
            const child_object = this.children[child_index];

            // make them do their draw
            child_object.draw( model_to_parent_matrix );
        }
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
}

// ############################################################################################
// ############################################################################################
// ############################################################################################
