
function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation, zRotation, xScale, yScale, zSacale) {
    var matrix = m4.translate(viewProjectionMatrix,
      translation[0],
      translation[1],
      translation[2]);
    matrix = m4.scale(matrix, xScale, yScale, zSacale);
    matrix = m4.xRotate(matrix, xRotation);
    matrix = m4.zRotate(matrix, zRotation);
    return m4.yRotate(matrix, yRotation);
  }