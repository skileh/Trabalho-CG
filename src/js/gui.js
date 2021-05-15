var config = {
  y_rotate: degToRad(0), x_rotate: degToRad(0), z_rotate: degToRad(0),
  y_translation: degToRad(0), x_translation: degToRad(0), z_translation: degToRad(0),
  beizer_translation: degToRad(0),
  y_scale: degToRad(0), x_scale: degToRad(0), z_scale: degToRad(0),
  camPosX: degToRad(0), camPosY: degToRad(0), camPosZ: degToRad(0),
  camBezier: degToRad(0), barDirection: degToRad(0),
  camRotX: degToRad(0), camRotY: degToRad(0), camRotZ: degToRad(0),
  objDelta: degToRad(0), aniObj: function () { isAnimate = true; },
  zoom: degToRad(0),
  velDelta: degToRad(0), animation: function () { animation = true; }
};

var button1 = { Add_new_object: function () { isCreate = true; } };
var button2 = { remove_obj: function () { isRemove = true; } };

function refreshGUI(gui) {
  for (var i = 0; i < Object.keys(gui.__folders).length; i++) {
    var key = Object.keys(gui.__folders)[i];
    for (var j = 0; j < gui.__folders[key].__controllers.length; j++) {
      gui.__folders[key].__controllers[j].updateDisplay();
    }
  }
}

const loadGUI = () => {
  const gui = new dat.GUI();
  config.zoom = 1
  gui.add(config, "zoom", 0.0001, 5, 0.0001);

  gui.add(button1, 'Add_new_object');
  gui.add(button2, 'remove_obj');

  const rotate = gui.addFolder('Rotação no Eixo Objeto');
  rotate.add(config, "y_rotate", 0, 20, 0.5).name('Y');
  rotate.add(config, "x_rotate", 0, 20, 0.5).name('X');
  rotate.add(config, "z_rotate", 0, 20, 0.5).name('Z');

  const translate = gui.addFolder('Translação Objeto');
  translate.add(config, "y_translation", -100, 100, 0.5).name('Y');
  translate.add(config, "x_translation", -100, 100, 0.5).name('X');
  translate.add(config, "z_translation", -100, 100, 0.5).name('Z');
  translate.add(config, "beizer_translation", 0, 1, 0.001).name('BEZIER');

  const scale = gui.addFolder('Escala Objeto');
  scale.add(config, "y_scale", 0, 10, 0.01).name('Y');
  scale.add(config, "x_scale", 0, 10, 0.01).name('X');
  scale.add(config, "z_scale", 0, 10, 0.01).name('Z');

  barDepthController = gui.add(config, 'barDirection',
    ['Translação', 'Look At objeto', 'Look At Ponto 0,0,0',
      'Rotação Ponto', 'Rotação Eixo'])
    .name('Objetivo Camêra')
    .listen();
  const cam_position = gui.addFolder('Camêra Translações');
  cam_position.add(config, "camPosX", -200, 200, 1).name('X');
  cam_position.add(config, "camPosY", -200, 200, 1).name('Y');
  cam_position.add(config, "camPosZ", -200, 200, 1).name('Z');
  cam_position.add(config, "camBezier", 0, 1, 0.001);

  const cam_rotation = gui.addFolder('Camêra Rotações');
  cam_rotation.add(config, "camRotX", 0, 360, 1).name('X');
  cam_rotation.add(config, "camRotY", 0, 360, 1).name('Y');
  cam_rotation.add(config, "camRotZ", 0, 360, 1).name('Z');

  const animaObj = gui.addFolder('Animaco Objeto');
  animaObj.add(config, "objDelta", 1, 10, 0.001).name('Delta T');
  animaObj.add(config, 'aniObj').name('Animação');

  const animaCam = gui.addFolder('Animaco Camera');
  animaCam.add(config, "velDelta", 1, 10, 0.001).name('Delta T');
  animaCam.add(config, 'animation').name('Animação');
  barDepthController.onChange(
    function (newValue) {
      config.camPosX = 0;
      config.camPosY = 0;
      refreshGUI(gui)
      if (newValue == 'Translação') {
        camTrans = 'Translação';
      }
      else if (newValue == 'Look At objeto') {
        camTrans = 'Look At objeto';
      }
      else if (newValue == 'Look At Ponto 0,0,0') {
        camTrans = 'Look At Ponto 0,0,0';
      }
      else if (newValue == 'Rotação Ponto') {
        camTrans = 'Rotação Ponto';
      }
      else if (newValue == 'Rotação Eixo') {
        camTrans = 'Rotação Eixo';
      }
      else {
        // console.log('error');
      }
      //do whatever you want...
    });

  return gui;
};
