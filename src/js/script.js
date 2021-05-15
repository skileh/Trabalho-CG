"use strict";
"use cam.js";

//códigos rodando dentro da GpU
var vs = `#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fs = `#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec4 v_color;

uniform vec4 u_colorMult;

out vec4 outColor;

void main() {
   outColor = v_color * u_colorMult;
}
`;


function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  var aux, auy;
  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");
  // setup GLSL program,
  var coneBufferInfos = flattenedPrimitives.createTruncatedConeBufferInfo(gl, 10, 0, 20, 12, 1, true, false);
  var programInfo = twgl.createProgramInfo(gl, [vs, fs]);
  var coneVAOs = twgl.createVAOFromBufferInfo(gl, programInfo, coneBufferInfos);

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(60);

  // Uniforms for each object.
  var coneUniforms = [];

  //armazena posições da translação bezier
  var positions = [];

  //Atributos dos objetos
  var coneTranslation = [];
  var coneBezier = []; //armazena a translação bezier do cone
  var coneYRotation = [];
  var coneXRotation = [];
  var coneZRotation = [];
  var coneXScale = [];
  var coneYScale = [];
  var coneZScale = [];
  var objectsToDraw = [];

  //Atributo das cameras
  var camBezier = 0;
  const cameraPosition = [[
    config.camPosX = 0,
    config.camPosY = 0,
    config.camPosZ = 100
  ]];
  var target = [0, 0, 0];
  var up = [0, 1, 0];

  
  var gui = loadGUI();
  requestAnimationFrame(drawScene);
  //variaveis calculo tempo
  var then = 0;
  // Draw the scene.
  function drawScene(time,now) {
    // Convert to seconds
    time = time * 0.001;
    // Subtract the previous time from the current time
    var deltaTime = time - then;
    // Remember the current time for the next frame.
    then = time;
    rotation += config.velDelta * deltaTime;
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix =
      m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    if (camCreate) {
      cameraPosition.push([0, 0, 100])
    }
    refreshGUI(gui);
    cameraPosition[camSelect] = [
      config.camPosX,
      config.camPosY,
      config.camPosZ
    ];

    if (camBezier != config.camBezier) {
      positions = bezier(config.camBezier,
        [-100, -70],
        [-100, 70],
        [80, 70],
        [80, -70]);
      cameraPosition[camSelect] = [
        positions[0],
        positions[1],
        config.camPosZ
      ];
      camBezier = config.camBezier;
      config.camPosX = positions[0];
      config.camPosY = positions[1];
      refreshGUI(gui);
    }

    // chamada da função calculo da camera
    var cameraMatrix = camMatrix(cameraPosition, target, up);
    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    // verifica se o slice de translação foi modificado
    if (coneTranslation[objectsToDraw.length - 1] != [
      config.x_translation,
      config.y_translation,
      config.z_translation
    ]) {
      coneTranslation[objectsToDraw.length - 1] = [
        config.x_translation,
        config.y_translation,
        config.z_translation
      ];


    }

    //verifica se o slice de translação bezier foi ativo
    if (coneBezier[objectsToDraw.length - 1] != config.beizer_translation) {
      positions = bezier(config.beizer_translation,
        [-60, -30],
        [-60, 30],
        [50, 30],
        [50, -30]);

      coneTranslation[objectsToDraw.length - 1] = [
        positions[0],
        positions[1],
        config.z_translation
      ];
      config.x_translation = positions[0];
      config.y_translation = positions[1];
      coneBezier[objectsToDraw.length - 1] = config.beizer_translation;
    }
    coneXRotation[objectsToDraw.length - 1] = config.x_rotate;
    coneYRotation[objectsToDraw.length - 1] = config.y_rotate;
    coneZRotation[objectsToDraw.length - 1] = config.z_rotate;

    coneXScale[objectsToDraw.length - 1] = config.x_scale;
    coneYScale[objectsToDraw.length - 1] = config.y_scale;
    coneZScale[objectsToDraw.length - 1] = config.z_scale;

    //verifica se um objeto deve ser criado
    if (isCreate) {
      refreshGUI(gui);
      var coneUniformss =
      {
        u_colorMult: [time, -time, 1, 1],
        u_matrix: m4.identity(),
      };
      coneTranslation.push([config.y_translation = 0,
      config.x_translation = 0,
      config.z_translation = 0]);
      coneYRotation.push(config.y_rotate = 0);
      coneXRotation.push(config.x_rotate = 0);
      coneZRotation.push(config.z_rotate = 0);
      coneXScale.push(config.x_scale = 0.5);
      coneZScale.push(config.z_scale = 0.5);
      coneYScale.push(config.y_scale = 0.5);
      coneBezier.push(config.beizer_translation);


      // setup GLSL program

      objectsToDraw.push({
        bufferInfo: coneBufferInfos,
        uniforms: coneUniformss,
      });
      isCreate = false;
      console.log(objectsToDraw);
    }

    if (isRemove) {
      refreshGUI(gui);
      //sempre deixa apenas 1 objeto na tela
      if (objectsToDraw.length == 1) {
        isRemove = false;
      }
      else {
        //remove o ultimo objeto inserido
        objectsToDraw.splice(0, 1);
        coneTranslation.splice(0, 1);
        coneYRotation.splice(0, 1);
        coneXRotation.splice(0, 1);
        coneZRotation.splice(0, 1);
        coneBezier.splice(0, 1);
        console.log(objectsToDraw.length)
        isRemove = false;
      }
    }

    // Compute the matrices for each object.
    var c = 0;
    objectsToDraw.forEach(function (object) {
      object.uniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        coneTranslation[c],
        coneXRotation[c],
        coneYRotation[c],
        coneZRotation[c],
        coneXScale[c],
        coneYScale[c],
        coneZScale[c]);

      c += 1;
    });

    // Setup all the needed attributes.
    // desenha 1 cone \  malha que vai ser utilizada
    gl.bindVertexArray(coneVAOs);
    // programa que será utilizado
    gl.useProgram(programInfo.program);

    // ------ Draw the objects --------
    objectsToDraw.forEach(function (object) {
      // Set the uniforms we just computed
      twgl.setUniforms(programInfo, object.uniforms);
      twgl.drawBufferInfo(gl, object.bufferInfo);
    });

    requestAnimationFrame(drawScene);
  }
}


main();