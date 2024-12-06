
import { Lathe } from "/ogl/lib/util/old_lathe.js";


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
        this.face_count = 0;

        this.lathe_data = {
            // front cone tip
            first_point: { radius: 0.0,  position_z:  0.87, colour: {r:0.5, g:0.5, b:0.5}},
            // rear tip
            last_point: { radius: 0.0,  position_z: -1.0,  colour: {r:0.5, g:0.5, b:0.5}},
            // the others
            body_points: [
                // front cone base
                { radius: 0.28, position_z:  0.7,  colour: {r:0.5, g:0.5, b:0.5}},
                // end of blades
                { radius: 0.58, position_z:  0.7,  colour: {r:0.5, g:0.5, b:0.5}},
                // front of shell
                { radius: 0.67, position_z:  1.0,  colour: {r:0.5, g:0.5, b:0.5}},
                // widest part
                { radius: 0.73, position_z:  0.48, colour: {r:0.5, g:0.5, b:0.5}},
                // past blades
                { radius: 0.7,  position_z: -0.17, colour: {r:0.5, g:0.5, b:0.5}},
                // end of shell
                { radius: 0.6,  position_z: -0.62, colour: {r:0.5, g:0.5, b:0.5}},
                // outer rear exhaust
                { radius: 0.62, position_z: -0.4,  colour: {r:0.5, g:0.5, b:0.5}},
                { radius: 0.39, position_z: -0.86, colour: {r:0.5, g:0.5, b:0.5}},
                // rear inner exhaust
                { radius: 0.52, position_z: -0.6,  colour: {r:0.5, g:0.5, b:0.5}},
            ],
            slice_count: this.circle_point_count,
        };

        // ==========================================
        // ==========================================
        // generate

        // convince to do our dirty work
        this.lathe = new Lathe( this.lathe_data );

        // heist the data
        this.vertices = this.lathe.vertices;
        this.bindings = this.lathe.bindings;
        this.colours = this.lathe.colours;
        this.normals = this.lathe.normals;
        this.vertex_count = this.lathe.vertex_count;
        this.face_count = this.lathe.face_count;
        this.prevent_exploding = true;
        this.prefer_wireframe = true;

        // ==========================================
        // ==========================================
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
    get_bindings(){
        return this.bindings;
    }
    get_face_count(){ return this.face_count; }

    // ############################################################################################
    // ############################################################################################
    // ############################################################################################

}