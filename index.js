const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const config = require('./api/server/config');
const zero = require('./api/server/zero-functions');

/////////////////////////////////
// SERVER
const index = fs.readFileSync(
   path.resolve(__dirname, config.path.root + config.file.index),
   'utf-8'
);

const favicon = fs.readFileSync(
   path.resolve(__dirname, config.path.root + config.file.favicon)
);

const zeroStyle = fs.readFileSync(
   path.resolve(__dirname, config.path.api_client + config.file.zero_style),
   'utf-8'
);

const zeroTranslator = fs.readFileSync(
   path.resolve(__dirname, config.path.api_client + config.file.zero_translator),
   'utf-8'
);

const bootstrapcss = fs.readFileSync(
   path.resolve(__dirname, config.path.api_client + config.file.bootstrapcss),
   'utf-8'
);

const bootstrapjs = fs.readFileSync(
   path.resolve(__dirname, config.path.api_client + config.file.bootstrapjs),
   'utf-8'
);

const jquery = fs.readFileSync(
   path.resolve(__dirname, config.path.api_client + config.file.jquery),
   'utf-8'
);

const papaparse = fs.readFileSync(
   path.resolve(__dirname, config.path.api_client + config.file.papaparse),
   'utf-8'
);

const zhDicts = fs.readFileSync(
   path.resolve(__dirname, config.path.data + config.file.zh_dicts),
   'utf-8'
);

const zhWords = fs.readFileSync(
   path.resolve(__dirname, config.path.data + config.file.zh_words),
   'utf-8'
);

const zhNames = fs.readFileSync(
   path.resolve(__dirname, config.path.data + config.file.zh_names),
   'utf-8'
);

const zhMeansLacViet = fs.readFileSync(
   path.resolve(__dirname, config.path.data + config.file.zh_means_lacviet),
   'utf-8'
);

const zhMeansThieuChuu = fs.readFileSync(
   path.resolve(__dirname, config.path.data + config.file.zh_means_thieuchuu),
   'utf-8'
);

const server = http.createServer((req, res) => {
   const { query, pathname } = url.parse(req.url, true);

   // Overview page
   if (pathname === config.web.root_path) {
      res.writeHead(200, {
         'Content-type': config.content.html
      });
      //console.log(index);
      res.end(index);

      // Product page
   } else if (pathname === config.web.root_path + config.file.favicon) {
      res.writeHead(200, {
         'Content-type': config.content.ico
      });
      res.end(favicon);
   } else if (pathname === config.web.api_path + config.file.zero_style) {
      res.writeHead(200, {
         'Content-type': config.content.css
      });
      res.end(zeroStyle);
   } else if (pathname === config.web.api_path + config.file.zero_translator) {
      res.writeHead(200, {
         'Content-type': config.content.js
      });
      res.end(zeroTranslator);
   } else if (pathname === config.web.api_path + config.file.bootstrapcss) {
      res.writeHead(200, {
         'Content-type': config.content.css
      });
      res.end(bootstrapcss);
   } else if (pathname === config.web.api_path + config.file.bootstrapjs) {
      res.writeHead(200, {
         'Content-type': config.content.js
      });
      res.end(bootstrapjs);
   } else if (pathname === config.web.api_path + config.file.jquery) {
      res.writeHead(200, {
         'Content-type': config.content.js
      });
      res.end(jquery);
   } else if (pathname === config.web.api_path + config.file.papaparse) {
      res.writeHead(200, {
         'Content-type': config.content.js
      });
      res.end(papaparse);
   } else if (pathname === config.web.api_path + config.file.zh_dicts) {
      res.writeHead(200, {
         'Content-type': config.content.csv
      });
      res.end(zhDicts);
   } else if (pathname === config.web.api_path + config.file.zh_words) {
      res.writeHead(200, {
         'Content-type': config.content.csv
      });
      res.end(zhWords);
   } else if (pathname === config.web.api_path + config.file.zh_names) {
      res.writeHead(200, {
         'Content-type': config.content.csv
      });
      res.end(zhNames);
   } else if (pathname === config.web.api_path + config.file.zh_means_lacviet) {
      res.writeHead(200, {
         'Content-type': config.content.csv
      });
      res.end(zhMeansLacViet);
   } else if (pathname === config.web.api_path + config.file.zh_means_thieuchuu) {
      res.writeHead(200, {
         'Content-type': config.content.csv
      });
      res.end(zhMeansThieuChuu);
   } else {
      res.writeHead(404, {
         'Content-type': config.content.html,
         'my-own-header': 'zero-translator'
      });
      res.end('<h1>Page not found!</h1>');
   }

   //var rule = ['第', '章', 'chương', ':'];
   //zero.dataToCSV(zero.generateChineseNumber(1, 3333, rule), 'data.csv');
});

server.listen(config.web.port, config.web.host, () => {
   console.log(`Listening to requests on port ${config.web.port}`);
});
