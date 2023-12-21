const fs = require('fs');

module.exports.toChineseNumber = function (number, alt = false) {
   if (!Number.isInteger(number) && number < 0) {
      throw Error('请输入自然数');
   }

   const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
   const positions = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿'];
   const charArray = String(number).split('');
   let result = '';
   let prevIsZero = false;

   //处理0  deal zero
   for (let i = 0; i < charArray.length; i++) {
      const ch = charArray[i];
      if (ch !== '0' && !prevIsZero) {
         result += digits[parseInt(ch)] + positions[charArray.length - i - 1];
      } else if (ch === '0') {
         prevIsZero = true;
      } else if (ch !== '0' && prevIsZero) {
         result += '零' + digits[parseInt(ch)] + positions[charArray.length - i - 1];
      }
   }
   //处理十 deal ten
   if (number < 100) {
      result = result.replace('一十', '十');
   } else if (number > 1000 && number % 1000 < 100) {
      result = result.replace('十零', '十');
   }

   if (alt) {
      result = result.replace('二百', '两百');
      result = result.replace('二千', '两千');
   }

   return result;
};

module.exports.generateChineseNumber = function (start, end, rule = '') {
   // rule 0: first chinese string
   // rule 1: last chinese string
   // rule 2: first other language string
   // rule 2: last other language string
   var data = new Array();
   var number = start;
   while (number <= end) {
      var word = this.toChineseNumber(number, false);
      if (rule == '') {
         data.push([word, number]);
      } else {
         data.push([rule[0] + word + rule[1], rule[2] + ' ' + number + rule[3]]);
      }
      number++;
   }
   return data;
};

module.exports.dataToCSV = function (data, filename) {
   var writeData = '';

   for (var i = 0; i < data.length; i++) {
      writeData += `${data[i].join('|')}\n`;
   }

   fs.writeFileSync(filename, writeData);
};