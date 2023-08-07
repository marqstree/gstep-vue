/**
   * 计算显示的字符串
   * @param {string} str 要裁剪的字符串
   * @param {number} maxWidth 最大宽度
   * @param {number} fontSize 字体大小
   */
export function fittingString(str, maxWidth, fontSize) {
  var fontWidth = fontSize * 1.3; //字号+边距
  maxWidth = maxWidth * 2; // 需要根据自己项目调整
  var width = calcStrLen(str) * fontWidth;
  var ellipsis = '…';
  if (width > maxWidth) {
    var actualLen = Math.floor((maxWidth - 10) / fontWidth);
    var result = str.substring(0, actualLen) + ellipsis;
    return result
  }
  return str
}

export function strWidth(str, fontSize){
  var fontWidth = fontSize * 1.3; //字号+边距
  var width = calcStrLen(str) * fontWidth;
  return width
}

/**
 * 计算字符串的长度
 * @param {string} str 指定的字符串
 */
export function calcStrLen(str) {
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}

export function uppercaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function date2Str(datetime) {
  let Y = datetime.getFullYear()
  let M = (datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1)
  let D = (datetime.getDate() < 10 ? '0' + (datetime.getDate()) : datetime.getDate())
  let h = (datetime.getHours() < 10 ? '0' + (datetime.getHours()) : datetime.getHours())
  let m = (datetime.getMinutes() < 10 ? '0' + (datetime.getMinutes()) : datetime.getMinutes())
  let s = (datetime.getSeconds() < 10 ? '0' + (datetime.getSeconds()) : datetime.getSeconds())
  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}

export function Number2Line(num) {
  let str = '';
  for (var i = 0; i < num; i++) {
    str += '|';
  }
  return str;
}

//阿拉伯数字转汉字
var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
var chnUnitChar = ["", "十", "百", "千"];

export function Number2Chinese(num) {

  var unitPos = 0;
  var strIns = '', chnStr = '';
  var needZero = false;

  if (num === 0) {
    return chnNumChar[0];
  }

  while (num > 0) {
    var section = num % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = SectionToChinese(section);
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    num = Math.floor(num / 10000);
    unitPos++;
  }

  return chnStr;
}

function SectionToChinese(section) {
  var strIns = '', chnStr = '';
  var unitPos = 0;
  var zero = true;
  while (section > 0) {
    var v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  return chnStr;
}