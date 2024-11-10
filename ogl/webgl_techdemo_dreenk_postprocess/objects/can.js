import { FRAGMENT_SHADER_SRC } from "../shaders/fragmentShader.js";
import { VERTEX_SHADER_SRC } from "../shaders/vertexShader.js";
import { generate_shader_program } from "../shaders.js";

const TAU = 2.0*Math.PI;
const CIRCLE_POINTS = 16;

class Can {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // creates a scene object
    constructor( gl_context ){
        // local reference to opengl context
        this.gl_context = gl_context;
        // make the shader for this can
        this.shader = generate_shader_program(this.gl_context, VERTEX_SHADER_SRC, FRAGMENT_SHADER_SRC);

        // ==========================================
          
        // model to world matrix, just use identity for now
        this.modelMatrix = mat4.create();
        this.modelMatrix_translation = mat4.create();
        this.modelMatrix_rotation = mat4.create();
        this.modelMatrix_rotation_offKilter = mat4.create();
        this.modelMatrix_rotation_updateFactor = mat4.create();

        this.generate_rotation_matrices();
        
        // prepare shape references
        this.textureCoordinates = [];
        this.vertexValues = [];
        this.bindings = [];

        // ==========================================

        this.texture_path = "/img/dreenk_texture.png";
        
        // Load texture
        this.loadTexture( gl_context );

        this.uvData = {
            bottom: {
                origin: {
                    u: 0.607,
                    v: 0.807
                },
                size: {
                    u: 0.17,
                    v: 0.17
                }
            },
            top: {
                origin: {
                    u: 0.23,
                    v: 0.80
                },
                size: {
                    u: 0.17,
                    v: 0.17
                }
            },
            side: {
                origin: {
                    u: 0.5,
                    v: 0.3
                },
                size: {
                    u: 1.0,
                    v: 0.6
                }
            }
        };

        // ==========================================

        this.circlePoints = CIRCLE_POINTS;

        // ==========================================

        this.modelScale = {
            x: 1.2,
            y: 1.2,
            z: 2
        };

        // ==========================================
        
        this.bottomVertices = CIRCLE_POINTS + 1;
        this.topVertices = CIRCLE_POINTS + 1;
        this.sideBottomVertices = CIRCLE_POINTS + 1;
        this.sideTopVertices = CIRCLE_POINTS + 1;
        this.perVertexFloats = 4;
        this.vertexNumber = (CIRCLE_POINTS+1)*2 + (CIRCLE_POINTS)*2;
        this.triangleNumber = CIRCLE_POINTS*2 + CIRCLE_POINTS + CIRCLE_POINTS
        this.centerBottomIndex = (CIRCLE_POINTS*2);
        this.centerTopIndex = (CIRCLE_POINTS*2)+1;
        this.bottomIndexOffset = 0;
        this.topIndexOffset = CIRCLE_POINTS;
        this.sidesBottomIndexOffset = this.bottomVertices+this.topVertices;
        this.sidesTopIndexOffset    = this.bottomVertices+this.topVertices + this.sideBottomVertices;

        // ==========================================

        this.generateVertices();
        this.generateBindings();
        this.generateMappings();

        // ==========================================

    
        this.initVertexBuffer();
        this.initIndexBuffer();

        // ==========================================
    
        this.initTextureBuffer();

        // ==========================================
        // ==========================================
    }



    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
   
    generate_rotation_matrices(){

        // factor of TAU in radians
        //  [1.0  * TAU] == 360
        //  [0.75 * TAU] == 270
        //  [0.5  * TAU] == 180
        //  [0.25 * TAU] ==  90
        this.model_rotation_initial = [
            // Rx
            -(2.0/3.0)/4.0,
            // Ry
            0.0,
            // Rz
            0.05,
        ];
        // anything other than y rotation tends to make it spin weird bc of the way we set up axises
        this.model_rotation_per_frame_factor = [
            0.0,
            0.1,
            0.0,
        ];

        // heaper order, heading pitch roll
        mat4.rotateY(
            this.modelMatrix_rotation_offKilter,
            this.modelMatrix_rotation_offKilter,
            this.model_rotation_initial[1] * TAU,
        );
        mat4.rotateX(
            this.modelMatrix_rotation_offKilter,
            this.modelMatrix_rotation_offKilter,
            this.model_rotation_initial[0] * TAU,
        );
        mat4.rotateZ(
            this.modelMatrix_rotation_offKilter,
            this.modelMatrix_rotation_offKilter,
            this.model_rotation_initial[2] * TAU,
        );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }
    loadTexture(){
        // ...

        this.texture = this.gl_context.createTexture();
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.texture);
    
