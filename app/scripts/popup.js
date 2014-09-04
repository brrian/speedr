(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var getCurrentTab, sendMessage;

getCurrentTab = new Promise(function(resolve, reject) {
  return chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    return resolve(tabs[0]);
  });
});

sendMessage = function(command, callback) {
  return getCurrentTab.then(function(tab) {
    return chrome.tabs.sendMessage(tab.id, {
      command: command
    }, callback);
  });
};

sendMessage("request.selection", function(selection) {
  if (selection) {
    window.selection = selection;
    document.getElementById("js-read-selection").className = "";
    return document.getElementById("js-read-selection-subtext").textContent = selection;
  }
});

document.getElementById("js-read-selection").onclick = function() {
  if (selection.length) {
    sendMessage("parse.selection");
    return window.close();
  }
};



},{}]},{},[1]);