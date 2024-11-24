
import { Coordinate_Frame } from "/ogl/common/obj/scene_objects/coordinate_frame.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################



//   0.0 to 1.0:                    [   R,   G,   B,   A ]
const canvas_default_clear_colour = [ 0.1, 0.1, 0.1, 1.0 ];
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





export class Scene_Graph {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor( gl_context, aspectRatio ){
        // .. local references to gl and program info
        this.gl_context = gl_context;
        
        this.camera = new Camera( this.gl_context,aspectRatio );
        
        this.camera.set_offset([ -0.0, -0.0, -4.3 ]);

        this.coordinate_frame = new Coordinate_Frame( this.gl_context, null );

        // empty list
        this.object_list = [];
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    /**
     * @brief provide an object and the relevant functions used during updates/draws for the object
     * 
     * @param {*} object_to_add scene object to add
     * @param {*} update_function the relevant update function with 1 parameter for delta_time
     * @param {*} draw_function  the draw function for the object, 2 parameters of camera_view, and camera_projection matrices
     */
    add_object( object_to_add, update_function, draw_function ){
        // prepare
        let object_list_addition = {
            // this is the object itself
            instance: object_to_add,
            // how we update the object
            update: update_function,
            // how we draw it
            draw: draw_function,
        };
        // put it in our list
        this.object_list.push( object_list_addition );
        // give back self reference
        return this;
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    set_camera_offset( x, y, z ){
        // tell camera to change
        this.camera.set_offset([ x, y, z ]);

        // give back self reference
        return this;
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    update( delta_time, aspectRatio ){
        this.coordinate_frame.update(delta_time);

        // this.triangle.update(delta_time);
        this.camera.update(delta_time, aspectRatio);

        // handle updating all our objects
        this.object_list.forEach(object_to_update => {
            // this is like we're saying 
            //  obj.update_function_name( delta_time )
            object_to_update.update.apply( object_to_update.instance, [delta_time] );
        });
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepare_draw_context(){
        // clear the screen
        this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);
    }
    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(){
        let world_to_ndc_matrix = this.camera.get_view_projection_matrix();

        this.coordinate_frame.draw( world_to_ndc_matrix );

        // // handle drawing all our objects
        // this.object_list.forEach(
        //     object_to_draw => {
        //         // this is like we're saying 
        //         //  obj.draw_function_name( camera_view_mat4, camera_projection_mat4 )
        //         object_to_draw.draw.apply( object_to_draw.instance, [ camera_view_mat4, camera_projection_mat4 ] );
        //     }
        // );
    }
}

// ############################################################################################
// ############################################################################################
// ############################################################################################



export class Canvas_Object {


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // ...
    constructor(canvas_name, canvas_clear_colour){
        // save the name of the canvas
        this.canvas_name = canvas_name;

        // get the canvas element
        this.canvas_element = document.querySelector(`#${canvas_name}`);

        // get webgl context
        this.gl_context =  this.canvas_element.getContext("webgl");
        this.aspect_ratio = this.canvas_element.width/this.canvas_element.height;

        // save our clear colour
        this.canvas_clear_colour = canvas_clear_colour;

        // prepare time
        this.old_time = Date.now();

        this.scene_obj = new Scene_Graph(this.gl_context, this.aspect_ratio )
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    assign_scene_object(scene_obj){
        // save it
        this.scene_obj = scene_obj;
        
        // give back reference
        return this;
    }
    get_scene_object(){
        return this.scene_obj;
    }

    get_gl_context(){
        return this.gl_context;
    }
    set_content_update_function(new_update_function){
        // replace our functional interface
        this.content_update = new_update_function;
        // give back reference
        return this;
    }
    set_content_draw_function(new_draw_function){
        // replace our functional interface
        this.content_draw = new_draw_function;
        // give back reference
        return this;
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    frame_update( new_time ){
        // ... generate delta time
        const delta_time = (new_time - this.old_time)/1000.0;
        this.old_time = new_time;

        // do update
        this.content_update(delta_time);
        // then draw
        this.content_draw();
        
        // give back reference
        return this;
    }



    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    content_update( delta_time ){
        this.scene_obj.update( delta_time, this.aspect_ratio );
        this.prepare_context();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    // prepares for drawing
    prepare_context(){
        this.gl_context.clearColor(this.canvas_clear_colour[0], this.canvas_clear_colour[1], this.canvas_clear_colour[2], this.canvas_clear_colour[3]); // clear to black
        this.gl_context.clearDepth(1.0); // clear everything
    
        this.gl_context.enable(this.gl_context.DEPTH_TEST); // enable depth testing
        this.gl_context.depthFunc(this.gl_context.LEQUAL); // near things obscure far things
        
        this.gl_context.enable(this.gl_context.CULL_FACE);
        this.gl_context.cullFace(this.gl_context.FRONT);
        
        this.gl_context.enable(this.gl_context.BLEND);
        this.gl_context.blendFunc(this.gl_context.SRC_ALPHA, this.gl_context.ONE_MINUS_SRC_ALPHA);
        // this.gl_context.blendFunc(this.gl_context.ONE, this.gl_context.ONE_MINUS_SRC_ALPHA);

        this.scene_obj.prepare_draw_context();
        // give back reference
        return this;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    content_draw(){
        // draw the scene
        this.scene_obj.draw();
    }


    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    static new_with_camera_offset( canvas_element_name, camera_offset_x, camera_offset_y, camera_offset_z ){
        let canvas_app = new Canvas_Object( canvas_element_name, canvas_default_clear_colour );
    
        // prepare the scene
        canvas_app.get_scene_object()
            .set_camera_offset( camera_offset_x, camera_offset_y, camera_offset_z );
    
        // give it to the asker
        return canvas_app;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    
}

// ############################################################################################
// ############################################################################################
// ############################################################################################



export class Scene_Graph_Manager {
    constructor( maximum_fps ){
        this.app_list = [];
        
        //   0.0 to 1.0:                   [   R,   G,   B,   A ]
        this.canvas_default_clear_colour = [ 0.1, 0.1, 0.1, 1.0 ];

        this.verbose_logging = true;
        this.maximum_fps = maximum_fps;
        this.time_between_frames = 1000.0/this.maximum_fps;
        this.hook_load_event();
    }
    hook_load_event(){
        window.addEventListener( "load", (event)=>{
            if(this.verbose_logging){ console.log("--- preparing managed page content ---"); }
            this.page_main();
            
            if(this.verbose_logging){ console.log("--- preparing managed canvases ---"); }
            this.app_main();
    
            if(this.verbose_logging){ console.log("--- starting apps ---"); }
            this.start();
        } );
    }
    start(){
        let self_reference = this;
        setInterval(
            function () {
                requestAnimationFrame(
                        (t) => {
                            self_reference.app_list.forEach(app_instance => {
                                app_instance.frame_update( t );
                            });
                        }
                    );
            },
            this.time_between_frames
        );
    }
    page_main(){
        // override to include things
        console.log("initialising page...");
    }
    app_main(){
        // override to include things
        console.log("initialising canvases...");
    
        this.prepare_new_app( "webgl_scene_graph_01", -0.0, -0.0, -1.1 );
    }

    prepare_new_app( canvas_element_name, camera_offset_x, camera_offset_y, camera_offset_z ){
        // construct and add
        this.app_list.push( Canvas_Object.new_with_camera_offset( canvas_element_name, camera_offset_x, camera_offset_y, camera_offset_z ) );
    }

}


// ############################################################################################
// ############################################################################################
// ############################################################################################


let page_manager = new Scene_Graph_Manager( 40 );


// ############################################################################################
// ############################################################################################
// ############################################################################################
