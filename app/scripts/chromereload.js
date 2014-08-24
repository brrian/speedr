(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*
Reload client for Chrome Apps & Extensions.
The reload client has a compatibility with livereload.
WARNING: only supports reload command.
 */
var LIVERELOAD_HOST, LIVERELOAD_PORT, connection;

LIVERELOAD_HOST = 'localhost:';

LIVERELOAD_PORT = 35729;

connection = new WebSocket('ws://' + LIVERELOAD_HOST + LIVERELOAD_PORT + '/livereload');

connection.onerror = function(e) {
  return console.log('reload connection got error' + JSON.stringify(e));
};

connection.onmessage = function(e) {
  var data;
  if (e.data) {
    data = JSON.parse(e.data);
    if (data && data.command === 'reload') {
      return chrome.runtime.reload();
    }
  }
};



},{}]},{},[1]);