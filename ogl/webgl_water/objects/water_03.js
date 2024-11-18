import { Water_02 } from "./water_02.js";
import { FRAGMENT_SHADER_SRC } from "../shaders/water_02_fragment_shader.js";
import { VERTEX_SHADER_SRC } from "../shaders/water_03_vertex_shader.js";
import { generate_shader_program } from "/ogl/common/shaders/shader_engine.js";
import { Perlin_07 } from "./perlin_07.js";
// import { Perlin_Renderer } from "./perlin_renderer.js";

const SQRT_OF_3 = 1.73205080757;

export class Water_03 extends Water_02 {
    constructor( gl_context ){
        super( gl_context );

        // replace with a better shader
        this.shader = generate_shader_program( this.gl_context, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC );

        this.perlin_object = new Perlin_07( gl_context );
        // this.perlin_render = new Perlin_Renderer(
        //         this.gl_context, this.perlin_object,
        //         (t)=>{this.perlin_object.update(t); },
        //         ()=>{this.perlin_object.draw(); }
        //     );
    }

    // ###########################################
    // ###########################################

    prepare_uniforms( camera_view_matrix, camera_projection_matrix ){
        // --- use super
        // --------------------------------------------------------
        
        super.prepare_uniforms( camera_view_matrix, camera_projection_matrix );

        // --------------------------------------------------------

        // ...

        // --------------------------------------------------------
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

    draw( camera_view_matrix, camera_projection_matrix ){
        super.draw(camera_view_matrix, camera_projection_matrix);

        // this.perlin_render.draw();
        // this.perlin_render.prepare_canvas_space();

        
    }

    // ###########################################
    // ###########################################
}