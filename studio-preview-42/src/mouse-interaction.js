// Keep the desktop pointer free. A drag rotates the camera; only a left click
// without a drag may activate the A-Frame object beneath the pointer.
const scene = document.querySelector('#office-scene');
const camera = document.querySelector('#player-camera');
let origin = null;
let dragged = false;
const cancelClick = () => {
  const cursor = camera?.components?.cursor;
  if (cursor) { cursor.isCursorDown = false; cursor.cursorDownEl = null; }
};
document.addEventListener('mousedown', event => {
  if (scene?.is('vr-mode') || event.target !== scene?.canvas) return;
  origin = event.button === 0 ? { x: event.clientX, y: event.clientY } : null;
  dragged = false;
  if (event.button !== 0) { cancelClick(); event.stopImmediatePropagation(); }
}, true);
document.addEventListener('mousemove', event => {
  if (!origin) return;
  if (Math.hypot(event.clientX-origin.x, event.clientY-origin.y) > 6) {
    dragged = true;
    cancelClick();
  }
}, true);
document.addEventListener('mouseup', event => {
  if (scene?.is('vr-mode')) return;
  if (dragged || event.button !== 0) cancelClick();
  origin = null;
}, true);
window.addEventListener('blur', () => { origin = null; cancelClick(); });
