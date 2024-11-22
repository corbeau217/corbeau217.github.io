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
        this.generate_normals();
    }
    generate_vertices(){
        this.vertices = [
            // ####left side
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
            // left
            0,1,2,
            0,2,1,
            // back
            1,5,6,
            1,6,2,
            // right
            5,4,7,
            5,7,6,
            // front
            4,0,3,
            4,3,7,
            // top
            7,3,2,
            7,2,6,
            // bottom
            0,4,5,
            0,5,1,
        ];
    }
    generate_normals(){
        // ...
    }
    get_vertices(){ return this.vertices; }
    get_bindings(){ return this.bindings; }
    get_face_count(){ return 12; }
}