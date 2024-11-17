const VERTEX_SHADER_SRC = `
attribute vec4 a_vertex_position;
// attribute vec4 a_normal;

uniform mat4 u_normal_matrix;
uniform mat4 u_model_matrix;
uniform mat4 u_view_matrix;
uniform mat4 u_projection_matrix;

varying highp float v_light_intensity;



void main(){
    gl_PointSize=15.0;
    vec4 pos = u_projection_matrix * ( u_view_matrix * (u_model_matrix * a_vertex_position) );
    gl_Position = pos;

    
    float ambient = 0.1;
    float percent_diffuse = (1.0-ambient);
    vec3 light_source_vec = vec3( -2.0, 5.0, 4.0 );
    vec3 light_direction_vec = normalize(light_source_vec);
    
    // broken
    // vec3 normal_source = normalize(a_normal.xyz);
    // honestly just use this
    vec3 normal_source = normalize(a_vertex_position.xyz);

    // make it a vec4 for use with our matrix
    vec4 normal_vec = vec4( normal_source, 0.0 );
    normal_vec = u_normal_matrix * normal_vec;

    float light_lambert = max( dot(normalize(normal_vec.xyz), light_direction_vec) , 0.0);

    v_light_intensity = min( (ambient+light_lambert), 1.0);
}
`;

export { VERTEX_SHADER_SRC };