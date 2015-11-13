(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    return window.open('help.html');
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendReponse) {
  if (request.url) {
    return chrome.tabs.create({
      url: request.url
    });
  }
});

chrome.contextMenus.create({
  title: "Read selected text",
  contexts: ["selection"],
  onclick: function(info, tab) {
    return chrome.tabs.sendMessage(tab.id, {
      command: 'parse.selection'
    });
  }
});

chrome.contextMenus.create({
  title: "Read selected text and start",
  contexts: ["selection"],
  onclick: function(info, tab) {
    return chrome.tabs.sendMessage(tab.id, {
      command: 'parse.selection.start'
    });
  }
});



},{}]},{},[1]);