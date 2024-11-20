import { Planar_Shape } from "../../common/obj/planar_shape.js";
import { FRAGMENT_SHADER_SRC } from "../shaders/water_fragment_shader.js";
import { VERTEX_SHADER_SRC } from "../shaders/water_vertex_shader.js";
import { generate_shader_program } from "/ogl/common/shaders/shader_engine.js";


export class Water {
    constructor( gl_context ){
        // gather our context
        this.gl_context = gl_context;
        // gather our shader
        this.shader = generate_shader_program( this.gl_context, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC );
        
        // settings
        this.prepare_settings();

        // create our mesh
        this.generate_mesh();
        this.initialise_mesh_buffers();

        // deal with data
        this.prepare_mesh_attribute_locations();
        this.bind_mesh_attributes();
        this.prepare_mesh_mapping_attribute();
    }

    // ###########################################
    // ###########################################

    prepare_settings(){

        this.column_count = 10;
        this.row_count = 10;

        // the shape to use
        //  we're saying false for clockwise winding
        //  we're saying true for xz axis
        this.shape = new Planar_Shape( this.column_count, this.row_count, false, true );

        // our model matrix
        this.model_matrix = mat4.create();
    }

    // ###########################################
    // ###########################################

    generate_mesh(){
        // raw shape
        this.vertices = this.shape.get_vertices();
        this.indices = this.shape.get_bindings();
        this.vertex_references = this.shape.get_vertex_references();
        this.face_count = this.shape.get_face_count();
    }
    initialise_mesh_buffers(){
        this.vertex_buffer = this.gl_context.createBuffer();
        this.indices_buffer = this.gl_context.createBuffer();
        this.vertex_reference_buffer = this.gl_context.createBuffer();
    }

    // ###########################################
    // ###########################################
    
    prepare_mesh_attribute_locations(){
        this.vertex_position_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_position");
        this.vertex_reference_location = this.gl_context.getAttribLocation(this.shader, "a_vertex_reference");
    }
    bind_mesh_attributes(){
        // prepare the index buffer as the one we're working on
        this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indices_buffer);
        // announce the data as our indices/bindings data
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices),
            this.gl_context.STATIC_DRAW
        );

        // prepare the vertex position buffer as the one to work on
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.vertex_buffer);
        // load the positions into the buffer
        this.gl_context.bufferData(
            this.gl_context.ARRAY_BUFFER,
            new Float32Array(this.vertices),
            this.gl_context.STATIC_DRAW
        );
        // link it to our attribute for usage in the shader
        this.gl_context.vertexAttribPointer(
            this.vertex_position_location,
            4,
            this.gl_context.FLOAT,
            false,
            0,
            0
        );
    }

    // ###########################################
    // ###########################################

    prepare_mesh_mapping_attribute(){
        // select references as the one we're working with
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.vertex_reference_buffer);
    
        // load the reference data
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.vertex_references),
          this.gl_context.STATIC_DRAW,
        );
        // map it to our attribute
        this.gl_context.vertexAttribPointer(
            this.vertex_reference_location,
            2,
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );
    }

    // ###########################################
    // ###########################################

    prepare_drawing_environment(){
        // start up our shader
        this.gl_context.useProgram(this.shader);
    }

    // ###########################################
    // ###########################################

    prepare_uniforms( camera_view_matrix, camera_projection_matrix ){
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_mesh_quad_count") , this.column_count, this.row_count );
        
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_model_matrix"), false, this.model_matrix );
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_view_matrix"), false, camera_view_matrix );
        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_projection_matrix"), false, camera_projection_matrix );
    }

    // ###########################################
    // ###########################################

    enable_attributes(){
        this.gl_context.enableVertexAttribArray(this.vertex_position_location);
        this.gl_context.enableVertexAttribArray(this.vertex_reference_location);
    }
    disable_attributes(){
        this.gl_context.disableVertexAttribArray(this.vertex_reference_location);
        this.gl_context.disableVertexAttribArray(this.vertex_position_location);
    }

    // ###########################################
    // ###########################################

    update( delta_time ){
        // zzzz
    }
    draw( camera_view_matrix, camera_projection_matrix ){
        // setup our shader etc
        this.prepare_drawing_environment();

        // load the data
        this.enable_attributes();
        this.prepare_uniforms( camera_view_matrix, camera_projection_matrix );

        // do the drawing
        this.gl_context.drawElements(this.gl_context.TRIANGLES, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.POINT, this.face_count*3, this.gl_context.UNSIGNED_SHORT, 0);

        // cleanup
        this.disable_attributes();
    }

    // ###########################################
    // ###########################################
}