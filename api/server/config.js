var config = {};

config.web = {};
config.path = {};
config.data = {};
config.file = {};
config.content = {};

config.web.port = 8000;
config.web.host = '127.0.0.1';
config.web.root_path = '/';
config.web.api_path = '/api/';

config.path.root = './';
config.path.server = './server/';
config.path.api_server = './api/server/';
config.path.api_client = './api/client/';
config.path.data = './data/';

config.file.index = 'index.html';
config.file.favicon = 'favicon.ico';
config.file.zero_style = 'zero-style.css';
config.file.zero_translator = 'zero-translator.js';

config.file.bootstrapcss = 'bootstrap.min.css';
config.file.bootstrapjs = 'bootstrap.min.js';
config.file.bootstrapjs = 'bootstrap.min.js';
config.file.jquery = 'jquery-3.6.0.min.js';
config.file.papaparse = 'papaparse.min.js';

config.file.zh_dicts = 'zh_dicts.csv';
config.file.zh_names = 'zh_names.csv';
config.file.zh_words = 'zh_words.csv';
config.file.zh_means_lacviet = 'zh_means_lacviet.csv';
config.file.zh_means_thieuchuu = 'zh_means_thieuchuu.csv';

config.content.html = 'text/html; charset=utf-8';
config.content.ico = 'image/x-icon';
config.content.css = 'text/css; charset=utf-8';
config.content.js = 'text/javascript; charset=utf-8';
config.content.csv = 'text/csv; charset=utf-8';

module.exports = config;
