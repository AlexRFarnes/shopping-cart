export default function addGlobalEventListener(type, attribute, callback) {
  document.addEventListener(type, e => {
    if (!e.target.matches(attribute)) return;
    callback(e);
  });
}
