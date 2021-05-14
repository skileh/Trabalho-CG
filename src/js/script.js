"use strict";

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

function bezier(t, p1, p2, p3, p4) {
  var invT = (1 - t)
  var px = ((p1[0]) * invT * invT * invT) +
    ((p2[0]) * 3 * t * invT * invT) +
    (p3[0] * 3 * invT * t * t) +
    (p4[0] * t * t * t);
  var py = ((p1[1]) * invT * invT * invT) +
    (p2[1] * 3 * t * invT * invT) +
    (p3[1] * 3 * invT * t * t) +
    ((p4[1]) * t * t * t);

  return [px, py];
}

var isCreate = false;
var isRemove = false;
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
  const cameraPosition = [
    config.cam1PosX=0,
    config.cam1PosY=0,
    config.cam1PosZ=100,
  ];
  var target = [0, 0, 0];
  var up = [0, 1, 0];

  //
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

  loadGUI();
  requestAnimationFrame(drawScene);
  // Draw the scene.
  function drawScene(time) {
    time = time * 0.0005;

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
    const cameraPosition = [
      config.cam1PosX,
      config.cam1PosY,
      config.cam1PosZ,
    ];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

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

      var coneUniformss =
      {
        u_colorMult: [time, -time, 1, 1],
        u_matrix: m4.identity(),
      };
      coneTranslation.push([0, 0, 0]);
      coneYRotation.push(0);
      coneXRotation.push(0);
      coneZRotation.push(0);
      coneXScale.push(1);
      coneZScale.push(1);
      coneYScale.push(1);
      coneBezier.push(0);
      config.x_scale = 0.5;
      config.z_scale = 0.5;
      config.y_scale = 0.5;


      // setup GLSL program

      objectsToDraw.push({
        bufferInfo: coneBufferInfos,
        uniforms: coneUniformss,
      });
      isCreate = false;
      console.log(objectsToDraw);
    }

    if (isRemove) {
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
        config.x_translation = 0;
        config.y_translation = 0;
        config.z_translation = 0;
        config.x_rotate = 0;
        config.y_rotate = 0;
        config.z_rotate = 0;
        config.beizer_translation = 0;
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