(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var $, subscribeForm, subscribeFormAction, subscribeFormStatus, subscribeFormSubmit;

$ = jQuery;

subscribeForm = $('#mc-embedded-subscribe-form');

subscribeFormAction = subscribeForm.attr('action');

subscribeFormStatus = subscribeForm.find('.subscribe__status').first();

subscribeFormSubmit = subscribeForm.find('input[type=submit]');

subscribeForm.on('submit', function(event) {
  var formData;
  subscribeFormStatus.removeClass('error success').text('');
  subscribeFormSubmit.attr('disabled', true);
  formData = subscribeForm.serialize();
  $.post(subscribeFormAction, formData, function(data) {
    data.msg = data.msg.replace(/^\d\s-/, '');
    subscribeFormStatus.addClass(data.result);
    subscribeFormStatus.html(data.msg);
    console.log(data);
    return subscribeFormSubmit.removeAttr('disabled');
  });
  return event.preventDefault();
});



},{}]},{},[1]);