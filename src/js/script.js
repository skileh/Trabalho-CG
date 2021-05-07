function main() {
  const { gl, meshProgramInfo } = initializeWorld();

  const cubeBufferInfo = flattenedPrimitives.createCubeBufferInfo(gl, 20);

  const cubeVAO = twgl.createVAOFromBufferInfo(
    gl,
    meshProgramInfo,
    cubeBufferInfo,
  );

  var fieldOfViewRadians = degToRad(60);

  const cubeUniforms = {
    u_colorMult: [1, 0.5, 0.5, 1],
    u_matrix: m4.identity(),
  };

  function computeMatrix(viewProjectionMatrix, 
    yRotation, xRotation, zRotation, 
    y_translation, x_translation, z_translation) {
    var matrix = m4.translate(
      viewProjectionMatrix,
      y_translation,
      x_translation,
      z_translation,
    );

    matrix = m4.xRotate(matrix,xRotation);
    matrix = m4.zRotate(matrix,zRotation);
    matrix = m4.yRotate(matrix, yRotation);
    return matrix;
  }

  loadGUI(1);
  
  function render() {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    var cameraPosition = [0, 0, 100];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    gl.useProgram(meshProgramInfo.program);

    // ------ Draw the cube --------

    // Setup all the needed attributes.
    gl.bindVertexArray(cubeVAO);

    cubeUniforms.u_matrix = computeMatrix(
      viewProjectionMatrix,
      config.y_rotate,
      config.x_rotate,
      config.z_rotate,
      config.y_translation,
      config.x_translation,
      config.z_translation,

    );

    // Set the uniforms we just computed
    twgl.setUniforms(meshProgramInfo, cubeUniforms);

    twgl.drawBufferInfo(gl, cubeBufferInfo);
	requestAnimationFrame(render);
  }
     
  requestAnimationFrame(render);

}

main();