        // Because images have to be downloaded over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = this.gl_context.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = this.gl_context.RGBA;
        const srcType = this.gl_context.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
        this.gl_context.texImage2D(
            this.gl_context.TEXTURE_2D,
            level,
            internalFormat,
            width,
            height,
            border,
            srcFormat,
            srcType,
            pixel
        );
    
        this.texture_image = new Image();
        this.texture_image.onload = () => {
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.texture);
        this.gl_context.texImage2D(
            this.gl_context.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            this.texture_image
        );
    
        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (this.isPowerOf2(this.texture_image.width) && this.isPowerOf2(this.texture_image.height)) {
            // Yes, it's a power of 2. Generate mips.
            this.gl_context.generateMipmap(this.gl_context.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_S, this.gl_context.CLAMP_TO_EDGE);
            this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_WRAP_T, this.gl_context.CLAMP_TO_EDGE);
            // this.gl_context.texParameteri(this.gl_context.TEXTURE_2D, this.gl_context.TEXTURE_MIN_FILTER, this.gl_context.LINEAR);
        }
        };
        this.texture_image.src = this.texture_path;
  
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    generateVertices(){

        /**
         * point on a circle is given by:
         *      ( cos(theta), sin(theta) )
         *   where theta is the angle from ( 1, 0 )
         * 
         *  using this with the xy plane, we can generate points on a circle
         *    then use the z axis to be the height of the cylinder
         * 
         *  I've opted to have everything around the origin so that the
         *     hypothetical "center of mass" is the center of rotation
         *   this way the wobbles in rotation are by my own creation and not due
         *       to the goofiness of the model
         */

        // === BOTTOM ===
        
        for (let vertexIdx = 0; vertexIdx < (this.circlePoints); vertexIdx++) {
            const vertexTheta = ((vertexIdx)/(this.circlePoints)) * TAU;

            this.vertexValues.push( this.modelScale.x/2.0 * Math.cos(vertexTheta) );     // x
            this.vertexValues.push( this.modelScale.y/2.0 * Math.sin(vertexTheta) );     // y
            this.vertexValues.push( -this.modelScale.z/2.0 );                            // z
            this.vertexValues.push( 1.0 );                       // w
            // console.log("bottom vertex " + vertexIdx + " done");
        }

        // === TOP ===

        for (let vertexIdx = 0; vertexIdx < (this.circlePoints); vertexIdx++) {
            const vertexTheta = ((vertexIdx)/(this.circlePoints)) * TAU;

            this.vertexValues.push( this.modelScale.x/2.0 * Math.cos(vertexTheta) );     // x
            this.vertexValues.push( this.modelScale.y/2.0 * Math.sin(vertexTheta) );     // y
            this.vertexValues.push( this.modelScale.z/2.0 );                             // z
            this.vertexValues.push( 1.0 );                       // w
            // console.log("top vertex " + vertexIdx + " done");
            
        }

        // bottom center
        this.vertexValues.push( 0.0 );   // x
        this.vertexValues.push( 0.0 );   // y
        this.vertexValues.push( -this.modelScale.z/2.0 );  // z
        this.vertexValues.push( 1.0 );   // w
        
        // top center
        this.vertexValues.push( 0.0 );   // x
        this.vertexValues.push( 0.0 );   // y
        this.vertexValues.push( this.modelScale.z/2.0 );   // z
        this.vertexValues.push( 1.0 );   // w
        
        // === SIDES ===
        /**
         * extra vertices added to fix the wrapping weirdness
         *  note: there'd be a way to fix the interpolation issues in that we could
         *      just do the overlapping vertices in the middle of a face
         *      
         *       a way to do this would be to end the side vertices 1 set early,
         *          then add to the start and end a "half" rotation by the usual angle
         *       care would need to be taken to make sure that it was treated as a
         *          continuing face rather than a new face
         */

        for (let vertexIdx = 0; vertexIdx <= (this.circlePoints); vertexIdx++) {
            const vertexTheta = ((vertexIdx)/(this.circlePoints)) * TAU;

            // -- SIDE BOTTOM --

            this.vertexValues.push( this.modelScale.x/2.0 * Math.cos(vertexTheta) );     // x
            this.vertexValues.push( this.modelScale.y/2.0 * Math.sin(vertexTheta) );     // y
            this.vertexValues.push( -this.modelScale.z/2.0 );                            // z
            this.vertexValues.push( 1.0 );                                          // w
            // console.log("side bottom vertex " + vertexIdx + " done");
            
        }



        for (let vertexIdx = 0; vertexIdx <= (this.circlePoints); vertexIdx++) {
            const vertexTheta = ((vertexIdx)/(this.circlePoints)) * TAU;

            // -- SIDE TOP --

            this.vertexValues.push( this.modelScale.x/2.0 * Math.cos(vertexTheta) );     // x
            this.vertexValues.push( this.modelScale.y/2.0 * Math.sin(vertexTheta) );     // y
            this.vertexValues.push( this.modelScale.z/2.0 );                             // z
            this.vertexValues.push( 1.0 );                                          // w
            // console.log("side top vertex " + vertexIdx + " done");
            
        }

        // // create an array of positions for the shape
        // return vertexValues;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    generateBindings(){


        // === BOTTOM BINDINGS ===
        for (let vertexIndex = 0; vertexIndex < (this.circlePoints); vertexIndex++) {
            const currentBottom = this.bottomIndexOffset + vertexIndex;
            const nextBottom = this.bottomIndexOffset + ((vertexIndex+1)%(this.circlePoints));
    
            this.bindings.push( this.centerBottomIndex ); // v0
            this.bindings.push( currentBottom );     // v1
            this.bindings.push( nextBottom );        // v2
        }
    
        // === TOP BINDINGS ===
        for (let vertexIndex = 0; vertexIndex < (this.circlePoints); vertexIndex++) {
            const currentTop = this.topIndexOffset + vertexIndex;
            const nextTop = this.topIndexOffset + ((vertexIndex+1)%(this.circlePoints));
    
            this.bindings.push( this.centerTopIndex );    // v0
            this.bindings.push( nextTop );           // v1
            this.bindings.push( currentTop );        // v2
        }
    
        // === SIDE BINDINGS ===
        for (let vertexIndex = 0; vertexIndex < (this.circlePoints); vertexIndex++) {
            const currentBottom = this.sidesBottomIndexOffset + vertexIndex;
            const nextBottom = this.sidesBottomIndexOffset + ((vertexIndex+1));
            
            const currentTop = this.sidesTopIndexOffset + vertexIndex;
            const nextTop = this.sidesTopIndexOffset + ((vertexIndex+1));
            
    
            /*
                ct   nt
                *----*
                |  / |
                *----*
                cb   nb
    
            */
            this.bindings.push( nextTop );       // v0
            this.bindings.push( currentBottom ); // v1
            this.bindings.push( currentTop );    // v2
    
            this.bindings.push( nextTop );       // v0
            this.bindings.push( nextBottom );    // v1
            this.bindings.push( currentBottom ); // v2
        }
    
        // return bindings;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    generateMappings(){


        // === BOTTOM ===
        
        for (let vertexIdx = 0; vertexIdx < (this.circlePoints); vertexIdx++) {
            const vertexTheta = ((vertexIdx)/(this.circlePoints)) * TAU;
            // the (cos,sin) to get circle point, then scale to the uv sizing, and offset by the mapping origin
            //      {@NOTE: need to match the direction that the vertices were generated}
            this.textureCoordinates.push( this.uvData.bottom.origin.u + ( this.uvData.bottom.size.u * Math.cos(vertexTheta) ) ); // u
            this.textureCoordinates.push( this.uvData.bottom.origin.v + ( this.uvData.bottom.size.v * Math.sin(vertexTheta) ) ); // v
        }
    
        // === TOP ===
    
        for (let vertexIdx = 0; vertexIdx < (this.circlePoints); vertexIdx++) {
            const vertexTheta = ((vertexIdx)/(this.circlePoints)) * TAU;
            // the (cos,sin) to get circle point, then scale to the uv sizing, and offset by the mapping origin
            //      {@NOTE: need to match the direction that the vertices were generated}
            this.textureCoordinates.push( this.uvData.top.origin.u + ( this.uvData.top.size.u * Math.cos(vertexTheta) ) ); // u
            this.textureCoordinates.push( this.uvData.top.origin.v + ( this.uvData.top.size.v * Math.sin(vertexTheta) ) ); // v
        }
    
        // === CENTERS ===
        
        // -- bottom
        this.textureCoordinates.push( this.uvData.bottom.origin.u ); // u
        this.textureCoordinates.push( this.uvData.bottom.origin.v ); // v
    
        // -- top --
        this.textureCoordinates.push( this.uvData.top.origin.u ); // u
        this.textureCoordinates.push( this.uvData.top.origin.v ); // v
        
        // === SIDES ===
    
        // -- bottom verts --
        for (let vertexIdx = 0; vertexIdx < (this.circlePoints); vertexIdx++) {
            // back from origin half the width, then travel forward the percentage of the vertices we're at (within the scale of this part of the texture)
            this.textureCoordinates.push( (this.uvData.side.origin.u - (this.uvData.side.size.u/2.0)) + ((vertexIdx/this.circlePoints) * this.uvData.side.size.u) ); // u
            // just offsets back from the origin by the half size
            this.textureCoordinates.push( (this.uvData.side.origin.v - (this.uvData.side.size.v/2.0)) ); // v
        }
        // manually do the last one
        this.textureCoordinates.push( (this.uvData.side.origin.u + (this.uvData.side.size.u/2.0)) ); // u
        this.textureCoordinates.push( (this.uvData.side.origin.v - (this.uvData.side.size.v/2.0)) ); // v
    
        // -- top verts --
        for (let vertexIdx = 0; vertexIdx < (this.circlePoints); vertexIdx++) {
            // [same as bottom, just difference in v]
            // back from origin half the width, then travel forward the percentage of the vertices we're at (within the scale of this part of the texture)
            this.textureCoordinates.push( (this.uvData.side.origin.u - (this.uvData.side.size.u/2.0)) + ((vertexIdx/this.circlePoints) * this.uvData.side.size.u) ); // u
            // just offsets forward from the origin by the half size
            this.textureCoordinates.push( (this.uvData.side.origin.v + (this.uvData.side.size.v/2.0)) ); // v
        }
        // manually do the last one
        this.textureCoordinates.push( (this.uvData.side.origin.u + (this.uvData.side.size.u/2.0)) ); // u
        this.textureCoordinates.push( (this.uvData.side.origin.v + (this.uvData.side.size.v/2.0)) ); // v
    
        // // create an array of positions for the shape
        // return textureCoordinates;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    initVertexBuffer(){
        // create a buffer for the shape's positions.
        this.positionBuffer = this.gl_context.createBuffer();
    
        // selec the vertexBuffer as one to apply
        //  buffer opers to from now on
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.positionBuffer);
    
        // allocate space on gpu of the number of vertices
        this.gl_context.bufferData(
            this.gl_context.ARRAY_BUFFER,
            new Float32Array(this.vertexValues),
            this.gl_context.STATIC_DRAW
        );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    initIndexBuffer(){
        // create a buffer for the shape's indices.
        this.indexBuffer = this.gl_context.createBuffer();
    
        // select the indexBuffer as one to apply
        //  buffer opers to from now on
        this.gl_context.bindBuffer(this.gl_context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    
        // allocate space on gpu of the number of indices
        this.gl_context.bufferData(
            this.gl_context.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.bindings),
            this.gl_context.STATIC_DRAW
        );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    initTextureBuffer(){
        this.textureCoordBuffer = this.gl_context.createBuffer();
        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.textureCoordBuffer);
    
        this.gl_context.bufferData(
          this.gl_context.ARRAY_BUFFER,
          new Float32Array(this.textureCoordinates),
          this.gl_context.STATIC_DRAW,
        );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    rebuild_model_matrix(){
        // incase we have existing junk in the matrix
        mat4.identity(this.modelMatrix);
      
        // ---- translate ----
        // existing translation
        mat4.multiply(
            // destination
            this.modelMatrix,
            // left matrix
            this.modelMatrix,
            // right matrix
            this.modelMatrix_translation
        );
      
        // ---- rotation ----
        // existing rotation that was then translated
        mat4.multiply(
            // destination
            this.modelMatrix,
            // left matrix
            this.modelMatrix,
            // right matrix
            this.modelMatrix_rotation,
        );
      
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    updateRotationMatrix(deltaTime){
        // wipe the rotation matrix
        this.modelMatrix_rotation = mat4.create();
      
        mat4.rotateY(
            this.modelMatrix_rotation_updateFactor,
            this.modelMatrix_rotation_updateFactor,
            this.model_rotation_per_frame_factor[1] * TAU * deltaTime,
        );
        mat4.rotateX(
            this.modelMatrix_rotation_updateFactor,
            this.modelMatrix_rotation_updateFactor,
            this.model_rotation_per_frame_factor[0] * TAU * deltaTime,
        );
        mat4.rotateZ(
            this.modelMatrix_rotation_updateFactor,
            this.modelMatrix_rotation_updateFactor,
            this.model_rotation_per_frame_factor[2] * TAU * deltaTime,
        );
      
        // merge together in the overall one
        mat4.multiply(
            // destination
            this.modelMatrix_rotation,
            // left matrix
            this.modelMatrix_rotation_updateFactor,
            // right matrix
            this.modelMatrix_rotation_offKilter,
        );
    }

    
    // ############################################################################################
    // ############################################################################################
    // ############################################################################################



    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute( vertexPosition_location ) {
        const numComponents = 4;
        const type = this.gl_context.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from

        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.positionBuffer);
        this.gl_context.vertexAttribPointer(
            vertexPosition_location,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        this.gl_context.enableVertexAttribArray(vertexPosition_location);
    }


    // tell webgl how to pull out the texture coordinates from buffer
    setTextureAttribute( textureCoord_location ) {
        const num = 2; // every coordinate composed of 2 values
        const type = this.gl_context.FLOAT; // the data in the buffer is 32-bit float
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set to the next
        const offset = 0; // how many bytes inside the buffer to start from

        this.gl_context.bindBuffer(this.gl_context.ARRAY_BUFFER, this.textureCoordBuffer);
        this.gl_context.vertexAttribPointer(
            textureCoord_location,
            num,
            type,
            normalize,
            stride,
            offset,
        );
        this.gl_context.enableVertexAttribArray(textureCoord_location);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    update( deltaTime ){
        // does the rotation
        this.updateRotationMatrix(deltaTime);

        // TRS the model matrix
        this.rebuild_model_matrix(deltaTime);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    draw(cameraViewMatrix, cameraProjectionMatrix){

        // ----------------------------------------------------------------------------------------
        // --- prepare our shader

        // tell webgl to use our program when drawing
        this.gl_context.useProgram(this.shader);

        // ----------------------------------------------------------------------------------------
        // --- prepare our attributes

        let vertexPosition_location = this.gl_context.getAttribLocation(this.shader, "aVertexPosition");
        let textureCoord_location = this.gl_context.getAttribLocation(this.shader, "aTextureCoord");

        // allow the vertex position attribute to exist
        this.gl_context.enableVertexAttribArray(vertexPosition_location);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        this.setPositionAttribute(vertexPosition_location);
      
        this.setTextureAttribute(textureCoord_location);
        
        // ----------------------------------------------------------------------------------------
        // --- prepare our uniforms

        let projectionMatrix_location =  this.gl_context.getUniformLocation(this.shader, "uProjectionMatrix");
        let viewMatrix_location =  this.gl_context.getUniformLocation(this.shader, "uViewMatrix");
        let modelMatrix_location =  this.gl_context.getUniformLocation(this.shader, "uModelMatrix");

        this.gl_context.uniformMatrix4fv( modelMatrix_location, false, this.modelMatrix );
      
        // set the shader uniforms
        this.gl_context.uniformMatrix4fv( projectionMatrix_location, false, cameraProjectionMatrix );
        this.gl_context.uniformMatrix4fv( viewMatrix_location, false, cameraViewMatrix );
      
        // ----------------------------------------------------------------------------------------
        // --- prepare texture information

        let uSampler_location =  this.gl_context.getUniformLocation(this.shader, "uSampler");
        
        // Tell WebGL we want to affect texture unit 0
        this.gl_context.activeTexture(this.gl_context.TEXTURE0);

        // Bind the texture to texture unit 0
        this.gl_context.bindTexture(this.gl_context.TEXTURE_2D, this.texture);
      
        // Tell the shader we bound the texture to texture unit 0
        this.gl_context.uniform1i(uSampler_location, 0);
      
        // ----------------------------------------------------------------------------------------
        // --- do the drawing
      
        //                 ( mode, numElements, datatype, offset )
        // gl.drawElements(gl.LINE_STRIP, 60, gl.UNSIGNED_SHORT, 0);
        // gl.drawElements(gl.TRIANGLE_STRIP, (buffers.triangleCount*3), gl.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.TRIANGLES, (4*this.circlePoints)*3, this.gl_context.UNSIGNED_SHORT, 0);
      
        // ----------------------------------------------------------------------------------------
        // --- cleanup our shader context
        
        this.gl_context.disableVertexAttribArray(vertexPosition_location);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}

export { Can };