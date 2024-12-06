
import { Water } from "./objects/water.js";
import { Water_02 } from "./objects/water_02.js";

import { Water_03 } from "./objects/water_03.js";
import { VERTEX_SHADER_SRC as water_03_vertex_shader_source } from "./shaders/water_03_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as water_03_fragment_shader_source } from "./shaders/water_03_fragment_shader.js";

import { Water_04 } from "./objects/water_04.js";
import { VERTEX_SHADER_SRC as water_04_vertex_shader_source } from "./shaders/water_04_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as water_04_fragment_shader_source } from "./shaders/water_04_fragment_shader.js";

import { Water_05 } from "./objects/water_05.js";
import { VERTEX_SHADER_SRC as water_05_vertex_shader_source } from "./shaders/water_05_vertex_shader.js";
import { FRAGMENT_SHADER_SRC as water_05_fragment_shader_source } from "./shaders/water_05_fragment_shader.js";

import { insert_shader_code_block } from "../lib/util/source_block.js";
import { Canvas_Manager } from "/webgl1/old_common/old_canvas_manager.js";

// ############################################################################################
// ############################################################################################
// ############################################################################################

class Water_Manager extends Canvas_Manager{
    constructor( maximum_fps ){
        super(maximum_fps);
    }
    page_main(){
        // super.page_main();
        // ------------------------------

        // water 03
        insert_shader_code_block( "webgl_water_03_vertex_source", water_03_vertex_shader_source );
        insert_shader_code_block( "webgl_water_03_fragment_source", water_03_fragment_shader_source );

        // water 04
        insert_shader_code_block( "webgl_water_04_vertex_source", water_04_vertex_shader_source );
        insert_shader_code_block( "webgl_water_04_fragment_source", water_04_fragment_shader_source );

        // water 05
        insert_shader_code_block( "webgl_water_05_vertex_source", water_05_vertex_shader_source );
        insert_shader_code_block( "webgl_water_05_fragment_source", water_05_fragment_shader_source );

        // ------------------------------
    }
    app_main(){
        // super.app_main();
        // ------------------------------
    
        this.prepare_new_app( "webgl_water_01", Water, 0.0, -0.75, -2.3 );
        this.prepare_new_app( "webgl_water_02", Water_02, 0.0, -0.0, -3.3 );
        this.prepare_new_app( "webgl_water_03", Water_03, 0.0, -0.0, -3.3 );
        this.prepare_new_app( "webgl_water_04", Water_04, 0.0, -0.0, -3.3 );
        this.prepare_new_app( "webgl_water_05", Water_05, 0.0, -0.7, -3.3 );

        // ------------------------------
    }
}


// ############################################################################################
// ############################################################################################
// ############################################################################################


let page_manager = new Water_Manager( 40 );


// ############################################################################################
// ############################################################################################
// ############################################################################################
