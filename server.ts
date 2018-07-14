// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { renderModuleFactory } from '@angular/platform-server';
import { readFileSync } from 'fs';
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

var request = require("request");
var https = require('https');

app.engine('html', (_, options, callback) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    // Our index.html
    document: template,
    url: options.req.url,
    // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  }).then(html => {
    callback(null, html);
  });
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.get('/user/getlist', function (req, res) {
  req = https.get("https://reqres.in/api/users", function (response) {
    console.log('   /user/getlist :- STATUS: ' + response.statusCode);
    response.on('data', function (d) {
      res.send(d);
    }
    );
  });
});

app.post('/authentication', (req, res) => {
  console.log("Authentication");
  request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://139.59.6.52:8080/SpringMvcJdbcTemplate/profile/login",
    "body": req
  }, (error, response, body) => {
    if (error) {
      console.log(error);
      return res.send(error);
    }
    if (response) {
      console.log('   /authenticationt :- STATUS: ' + response.statusCode);
      res.send(body);
    }
  });
});

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});