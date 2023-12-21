var zNavTrung = document.getElementById('nav-trung');
var zNavHan = document.getElementById('nav-han');
var zNavViet = document.getElementById('nav-viet');
var zNavHighlightTrung = '';
var zNavHighlightHan = document.getElementById('nav-highlight-han');
var zNavHighlightViet = document.getElementById('nav-highlight-viet');
var zZeroTable = document.getElementById('zero-table');

var zButtonUpdate = document.getElementById('btn-update');
var zModalUpdateWords = document.getElementById('modal-update-words');
var zInputUpdateTrung = zModalUpdateWords.querySelector('#input-trung');
var zInputUpdateHan = zModalUpdateWords.querySelector('#input-han');
var zInputUpdateViet = zModalUpdateWords.querySelector('#input-viet');
var zButtonUpdateAdd = zModalUpdateWords.querySelector('#btn-update-add');
var zButtonUpdateDelete = zModalUpdateWords.querySelector('#btn-update-delete');
var zButtonUpdateInfo = zModalUpdateWords.querySelector('#btn-update-info');
var zCheckName = zModalUpdateWords.querySelector('#check-name');

var zButtonInfo = document.getElementById('btn-info');
var zModalInfoWords = document.getElementById('modal-info-words');
var zModalInfoBody = zModalInfoWords.querySelector('.modal-body');

var zModalTextTrung = '';
var zModalTextViet = '';

const DATA_TYPE_NAMES = 1;
const DATA_TYPE_WORDS = 2;
const DATA_TYPE_DICTS = 3;
const DATA_TYPE_OTHERS = 4;

const DATA_MEANS_TYPE_VIETPHRASE_NAMES = 1;
const DATA_MEANS_TYPE_VIETPHRASE_WORDS = 2;
const DATA_MEANS_TYPE_LACVIET = 3;
const DATA_MEANS_TYPE_THIEUCHUU = 4;

var zDataType = 0;

var zDataDicts;
var zDataWords;
var zDataNames;

var zDataDictsLocal = new Array();
var zDataWordsLocal = new Array();
var zDataNamesLocal = new Array();

var zDataSearch = new Array();
var zDataUpdate = new Array();

var zDataMeansLacViet;
var zDataMeansThieuChuu;

var zDataMeans = new Array();
/*
// Copy clipboard to <div>
zNavTrung.addEventListener('paste', (event) => {
  let paste = (event.clipboardData || window.clipboardData).getData('text');
  zNavTrung.value = paste;
  event.preventDefault();
});
*/

$(document).ready(function () {
  $.ajax({
    url: 'api/zh_dicts.csv',
    dataType: 'text',
  }).done(getDicts);

  $.ajax({
    url: 'api/zh_words.csv',
    dataType: 'text',
  }).done(getWords);

  $.ajax({
    url: 'api/zh_names.csv',
    dataType: 'text',
  }).done(getNames);

  $.ajax({
    url: 'api/zh_means_lacviet.csv',
    dataType: 'text',
  }).done(getMeansLacViet);

  $.ajax({
    url: 'api/zh_means_thieuchuu.csv',
    dataType: 'text',
  }).done(getMeansThieuChuu);

  zNavTrung.value = '';
  zNavHan.value = '';
  zNavViet.value = '';
  zNavHighlightTrung = '';
  zNavHighlightHan.value = '';
  zNavHighlightViet.value = '';
  zButtonUpdate.disabled = true;
  zButtonInfo.disabled = true;
  zZeroTable.innerHTML = '';
});

var zDataConfig = {
  delimiter: '=',
}

// Get global data.csv into global arrays
function getDicts(data) {
  zDataDicts = Papa.parse(data, zDataConfig).data;
  zDataDicts.splice(zDataDicts.length - 1, 1); // Remove last character '' in .csv file
}

function getWords(data) {
  zDataWords = Papa.parse(data, zDataConfig).data;
  zDataWords.splice(zDataWords.length - 1, 1);
}

function getNames(data) {
  zDataNames = Papa.parse(data, zDataConfig).data;
  zDataNames.splice(zDataNames.length - 1, 1);
}

