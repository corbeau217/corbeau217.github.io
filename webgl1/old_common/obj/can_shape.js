const TAU = 2.0*Math.PI;
const CIRCLE_POINTS = 16;

class Can_Shape {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    constructor(){
        
        // prepare shape references
        this.textureCoordinates = [];
        this.vertexValues = [];
        this.bindings = [];

        this.texture_path = "/img/dreenk_texture.png";

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

        // ==========================================
        // ==========================================

        this.modelScale = {
            x: 1.2,
            y: 1.2,
            z: 2
        };

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

        // ==========================================
        // ==========================================


        // say texture not ready
        this.texture_ready = false;
        this.texture_image = new Image();
        this.texture_image.onload = () => {
            this.texture_ready = true;
        };
        this.texture_image.src = this.texture_path;

        // say that we want our y axis flipped
        this.texture_y_flipped = true;
        

        // ==========================================
        // ==========================================
    }



    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
   
    get_vertices(){
        return this.vertexValues;
    }
    get_indices(){
        return this.bindings;
    }
    get_uv_mappings(){
        return this.textureCoordinates;
    }
    get_texture_data(){
        if(!this.texture_ready){
            console.log("texture not ready!");
        }
        return this.texture_image;
    }
    is_texture_y_flipped(){
        return this.texture_y_flipped;
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

}

export { Can_Shape };