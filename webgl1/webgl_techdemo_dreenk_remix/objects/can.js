

const TAU = 2.0*Math.PI;
const CIRCLE_POINTS = 16;

class Can {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // creates a scene object
    constructor( gl_context, programInfo ){
        // local references, very cursed
        this.gl_context = gl_context;
        this.programInfo = programInfo;
          
        // model to world matrix, just use identity for now
        this.modelMatrix = mat4.create();
        this.modelMatrix_translation = mat4.create();
        this.modelMatrix_rotation = mat4.create();
        this.modelMatrix_rotation_offKilter = mat4.create();
        this.modelMatrix_rotation_updateFactor = mat4.create();
        this.modelMatrix_scale = mat4.create();

        this.generate_rotation_matrices();
        
        // prepare shape references
        this.textureCoordinates = [];
        this.vertexValues = [];
        this.bindings = [];

        this.texture_path = "/img/dreenk_texture.png";
        
        // Load texture
        this.loadTexture( gl_context );

        this.circlePoints = CIRCLE_POINTS;

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

        this.modelScale = {
            x: 1.2,
            y: 1.2,
            z: 2
        };

        // deal with shape
        this.build_shape();
        this.initBuffers( gl_context );
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
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    build_shape(){
        // ...

        // ==========================================
        // ==========================================
        
        this.bottomVertices = CIRCLE_POINTS + 1;
        this.topVertices = CIRCLE_POINTS + 1;
        this.sideBottomVertices = CIRCLE_POINTS + 1;
        this.sideTopVertices = CIRCLE_POINTS + 1;
        this.centerBottomIndex = (CIRCLE_POINTS*2);
        this.centerTopIndex = (CIRCLE_POINTS*2)+1;
        this.bottomIndexOffset = 0;
        this.topIndexOffset = CIRCLE_POINTS;
        this.sidesBottomIndexOffset = this.bottomVertices+this.topVertices;
        this.sidesTopIndexOffset    = this.bottomVertices+this.topVertices + this.sideBottomVertices;

        // ==========================================
        // ==========================================

        this.generateVertices();
        this.generateBindings();
        this.generateMappings();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    initBuffers(){
    
        this.initVertexBuffer( this.gl_context );
        this.initIndexBuffer( this.gl_context );
    
    
        this.initTextureBuffer( this.gl_context );
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
    
    initVertexBuffer( gl ){

        // create a buffer for the shape's positions.
        this.positionBuffer = gl.createBuffer();
    
        // selec the vertexBuffer as one to apply
        //  buffer opers to from now on
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    
        // generateVertices();
    
    
        // allocate space on gpu of the number of vertices
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.vertexValues),
            gl.STATIC_DRAW
        );
    
    
        // return positionBuffer;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################


    initIndexBuffer( gl ){

        // create a buffer for the shape's indices.
        this.indexBuffer = gl.createBuffer();
    
        // select the indexBuffer as one to apply
        //  buffer opers to from now on
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        
        // indices = generateBindings();
    
        // allocate space on gpu of the number of indices
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.bindings),
            gl.STATIC_DRAW
        );
    
        // // copy dataa over, passing in offset
        // gl.bufferSubData( gl.ELEMENT_ARRAY_BUFFER, 0, indices );
    
        // return indexBuffer;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    initTextureBuffer( gl ){
        this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        
        // textureCoordinates = generateMappings();
        // generateMappings();
    
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(this.textureCoordinates),
          gl.STATIC_DRAW,
        );
      
        // return textureCoordBuffer;
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
    setPositionAttribute(gl_context, programInfo ) {
        const numComponents = 4;
        const type = gl_context.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from
        gl_context.bindBuffer(gl_context.ARRAY_BUFFER, this.getVertexBuffer());
        gl_context.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl_context.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }


    // tell webgl how to pull out the texture coordinates from buffer
    setTextureAttribute(gl_context, programInfo) {
        const num = 2; // every coordinate composed of 2 values
        const type = gl_context.FLOAT; // the data in the buffer is 32-bit float
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set to the next
        const offset = 0; // how many bytes inside the buffer to start from
        gl_context.bindBuffer(gl_context.ARRAY_BUFFER, this.getTextureCoordBuffer());
        gl_context.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            num,
            type,
            normalize,
            stride,
            offset,
        );
        gl_context.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    prepareTexture(gl_context){

        // Tell WebGL we want to affect texture unit 0
        gl_context.activeTexture(gl_context.TEXTURE0);

        // Bind the texture to texture unit 0
        gl_context.bindTexture(gl_context.TEXTURE_2D, this.texture);

    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // getTexture(){
    //     return this.texture;
    // }
    getTextureCoordBuffer(){
        return this.textureCoordBuffer;
    }
    getVertexBuffer(){
        return this.positionBuffer;
    }
    getBindingBuffer(){
        return this.indexBuffer;
    }
    getCirclePoints(){
        return this.circlePoints;
    }
    getModelMatrix(){
        return this.modelMatrix;
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

        // tell webgl to use our program when drawing
        this.gl_context.useProgram(this.programInfo.program);
        
        this.gl_context.uniformMatrix4fv( this.programInfo.uniformLocations.modelMatrix, false, this.modelMatrix );
      
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        this.setPositionAttribute(this.gl_context, this.programInfo);
      
        this.setTextureAttribute(this.gl_context, this.programInfo);
      
      
        // set the shader uniforms
        this.gl_context.uniformMatrix4fv( this.programInfo.uniformLocations.projectionMatrix, false, cameraProjectionMatrix );
        this.gl_context.uniformMatrix4fv( this.programInfo.uniformLocations.viewMatrix, false, cameraViewMatrix );
      
        this.prepareTexture(this.gl_context);
      
        // Tell the shader we bound the texture to texture unit 0
        this.gl_context.uniform1i(this.programInfo.uniformLocations.uSampler, 0);
      
      
        //                 ( mode, numElements, datatype, offset )
        // gl.drawElements(gl.LINE_STRIP, 60, gl.UNSIGNED_SHORT, 0);
        // gl.drawElements(gl.TRIANGLE_STRIP, (buffers.triangleCount*3), gl.UNSIGNED_SHORT, 0);
        this.gl_context.drawElements(this.gl_context.TRIANGLES, (4*this.circlePoints)*3, this.gl_context.UNSIGNED_SHORT, 0);
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}

export { Can };