function getMeansLacViet(data) {
  zDataMeansLacViet = Papa.parse(data, zDataConfig).data;
  zDataMeansLacViet.splice(zDataMeansLacViet.length - 1, 1);
}

function getMeansThieuChuu(data) {
  zDataMeansThieuChuu = Papa.parse(data, zDataConfig).data;
  zDataMeansThieuChuu.splice(zDataMeansThieuChuu.length - 1, 1);
}

zModalUpdateWords.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;

  // Extract info from data-bs-* attributes
  var value = button.getAttribute('data-bs-whatever');

  var text = '';

  switch (value) {
    case 'info-to-update': text = zModalTextTrung; break;
    case 'highlight-to-update': text = zNavHighlightTrung; break;
    default: text = ''; break;
  }

  update(text);
});

zModalInfoWords.addEventListener('show.bs.modal', function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;

  // Extract info from data-bs-* attributes
  var value = button.getAttribute('data-bs-whatever');

  var text = '';

  switch (value) {
    case 'update-to-info': text = zModalTextTrung; break;
    case 'highlight-to-info': text = zNavHighlightTrung; break;
    default: text = ''; break;
  }

  info(text);
});

function info(text) {
  if (text == '') {
    zModalTextTrung = '';
    return;
  }

  zModalInfoBody.innerHTML = `<div class="zero-container"><b>${text}</b></div>`;

  var infoText = '';
  var count = 0;

  for (var i = 0; i < zDataMeans.length; i++) {
    var pos = text.search(zDataMeans[i].TRUNG);
    if (pos != -1) {
      var typeName = '';
      var separator = count > 0 ? '<hr>' : '';
      switch (zDataMeans[i].TYPE) {
        case DATA_MEANS_TYPE_VIETPHRASE_NAMES: typeName = 'VietPhrase - Name'; break;
        case DATA_MEANS_TYPE_VIETPHRASE_WORDS: typeName = 'VietPhrase'; break;
        case DATA_MEANS_TYPE_LACVIET: typeName = 'Lạc Việt'; break;
        case DATA_MEANS_TYPE_THIEUCHUU: typeName = 'Thiều Chửu'; break;
        default: typeName = 'Unknown'; break;
      }
      infoText += `<br>${separator}<b>${zDataMeans[i].TRUNG}</b>《${typeName} ~ ${zDataMeans[i].ID}》<br>${zDataMeans[i].VIET}`;
      count++;
    }
  }

  if (infoText != '') {
    zModalInfoBody.innerHTML += infoText;
    zModalInfoBody.innerHTML = zModalInfoBody.innerHTML.replace(/\\n/g, '<br>').replace(/\\t/g, '&nbsp;&nbsp;&nbsp;');

  } else {
    zModalInfoBody.innerHTML = 'Không tìm thấy thông tin!';
  }

  zModalTextTrung = text;

  console.log(zModalInfoBody);
}

