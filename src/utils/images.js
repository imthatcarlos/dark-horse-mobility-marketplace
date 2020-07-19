export const bufferToImage = (buf, ext = 'png') => {
  var blob = new Blob([buf], { type: `image/${ext}` } );
  var urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL( blob );
};
