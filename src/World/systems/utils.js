function getBaseUrl() {
  let url = window.location.href;
  return url.substring(0, url.lastIndexOf("/") + 1);
}

export { getBaseUrl };
