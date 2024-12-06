export class Vehicle_Shape {
    // ...
    constructor(){
        this.prepare_shape_settings();
        this.winding_clockwise = true;
        this.build_mesh();
    }
    prepare_shape_settings(){
        // body sizing
        this.body_half_width         = 0.5;
        // engine bay
        this.engine_bay_front_height = 0.35;
        this.engine_bay_back_height  = 0.45;
        this.engine_bay_size_z       = 0.5;
        // cabin
        this.cabin_roof_front_height = 0.8;
        this.cabin_roof_back_height  = 0.8;
        this.cabin_forward_z         = 0.5;
        this.cabin_back_z            = 0.5;
        this.cabin_roof_forward_z    = 0.4;
        this.cabin_roof_back_z       = 0.45;
        // rear bay
        this.rear_bay_front_height   = 0.45;
        this.rear_bay_back_height    = 0.45;
        this.rear_bay_size_z         = 0.5;
    }
    // incase we want to tweak the settings and rebuild our mesh
    build_mesh(){
        this.generate_vertices();
        this.generate_bindings();
    }
    generate_vertices(){
        // all vertices are:
        //  x, y, z, w,
        // as per /daily/img/modeldiagram_05062024_vehicle_H.png
        this.vertices = [
            //        x          |               y             |                         z                  |   w   | index|
            // ------------------|-----------------------------|--------------------------------------------|-------|------|
             this.body_half_width,                          0.0,                        this.cabin_forward_z,    1.0, // 0
             this.body_half_width,                          0.0, this.cabin_forward_z+this.engine_bay_size_z,    1.0, // 1
             this.body_half_width, this.engine_bay_front_height, this.cabin_forward_z+this.engine_bay_size_z,    1.0, // 2
             this.body_half_width,  this.engine_bay_back_height,                        this.cabin_forward_z,    1.0, // 3
             this.body_half_width, this.cabin_roof_front_height,                   this.cabin_roof_forward_z,    1.0, // 4
             this.body_half_width,  this.cabin_roof_back_height,                   -(this.cabin_roof_back_z),    1.0, // 5
             this.body_half_width,   this.rear_bay_front_height,                        -(this.cabin_back_z),    1.0, // 6
             this.body_half_width,    this.rear_bay_back_height,   -(this.cabin_back_z+this.rear_bay_size_z),    1.0, // 7
             this.body_half_width,                          0.0,   -(this.cabin_back_z+this.rear_bay_size_z),    1.0, // 8
             this.body_half_width,                          0.0,                        -(this.cabin_back_z),    1.0, // 9
            // ------------------|-----------------------------|--------------------------------------------|-------|------|
            -this.body_half_width,                          0.0,                        this.cabin_forward_z,    1.0, // 10
            -this.body_half_width,                          0.0, this.cabin_forward_z+this.engine_bay_size_z,    1.0, // 11
            -this.body_half_width, this.engine_bay_front_height, this.cabin_forward_z+this.engine_bay_size_z,    1.0, // 12
            -this.body_half_width,  this.engine_bay_back_height,                        this.cabin_forward_z,    1.0, // 13
            -this.body_half_width, this.cabin_roof_front_height,                   this.cabin_roof_forward_z,    1.0, // 14
            -this.body_half_width,  this.cabin_roof_back_height,                   -(this.cabin_roof_back_z),    1.0, // 15
            -this.body_half_width,   this.rear_bay_front_height,                        -(this.cabin_back_z),    1.0, // 16
            -this.body_half_width,    this.rear_bay_back_height,   -(this.cabin_back_z+this.rear_bay_size_z),    1.0, // 17
            -this.body_half_width,                          0.0,   -(this.cabin_back_z+this.rear_bay_size_z),    1.0, // 18
            -this.body_half_width,                          0.0,                        -(this.cabin_back_z),    1.0, // 19
            // ------------------|-----------------------------|--------------------------------------------|-------|------|
        ];
    }
    generate_bindings(){
        // get our bindings depending on our winding order
        //  diagrams were for anticlockwise winding order
        this.bindings = (this.winding_clockwise)? this.clock_wise_bindings() : this.anti_clock_wise_bindings();
    }
    clock_wise_bindings(){
        return [
            // --- left side ---
            // front quarter
            1,2,3,
            0,1,3,
            // window
            3,4,5,
            3,5,6,
            // door
            0,3,6,
            0,6,9,
            // rear quarter
            6,7,9,
            7,8,9,
            // --- right side ---
            // front quarter
            11,13,12,
            10,13,11,
            // window
            13,15,14,
            13,16,15,
            // door
            10,16,13,
            10,19,16,
            // rear quarter
            16,19,17,
            17,19,18,
            // --- center ---
            // front
            1,12,2,
            1,11,12,
            // engine bay top
            2,12,13,
            2,13,3,
            // windshield
            3,13,14,
            3,14,4,
            // roof
            4,14,15,
            4,15,5,
            // rear window
            5,15,16,
            5,16,6,
            // rear bay top
            6,16,17,
            6,17,7,
            // rear
            7,17,18,
            7,18,8,
            // rear underside
            8,18,19,
            8,19,9,
            // cabin underside
            9,19,10,
            9,1,0,
            // engine underside
            0,10,11,
            0,11,1,
        ];
    }
    anti_clock_wise_bindings(){
        return [
            // --- left side ---
            // front quarter
            1,3,2,
            0,3,1,
            // window
            3,5,4,
            3,6,5,
            // door
            0,6,3,
            0,9,6,
            // rear quarter
            6,9,7,
            7,9,8,
            // --- right side ---
            // front quarter
            11,12,13,
            10,11,13,
            // window
            13,14,15,
            13,15,16,
            // door
            10,13,16,
            10,16,19,
            // rear quarter
            16,17,19,
            17,18,19,
            // --- center ---
            // front
            1,2,12,
            1,12,11,
            // engine bay top
            2,13,12,
            2,3,13,
            // windshield
            3,14,13,
            3,4,14,
            // roof
            4,15,14,
            4,5,15,
            // rear window
            5,16,15,
            5,6,16,
            // rear bay top
            6,17,16,
            6,7,17,
            // rear
            7,18,17,
            7,8,18,
            // rear underside
            8,19,18,
            8,9,19,
            // cabin underside
            9,10,19,
            9,0,1,
            // engine underside
            0,11,10,
            0,1,11,
        ];
    }
    get_vertices(){ return this.vertices; }
    get_bindings(){ return this.bindings; }
    get_face_count(){ return 36; }
}