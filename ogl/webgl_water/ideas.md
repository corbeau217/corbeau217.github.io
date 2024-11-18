# ideas doc

## scene/scene objects
### draw calls
> regarding how draw calls are handled
---
currently we have this in `prepare_drawing()`, which should be illegal since it'll write over any previously drawn things
```js
this.gl_context.clear(this.gl_context.COLOR_BUFFER_BIT | this.gl_context.DEPTH_BUFFER_BIT);
```
---

### uniform binding
> regarding the binding of uniforms in shaders
---
something like:
```js
    this.uniforms = [
        {
            location: this.gl_context.getUniformLocation(this.shader, "u_mesh_divisions"),
            binding_function: this.gl_context.uniform2f,
            get_parameters: () => { return [ location, this.column_count, this.row_count ]; },
        },
    ];
```
* maybe we should have something to determine which to use and automatically do it
---