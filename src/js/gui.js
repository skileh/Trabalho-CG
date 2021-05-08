var config = { y_rotate: degToRad(0),  x_rotate: degToRad(0), z_rotate: degToRad(0),
				y_translation: degToRad(0),  x_translation: degToRad(0), z_translation: degToRad(0)};

var button = { Add_new_object:function(){ render() }};

var select = { Select_Object:function(){ 'dat.gui' }};

const loadGUI = (val) => {


  const gui = new dat.GUI();
  gui.add(button, 'Add_new_object');

  gui.add(select, 'Select_Object', [ 'pizza', 'chrome', 'hooray' ] )

  const rotate = gui.addFolder('Rotação no eixo');
  rotate.add(config, "y_rotate", 0, 20, 0.5);
  rotate.add(config, "x_rotate", 0, 20, 0.5);
  rotate.add(config, "z_rotate", 0, 20, 0.5);

  const translate = gui.addFolder('Translação Linear');
  translate.add(config, "y_translation", -100, 100, 0.5);
  translate.add(config, "x_translation", -100, 100, 0.5);
  translate.add(config, "z_translation", -100, 100, 0.5);

};
