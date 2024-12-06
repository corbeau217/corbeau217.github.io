import { Planar_Shape } from "../../old_common/obj/planar_shape.js";
import { Water } from "./water.js";
import {
    explode_mesh_with_references,
    generate_normals_for_explode_vertices,
} from "/webgl1/lib/util/geometry.js";
import { FRAGMENT_SHADER_SRC } from "../shaders/water_02_fragment_shader.js";
import { VERTEX_SHADER_SRC } from "../shaders/water_02_vertex_shader.js";
import { generate_shader_program } from "/ext/webgl_1_core/src/shader_util/shader_engine.js";

const SQRT_OF_3 = 1.73205080757;

export class Water_02 extends Water {
    // ################################## -- WATER -- OVERRIDES
    // ###########################################
    // ###########################################

    constructor( gl_context ){
        super( gl_context );

        this.replace_shader( VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC );

        // defer so we can overwrite
        this.customise_mesh_shape();
    }
    prepare_settings(){
        super.prepare_settings();

        this.model_matrix = mat4.create();

        // (static) scale(out, a, v) → {mat4}
        this.scale = vec3.fromValues(1.5, 1.0, 1.5);

        this.rotation_y = 1.0*Math.PI/12.0;

        this.light_source_vector = { x: 4.0, y: 3.0, z: -3.5 };

        this.light_ambient_intensity = { r: 0.2, g: 0.2, b: 0.2 };

        this.shape_colour = { r: 0.9, g: 0.5, b: 0.2, a: 1.0 };


        mat4.scale( this.model_matrix, this.model_matrix, this.scale);
        mat4.rotateY( this.model_matrix, this.model_matrix, this.rotation_y );
    }

    initialise_mesh_buffers(){
        super.initialise_mesh_buffers();

        // generate a buffer for the normals
        this.normal_buffer = this.gl_context.createBuffer();
    }

    initialise_mesh_attribute_locations(){
        super.initialise_mesh_attribute_locations();
        this.normal_attribute_index = this.managed_shader.declare_managed_attribute_location("a_normal");
    }

    prepare_mesh_attribute_locations(){
        super.prepare_mesh_attribute_locations();

        // gather the attribute shader location
        // this.normal_location = this.managed_shader.get_attribute_location("a_normal");
        this.normal_location = this.managed_shader.get_attribute_location_by_index( this.normal_attribute_index );
    }

    prepare_uniforms( camera_view_matrix, camera_projection_matrix ){
        // --- directly replace super
        // --------------------------------------------------------

        let model_view = mat4.create();
        let model_view_projection = mat4.create();
        let model_view_inverse = mat4.create();
        let normal_matrix = mat3.create();

        // --------------------------------------------------------
        
        this.gl_context.uniform2f( this.gl_context.getUniformLocation(this.shader, "u_mesh_quad_count"), this.column_count, this.row_count );
        this.gl_context.uniform4f( this.gl_context.getUniformLocation(this.shader, "u_shape_colour"), this.shape_colour.r, this.shape_colour.g, this.shape_colour.b, this.shape_colour.a );

        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_source_vector"), this.light_source_vector.x, this.light_source_vector.y, this.light_source_vector.z );
        this.gl_context.uniform3f( this.gl_context.getUniformLocation(this.shader, "u_light_ambient_intensity"), this.light_ambient_intensity.r, this.light_ambient_intensity.g, this.light_ambient_intensity.b );
        
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
    
    enable_attributes(){
        super.enable_attributes();
        // ...
        this.managed_shader.enable_attributes();
        // this.gl_context.enableVertexAttribArray(this.normal_location);
    }
    disable_attributes(){
        super.disable_attributes();
        // ...
        this.managed_shader.disable_attributes();
        // this.gl_context.disableVertexAttribArray(this.normal_location);
    }

    // NEW FUNCTIONS #################### -- WATER_02
    // ###########################################
    // ###########################################

    replace_shader( vertex_source, fragment_source ){
        // out with the old
        this.managed_shader.replace_shader_code(vertex_source, fragment_source);
        
        // in with the new
        this.shader = this.managed_shader.get_shader_program();

        // relocated the things
        this.prepare_mesh_attribute_locations();
    }

    customise_mesh_shape(){
        this.z_function = (x,y)=>{return (-Math.cos(x) * Math.sin(y));};
        this.remap_z_values();

        this.rebuild_mesh_as_exploded();
    }

    remap_z_values(){
        // total number
        let vertex_count = (this.column_count+1)*(this.row_count+1);

        // to handle when it's actually y we're modifying
        let x_index = 0;
        let y_index = (this.shape.use_xz_axis)? 2 : 1;
        let z_index = (this.shape.use_xz_axis)? 1 : 2;

        // every vertex
        for (let vertex_index = 0; vertex_index < vertex_count; vertex_index++) {
            const vertices_offset = (vertex_index*4);
            // the element to change
            const value_to_change = vertices_offset+z_index;
            
            // set the value
            this.vertices[value_to_change] = this.z_function(
                this.vertices[vertices_offset+x_index],
                this.vertices[vertices_offset+y_index],
            );
            
        }
    }

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

        // generate a buffer for the normals
        this.normal_buffer = this.gl_context.createBuffer();
        
        // fill the buffer with information
        this.prepare_mesh_attribute_normals();
    }

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
}