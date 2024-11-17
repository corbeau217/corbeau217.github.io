import {
    unit_sphere_float_vertices,
    unit_sphere_bindings,
    unit_sphere_face_count,
} from "/ogl/common/util/geometry.js";
export class Sphere_Shape {
    // ...
    constructor(){
        this.prepare_shape_settings();
        this.winding_clockwise = true;
        this.build_mesh();
    }
    prepare_shape_settings(){
    }
    // incase we want to tweak the settings and rebuild our mesh
    build_mesh(){
        this.generate_vertices();
        this.generate_bindings();
    }
    generate_vertices(){
        this.vertices = unit_sphere_float_vertices();
    }
    generate_bindings(){
        // get our bindings depending on our winding order
        //  diagrams were for anticlockwise winding order
        this.bindings = unit_sphere_bindings(this.winding_clockwise);
    }
    get_vertices(){ return this.vertices; }
    get_bindings(){ return this.bindings; }
    get_face_count(){ return unit_sphere_face_count(); }
}