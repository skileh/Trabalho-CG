var config = { y_rotate: degToRad(0),  x_rotate: degToRad(0), z_rotate: degToRad(0),
				y_translation: degToRad(0),  x_translation: degToRad(0), z_translation: degToRad(0),
      beizer_translation: degToRad(0)};

var button1 = { Add_new_object:function(){ val = 0, count +=1, isCreate=true}};
var button2 = { remove_obj:function(){ isRemove=true}};
var select = { Select_Object:function(){ if(isSelect == '0'){
  val = 0;
} 
}};

var num;
const loadGUI = () => {


  const gui = new dat.GUI();
  gui.add(button1, 'Add_new_object');
  gui.add(button2, 'remove_obj');
  gui.add(select, 'Select_Object', num); 

  const rotate = gui.addFolder('Rotação no eixo');
  rotate.add(config, "y_rotate", 0, 20, 0.5);
  rotate.add(config, "x_rotate", 0, 20, 0.5);
  rotate.add(config, "z_rotate", 0, 20, 0.5);

  const translate = gui.addFolder('Translação');
  translate.add(config, "y_translation", -100, 100, 0.5);
  translate.add(config, "x_translation", -100, 100, 0.5);
  translate.add(config, "z_translation", -100, 100, 0.5);
  translate.add(config, "beizer_translation", 0,1,0.001);

};