// Same as function translate() with minor change
function update(text) {
  if (text == '') {
    zInputUpdateHan.value = '';
    zInputUpdateViet.value = '';
    zModalTextTrung = '';
    zModalTextViet = '';
    zButtonUpdateAdd.textContent = 'Add';
    zButtonUpdateAdd.disabled = true;
    zButtonUpdateDelete.disabled = true;
    zCheckName.checked = false;
    return;
  }

  zButtonUpdateAdd.disabled = false;

  zDataUpdate.length = 0;
  zZeroTable.innerHTML = '';

  var txtTrung = text;
  var txtHan = txtTrung;
  var txtViet = txtTrung;

  // Search string in local data (get from global data.csv before)
  // Use local data instead of global data.csv will take less time to search
  zDataUpdate.pushData(txtTrung, zDataNamesLocal, DATA_TYPE_NAMES);
  zDataUpdate.pushData(txtTrung, zDataWordsLocal, DATA_TYPE_WORDS);
  zDataUpdate.pushData(txtTrung, zDataDictsLocal, DATA_TYPE_DICTS);

  var sorto = { T_INDEX: 'asc' };

  // Sort & then clean duplicate words
  zDataUpdate.cleanDuplicate();

  // Update 'HAN' word into searched data
  zDataUpdate.updateDicts(zDataDictsLocal);

  // Add other chars not in any original data.csv & sort again
  zDataUpdate.pushOtherChars(txtTrung, DATA_TYPE_OTHERS);
  zDataUpdate.keySort(sorto); // sort again

  // zDataUpdate.buildTable(zZeroTable);

  // Update the modal's content.
  if (zDataUpdate.length == 1) {
    txtHan = zDataUpdate[0].HAN;
    txtViet = zDataUpdate[0].VIET;
    zDataType = zDataUpdate[0].TYPE;
    switch (zDataType) {
      case DATA_TYPE_NAMES:
        zButtonUpdateAdd.textContent = 'Update Name';
        zButtonUpdateDelete.disabled = false;
        zCheckName.checked = true;
        break;
      case DATA_TYPE_WORDS:
        zButtonUpdateAdd.textContent = 'Update';
        zButtonUpdateDelete.disabled = false;
        zCheckName.checked = false;
        break;
      case DATA_TYPE_DICTS:
        zButtonUpdateAdd.textContent = 'Add';
        zButtonUpdateDelete.disabled = true;
        zCheckName.checked = false;
        break;
      default:
        zButtonUpdateAdd.textContent = 'Add';
        zButtonUpdateDelete.disabled = true;
        zCheckName.checked = false;
    }
  } else {
    var txtHanViet = zDataUpdate.getHanViet();
    txtHan = txtHanViet[0];
    txtViet = txtHanViet[1];
    zButtonUpdateAdd.textContent = 'Add';
    zButtonUpdateDelete.disabled = true;
    zCheckName.checked = false;
  }

  zInputUpdateTrung.value = txtTrung;
  zInputUpdateHan.value = txtHan;
  zInputUpdateViet.value = txtViet;

  zModalTextTrung = txtTrung;
  zModalTextViet = txtViet;
}

function checkName() {
  switch (zDataType) {
    case DATA_TYPE_NAMES:
      zButtonUpdateAdd.textContent = zCheckName.checked ? 'Update Name' : 'Update';
      break;
    case DATA_TYPE_WORDS:
      zButtonUpdateAdd.textContent = zCheckName.checked ? 'Update Name' : 'Update';
      break;
    case DATA_TYPE_DICTS:
      zButtonUpdateAdd.textContent = zCheckName.checked ? 'Add Name' : 'Add';
      break;
    default:
      zButtonUpdateAdd.textContent = zCheckName.checked ? 'Add Name' : 'Add';
      break;
  }
  zInputUpdateViet.value = zCheckName.checked ? zInputUpdateViet.value.toTitleCase() : zModalTextViet;
}

function translate() {
  console.clear();

  if (zNavTrung.value == '') {
    zNavHan.value = '';
    zNavViet.value = '';
    return;
  }

  zDataNamesLocal.length = 0;
  zDataWordsLocal.length = 0;
  zDataDictsLocal.length = 0;
  zDataMeans.length = 0;

  zDataSearch.length = 0;
  zZeroTable.innerHTML = '';

  zNavHighlightTrung = '';
  zNavHighlightHan.value = '';
  zNavHighlightViet.value = '';
  zButtonUpdate.disabled = true;
  zButtonInfo.disabled = true;

  var txtTrung = zNavTrung.value;
  var txtHan = txtTrung;
  var txtViet = txtTrung;

  // Search string in global data.csv & make new local data for this text
  zDataSearch.pushData(txtTrung, zDataNames, DATA_TYPE_NAMES, zDataNamesLocal);
  zDataSearch.pushData(txtTrung, zDataWords, DATA_TYPE_WORDS, zDataWordsLocal);
  zDataSearch.pushData(txtTrung, zDataDicts, DATA_TYPE_DICTS, zDataDictsLocal);

  // Sort & then clean duplicate words
  zDataSearch.cleanDuplicate();

  // Update 'HAN' word into searched data
  zDataSearch.updateDicts(zDataDicts);

  // Add other chars not in any original data.csv & sort again
  zDataSearch.pushOtherChars(txtTrung, DATA_TYPE_OTHERS);
  zDataSearch.keySort({ T_INDEX: 'asc' }); // sort again

  console.log('Final data:');
  console.log(zDataSearch);

  // Make new local meaning dictionary (Vietphrase, Lac Viet, Thieu Chuu) for this text
  zDataMeans.pushDataMeans(txtTrung, zDataNamesLocal, DATA_MEANS_TYPE_VIETPHRASE_NAMES);
  zDataMeans.pushDataMeans(txtTrung, zDataWordsLocal, DATA_MEANS_TYPE_VIETPHRASE_WORDS);
  zDataMeans.pushDataMeans(txtTrung, zDataMeansLacViet, DATA_MEANS_TYPE_LACVIET);
  zDataMeans.pushDataMeans(txtTrung, zDataMeansThieuChuu, DATA_MEANS_TYPE_THIEUCHUU);

  zDataMeans.cleanDuplicateObject();
  zDataMeans.keySort({ TYPE: 'asc', LEN: 'desc', TRUNG: 'asc' });

  console.log('Info data:');
  console.log(zDataMeans);

  //zDataMeans.buildTable(zZeroTable);

  var txtHanViet = zDataSearch.getHanViet();
  txtHan = txtHanViet[0];
  txtViet = txtHanViet[1];

  zNavHan.value = txtHan.toSentenceCase();
  zNavViet.value = txtViet.toSentenceCase();

  //zDataSearch.buildTable(zZeroTable);
}

