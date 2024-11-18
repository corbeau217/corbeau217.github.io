import { Planar_Shape } from "../../common/obj/planar_shape.js";
import { Water } from "./water.js";
// import { explode_mesh } from "/ogl/common/util/geometry.js";
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
        // this.exploded_mesh_data = explode_mesh( this.vertices, this.indices );
        
        // // rebuild our mesh bindings
        // this.bind_mesh_attributes();
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