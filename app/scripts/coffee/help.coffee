'use strict'

$ = jQuery

subscribeForm = $('#mc-embedded-subscribe-form')
subscribeFormAction = subscribeForm.attr 'action'
subscribeFormStatus = subscribeForm.find('.subscribe__status').first()
subscribeFormSubmit = subscribeForm.find 'input[type=submit]'

subscribeForm.on 'submit', (event) ->
	# Reset the status
	subscribeFormStatus.removeClass('error success').text('')

	# Disable the submit
	subscribeFormSubmit.attr 'disabled', true

	formData = subscribeForm.serialize()

	$.post subscribeFormAction, formData, (data) ->
		# Clean the JSON response
		data.msg = data.msg.replace /^\d\s-/, ''

		subscribeFormStatus.addClass data.result
		subscribeFormStatus.html data.msg
		console.log data

		subscribeFormSubmit.removeAttr 'disabled'

	event.preventDefault()

# subscribeForm.addEventListener 'submit', (event) ->
# 	email = subscribeForm.querySelector('input[name=EMAIL]').value

# 	xmlhttp.open 'POST', subscribeFormAction, true
# 	xmlhttp.setRequestHeader 'Content-type', 'application/x-www-form-urlencoded'
# 	xmlhttp.send 'EMAIL=' + email

# 	xmlhttp.onreadystatechange = ->
# 		if xmlhttp.readyState is 4 and xmlhttp.status is 200
# 			response = JSON.parse xmlhttp.responseText

# 			console.log subscribeFormStatus.innerHTML = response.msg

			
# 			console.log xmlhttp.responseText

# 	event.preventDefault()