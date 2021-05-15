const degToRad = (d) => (d * Math.PI) / 180;

const radToDeg = (r) => (r * 180) / Math.PI;

var isAnimate = false;
var camSelect = 0;
var isCreate = false;
var isRemove = false;
var camTrans;
var animation = false;
var rotation = degToRad(40);