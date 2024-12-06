const TAU = 2.0*Math.PI;

// ==========================================
// ==========================================

let textureCoordinates = [];
let vertexValues = [];
let bindings = [];

let vertices;
let indices;


// the ends/caps including their center vertex
let bottomVertices = 0;
let topVertices = 0;
// the side edges around the circumference of the prism
//  including the doubled vertices/corner to hide wrapping issues
let sideBottomVertices = 0;
let sideTopVertices = 0;

// ==========================================
// ==========================================

// position of the center bottom
let centerBottomIndex = 0;
// position of the center top
let centerTopIndex = 0;

// bottom vertex start
let bottomIndexOffset = 0;
// top vertex start
let topIndexOffset = 0;


// side vertex starts
let sidesBottomIndexOffset = 0;
let sidesTopIndexOffset = 0;

// ==========================================
// ==========================================

function prepareGlobals( circlePoints ){
    bottomVertices = circlePoints + 1;
    topVertices = circlePoints + 1;
    sideBottomVertices = circlePoints + 1;
    sideTopVertices = circlePoints + 1;
    centerBottomIndex = (circlePoints*2);
    centerTopIndex = (circlePoints*2)+1;
    bottomIndexOffset = 0;
    topIndexOffset = circlePoints;
    sidesBottomIndexOffset = bottomVertices+topVertices;
    sidesTopIndexOffset    = bottomVertices+topVertices + sideBottomVertices;
}

// uv - json - data
const uvData = {
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
}

const modelScale = {
    x: 1.2,
    y: 1.2,
    z: 2
}

// ==========================================
// ==========================================

function generateVertices( circlePoints ){

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
    
    for (let vertexIdx = 0; vertexIdx < (circlePoints); vertexIdx++) {
        const vertexTheta = ((vertexIdx)/(circlePoints)) * TAU;

        vertexValues.push( modelScale.x/2.0 * Math.cos(vertexTheta) );     // x
        vertexValues.push( modelScale.y/2.0 * Math.sin(vertexTheta) );     // y
        vertexValues.push( -modelScale.z/2.0 );                            // z
        vertexValues.push( 1.0 );                       // w
        // console.log("bottom vertex " + vertexIdx + " done");
    }

    // === TOP ===

    for (let vertexIdx = 0; vertexIdx < (circlePoints); vertexIdx++) {
        const vertexTheta = ((vertexIdx)/(circlePoints)) * TAU;

        vertexValues.push( modelScale.x/2.0 * Math.cos(vertexTheta) );     // x
        vertexValues.push( modelScale.y/2.0 * Math.sin(vertexTheta) );     // y
        vertexValues.push( modelScale.z/2.0 );                             // z
        vertexValues.push( 1.0 );                       // w
        // console.log("top vertex " + vertexIdx + " done");
        
    }

    // bottom center
    vertexValues.push( 0.0 );   // x
    vertexValues.push( 0.0 );   // y
    vertexValues.push( -modelScale.z/2.0 );  // z
    vertexValues.push( 1.0 );   // w
    
    // top center
    vertexValues.push( 0.0 );   // x
    vertexValues.push( 0.0 );   // y
    vertexValues.push( modelScale.z/2.0 );   // z
    vertexValues.push( 1.0 );   // w
    
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

    for (let vertexIdx = 0; vertexIdx <= (circlePoints); vertexIdx++) {
        const vertexTheta = ((vertexIdx)/(circlePoints)) * TAU;

        // -- SIDE BOTTOM --

        vertexValues.push( modelScale.x/2.0 * Math.cos(vertexTheta) );     // x
        vertexValues.push( modelScale.y/2.0 * Math.sin(vertexTheta) );     // y
        vertexValues.push( -modelScale.z/2.0 );                            // z
        vertexValues.push( 1.0 );                                          // w
        // console.log("side bottom vertex " + vertexIdx + " done");
        
    }



    for (let vertexIdx = 0; vertexIdx <= (circlePoints); vertexIdx++) {
        const vertexTheta = ((vertexIdx)/(circlePoints)) * TAU;

        // -- SIDE TOP --

        vertexValues.push( modelScale.x/2.0 * Math.cos(vertexTheta) );     // x
        vertexValues.push( modelScale.y/2.0 * Math.sin(vertexTheta) );     // y
        vertexValues.push( modelScale.z/2.0 );                             // z
        vertexValues.push( 1.0 );                                          // w
        // console.log("side top vertex " + vertexIdx + " done");
        
    }

    // create an array of positions for the shape
    return vertexValues;
}


function generateBindings( circlePoints ){


    // === BOTTOM BINDINGS ===
    for (let vertexIndex = 0; vertexIndex < (circlePoints); vertexIndex++) {
        const currentBottom = bottomIndexOffset + vertexIndex;
        const nextBottom = bottomIndexOffset + ((vertexIndex+1)%(circlePoints));

        bindings.push( centerBottomIndex ); // v0
        bindings.push( currentBottom );     // v1
        bindings.push( nextBottom );        // v2
    }

    // === TOP BINDINGS ===
    for (let vertexIndex = 0; vertexIndex < (circlePoints); vertexIndex++) {
        const currentTop = topIndexOffset + vertexIndex;
        const nextTop = topIndexOffset + ((vertexIndex+1)%(circlePoints));

        bindings.push( centerTopIndex );    // v0
        bindings.push( nextTop );           // v1
        bindings.push( currentTop );        // v2
    }

    // === SIDE BINDINGS ===
    for (let vertexIndex = 0; vertexIndex < (circlePoints); vertexIndex++) {
        const currentBottom = sidesBottomIndexOffset + vertexIndex;
        const nextBottom = sidesBottomIndexOffset + ((vertexIndex+1));
        
        const currentTop = sidesTopIndexOffset + vertexIndex;
        const nextTop = sidesTopIndexOffset + ((vertexIndex+1));
        

        /*
            ct   nt
            *----*
            |  / |
            *----*
            cb   nb

        */
        bindings.push( nextTop );       // v0
        bindings.push( currentBottom ); // v1
        bindings.push( currentTop );    // v2

        bindings.push( nextTop );       // v0
        bindings.push( nextBottom );    // v1
        bindings.push( currentBottom ); // v2
    }

    return bindings;
}


