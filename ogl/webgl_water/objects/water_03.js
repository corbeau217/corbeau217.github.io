import { Water_02 } from "./water_02.js";
import { FRAGMENT_SHADER_SRC } from "../shaders/water_02_fragment_shader.js";
import { VERTEX_SHADER_SRC } from "../shaders/water_03_vertex_shader.js";
import { generate_shader_program } from "/ogl/common/shaders/shader_engine.js";
import { Perlin_08 } from "./perlin_08.js";
import { Perlin_Renderer } from "./perlin_renderer.js";

const SQRT_OF_3 = 1.73205080757;

export class Water_03 extends Water_02 {
    constructor( gl_context ){
        super( gl_context );

        // replace with a better shader
        this.gl_context.deleteProgram(this.shader);
        this.shader = generate_shader_program( this.gl_context, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC );

        this.perlin_object = new Perlin_08( gl_context );
        this.perlin_render = new Perlin_Renderer(
                this.gl_context, this.perlin_object,
                this.perlin_object.update,
                this.perlin_object.draw
            );
    }

    // ###########################################
    // ###########################################

    update( delta_time ){
        super.update( delta_time );
        
        // draw the perlin renderer before our next draw
        this.perlin_render.draw();
        // this.perlin_object.draw();
    }

    // ###########################################
    // ###########################################
}