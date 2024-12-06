// ############################################################################################
// ############################################################################################
// ############################################################################################

const type_matching_expression = /\b(?:i?(?:vec|mat)[234])|void|float|bool/g;
const comment_matching_expression = /\s*?\/\//g;
const uniform_declaration_matching_expression = /\s*?uniform/g;
const varying_declaration_matching_expression = /\s*?varying/g;
const function_header_matching_expression = /\w+\s+\w+\((?:\s*?\w+\s*?,?)*?\){?/g;

// ############################################################################################
// ############################################################################################
// ############################################################################################

export function determine_source_line_class( source_line_text ){
    let class_tags = [`shader_source_line`];

    // when it's a comment line starting with any length of whitespace
    if( source_line_text.match(comment_matching_expression) ) class_tags.push( `shader_source_comment_line` );
    if( source_line_text.match(uniform_declaration_matching_expression) ) class_tags.push( `shader_source_uniform_line` );
    if( source_line_text.match(varying_declaration_matching_expression) ) class_tags.push( `shader_source_varying_line` );
    if( source_line_text.match(function_header_matching_expression) ) class_tags.push( `shader_source_function_header_line` );

    return class_tags.join(' ');
}


export function prepare_shader_source_block( shader_source_data ){
    // split up whenever there's a new line element
    let shader_source_block_inner = [];
    shader_source_data.split('\n').forEach(
            source_line => {
                let line_class = determine_source_line_class( source_line );
                shader_source_block_inner.push(`<code class="${line_class}">` + source_line + `</code>`);
            }
        );
    
    // merge with line breaks
    return shader_source_block_inner.join(`<br />`);
}


export function insert_shader_code_block( element_id, source_code ){
    let code_block = document.querySelector(`#${element_id}`);
    let source_block = prepare_shader_source_block(source_code);
    code_block.innerHTML = source_block;
}

// ############################################################################################
// ############################################################################################
// ############################################################################################
