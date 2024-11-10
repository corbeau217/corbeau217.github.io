

const TAU = 2.0*Math.PI;
const CIRCLE_POINTS = 16;

class Can {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    // creates a scene object
    constructor( gl_context ){
        
        // prepare shape references
        this.textureCoordinates = [];
        this.vertexValues = [];
        this.bindings = [];

        this.texture_path = "/ogl/webgl_techdemo_dreenk_remix/img/dreenk.png";
        
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
    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }
    loadTexture(gl_context){
        // ...

        this.texture = gl_context.createTexture();
        gl_context.bindTexture(gl_context.TEXTURE_2D, this.texture);
    
        // Because images have to be downloaded over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = gl_context.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl_context.RGBA;
        const srcType = gl_context.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
        gl_context.texImage2D(
            gl_context.TEXTURE_2D,
            level,
            internalFormat,
            width,
            height,
            border,
            srcFormat,
            srcType,
            pixel
        );
    
        const image = new Image();
        image.onload = () => {
        gl_context.bindTexture(gl_context.TEXTURE_2D, this.texture);
        gl_context.texImage2D(
            gl_context.TEXTURE_2D,
            level,
            internalFormat,
            srcFormat,
            srcType,
            image
        );
    
        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl_context.generateMipmap(gl_context.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl_context.texParameteri(gl_context.TEXTURE_2D, gl_context.TEXTURE_WRAP_S, gl_context.CLAMP_TO_EDGE);
            gl_context.texParameteri(gl_context.TEXTURE_2D, gl_context.TEXTURE_WRAP_T, gl_context.CLAMP_TO_EDGE);
            // gl_context.texParameteri(gl_context.TEXTURE_2D, gl_context.TEXTURE_MIN_FILTER, gl_context.LINEAR);
        }
        };
        image.src = this.texture_path;
  
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

    build_shape(){
        // ...

        // ==========================================
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
        // ==========================================

        this.generateVertices();
        this.generateBindings();
        this.generateMappings();
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    initBuffers( gl_context ){
    
        // prepareGlobals(circlePoints);
    
        this.initVertexBuffer( gl_context );
        this.initIndexBuffer( gl_context );
    
    
        this.initTextureBuffer( gl_context );
    
    
        // console.log("vertex array size: " + vertexValues.length + " which is "+(vertexValues.length/perVertexFloats) + " of the " + vertexNumber);
        // console.log("bindings array size: " + bindings.length + " which is "+(bindings.length/3) + " of the " + triangleNumber);
        // console.log("mappings array size: " + textureCoordinates.length + " which is "+(textureCoordinates.length/2) + " of the " + vertexNumber);
    
        // return {
        //     position: positionBuffer,
        //     textureCoord: textureCoordBuffer,
        //     indices: indexBuffer,
        // };
    
        
    
    
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

    getTexture(){
        return this.texture;
    }
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

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}

export { Can };