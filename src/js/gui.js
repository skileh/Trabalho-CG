var config = { y_rotate: degToRad(0),  x_rotate: degToRad(0), z_rotate: degToRad(0),
				y_translation: degToRad(0),  x_translation: degToRad(0), z_translation: degToRad(0),
        beizer_translation: degToRad(0), 
        y_scale: degToRad(2),  x_scale: degToRad(2), y_scale: degToRad(2),
        cam1PosX: degToRad(2),  cam1PosY: degToRad(2), cam1PosZ: degToRad(2)};

var button1 = { Add_new_object:function(){ isCreate=true}};
var button2 = { remove_obj:function(){ isRemove=true}};

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
  scale.add(config, "y_scale", 0, 10, 0.01);

  const cam_position = gui.addFolder('Translação Camêra');
  cam_position.add(config, "cam1PosX", -200, 200, 1);
  cam_position.add(config, "cam1PosY", -200, 200, 1);
  cam_position.add(config, "cam1PosZ", -200, 200, 1);




};
