var config = { y_rotate: degToRad(0),  x_rotate: degToRad(0), z_rotate: degToRad(0),
				y_translation: degToRad(0),  x_translation: degToRad(0), z_translation: degToRad(0),
        beizer_translation: degToRad(0), 
        y_scale: degToRad(0),  x_scale: degToRad(0), z_scale: degToRad(0),
        camPosX: degToRad(0),  camPosY: degToRad(0), camPosZ: degToRad(0)};

var button1 = { Add_new_object:function(){ isCreate=true}};
var button2 = { remove_obj:function(){ isRemove=true}};

function refreshGUI(gui){
  for (var i = 0; i < Object.keys(gui.__folders).length; i++) {
    var key = Object.keys(gui.__folders)[i];
    for (var j = 0; j < gui.__folders[key].__controllers.length; j++ )
    {
        gui.__folders[key].__controllers[j].updateDisplay();
    }
  }
} 

const loadGUI = () => {
  const gui = new dat.GUI();
  gui.add(button1, 'Add_new_object');
  gui.add(button2, 'remove_obj');

  const rotate = gui.addFolder('Rotação no Eixo Objeto');
  rotate.add(config, "y_rotate", 0, 20, 0.5);
  rotate.add(config, "x_rotate", 0, 20, 0.5);
  rotate.add(config, "z_rotate", 0, 20, 0.5);

  const translate = gui.addFolder('Translação Objeto');
  translate.add(config, "y_translation", -100, 100, 0.5);
  translate.add(config, "x_translation", -100, 100, 0.5);
  translate.add(config, "z_translation", -100, 100, 0.5);
  translate.add(config, "beizer_translation", 0,1,0.001);

  const scale = gui.addFolder('Escala Objeto');
  scale.add(config, "y_scale", 0, 10, 0.01);
  scale.add(config, "x_scale", 0, 10, 0.01);
  scale.add(config, "z_scale", 0, 10, 0.01);

  const cam_position = gui.addFolder('Translação Camêra');
  cam_position.add(config, "camPosX", -200, 200, 1);
  cam_position.add(config, "camPosY", -200, 200, 1);
  cam_position.add(config, "camPosZ", -200, 200, 1);
  cam_position.add(config, "camBezier", 0,1,0.001);



  return gui;
};
