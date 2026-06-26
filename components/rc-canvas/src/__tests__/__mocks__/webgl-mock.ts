import { jest } from '@jest/globals';

/**
 * 最小 WebGL2RenderingContext stub，供 jsdom 测试使用。
 * jsdom 不实现 WebGL，getContext('webgl2') 返回 null，
 * 通过此 mock 让 WebGLRenderer 构造函数不抛出异常。
 *
 * 只 stub 被构造函数和 dispose() 调用的方法，不验证调用顺序。
 */
export function createWebGL2Mock(): WebGL2RenderingContext {
    const mockFn = () => jest.fn();
    const mockObj = () => jest.fn(() => ({}));

    return {
        // 常量
        BLEND: 0x0be2,
        SRC_ALPHA: 0x0302,
        ONE_MINUS_SRC_ALPHA: 0x0303,
        COLOR_BUFFER_BIT: 0x4000,
        TRIANGLES: 0x0004,
        UNSIGNED_SHORT: 0x1403,
        ARRAY_BUFFER: 0x8892,
        ELEMENT_ARRAY_BUFFER: 0x8893,
        STATIC_DRAW: 0x88b4,
        VERTEX_SHADER: 0x8b31,
        FRAGMENT_SHADER: 0x8b30,
        FLOAT: 0x1406,
        TEXTURE_2D: 0x0de1,
        TEXTURE0: 0x84c0,
        RGBA: 0x1908,
        UNSIGNED_BYTE: 0x1401,
        LINEAR: 0x2601,
        CLAMP_TO_EDGE: 0x812f,
        TEXTURE_MIN_FILTER: 0x2801,
        TEXTURE_WRAP_S: 0x2802,
        TEXTURE_WRAP_T: 0x2803,
        R8: 0x8229,
        RED: 0x1903,
        UNPACK_ALIGNMENT: 0x0cf5,

        // 方法 stub
        enable: mockFn(),
        blendFunc: mockFn(),
        viewport: mockFn(),
        clearColor: mockFn(),
        clear: mockFn(),
        pixelStorei: mockFn(),

        createVertexArray: mockObj(),
        createBuffer: mockObj(),
        createShader: mockObj(),
        createProgram: mockObj(),
        createTexture: mockObj(),

        bindVertexArray: mockFn(),
        bindBuffer: mockFn(),
        bindTexture: mockFn(),
        activeTexture: mockFn(),

        bufferData: mockFn(),
        texImage2D: mockFn(),

        enableVertexAttribArray: mockFn(),
        vertexAttribPointer: mockFn(),

        shaderSource: mockFn(),
        compileShader: mockFn(),
        attachShader: mockFn(),
        linkProgram: mockFn(),
        useProgram: mockFn(),

        deleteShader: mockFn(),
        deleteProgram: mockFn(),
        deleteBuffer: mockFn(),
        deleteVertexArray: mockFn(),
        deleteTexture: mockFn(),

        texParameteri: mockFn(),
        drawElements: mockFn(),

        uniformMatrix3fv: mockFn(),
        uniform1f: mockFn(),
        uniform1i: mockFn(),
        uniform2f: mockFn(),
        uniform4f: mockFn(),
        uniform4fv: mockFn(),

        getUniformLocation: jest.fn(() => ({})),
        getShaderInfoLog: jest.fn(() => ''),
        getProgramInfoLog: jest.fn(() => ''),
    } as unknown as WebGL2RenderingContext;
}
