export function setAttributes(el: any, attributes: any) {
  for (const key in attributes) {
    el.setAttribute(key, attributes[key]);
  }
}
