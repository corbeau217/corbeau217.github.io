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
        // all vertices are:
        //  x, y, z, w,
        this.vertices = [
            // ..
        ];
    }
    generate_bindings(){
        // get our bindings depending on our winding order
        //  diagrams were for anticlockwise winding order
        this.bindings = (this.winding_clockwise)? this.clock_wise_bindings() : this.anti_clock_wise_bindings();
    }
    clock_wise_bindings(){
        return [
            // ..
        ];
    }
    anti_clock_wise_bindings(){
        return [
            // ...
        ];
    }
    get_vertices(){ return this.vertices; }
    get_bindings(){ return this.bindings; }
}