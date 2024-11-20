
export class Managed_Shader {
    constructor( shader_id, gl_context, vertex_shader_source, fragment_shader_source ){
        // save our data
        this.id = shader_id;
        this.gl_context = gl_context;
        this.vertex_source = vertex_shader_source;
        this.fragment_source = fragment_shader_source;
        this.shader_program = null;

        this.verbose_logging = false;

        // make the shader
        this.generate_shader_program();
    }
    generate_shader_program(){
        // TODO: probably could just replace the changes rather than remaking from scratch?
        if(this.shader_program!=null){
            // delete old
            this.gl_context.deleteProgram(this.shader_program);
        }
        // make them
        this.initialise_shaders();
    }
    compile_shader( shader_type ){
        // prepare references
        let compiling_shader, shader_source;

        // determine which shader to change
        switch (shader_type) {
            case this.gl_context.VERTEX_SHADER:
                this.vertex_compiled_shader = this.gl_context.createShader(shader_type);
                compiling_shader = this.vertex_compiled_shader
                shader_source = this.vertex_source;
                break;
            case this.gl_context.FRAGMENT_SHADER:  
                this.fragment_compiled_shader = this.gl_context.createShader(shader_type);
                compiling_shader = this.fragment_compiled_shader;
                shader_source = this.fragment_source;
                break;
        
            default:
                if(this.verbose_logging){
                    console.log("requested loading an unknown shader type!");
                }
                return;
        }

        // send the source to the shader object
        this.gl_context.shaderSource(compiling_shader, shader_source);
        
        // compile the shader program
        this.gl_context.compileShader(compiling_shader);

        if(this.verbose_logging){
            // see if it compiled successfully
            if( !this.gl_context.getShaderParameter(compiling_shader, this.gl_context.COMPILE_STATUS) ){ // seems we can get a lot from canvas elements
                console.log(
                    // very interesting that theres' an info log, does this mean we can debug webgl irl?
                    //  instead of prayer-debugging
                    `an error occurred compiling the shaders: ${this.gl_context.getShaderInfoLog(compiling_shader)}`, //again with the comma??? @mdn-tutorial pls
                );
            }
        }
    }
    
    initialise_shaders(){
        // ------------------------------------------------
        // ------------------------------------------------
        // ---- compile

        this.compile_shader(this.gl_context.VERTEX_SHADER);
        this.compile_shader(this.gl_context.FRAGMENT_SHADER);

        // ------------------------------------------------
        // ------------------------------------------------
        // ---- create the shader program

        this.shader_program = this.gl_context.createProgram();

        // ------------------------------------------------
        // ------------------------------------------------
        // ---- attach and link

        // create, then attach the parts, then link it to the canvas instance
        this.gl_context.attachShader(this.shader_program, this.vertex_compiled_shader);
        this.gl_context.attachShader(this.shader_program, this.fragment_compiled_shader);
        this.gl_context.linkProgram(this.shader_program);

        // ------------------------------------------------
        // ------------------------------------------------
        // ---- error reporting / cleanup our mess

        // if creating the shader program failed tell the user about it
        if( !this.gl_context.getProgramParameter(this.shader_program, this.gl_context.LINK_STATUS) ){
            console.log(
                `unable to init the shader program: ${this.gl_context.getProgramInfoLog(
                    this.shader_program
                )}`
            );
        }
        // otherwise clean up
        else {
            // now that it's linked, detach the prepared content
            this.gl_context.detachShader(this.shader_program, this.vertex_compiled_shader);
            this.gl_context.detachShader(this.shader_program, this.fragment_compiled_shader);
    
            // and delete it
            this.gl_context.deleteShader(this.vertex_compiled_shader);
            this.gl_context.deleteShader(this.fragment_compiled_shader);
        }
    }
    replace_shader_code( new_vertex_source, new_fragment_source ){
        // TODO: test this commented out code
        // // check we can skip?
        // if(this.vertex_source==new_vertex_source && this.fragment_source==new_fragment_source && this.shader_program!=null){
        //     // no need to do anything
        //     return;
        // }
        this.vertex_source = new_vertex_source;
        this.fragment_source = new_fragment_source;
        this.generate_shader_program();
    }
    get_shader_program(){
        return this.shader_program;
    }
    get_vertex_source(){
        return this.vertex_source;
    }
    get_fragment_source(){
        return this.fragment_source;
    }
}

// ############################################################################################
// ############################################################################################
// ############################################################################################
