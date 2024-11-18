export class Planar_Shape {

    // ###########################################
    // ###########################################

    /**
     * 
     * @param {*} column_count number of quads along the x axis
     * @param {*} row_count number of quads along the y axis
     */
    constructor( column_count, row_count, clockwise_winding, use_xz_axis ){
        this.prepare_shape_settings( column_count, row_count, clockwise_winding, use_xz_axis );

        this.build_mesh();
    }

    // ###########################################
    // ###########################################

    prepare_shape_settings( column_count, row_count, clockwise_winding, use_xz_axis ){
        // how many vertices to use
        this.vertex_count = {
            x: column_count+1,
            y: row_count+1,
        };

        // how many quads
        this.quad_count = {
            x: column_count,
            y: row_count,
        };

        this.minimum_position = { x: -1.0, y: -1.0, };
        this.maximum_position = { x:  1.0, y:  1.0, };
        this.position_range = {
            x: this.maximum_position.x - this.minimum_position.x,
            y: this.maximum_position.y - this.minimum_position.y,
        };
        this.quad_size_percentage = {
            x: 1.0 / this.quad_count.x,
            y: 1.0 / this.quad_count.y,
        };
        this.quad_size = {
            x: this.quad_size_percentage.x * this.position_range.x,
            y: this.quad_size_percentage.y * this.position_range.y,
        };
        
        // the winding order to use
        this.winding_clockwise = clockwise_winding;

        // when this is false, we use xy instead
        this.use_xz_axis = use_xz_axis;

        this.face_count = ( this.quad_count.x * this.quad_count.y ) * 2;
    }

    // incase we want to tweak the settings and rebuild our mesh
    build_mesh(){
        this.generate_vertices();
        this.generate_bindings();
        this.generate_vertex_references();
    }

    // ###########################################
    // ###########################################

    generate_vertices(){
        let raw_vertices = [];
        
        // all columns of vertices
        for (let vertex_x_index = 0; vertex_x_index < this.vertex_count.x; vertex_x_index++) {
            // left to right
            const vertex_x_value = this.minimum_position.x + (this.quad_size.x * vertex_x_index);

            // all rows within a column
            for (let vertex_y_index = 0; vertex_y_index < this.vertex_count.y; vertex_y_index++) {
                // top to bottom
                const vertex_y_value = this.maximum_position.y - (this.quad_size.y * vertex_y_index);
                
                // when we should map the y value across z axis instead
                if(this.use_xz_axis){
                    // generate the vertex
                    raw_vertices.push({
                        x: vertex_x_value,
                        y: 0.0,
                        z: vertex_y_value,
                        w: 1.0,
                    });
                }
                // using xy instead
                else {
                    // generate the vertex
                    raw_vertices.push({
                        x: vertex_x_value,
                        y: vertex_y_value,
                        z: 0.0,
                        w: 1.0,
                    });
                }

            }
        }

        // prepare the reference
        this.vertices = [];

        // now fill the vertices with the data
        for (let raw_vertex_index = 0; raw_vertex_index < raw_vertices.length; raw_vertex_index++) {
            const current_vertex = raw_vertices[raw_vertex_index];

            // push each of the float values
            this.vertices.push(current_vertex.x);
            this.vertices.push(current_vertex.y);
            this.vertices.push(current_vertex.z);
            this.vertices.push(current_vertex.w);
            
        }

        // give it back
        return this.vertices;
    }
    generate_bindings(){
        // empty the array
        this.bindings = [];

        // for all the quads along x axis
        for (let vertex_x_index = 0; vertex_x_index < this.quad_count.x; vertex_x_index++) {
            const current_top_offset = vertex_x_index * this.vertex_count.y;
            const next_top_offset = (vertex_x_index+1) * this.vertex_count.y;
            const current_bottom_offset = current_top_offset + 1;
            const next_bottom_offset = next_top_offset + 1;

            // for all the quads along y axis
            for (let vertex_y_index = 0; vertex_y_index < this.quad_count.y; vertex_y_index++) {
                // the 4 corners of our quad 
                const top_left_index = current_top_offset + vertex_y_index;
                const bottom_left_index = current_bottom_offset + vertex_y_index;
                const top_right_index = next_top_offset + vertex_y_index;
                const bottom_right_index = next_bottom_offset + vertex_y_index;

                // bottom left triangle
                const triangle_1 = (this.winding_clockwise)?
                    [ top_left_index, bottom_right_index, bottom_left_index  ] : // clockwise
                    [ top_left_index,  bottom_left_index, bottom_right_index ] ; // anti clockwise
                // top right triangle
                const triangle_2 = (this.winding_clockwise)?
                    [ top_left_index,    top_right_index, bottom_right_index ] : // clockwise
                    [ top_left_index, bottom_right_index,    top_right_index ] ; // anti clockwise
                
                // add them to the bindings list
                this.bindings.push( triangle_1[0] );   this.bindings.push( triangle_1[1] );   this.bindings.push( triangle_1[2] );
                this.bindings.push( triangle_2[0] );   this.bindings.push( triangle_2[1] );   this.bindings.push( triangle_2[2] );
            }
        }

        // give it back
        return this.bindings;
    }
    generate_vertex_references(){
        // empty it out
        this.vertex_references = [];

        for (let vertex_x_index = 0; vertex_x_index < this.vertex_count.x; vertex_x_index++) {
            for (let vertex_y_index = 0; vertex_y_index < this.vertex_count.y; vertex_y_index++) {
                this.vertex_references.push( 1.0*vertex_x_index ); // as a float
                this.vertex_references.push( 1.0*vertex_y_index ); // as a float
            }
        }

        // git it back
        return this.vertex_references;
    }

    // ###########################################
    // ###########################################

    get_vertices(){ return this.vertices; }
    get_bindings(){ return this.bindings; }
    get_vertex_references(){ return this.vertex_references; }
    get_face_count(){ return this.face_count; }

    // ###########################################
    // ###########################################
}