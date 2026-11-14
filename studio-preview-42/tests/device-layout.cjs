const fs=require('fs'),vm=require('vm'),assert=require('assert');
const base=require('path').resolve(__dirname,'..')+'/';
const THREE=require(base+'node_modules/three/build/three.cjs');
// Canvas painting is stubbed; these tests exercise layout and input state.
const createCanvas=()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){}})});
class El{
 constructor(){this.object3D=new THREE.Group();this.listeners={};this.children=[];this.classes=new Set;this.classList={add:v=>this.classes.add(v),remove:v=>this.classes.delete(v),toggle:(v,on)=>on?this.classes.add(v):this.classes.delete(v)};}
 appendChild(e){this.children.push(e);this.object3D.add(e.object3D);return e;}
 setAttribute(n,a,b){if(n==='visible')this.object3D.visible=a===true||a==='true';if(n==='position')this.object3D.position.fromArray(a.split(' ').map(Number));}
 setObject3D(n,o){this.object3D.add(o)}
 addEventListener(n,f){(this.listeners[n]??=[]).push(f)}
 emit(n){for(const f of this.listeners[n]||[])f({stopPropagation(){}})}
}
const ids={};for(const id of ['office-scene','player-camera','player-rig','gaze-cursor','vr-left','vr-right','scene-container'])ids[id]=new El;
let vr=false,shown='',interactions=0;
const scene=ids['office-scene'];scene.hasLoaded=true;scene.is=()=>vr;
scene.exitVR=async()=>{vr=false;scene.emit('exit-vr')};
const cam=new THREE.PerspectiveCamera(60,1,.1,100);cam.position.y=1.64;cam.updateMatrixWorld();
ids['player-camera'].getObject3D=()=>cam;
const document={querySelector:s=>ids[s.slice(1)],getElementById:s=>ids[s],body:new El,createElement:t=>t==='canvas'?createCanvas(1,1):new El};
const window={EDA_ESSENTIAL:{show:s=>shown=s,interact:()=>interactions++}};
vm.runInNewContext(fs.readFileSync(base+'src/device-v9.js','utf8'),{document,window,AFRAME:{THREE},ResizeObserver:class{observe(){}},requestAnimationFrame:()=>1,cancelAnimationFrame(){},console});
const menu=scene.children[0],shortcut=ids['player-camera'].children[0];
vr=true;scene.emit('enter-vr');assert(menu.object3D.visible);assert(menu.children[0].classes.has('interactive-object'));
menu.children[2].emit('click');assert.equal(shown,'membresias');assert(!menu.object3D.visible);
shortcut.children[0].emit('click');assert(menu.object3D.visible,'look-down shortcut must reopen a closed menu');
ids['vr-right'].emit('gripdown');assert(menu.object3D.visible);
(async()=>{await window.EDA_DEVICE.browser('diagnostico');assert(!vr);assert.equal(shown,'diagnostico');assert.equal(interactions,1);assert(!shortcut.object3D.visible);assert(!menu.children[0].classes.has('interactive-object'));
const source=fs.readFileSync(base+'src/holo-v4.js','utf8');const scaleCode=source.slice(source.indexOf('window.EDA_HOLO ='),source.indexOf('function draw(id)'));
let bounds;document.querySelector=s=>({getBoundingClientRect:()=>bounds});vm.runInNewContext(scaleCode,{window,document,scene});
for(const [w,h] of [[320,568],[390,844],[844,390],[768,1024],[1024,768],[1440,900],[3840,2160]]){
 bounds={width:w,height:h-70};cam.aspect=w/bounds.height;cam.updateProjectionMatrix();const position=new THREE.Vector3(0,1.64,-3);const scale=window.EDA_HOLO.scale(position,cam);const pixels=scale*2.46*bounds.height*cam.projectionMatrix.elements[5]/6;assert(Number.isFinite(scale));assert(pixels*2.35/2.46<=w-31);assert(pixels<=bounds.height-149);}
vr=true;assert.equal(window.EDA_HOLO.scale(new THREE.Vector3(),cam),1);
console.log('PASS: VR menu, controller menu, gaze shortcut, browser handoff, raycast cleanup and 7 screen size projections.');})();
