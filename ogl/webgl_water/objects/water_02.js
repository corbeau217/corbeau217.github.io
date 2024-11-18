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

        this.normals = generate_normals_for_explode_vertices( this.vertices, this.face_count );
        
        // rebuild our mesh bindings
        this.bind_mesh_attributes();
        this.prepare_mesh_mapping_attribute();
    }

    // ###########################################
    // ###########################################

    prepare_uniforms( camera_view_matrix, camera_projection_matrix ){
        super.prepare_uniforms( camera_view_matrix, camera_projection_matrix );
        // ...
    }

    // ###########################################
    // ###########################################

    enable_attributes(){
        super.enable_attributes();
        // ...
    }
    disable_attributes(){
        super.disable_attributes();
        // ...
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