function getSpacing(curr_string, next_string) {
  var spacing = '';
  switch (curr_string.charAt(curr_string.length - 1)) {
    case '': spacing = ''; break;
    case ' ': spacing = ''; break;
    case '“': spacing = ''; break;
    case '‘': spacing = ''; break;
    case '{': spacing = ''; break;
    case '[': spacing = ''; break;
    case '(': spacing = ''; break;
    case '<': spacing = ''; break;
    case '\n': spacing = ''; break;
    case '\r': spacing = ''; break;
    case '\t': spacing = ''; break;
    default: spacing = ' '; break;
  }

  if (spacing == ' ' && next_string != '') {
    switch (next_string.charAt(0)) {
      case ' ': spacing = ''; break;
      case ',': spacing = ''; break;
      case ';': spacing = ''; break;
      case ':': spacing = ''; break;
      case '.': spacing = ''; break;
      case '?': spacing = ''; break;
      case '!': spacing = ''; break;
      case '”': spacing = ''; break;
      case '’': spacing = ''; break;
      case '}': spacing = ''; break;
      case ']': spacing = ''; break;
      case ')': spacing = ''; break;
      case '>': spacing = ''; break;
      case '^': spacing = ''; break;
      case '\n': spacing = ''; break;
      case '\r': spacing = ''; break;
      case '\t': spacing = ''; break;
      default: spacing = ' '; break;
    }
  }
  return spacing;
}

// Array: [{TYPE, ID, T_INDEX, V_INDEX, TRUNG, HAN, VIET}]
Array.prototype.getHanViet = function () {
  var txtViet = '';
  var txtHan = '';

  var replaceIndex = 0;
  for (var i = 0; i < this.length; i++) {
    var currString = this[i].VIET.split('/')[0];
    var nextString = i + 1 < this.length ? this[i + 1].VIET.split('/')[0] : '';

    var spacing = getSpacing(currString, nextString);
    currString += spacing;

    txtViet += currString;

    this[i].V_INDEX = replaceIndex;
    replaceIndex += currString.length;
  }

  for (var i = 0; i < this.length; i++) {
    var currString = this[i].HAN;
    var nextString = i + 1 < this.length ? this[i + 1].HAN : '';

    var spacing = getSpacing(currString, nextString);
    currString += spacing;

    txtHan += currString;
  }

  return [txtHan, txtViet];
};

// Array: [{TYPE, ID, LEN, TRUNG, VIET}]
Array.prototype.pushDataMeans = function (text, data_csv, type) {
  for (var i = 0; i < data_csv.length; i++) {
    var strSearch = data_csv[i][0];
    var index = 0;
    while (index < text.length && index != -1) {
      index = text.indexOf(strSearch, index);
      if (index != -1) {
        this.push({ TYPE: type, ID: i, LEN: strSearch.length, TRUNG: strSearch, VIET: data_csv[i][1] });
        index++;
      }
    }
  }
};

