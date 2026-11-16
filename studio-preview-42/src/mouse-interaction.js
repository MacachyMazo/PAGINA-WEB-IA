// Desktop: free mouse-look while locked, central aim + left click to interact.
const scene = document.querySelector('#office-scene');
const camera = document.querySelector('#player-camera');
const desktop = () => !window.EDA_TOUCH?.enabled && !scene?.is('vr-mode');
function syncPointer() {
  if (!desktop()) return;
  const locked = document.pointerLockElement === scene.canvas;
  camera.setAttribute('cursor', 'rayOrigin', locked ? 'entity' : 'mouse');
  camera.setAttribute('cursor', 'downEvents', locked ? ['eda-manual-down'] : []);
  camera.setAttribute('cursor', 'upEvents', locked ? ['eda-manual-up'] : []);
  const cursor = camera.components?.cursor;
  if (cursor) { cursor.isCursorDown = false; cursor.cursorDownEl = null; }
}
document.addEventListener('pointerlockchange', syncPointer);
scene?.addEventListener('exit-vr', syncPointer);
function visible(el) {
  for (let node = el; node && node !== scene; node = node.parentElement) {
    if (node.object3D?.visible === false || [false, 'false'].includes(node.getAttribute('visible'))) return false;
  }
  return true;
}
document.addEventListener('click', event => {
  if (!desktop() || event.target !== scene?.canvas || event.button !== 0 || document.pointerLockElement !== scene.canvas) return;
  event.stopImmediatePropagation();
  const THREE = window.AFRAME.THREE;
  const ray = new THREE.Raycaster();
  scene.object3D.updateMatrixWorld(true);
  ray.setFromCamera(new THREE.Vector2(0, 0), scene.camera);
  ray.far = 14;
  const targets = [...scene.querySelectorAll('.interactive-object')].filter(visible);
  const hits = ray.intersectObjects(targets.map(el => el.object3D), true);
  let target = null;
  for (const hit of hits) {
    for (let obj = hit.object; obj; obj = obj.parent) {
      target = targets.find(el => el.object3D === obj);
      if (target) break;
    }
    if (target) break;
  }
  if (target) target.emit('click', { intersection: hits[0], mouseEvent: event }, false);
  else window.EDA_ESSENTIAL?.interact?.();
  // HTML forms and the official Discord iframe need the ordinary OS pointer.
  if (['diagnostico', 'discord'].includes(window.EDA_V4?.active)) document.exitPointerLock?.();
}, true);
