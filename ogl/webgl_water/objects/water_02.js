import { Planar_Shape } from "../../common/obj/planar_shape.js";
import { Water } from "./water.js";
import {
    explode_mesh_with_references,
    generate_normals_for_explode_vertices,
} from "/ogl/common/util/geometry.js";
import { FRAGMENT_SHADER_SRC } from "../shaders/water_02_fragment_shader.js";
import { VERTEX_SHADER_SRC } from "../shaders/water_02_vertex_shader.js";
import { generate_shader_program } from "/ogl/common/shaders/shader_engine.js";


export class Water_02 extends Water {
    constructor( gl_context ){
        super( gl_context );

        // replace with a better shader
        this.shader = generate_shader_program( this.gl_context, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC );


        this.light_source_vector = {
            x: 0.0,
            y: 0.0,
            z: 0.0,
        };


        this.rebuild_mesh_as_exploded();
    }

    // ###########################################
    // ###########################################

    rebuild_mesh_as_exploded(){
        // gather the data when it's by face
        this.exploded_mesh_data = explode_mesh_with_references( this.vertices, this.indices, this.vertex_references );

        // replace our vertices and bindings with the generated information
        this.vertices = this.exploded_mesh_data.vertices;
        this.indices = this.exploded_mesh_data.indices;
        this.vertex_references = this.exploded_mesh_data.references;
        this.face_count = this.exploded_mesh_data.face_count;

        
        // rebuild our mesh bindings
        this.bind_mesh_attributes();
        // rebuild our referencing information
        this.prepare_mesh_mapping_attribute();


        
        // generate normal vectors
        this.normals = generate_normals_for_explode_vertices( this.vertices, this.face_count );

        // gather the attribute shader location
        this.normal_location = this.gl_context.getAttribLocation(this.shader, "a_normal");

        // generate a buffer for the normals
        this.normal_buffer = this.gl_context.createBuffer();
        
        // fill the buffer with information
        this.prepare_mesh_attribute_normals();
    }

    // ###########################################
    // ###########################################

    prepare_mesh_attribute_normals(){
        // select references as the one we're working with
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.normal_buffer);
    
        // load the reference data
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.normals),
          this.gl_context.STATIC_DRAW,
        );
        // map it to our attribute
        this.gl_context.vertexAttribPointer(
            this.normal_location,
            3,
            this.gl_context.FLOAT,
            false,
            0,
            0,
        );
    }

    
    // ###########################################
    // ###########################################

    prepare_uniforms( camera_view_matrix, camera_projection_matrix ){
        // --- directly replace super
        // --------------------------------------------------------

        let model_view = mat4.create();
        let model_view_projection = mat4.create();
        let model_view_inverse = mat4.create();
        let normal_matrix = mat3.create();

        // --------------------------------------------------------
        
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_mesh_quad_count"), this.column_count, this.row_count );
        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_source_vector"), this.light_source_vector.x, this.light_source_vector.y, this.light_source_vector.z );
        
        // --------------------------------------------------------
        // --- build matrices

        // (static) multiply(out, a, b) → {mat4}
        mat4.multiply( model_view, camera_view_matrix, this.model_matrix);

        // (static) multiply(out, a, b) → {mat4}
        mat4.multiply( model_view_projection, camera_projection_matrix, model_view);

        // (static) invert(out, a) → {mat4}
        mat4.invert( model_view_inverse, model_view);

        // (static) fromMat4(out, a) → {mat3}
        mat3.fromMat4(normal_matrix, model_view_inverse);

        // (static) transpose(out, a) → {mat4}
        // (static) transpose(out, a) → {mat3}
        mat3.transpose(normal_matrix, normal_matrix);

        // --------------------------------------------------------

        this.gl_context.uniformMatrix4fv( this.gl_context.getUniformLocation(this.shader, "u_mvp_matrix"), false, model_view_projection );
        this.gl_context.uniformMatrix3fv( this.gl_context.getUniformLocation(this.shader, "u_normal_matrix"), false, normal_matrix );

        // --------------------------------------------------------
    }
    
    // ###########################################
    // ###########################################

    enable_attributes(){
        super.enable_attributes();
        // ...
        this.gl_context.enableVertexAttribArray(this.normal_location);
    }
    disable_attributes(){
        super.disable_attributes();
        // ...
        this.gl_context.disableVertexAttribArray(this.normal_location);
    }

    // ###########################################
    // ###########################################

    update( delta_time ){
        super.update( delta_time );
        // ...
    }

    // ###########################################
    // ###########################################
}