// Array: [{TYPE, ID, T_INDEX, V_INDEX, TRUNG, HAN, VIET}]
Array.prototype.pushData = function (text, data_csv, type, data_csv_local = null) {
  for (var i = 0; i < data_csv.length; i++) {
    var strSearch = data_csv[i][0];
    var index = 0;
    while (index < text.length && index != -1) {
      index = text.indexOf(strSearch, index);
      if (index != -1) {
        if (data_csv_local != null) {
          data_csv_local.push([strSearch, data_csv[i][1]]);
        }
        this.push({ TYPE: type, ID: i, T_INDEX: index, V_INDEX: -1, TRUNG: strSearch, HAN: '', VIET: data_csv[i][1] });
        index++;
      }
    }
  }
  if (data_csv_local != null) {
    data_csv_local.cleanDuplicateArray(0); // Clean the same values at index 0 (china), then keep only 1 value
  }
};

// Array: [{TYPE, ID, T_INDEX, V_INDEX, TRUNG, HAN, VIET}]
Array.prototype.pushOtherChars = function (text_data, type) {
  var text = this.splitText(text_data);

  for (var i = 0; i < text.length; i++) {
    this.push({ TYPE: type, ID: -1, T_INDEX: text[i].INDEX, V_INDEX: -1, TRUNG: text[i].TEXT, HAN: text[i].TEXT, VIET: text[i].TEXT });
  }
};

// Array: [{TYPE, ID, T_INDEX, V_INDEX, TRUNG, HAN, VIET}]
Array.prototype.splitText = function (text_data) {
  var results = new Array();
  var text = text_data;
  var index = 0;

  for (var i = 0; i < this.length; i++) {
    var pos = text.search(this[i].TRUNG);
    if (pos != -1) {
      var prevText = text.slice(0, pos);
      text = text.slice(pos + this[i].TRUNG.length, text.length);

      if (prevText != '') {
        var dataPrevText = prevText.splitTextInLine();
        for (var j = 0; j < dataPrevText.length; j++) {
          results.push({ TEXT: dataPrevText[j], INDEX: index });
        }
      }

      index += pos + this[i].TRUNG.length;
    }
  }

  if (text != '') {
    results.push({ TEXT: text, INDEX: index });
  }

  if (results.length == 0) {
    return -1;
  }

  return results;
};

// All Arrays, clean data have the same value at (index)
Array.prototype.cleanDuplicateArray = function (index) {
  if (this.length == 0) {
    return -1;
  }

  var i = 0;
  while (i < this.length) {
    var j = i + 1;
    var count = 0;
    while (j < this.length) {
      if (this[j][index] == this[i][index]) {
        count++;
      }
      j++;

    }
    if (count > 0) {
      this.splice(i, count);
    }
    i++;
  }
}

// All objects, clean data have the same value at (key)
Array.prototype.cleanDuplicateObject = function () {
  if (this.length == 0) {
    return -1;
  }

  this.keySort({ TYPE: 'asc', ID: 'asc' });

  var i = 0;
  while (i < this.length) {
    var j = i + 1;
    var count = 0;
    while (j < this.length) {
      if (this[j].ID == this[i].ID && this[j].TYPE == this[i].TYPE) {
        count++;
        j++;
      } else {
        break;
      }

    }
    if (count > 0) {
      this.splice(i, count);
    }
    i++;
  }
}

// Array: [{TYPE, ID, T_INDEX, V_INDEX, TRUNG, HAN, VIET}], sort array first, then clean duplicate
Array.prototype.cleanDuplicate = function () {
  if (this.length == 0) {
    return -1;
  }

  this.keySort({ T_INDEX: 'asc' });

  var i = 0;
  while (i < this.length) {
    var nextIndex = this[i].T_INDEX + this[i].TRUNG.length;
    var flag = 0;
    var j = i + 1;
    var start = j;
    var count = 0;
    while (j < this.length && this[j].T_INDEX < nextIndex) {
      if (this[j].TYPE >= this[i].TYPE && this[j].TRUNG.length <= this[i].TRUNG.length) {
        count++;
        flag = 1;
        j++;
      } else {
        flag = 2;
        break;
      }
    }
    if (flag == 1) {
      this.splice(start, count);
      i++;
    } else if (flag == 2) {
      this.splice(i, 1);
    } else {
      i++;
    }
  }
};

