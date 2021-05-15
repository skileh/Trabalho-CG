//Esta função possui o calculo das posições da camera / rotação e zoom da mesma
function camMatrix(cameraPosition, target, up) {
  if (!animation) {
    return camMatrixNoAnimation(cameraPosition, target, up);
  }
  else {
    return camMatrixAnimation(cameraPosition, target, up);
  }
}

function camMatrixNoAnimation(cameraPosition, target, up) {
  var cameraMatrix;
  if (camTrans == 'Translação') {
    cameraMatrix = m4.translation(config.camPosX,
      config.camPosY,
      config.camPosZ);
  }
  else if (camTrans == 'Look At objeto') {
    target = [config.x_translation, config.y_translation, 0];
    cameraPosition[camSelect] = [config.camPosX, config.camPosY, 200 - config.camPosZ];
    cameraMatrix = m4.lookAt(cameraPosition[camSelect], target, up);
  }
  else if (camTrans == 'Look At ponto 0,0,0') {
    target = [0, 0, 0];
    cameraMatrix = m4.lookAt(cameraPosition[camSelect], target, up);
  }
  else if (camTrans == 'animação') {
    camTrans = 'animação';
  }
  // faz uma matriz que gira a câmera em torno do raio de origem * 1,5 distância para fora e olhando para a origem.
  else if (camTrans == 'Rotação Ponto') {
    //gira em torno do ponto onde está o objeto selecionado
    cameraMatrix = m4.xRotation(degToRad(config.camRotX));
    cameraMatrix = m4.yRotate(cameraMatrix, degToRad(config.camRotY));
    cameraMatrix = m4.zRotate(cameraMatrix, degToRad(config.camRotZ));
    cameraMatrix = m4.translate(cameraMatrix, config.x_translation, config.y_translation, 100 * 1.5);
  }
  else if (camTrans == 'Rotação Eixo') {
    cameraMatrix = m4.xRotation(degToRad(config.camRotX));
    cameraMatrix = m4.yRotate(cameraMatrix, degToRad(config.camRotY));
    cameraMatrix = m4.zRotate(cameraMatrix, degToRad(config.camRotZ));
    //gira em torno de x=0 e y=0
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, 100 * 1.5);
  }
  else {
    cameraMatrix = m4.lookAt(cameraPosition[camSelect], target, up);
  }

  cameraMatrix = m4.scale(cameraMatrix,
    config.zoom,
    config.zoom,
    1);

  return cameraMatrix;
}


function camMatrixAnimation(cameraPosition, target, up) {
  //calculo incremento rotação

  var cameraMatrix;
  if (rotation <= 20) {
    if (rotation == 1) {
      config.camPosx = 0;
    }
    cameraMatrix = m4.translation(rotation,
      config.camPosY,
      config.camPosZ);
  } else if (rotation <= 40) {
    positions = bezier(((rotation - 20) / 20),
      [20, -0],
      [60, 30],
      [-70, 30],
      [-20, 0]);
    cameraMatrix = m4.translation(positions[0],
      positions[1],
      config.camPosZ);

    config.camPosX = positions[0];
    config.camPosY = positions[1];
    cameraPosition[camSelect] = [positions[0], positions[1], config.camPosZ];
  } else if (rotation <= 60) {
    cameraMatrix = m4.translation(config.camPosX,
      rotation-40,
      config.camPosZ);
  }
  else {
    cameraMatrix = m4.lookAt(cameraPosition[camSelect], target, up);
    animation = false;
    rotation = degToRad(40);
  }
  return cameraMatrix;
}