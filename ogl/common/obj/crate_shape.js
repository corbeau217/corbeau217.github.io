// import {
//     unit_sphere_float_vertices,
//     unit_sphere_bindings,
//     unit_sphere_face_count,
// } from "/ogl/common/util/geometry.js";

export class Crate_Shape {
    // ...
    constructor(){
        this.prepare_shape_settings();
        this.winding_clockwise = true;
        this.build_mesh();
    }
    prepare_shape_settings(){
        // ...
    }
    // incase we want to tweak the settings and rebuild our mesh
    build_mesh(){
        this.generate_vertices();
        this.generate_bindings();
    }
    generate_vertices(){
        this.vertices = [
            // left side
            // --- bottom
            -1.0, -1.0, -1.0, 1.0,
            -1.0, -1.0,  1.0, 1.0,
            // --- top
            -1.0,  1.0,  1.0, 1.0,
            -1.0,  1.0, -1.0, 1.0,
            // right side
            // --- bottom
             1.0, -1.0, -1.0, 1.0,
             1.0, -1.0,  1.0, 1.0,
             // --- top
             1.0,  1.0,  1.0, 1.0,
             1.0,  1.0, -1.0, 1.0,
        ];
    }
    generate_bindings(){
        // get our bindings depending on our winding order
        //  diagrams were for anticlockwise winding order
        this.bindings = [
            // ...
            // TODO: make bindings lol
            0,1,2,
            0,2,1,
        ];
    }
    get_vertices(){ return this.vertices; }
    get_bindings(){ return this.bindings; }
    get_face_count(){ return 2; }
}