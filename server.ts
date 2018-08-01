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
import { PostRequest, Context, Data, Pagination } from './src/app/shared/models/request';
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

var request = require("request");
var https = require('https');
var limitVal = 10;

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

app.use(express.json());
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
app.post('/api/getFavBoards', (req, res) => {
  console.log("Get fav boards");
  request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://139.59.6.52:8080/SpringMvcJdbcTemplate/boards/getboardinfobyinstid",
    "body": req
  }, (error, response, body) => {
    if (error) {
      console.log(error);
      return res.send(error);
    }
    if (response) {
      console.log('   /api/getFavBoards :- STATUS: ' + response.statusCode);
      res.send(body);
    }
  });
});

app.post('/api/createVerbalPost', (req, res) => {
  console.log("Create Verbal Post");
  request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://139.59.6.52:8080/SpringMvcJdbcTemplate/verbal/post/create",
    "body": req
  }, (error, response, body) => {
    if (error) {
      console.log(error);
      return res.send(error);
    }
    if (response) {
      console.log('   /api/createVerbalPost :- STATUS: ' + response.statusCode);
      res.send(body);
    }
  });
});


app.post('/api/getPosts', (req, res) => {
  console.log("Get posts");

  let reqBody = { context: null, data: null, pagination: null };
  reqBody.context = { type: null };
  reqBody.data = { category: null, model: null };
  reqBody.pagination = { limit: limitVal, offset: 0 };

  if (req.body.type != undefined && req.body.type != null) {
    reqBody.context.type = req.body.type;
  }
  if (req.body.category != undefined && req.body.category != null) {
    reqBody.data.category = req.body.category;
  }
  if (req.body.model != undefined && req.body.model != null) {
    reqBody.data.model = req.body.model;
  }
  if (req.body.page != undefined && req.body.page != null) {
    reqBody.pagination.offset = req.body.page;
  }
  console.log(reqBody);

  request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://139.59.6.52:8080/SpringMvcJdbcTemplate/v2/post/get",
    "body": reqBody,
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log(error);
      return res.send(error);
    }
    if (response) {
      console.log('   /api/getPosts :- STATUS: ' + response.statusCode);
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