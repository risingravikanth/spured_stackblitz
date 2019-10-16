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

// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { renderModuleFactory } from '@angular/platform-server';
import { readFileSync } from 'fs';
import * as cookieParser from 'cookie-parser';

const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

var request = require("request");
var https = require('https');
var limitVal = 10;
var limitCommentVal = 3;
var serverUrl = "http://139.59.6.52:8080/SpringMvcJdbcTemplate";

const domino = require("domino");
const fs = require("fs");
const path = require("path");
const templateA = fs
  .readFileSync(path.join("dist/browser", "index.html"))
  .toString();
const win = domino.createWindow(templateA);
global["document"] = win.document;
/*
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
});*/

app.use(express.json());
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.post('/authentication', (req, res) => {
  console.log("Authentication");
  console.log(req.body);
  request.post({
    "headers": { "content-type": "application/json" },
    "url": serverUrl + "/profile/login",
    "body": req.body,
    json: true
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

app.post('/api/getPosts', (req, res) => {
  console.log("Get posts");
  let reqBody = { context: null, data: null, pagination: null };
  reqBody.context = { section: null };
  reqBody.data = { category: null, model: null };
  reqBody.pagination = { limit: limitVal, offset: 0 };

  if (req.body.type != undefined && req.body.type != null) {
    reqBody.context.section = req.body.type;
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
    "url": serverUrl + "/v2/post/get",
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

app.post('/api/createPost', (req, res) => {
  console.log("create posts");
  let token = req.headers.authorization;
  let reqBody = { context: null, data: null };
  reqBody.context = { type: null };
  reqBody.data = {
    _type: null, category: null, model: null, text: null, topic: null,
    website: null, contacts: null, fromdate: null, todate: null, qualifications: null, deadline: null
  };

  if (req.body.type != undefined && req.body.type != null) {
    reqBody.context.type = req.body.type;
  }
  if (req.body._type != undefined && req.body._type != null) {
    reqBody.data._type = req.body._type;
  }
  if (req.body.post != undefined && req.body.post != null) {
    reqBody.data.text = req.body.post;
  }
  if (req.body.model != undefined && req.body.model != null) {
    reqBody.data.model = req.body.model;
  }
  if (req.body.category != undefined && req.body.category != null) {
    reqBody.data.category = req.body.category;
  }
  if (req.body.topic != undefined && req.body.topic != null) {
    reqBody.data.topic = req.body.topic;
  }
  if (req.body.website != undefined && req.body.website != null) {
    reqBody.data.website = req.body.website;
  }
  if (req.body.contacts != undefined && req.body.contacts != null) {
    reqBody.data.contacts = req.body.contacts;
  }
  if (req.body.fromdate != undefined && req.body.fromdate != null) {
    reqBody.data.fromdate = req.body.fromdate;
  }
  if (req.body.todate != undefined && req.body.todate != null) {
    reqBody.data.todate = req.body.todate;
  }
  if (req.body.deadline != undefined && req.body.deadline != null) {
    reqBody.data.deadline = req.body.deadline;
  }
  if (req.body.qualifications != undefined && req.body.qualifications != null) {
    reqBody.data.qualifications = req.body.qualifications;
  }
  console.log(reqBody);

  request.post({
    "headers": { "Authorization": token },
    "url": serverUrl + "/v2/post/create",
    "body": reqBody,
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log(error);
      return res.send(error);
    }
    if (response) {
      console.log('   /api/createPost :- STATUS: ' + response.statusCode);
      res.send(body);
    }
  });
});

app.post('/api/getComments', (req, res) => {
  console.log("Get posts");
  let reqBody = { context: null, data: null, pagination: null };
  reqBody.context = { type: null, postId: null };
  reqBody.data = {};
  reqBody.pagination = { limit: limitCommentVal, offset: 0 };

  if (req.body.type != undefined && req.body.type != null) {
    reqBody.context.section = req.body.type;
  }
  if (req.body.postId != undefined && req.body.postId != null) {
    reqBody.context.postId = req.body.postId;
  }
  if (req.body.page != undefined && req.body.page != null) {
    reqBody.pagination.offset = req.body.page;
  }
  console.log(reqBody);
  request.post({
    "headers": { "content-type": "application/json" },
    "url": serverUrl + "/v2/comment/get",
    "body": reqBody,
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log(error);
      return res.send(error);
    }
    if (response) {
      console.log('   /api/getComments :- STATUS: ' + response.statusCode);
      res.send(body);
    }
  });
});

app.post('/api/createComment', (req, res) => {
  console.log("Create Comment for a post");
  console.log(req);
  let token = req.headers.authorization;
  let reqBody = { context: null, data: null };
  reqBody.context = { type: null, postId: null };
  reqBody.data = { _type: null, text: null };

  if (req.body.type != undefined && req.body.type != null) {
    reqBody.context.type = req.body.type;
  }
  if (req.body.postId != undefined && req.body.postId != null) {
    reqBody.context.postId = req.body.postId;
  }
  if (req.body.post != undefined && req.body.post != null) {
    reqBody.data.text = req.body.post;
  }
  if (req.body._type != undefined && req.body._type != null) {
    reqBody.data._type = req.body._type;
  }
  request.post({
    "headers": { "Authorization": token },
    "url": serverUrl + "/v2/comment/create",
    "body": reqBody,
    json: true
  }, (error, response, body) => {
    if (error) {
      console.log(error);
      return res.send(error);
    }
    if (response) {
      console.log('   /api/createComment :- STATUS: ' + response.statusCode);
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
/*app.get('*', (req, res) => {
  res.render('index', { req });
});*/

app.get('*', (req, res) => {
  console.time(`GET: ${req.originalUrl}`);
  res.render(
    'index', {
      req: req,
      res: res,
      providers: [
        {
          provide: 'REQUEST', useValue: (req)
        },
        {
          provide: 'RESPONSE', useValue: (res)
        },
      ]
    },
    (err, html) => {
      if (!!err) throw err;
      res.send(html);
    }
  );
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});



app.use(cookieParser());
 
app.engine('html', (_, options, callback) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    document: template,
    url: options.req.url,
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP),
      {
        provide: 'REQUEST',
        useValue: options.req
      },
      {
        provide: 'RESPONSE',
        useValue: options.req.res
      }
    ]
  }).then(html => {
    callback(null, html);
  });
});
 