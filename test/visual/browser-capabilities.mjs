/** Check the actual native browser/driver, rather than accepting a blank canvas. */
export async function inspectBrowserRendering(browser) {
    const context = await browser.newContext();
    try {
        const page = await context.newPage();
        return { browser: browser.version(), ...await page.evaluate(() => {
            const canvas = globalThis.document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            const errors = [];
            canvas.addEventListener('webglcontextcreationerror', event => errors.push(event.statusMessage));
            const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
            if (!gl) return { webgl2: false, drawn: false, errors };
            const compile = (type, source) => {
                const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
                return shader;
            };
            const program = gl.createProgram();
            gl.attachShader(program, compile(gl.VERTEX_SHADER, '#version 300 es\nin vec2 position; void main(){gl_Position=vec4(position,0.,1.);}'));
            gl.attachShader(program, compile(gl.FRAGMENT_SHADER, '#version 300 es\nprecision highp float; out vec4 color; void main(){color=vec4(1.,0.,0.,1.);}'));
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
            gl.useProgram(program);
            const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-.8,-.8,.8,-.8,0,.8]), gl.STATIC_DRAW);
            const attribute = gl.getAttribLocation(program, 'position'); gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
            gl.clearColor(.2,.4,.6,1); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
            const center = new Uint8Array(4), background = new Uint8Array(4);
            gl.readPixels(32, 32, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, center); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, background);
            const extension = gl.getExtension('WEBGL_debug_renderer_info');
            const result = { webgl2: true, drawn: center[0] === 255 && center[1] === 0 && center[3] === 255 && background[0] === 51, center: [...center], background: [...background], error: gl.getError(), vendor: gl.getParameter(gl.VENDOR), renderer: gl.getParameter(gl.RENDERER), driver: extension ? gl.getParameter(extension.UNMASKED_RENDERER_WEBGL) : null, errors };
            gl.getExtension('WEBGL_lose_context')?.loseContext();
            return result;
        }) };
    } finally { await context.close(); }
}
