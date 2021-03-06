'use strict'

$ = jQuery

Utility = require './common/utility.coffee'
Defaults = require './common/defaults.coffee'

User = {}
App = {}

generateKeyCombo = Utility.generateKeyCombo

parseKeyCode = Utility.parseKeyCode

populateDefaults = ->
    populateSettings(Defaults.settings)
    populateBindings(Defaults.bindings)

populateSettings = (object) ->
    for setting, value of object
        type = typeof value

        switch type
            when 'number'
                $('input[name=' + setting + ']').val value
            when 'boolean'
                $('input[name=' + setting + ']').prop 'checked', value
            when 'string'
                $('input[name=' + setting + '][value="' + value + '"]').prop 'checked', true

populateBindings = (object) ->
    for binding, action of object
        element = $('.js-binding-' + action.replace ' ', '-')
        bindingContainer = element.find '.binding'
        keys = binding.split '+'

        # We need this for when we click 'Restore defaults'
        bindingContainer.empty()

        element.attr 'data-binding', binding

        for key in keys
            bindingContainer.removeClass 'binding-text binding-text-empty'
            $('<span class="keyboard-key">' + parseKeyCode(key) + '</span>').appendTo bindingContainer

generateKeyElements = (keyBinding) ->
    keys = keyBinding.split('+')
    keysContainer = ''

    for key in keys
        keysContainer += '<span class="keyboard-key">' + parseKeyCode(key) + '</span>'

    keysContainer

keyBindingListener = (event) ->
    unless event.keyCode is 18 or event.keyCode is 17 or event.keyCode is 16 or event.keyCode is 13 or event.keyCode is 8 or event.keyCode is 91 or event.keyCode is 93
        binding = $('.binding-text-waiting')
        bindingGroup = binding.parents '.binding-group'
        keyBinding = generateKeyCombo(event)

        bindingGroup.attr 'data-binding', keyBinding
        binding.removeClass 'binding-text binding-text-empty binding-text-waiting'

        binding.html generateKeyElements keyBinding

        removeKeyBindingListeners()
        validateBindings()    

keyDownNullifier = ->
    false

removeKeyBindingListeners = ->
    $(window).unbind 'keyup', keyBindingListener
    $(window).unbind 'keydown', keyDownNullifier

    App.setBinding = false

showDuplicateBindings = (bindingGroups) ->
    for binding, elements of bindingGroups
        if elements.length > 1
            for element in elements
                $(element).find('.form-error').text 'Duplicate binding detected!'

validateSettings = ->
    passes = true

    # Clear any existing errors
    $('.settings-section').find('.form-error').empty()

    $('input[type=text]').each ->
        value = $(@).val()
        error = $(@).siblings('.form-error')

        if value.length > 0 and /^[0-9]+$/.test(value) is false
            console.log error
            error.text('Please enter a numeric value')
            passes = false

        return

    passes

validateBindings = ->
    bindingGroups = {}
    bindings = {}
    passes = true

    # Loop through all the binding-groups and push it's binding into an object
    $('.binding-group').each ->
        binding = $(@).attr('data-binding')

        $(@).find('.form-error').empty()

        if !bindingGroups.hasOwnProperty binding
            if binding isnt undefined
                bindingGroups[binding] = [@]

                $(@).attr('class').match /js-binding-(\S+)/
                action = RegExp.$1.replace '-', ' '

                bindings[binding] = action
        else
            bindingGroups[binding].push @

            passes = false

            return

    showDuplicateBindings(bindingGroups)

    return if passes is true then bindings else false

parseBindings = ->
    bindings = validateBindings()

    if bindings isnt false then User.bindings = bindings else return false


parseSettings = ->
    if validateSettings() is true
        # Go through all the inputs
        settings = {}

        $('.settings-section').find('input').each ->
            type = $(@).attr('type')
            setting = $(@).attr('name')

            switch type
                when 'text'
                    if $(@).val() then value = parseInt $(@).val(), 10
                when 'radio'
                    if $(@).prop 'checked' then value = $(@).val()
                when 'checkbox'
                    value = $(@).prop 'checked'

            if value isnt undefined then settings[setting] = value

            return
        
        User.settings = settings
    else
        return false

$('.js-edit').click ->
    # Let the app know that we are setting a binding
    if App.setBinding is true
        removeKeyBindingListeners()
        $('.binding-text-waiting').parents('.binding-group').find('.js-clear').trigger('click')
    
    App.setBinding = true

    # Empty the binding
    bindingGroup = $(@).parents '.binding-group'
    binding = bindingGroup.find '.binding'

    binding.removeClass('binding-text-empty').addClass('binding-text binding-text-waiting').empty()

    $(window).on 'keyup', keyBindingListener
    $(window).on 'keydown', keyDownNullifier

$('.js-clear').click ->
    bindingGroup = $(@).parents '.binding-group'
    binding = bindingGroup.find '.binding'

    bindingGroup.attr 'data-binding', null
    binding.removeClass('binding-text-waiting').addClass('binding-text binding-text-empty').empty()

    validateBindings()

    $(window).unbind 'keyup', keyBindingListener

$('.js-default').click ->
    bindings = Defaults.bindings
    bindingGroup = $(@).parents '.binding-group'
    binding = bindingGroup.find '.binding'
    
    bindingGroup.attr('class').match /js-binding-(\S+)/
    action = RegExp.$1.replace '-', ' '

    # Loop through all of the bindings until we have a match
    # This isn't the best way, but the object isn't that big so I think performance will be negligble
    for keyBinding, bindingAction of bindings
        if bindingAction is action
            bindingGroup.attr 'data-binding', keyBinding
            binding.removeClass 'binding-text binding-text-empty'

            binding.html generateKeyElements keyBinding

    validateBindings()

$('#js-save-settings').click ->
    # We need to create an object to save to chrome storage
    flashMessage = $('#js-flash-message')
    submit = $(@)
    
    if parseSettings() isnt false and parseBindings() isnt false
        chrome.storage.sync.set User, ->
            flashMessage.addClass 'fade-in-out'
            flashMessage.text 'Nice! Your preferences have been saved!'
    else
        flashMessage.addClass 'fade-in-out'
        flashMessage.text 'You have some errors! Try checking your settings again.'

        submit.addClass 'shake'
        submit.one 'webkitAnimationEnd animationend', ->
            submit.removeClass 'shake'

    flashMessage.one 'webkitAnimationEnd animationend', ->
        flashMessage.removeClass('fade-in-out').empty()

$('#js-restore-defaults').click ->
    populateDefaults()
    validateSettings()
    validateBindings()

# We need to set the fontWeight programatically
$('input[name=fontFamily]').change ->
    $('#js-font-weight').attr 'value', $(@).attr 'data-font-weight'

chrome.storage.sync.get ['settings', 'bindings'], (data) ->
    if data.settings then populateSettings(data.settings)
    if data.bindings then populateBindings(data.bindings)

populateDefaults()