// Array: [{TYPE, ID, T_INDEX, V_INDEX, TRUNG, HAN, VIET}]
Array.prototype.updateDicts = function (data_dicts) {
  if (this.length == 0) {
    return -1;
  }

  for (var i = 0; i < this.length; i++) {
    if (this[i].ID != -1) {
      var words = this[i].TRUNG.split('');
      for (var j = 0; j < words.length; j++) {
        var spacing = j < words.length - 1 ? ' ' : '';
        for (var k = 0; k < data_dicts.length - 1; k++) {
          if (words[j] == data_dicts[k][0]) {
            this[i].HAN += data_dicts[k][1] + spacing;
            break;
          }
        }
      }
    }
  }

};

// All object arrays
Array.prototype.keySort = function (keys) {
  if (this.length == 0) {
    return -1;
  }

  keys = keys || {};

  // via
  // https://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
  var obLen = function (obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key))
        size++;
    }
    return size;
  };

  // avoiding using Object.keys because I guess did it have IE8 issues?
  // else var obIx = function(obj, ix){ return Object.keys(obj)[ix]; } or
  // whatever
  var obIx = function (obj, ix) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (size == ix)
          return key;
        size++;
      }
    }
    return false;
  };

  var keySort = function (a, b, d) {
    d = d !== null ? d : 1;
    // a = a.toLowerCase(); // this breaks numbers
    // b = b.toLowerCase();
    if (a == b)
      return 0;
    return a > b ? 1 * d : -1 * d;
  };

  var KL = obLen(keys);

  if (!KL)
    return this.sort(keySort);

  for (var k in keys) {
    // asc unless desc or skip
    keys[k] =
      keys[k] == 'desc' || keys[k] == -1 ? -1
        : (keys[k] == 'skip' || keys[k] === 0 ? 0
          : 1);
  }

  this.sort(function (a, b) {
    var sorted = 0, ix = 0;

    while (sorted === 0 && ix < KL) {
      var k = obIx(keys, ix);
      if (k) {
        var dir = keys[k];
        sorted = keySort(a[k], b[k], dir);
        ix++;
      }
    }
    return sorted;
  });
  return this;
};

// All object arrays
Array.prototype.buildTable = function (container) {
  if (this.length == 0 || container == null) {
    return '';
  }

  let labels = Object.keys(this[0]);

  var table = document.createElement('table');
  var thead = document.createElement('thead');
  var tbody = document.createElement('tbody');

  table.setAttribute('class', 'table table-striped');

  var theadTr = document.createElement('tr');
  for (var i = 0; i < labels.length; i++) {
    var theadTh = document.createElement('th');
    theadTh.innerHTML = labels[i];
    theadTr.appendChild(theadTh);
  }
  thead.appendChild(theadTr);
  table.appendChild(thead);

  for (j = 0; j < this.length; j++) {
    var tbodyTr = document.createElement('tr');
    for (k = 0; k < labels.length; k++) {
      var tbodyTd = document.createElement('td');
      tbodyTd.innerHTML = this[j][labels[k].toUpperCase()];
      tbodyTr.appendChild(tbodyTd);
    }
    tbody.appendChild(tbodyTr);
  }
  table.appendChild(tbody);

  container.appendChild(table);
};

