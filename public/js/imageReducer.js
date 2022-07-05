const MIME_TYPE = "image/png";
const QUALITY = 0.7;
var files_sum = [];
var filesList = [];

function calculateSize(img, maxWidth, maxHeight) {
  let width = img.width;
  let height = img.height;

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
}

function changeHtmlElementId (canvasID)
  {
     var htmlElement = document.getElementById(canvasID);
     htmlElement.id = "myCanvasOld";  // here you can assign new Id
     var Tag = document.getElementsByClassName(canvasID)
     Tag[0].className = "downloadOld";
  }

function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}



$(document).ready(function(){
  $("#nodeStatus").click(function(){
    if($("#nodeStatus").text() == "Hide Node Status"){
      $("#right").hide();
      $("#nodeStatus").text("Show Node Status");
    }
    else{
      $("#right").show();
      $("#nodeStatus").text("Hide Node Status");
    }
  });
});

function handleDragOver(evt) {
  evt.stopPropagation(); // Do not allow the dragover event to bubble.
  evt.preventDefault(); // Prevent default dragover event behavior.
} // handleDragOver

function handleFileSelect(evt) {
  evt.stopPropagation(); // Do not allow the drop event to bubble.
  evt.preventDefault(); // Prevent default drop event behavior.

  if (evt.dataTransfer != null){
    var files = evt.dataTransfer.files; // Grab the list of files dragged to the drop box.
  } else {
    var files = evt.target.files; // FileList object from input
  }

  if (!files) {
      alert("<p>At least one selected file is invalid - do not select any folders.</p><p>Please reselect and try again.</p>");
      return;
  }
  for (var i = 0; i < files.length; i++) {
      if (!files[i]) {
          alert("Unable to access " + file.name);
          continue; // Immediately move to the next file object.
      }
      if (files[i].size == 0) {
          alert("Skipping " + files[i].name.toUpperCase() + " because it is empty.");
          continue;
      }
      if (files_sum.includes(filesum(files[i]))) {
          alert("This files is already listed");
          continue
      } else {
          files_sum[filesList.length] = filesum(files[i])
          document.querySelector("#compressWorkBox").querySelector("ul").innerHTML += '<li id="' + filesum(files[i]) + '"><strong class="fileName">' +
          files[i].name + '</strong> <spam class="itemClosebtn"><a class="removeList" onclick="removeList(\''+filesum(files[i])+'\')">&times;</a></spam>' +
          '</a></spam><br> <spam id="fileProperties"> (' + (files[i].type || 'n/a' ) +') - ' +
          files[i].size + ' bytes, last modified: ' + new Date(files[i].lastModified).toLocaleDateString() +'</spam></li>';

          filesList[filesList.length] = files[i]; //push valid files for filesList array
      }
  }

}

document.getElementById('dropContainer').addEventListener('dragover', handleDragOver, false);
document.getElementById('dropContainer').addEventListener('drop', handleFileSelect, false);
document.getElementById('img-browse').addEventListener('change', handleFileSelect, false);

function download(canvasID) {
  var Tag = document.getElementsByClassName(canvasID);
  var imageLink = document.getElementById(canvasID).toDataURL("image/png").replace("image/png", "image/octet-stream");
  Tag[0].download = canvasID;
  Tag[0].setAttribute("href", imageLink);
  changeHtmlElementId(canvasID);
}

function removeList(checksum) {
  var item = files_sum.indexOf(checksum)
  filesList.splice(item, 1)
  files_sum.splice(item, 1)

  document.getElementById(checksum).remove();
}

function compress() {
  if(filesList.length == 0) {
    alert('Please input the images');
  }
  var sidemenu = document.getElementById('imgList');
  while (sidemenu.children.length > 0) {
      sidemenu.removeChild(sidemenu.lastChild);
  }

  const MAX_WIDTH = document.getElementById("widthSize").value;
  const MAX_HEIGHT = document.getElementById("heightSize").value;

  for(let i = 0; i < filesList.length; i ++) {
    const file = filesList[i]; // get the file
    const blobURL = URL.createObjectURL(file);
    console.log(blobURL)
    const img = new Image();
    img.src = blobURL;
    img.onerror = function () {
      URL.revokeObjectURL(this.src);
      // Handle the failure properly
      console.log("Cannot load image");
    };
    
    img.onload = function () {
      URL.revokeObjectURL(this.src);
      console.log(img.width)
      const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      canvas.id = file.name;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const div = document.createElement('div');
      div.className = "eachImg-compressed";
      div.appendChild(canvas);

      const p = document.createElement('p');
      p.innerText = `Original file size: - Width: ${img.width} Height: ${img.height}`;
      div.append(p);

      const p1 = document.createElement('p');
      p1.innerText = `Original file size: - Width: ${newWidth} Height: ${newHeight}`;

      const button = document.createElement('button');
      button.setAttribute('onclick',`download("${canvas.id}")`);
      button.className = "downloadbtn";
      const a = document.createElement('a');
      a.className = canvas.id;
      a.innerText = `Download`;
      button.appendChild(a);
      p1.appendChild(button)

      div.append(p1);
      document.getElementById("resultShow").append(div);
    };
  }

  
  
  //reset filesList input
  document.getElementById("img-browse").value = ''
  if(!/safari/i.test(navigator.userAgent)){
    document.getElementById("img-browse").type = ''
    document.getElementById("img-browse").type = 'file'
  }
  filesList = [];
  files_sum = [];
};

function filesum(file) {
  var MD5 = function(d){result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

  var checksum = MD5(file.name + file.size + file.lastModified)
  return checksum
}

function reset () {
  var sidemenu = document.getElementById('imgList');
  while (sidemenu.children.length > 0) {
      sidemenu.removeChild(sidemenu.lastChild);
  }
  var resultmenu = document.getElementById('resultShow');
  while (resultmenu.children.length > 0) {
    resultmenu.removeChild(resultmenu.lastChild);
  }
  //reset filesList input
  document.getElementById("img-browse").value = ''
  if(!/safari/i.test(navigator.userAgent)){
    document.getElementById("img-browse").type = ''
    document.getElementById("img-browse").type = 'file'
  }
  filesList = [];
  files_sum = [];
}

