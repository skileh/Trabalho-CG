"use strict";

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

var val=0;
var count=0;
var index=0;
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

  // Tell the twgl to match position with a_position, n
  // normal with a_normal etc..
  twgl.setAttributePrefix("a_");
  // setup GLSL program
  var programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  function degToRad(d) {
    return d * Math.PI / 180;
  }


  var fieldOfViewRadians = degToRad(60);

  // Uniforms for each object.
  var coneUniforms = [];
  var coneTranslation =[];
  var coneYRotation=[];
  var coneXRotation=[];

  var objectsToDraw = [];

  function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
    var matrix = m4.translate(viewProjectionMatrix,
        translation[0],
        translation[1],
        translation[2]);
    matrix = m4.xRotate(matrix, xRotation);
    return m4.yRotate(matrix, yRotation);
  }
  loadGUI(objectsToDraw);
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
    var cameraPosition = [0, 0, 100];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    var t = config.beizer_translation;
    var invT = (1 - t)
    var Px = ((-60) * invT *invT *invT) +
        ((-60) * 3 * t * invT *invT )+
        (50 * 3 * invT * t * t)+
        (50 * t * t * t);
    var Py= ((-30) * invT *invT *invT )+
        (30 * 3 * t * invT *invT )+
       ( 30 * 3 * invT * t * t )+
        ((-30) * t * t * t);

    if(val == 0){
      coneTranslation[count-1] = [
                        Px,
                        Py,
                        config.z_translation
                        ];
      coneXRotation[count-1] =  config.x_rotate;
      coneYRotation[count-1] =  config.y_rotate;

    }
    if(isCreate){

      var coneUniformss =
        {
          u_colorMult: [time, -time, 1, 1],
          u_matrix: m4.identity(),
        };
      coneTranslation.push([ 0, 0, 0]);
      coneYRotation.push(0);
      coneXRotation.push(0);
      var coneBufferInfos   = flattenedPrimitives.createTruncatedConeBufferInfo(gl, 10, 0, 20, 12, 1, true, false);

      // setup GLSL program

      var coneVAOs   = twgl.createVAOFromBufferInfo(gl, programInfo, coneBufferInfos);
      objectsToDraw.push({
          programInfo: programInfo,
          bufferInfo: coneBufferInfos,
          vertexArray: coneVAOs,
          uniforms: coneUniformss,
      });
      isCreate = false;
      console.log(objectsToDraw);
    }

    if(isRemove){
      if(count == 1){
        isRemove=false;
      }
      else{
        objectsToDraw.splice(0,1);
        isRemove=false;
        count -=1;
      }
    }

    // Compute the matrices for each object.
    var c=0;
    objectsToDraw.forEach(function(object) {

      object.uniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        coneTranslation[c],
        coneXRotation[c],
        coneYRotation[c]);
      c +=1;
    });

    // ------ Draw the objects --------
    objectsToDraw.forEach(function(object) {
      var programInfo = object.programInfo;

      gl.useProgram(programInfo.program);

      // Setup all the needed attributes.
      gl.bindVertexArray(object.vertexArray);

      // Set the uniforms we just computed
      twgl.setUniforms(programInfo, object.uniforms);
      twgl.drawBufferInfo(gl, object.bufferInfo);
    });

    requestAnimationFrame(drawScene);
  }
}


main();