function generateMappings( circlePoints ){


    // === BOTTOM ===
    
    for (let vertexIdx = 0; vertexIdx < (circlePoints); vertexIdx++) {
        const vertexTheta = ((vertexIdx)/(circlePoints)) * TAU;
        // the (cos,sin) to get circle point, then scale to the uv sizing, and offset by the mapping origin
        //      {@NOTE: need to match the direction that the vertices were generated}
        textureCoordinates.push( uvData.bottom.origin.u + ( uvData.bottom.size.u * Math.cos(vertexTheta) ) ); // u
        textureCoordinates.push( uvData.bottom.origin.v + ( uvData.bottom.size.v * Math.sin(vertexTheta) ) ); // v
    }

    // === TOP ===

    for (let vertexIdx = 0; vertexIdx < (circlePoints); vertexIdx++) {
        const vertexTheta = ((vertexIdx)/(circlePoints)) * TAU;
        // the (cos,sin) to get circle point, then scale to the uv sizing, and offset by the mapping origin
        //      {@NOTE: need to match the direction that the vertices were generated}
        textureCoordinates.push( uvData.top.origin.u + ( uvData.top.size.u * Math.cos(vertexTheta) ) ); // u
        textureCoordinates.push( uvData.top.origin.v + ( uvData.top.size.v * Math.sin(vertexTheta) ) ); // v
    }

    // === CENTERS ===
    
    // -- bottom
    textureCoordinates.push( uvData.bottom.origin.u ); // u
    textureCoordinates.push( uvData.bottom.origin.v ); // v

    // -- top --
    textureCoordinates.push( uvData.top.origin.u ); // u
    textureCoordinates.push( uvData.top.origin.v ); // v
    
    // === SIDES ===

    // -- bottom verts --
    for (let vertexIdx = 0; vertexIdx < (circlePoints); vertexIdx++) {
        // back from origin half the width, then travel forward the percentage of the vertices we're at (within the scale of this part of the texture)
        textureCoordinates.push( (uvData.side.origin.u - (uvData.side.size.u/2.0)) + ((vertexIdx/circlePoints) * uvData.side.size.u) ); // u
        // just offsets back from the origin by the half size
        textureCoordinates.push( (uvData.side.origin.v - (uvData.side.size.v/2.0)) ); // v
    }
    // manually do the last one
    textureCoordinates.push( (uvData.side.origin.u + (uvData.side.size.u/2.0)) ); // u
    textureCoordinates.push( (uvData.side.origin.v - (uvData.side.size.v/2.0)) ); // v

    // -- top verts --
    for (let vertexIdx = 0; vertexIdx < (circlePoints); vertexIdx++) {
        // [same as bottom, just difference in v]
        // back from origin half the width, then travel forward the percentage of the vertices we're at (within the scale of this part of the texture)
        textureCoordinates.push( (uvData.side.origin.u - (uvData.side.size.u/2.0)) + ((vertexIdx/circlePoints) * uvData.side.size.u) ); // u
        // just offsets forward from the origin by the half size
        textureCoordinates.push( (uvData.side.origin.v + (uvData.side.size.v/2.0)) ); // v
    }
    // manually do the last one
    textureCoordinates.push( (uvData.side.origin.u + (uvData.side.size.u/2.0)) ); // u
    textureCoordinates.push( (uvData.side.origin.v + (uvData.side.size.v/2.0)) ); // v

    // create an array of positions for the shape
    return textureCoordinates;
}

// ==========================================
// ==========================================


function initBuffers( gl, circlePoints ){
    
    prepareGlobals(circlePoints);

    const positionBuffer = initVertexBuffer( gl, circlePoints );
    const indexBuffer = initIndexBuffer( gl, circlePoints );


    const textureCoordBuffer = initTextureBuffer( gl, circlePoints );

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
    };

    


}

function initVertexBuffer( gl, circlePoints ){

    // create a buffer for the shape's positions.
    const positionBuffer = gl.createBuffer();

    // selec the vertexBuffer as one to apply
    //  buffer opers to from now on
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    vertices = generateVertices( circlePoints );


    // allocate space on gpu of the number of vertices
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );


    return positionBuffer;
}

function initIndexBuffer( gl, circlePoints ){

    // create a buffer for the shape's indices.
    const indexBuffer = gl.createBuffer();

    // selec the indexBuffer as one to apply
    //  buffer opers to from now on
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
    indices = generateBindings( circlePoints );

    // allocate space on gpu of the number of indices
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW
    );

    return indexBuffer;
}


function initTextureBuffer( gl, circlePoints ){
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    
    textureCoordinates = generateMappings( circlePoints );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      gl.STATIC_DRAW,
    );
  
    return textureCoordBuffer;
}

export { initBuffers };