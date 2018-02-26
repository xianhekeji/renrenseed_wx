function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

function remove(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
function removeByValue(arr, text, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][text] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
function getIndex(arr, text, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][text] == val) {
      return i;
      break;
    }
  }
  return -1;
}
module.exports = {
  json2Form: json2Form,
  formatTime: formatTime,
  removeByValue: removeByValue,
  remove: remove,
  getIndex: getIndex
}

