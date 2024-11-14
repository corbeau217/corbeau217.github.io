import {
    unit_circle_points,
    circle_points,
    circle_points_radius,
    tesselate_between_indices_lists,
    tesselate_indices_index_to_list,
    tesselate_indices_list_to_index,
} from "../util/geometry.js";


export class Engine_Shape {

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    constructor(){
        // ==========================================
        // ==========================================
        // prepare shape references
        
        this.vertices = [];
        this.bindings = [];

        this.circle_point_count = 12;

        // ==========================================
        // ==========================================
        // generate

        this.generateVertices();
        this.generateBindings();

        // ==========================================
        // ==========================================
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    generateVertices(){
        // ==========================================
        // ==========================================
        // === sizings

        this.ring_radius_list = [
            // front cone tip
            { radius: 0.0, position_z: 0.5 },
            { radius: 0.2, position_z: 0.2 },
            // end of blades
            { radius: 0.8, position_z: 0.2 },
            // front of shell
            { radius: 0.7, position_z: 1.0 },
            // widest part
            { radius: 1.0, position_z: 0.4 },
            // past blades
            { radius: 0.9, position_z: 0.0 },
            // end of shell
            { radius: 0.6, position_z: -0.5 },
            // outer rear exhaust
            { radius: 0.5, position_z: -0.4 },
            { radius: 0.35, position_z: -0.7 },
            // rear inner exhaust
            { radius: 0.25, position_z: -0.6 },
            // rear tip
            { radius: 0.0, position_z: -1.0 },
        ];
        
        // ==========================================
        // ==========================================
        // create the rings

        // could be more efficient but it's easier to read right now

        // all rings we have data for
        for (let ring_index = 1; ring_index < this.ring_radius_list.length-2; ring_index++) {
            // current ring information
            const ring_data = this.ring_radius_list[ring_index];
            
            // get a list of vertices for the ring
            // let current_ring_xy_points = circle_points_radius(this.circle_point_count, ring_data.radius);
            let current_ring_xy_points = unit_circle_points(this.circle_point_count);
            
            // for the current ring we want to generate all the vertices for it
            for (let i = 0; i < current_ring_xy_points.length; i++) {
                let vert_index = i*2;
                // x value
                this.vertices.push( ring_data.radius * current_ring_xy_points[ vert_index ]   );
                // y value
                this.vertices.push( ring_data.radius * current_ring_xy_points[ vert_index ]+1 );
                // z value
                this.vertices.push( ring_data.position_z );
                // w value
                this.vertices.push( 1.0 );
            }
        }

        // ==========================================
        // ==========================================
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

    generateBindings(){
        // create the list of lists of indices
        let indices_list_of_lists = [];

        // first point is on its own, then we do the rings

        // // for all the circles we're doing
        // let right_list = [];
        // // number of points on a circle
        // for(let i = 0; i < this.circle_point_count; i++){
        //     let right_index = this.circle_point_count + i;
        //     right_list.push( right_index );
        // }
        // indices_list_of_lists.push( tesselate_indices_index_to_list( 0, right_list ) );

        // also ignoring the last element
        // for all the circles we're doing
        for (let ring_index = 1; ring_index < this.ring_radius_list.length-1; ring_index++) {
            let left_list = [];
            let right_list = [];
            // number of points on a circle
            for(let i = 0; i < this.circle_point_count; i++){
                let left_index = ((ring_index-1)*this.circle_point_count) + i;
                let right_index = ((ring_index)*this.circle_point_count) + i;
                left_list.push( left_index );
                right_list.push( right_index );
            }
            indices_list_of_lists.push( tesselate_between_indices_lists( left_list, right_list ) );
        }


        // // for all the circles we're doing
        // let left_list = [];
        // // number of points on a circle
        // for(let i = 0; i < this.circle_point_count; i++){
        //     let left_index = ((this.ring_radius_list.length-2)*this.circle_point_count) + i;
        //     left_list.push( left_index );
        // }
        // indices_list_of_lists.push( tesselate_indices_list_to_index( left_list, (this.circle_point_count*(this.ring_radius_list.length-2)) ) );

        // now we go through each list and fill our bindings list iwth it
        for (let i = 0; i < indices_list_of_lists.length; i++) {
            const sub_list = indices_list_of_lists[i];
            // all points in sublist
            for (let j = 0; j < sub_list.length; j++) {
                // add to bindings
                this.bindings.push(sub_list[j]);
            }   
        }
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################
   
    get_vertices(){
        return this.vertices;
    }
    get_indices(){
        return this.bindings;
    }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}