// Upper case the first letter of each word (\p{L} + /gu = match all unicode) (Title Case = Cycle Case)
String.prototype.toTitleCase = function () {
  return this.toLowerCase().replace(/(^|[\s.?!:“”‘’"'{}[\]()<>\/])(\p{L})/gu, (match) => match.toUpperCase());
};

// Upper case the first letter of each sentence (\p{L} + /gu = match all unicode)
String.prototype.toSentenceCase = function () {
  return this.replace(/(^|[\n.?!:][ “”‘’"'{}[\]()<>]*)(\p{L})/gu, (match) => match.toUpperCase());
};

String.prototype.findHighlightedText = function () {
  if (this == '') {
    return '';
  }

  var regexStart = /[^\r^\n^\t^ ]/;
  var regexEnd = /[\r\n\t]/;

  var matchStart = regexStart.exec(this);
  var matchEnd;

  var text = '';

  if (matchStart != null) {
    text = this.slice(matchStart.index, this.length);
    matchEnd = regexEnd.exec(text);

    if (matchEnd != null) {
      text = text.slice(0, matchEnd.index);
    }
  }

  return text;
};

String.prototype.splitTextInLine = function () {
  if (this == '') {
    return '';
  }

  var regexStart = /[^\r^\n^\t^ ]/;
  var regexEnd = /[\r\n\t]/;

  var text = this;
  var dataText = new Array();

  var matchStart = regexStart.exec(text);
  var matchEnd;

  while (matchStart != null) {
    var temp = text.slice(0, matchStart.index);
    if (temp != '') {
      dataText.push(temp);
    }
    text = text.slice(matchStart.index, text.length);
    matchEnd = regexEnd.exec(text);

    if (matchEnd != null) {
      dataText.push(text.slice(0, matchEnd.index));
      text = text.slice(matchEnd.index, text.length);
    } else {
      break;
    }

    matchStart = regexStart.exec(text);
  }

  if (text != '') {
    dataText.push(text);
  }

  return dataText;
};

//zNavViet.onmouseup = zNavViet.onkeyup = zNavViet.onselectionchange = function () {
zNavViet.onselectionchange = function () {
  zNavHighlightTrung = '';
  zNavHighlightHan.value = '';
  zNavHighlightViet.value = '';
  zButtonUpdate.disabled = true;
  zButtonInfo.disabled = true;

  var textStart = zNavViet.selectionStart;
  var textEnd = zNavViet.selectionEnd;

  //if (textStart == textEnd) return;

  console.log('call event!');

  var dataStart = -1;
  var dataEnd = 0;

  var txtTrung = '';
  var txtHan = '';
  var txtViet = '';

  var flag = 0;
  var tempEnd = textStart;

  for (var i = 0; i < zDataSearch.length; i++) {
    var index = zDataSearch[i].V_INDEX;
    var len = zDataSearch[i].VIET.split('/')[0].length;
    if (flag != 1 && textStart >= index && textStart < index + len) {
      textStart = index;
      tempEnd = index + len;
      dataStart = i;
      dataEnd = i;
      flag = 1;
    }
    if (tempEnd > textEnd) {
      break;
    }
    if (textEnd > index) {
      tempEnd = index + len;
      dataEnd = i;
    }
  }

  textEnd = tempEnd;

  if (dataStart != -1) {
    for (var i = dataStart; i <= dataEnd; i++) {
      var currString = zDataSearch[i].HAN;
      var nextString = i + 1 < zDataSearch.length ? zDataSearch[i + 1].HAN : '';

      var spacing = getSpacing(currString, nextString);
      currString += spacing;

      txtHan += currString;
      txtTrung += zDataSearch[i].TRUNG;
    }
  }

  txtViet = zNavViet.value.slice(textStart, textEnd);

  var regex = /\p{L}/gu; // match all unicode
  var match = regex.exec(txtViet);

  if (match != null) {
    zNavHighlightTrung = txtTrung.findHighlightedText();
    zNavHighlightHan.value = txtHan.findHighlightedText();
    zNavHighlightViet.value = txtViet.findHighlightedText();
    zButtonUpdate.disabled = false;
    zButtonInfo.disabled = false;
  }
};

//zInputUpdateTrung.onmouseup = zInputUpdateTrung.onkeyup = zInputUpdateTrung.onselectionchange = function () {
zInputUpdateTrung.onmouseup = zInputUpdateTrung.onkeyup = zInputUpdateTrung.onselectionchange = function () {
  update(zInputUpdateTrung.value);
};

zInputUpdateViet.onselectionchange = function () {
  if (!zCheckName.checked) zModalTextViet = zInputUpdateViet.value;
};

const btn_translate = document.getElementById("btn-translate");
btn_translate.addEventListener("click", translate);

const check_name = document.getElementById("check-name");
check_name.addEventListener("click", checkName);
