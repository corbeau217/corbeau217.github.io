import { Shader_Manager } from "/ogl/common/shaders/shader_engine.js";
import { VERTEX_SHADER_SRC as shape_wrapper_default_vertex_source } from "../shaders/shape_wrapper_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as shape_wrapper_default_fragment_source } from "../shaders/shape_wrapper_fragment_shader.js";

export class Shape_Wrapper {
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    constructor( gl_context ){
        // gather our context
        this.gl_context = gl_context;
        // gather our shader
        this.shader_manager = new Shader_Manager(this.gl_context);
        this.managed_shader = this.shader_manager.new_shader( shape_wrapper_default_vertex_source, shape_wrapper_default_fragment_source );
        this.shader = this.managed_shader.get_shader_program();

        // settings
        this.prepare_settings();

        // initialise our attribute information
        this.initialise_mesh_attribute_locations();
    }
    prepare_settings(){
        // ...
    }
    // once on construction
    initialise_mesh_attribute_locations(){
        //. ..
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // when we load the buffers with data
    prepare_attribute_data(){
        // ...
    }
    // when announcing a new shape to use
    replace_shape(shape_replacement){
        // ..
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // before each draw
    prepare_uniforms( view_matrix, projection_matrix ){
        // ...
    }
    // each frame before a draw
    update( delta_time ){
        // ...
    }
    draw_self(){
        // ... override with things?
        // this.gl_context.drawElements(this.gl_context.TRIANGLES, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);
        // this.gl_context.drawElements(this.gl_context.POINT, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);
    }
    draw( view_matrix, projection_matrix ){
        // select our shader as being used
        this.gl_context.useProgram(this.shader);
        // ...

        // load the data
        this.managed_shader.enable_attributes();
        this.prepare_uniforms( view_matrix, projection_matrix );


        // do the drawing
        this.draw_self();

        // cleanup
        this.managed_shader.disable_attributes();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}