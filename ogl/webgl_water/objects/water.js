import { FRAGMENT_SHADER_SRC } from "../shaders/water_fragmentShader.js";
import { VERTEX_SHADER_SRC } from "../shaders/water_vertexShader.js";

function generate_plane_vertices_as_floats(row_count, column_count){
    // TODO: do this
}
function generate_plane_bindings(row_count, column_count){
    // TODO: do this
}

export class Water {
    constructor( gl_context ){
        // gather our context
        this.gl_context = gl_context;
        // gather our shader
        // this.shader = prepare_shader_program( VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC );

        // settings
        this.row_count = 7;
        this.column_count = 7;
        
        // raw shape
        this.vertices = generate_plane_vertices_as_floats( this.row_count, this.column_count );
        this.bindings = generate_plane_bindings( this.row_count, this.column_count );

        // prepare the buffers
    }
}