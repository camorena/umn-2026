// Updated contact form implementation with EmailJS v3
jQuery(document).ready(function ($) {
  // Check if emailjs is defined
  if (typeof emailjs === 'undefined') {
    console.error(
      'EmailJS library is not loaded properly. Please check your internet connection or script inclusion.'
    )
  }

  $('#submit_btn').click(function (e) {
    e.preventDefault() // Prevent the default form submission

    var proceed = true

    // Simple validation at client's end
    $('#contact_form input[required], #contact_form textarea[required]').each(function () {
      $(this).css('background-color', '')
      if (!$.trim($(this).val())) {
        // If this field is empty
        $(this).css('background-color', '#FFDEDE') // Change background color to #FFDEDE
        proceed = false // Set do not proceed flag
      }
      // Check invalid email
      var email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
      if ($(this).attr('type') == 'email' && !email_reg.test($.trim($(this).val()))) {
        $(this).css('background-color', '#FFDEDE') // Change background color to #FFDEDE
        proceed = false // Set do not proceed flag
      }
    })

    if (proceed) {
      // Everything looks good! proceed...
      // Show loading message
      $('#contact_results')
        .hide()
        .html('<div class="alert alert-info">Sending your message...</div>')
        .slideDown()

      // Check if emailjs exists
      if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not defined. The EmailJS script may not be loading correctly.')
        $('#contact_results')
          .hide()
          .html(
            '<div class="alert alert-danger">There was an error sending your message. Please try again later or contact us directly.</div>'
          )
          .slideDown()
        return
      }

      // Get input field values data to be sent to server
      var templateParams = {
        from_name: $('input[name=name]').val(),
        reply_to: $('input[name=email]').val(),
        location: $('#branches option:selected').val(),
        subject: $('#subjects option:selected').val(),
        message: $('textarea[name=message]').val(),
      }

      // Try-catch block to handle any potential errors
      try {
        // Send email using EmailJS v3 syntax
        emailjs.send('service_u1il4ed', 'template_f6lo1ka', templateParams).then(
          function (response) {
            console.log('SUCCESS!', response.status, response.text)
            var output =
              '<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Thank you for your message!</strong> We will contact you soon.</div>'

            // Add a button to send another message
            output +=
              '<div class="text-center" style="margin-top:15px;"><button id="send_another" class="btn">Send Another Message</button></div>'

            // Reset values in all input fields
            $('#contact_form input[required], #contact_form textarea[required]').val('')
            $('#contact_form').slideUp() // Hide the form
            $('#contact_results').hide().html(output).slideDown()

            // Attach click handler to the new button
            $(document).on('click', '#send_another', function () {
              $('#contact_results').slideUp()
              $('#contact_form').slideDown()
            })

            // Optional: automatically show the form again after 8 seconds
            /*
                            setTimeout(function() {
                                if ($("#contact_form").is(":hidden")) {
                                    $("#contact_results").slideUp();
                                    $("#contact_form").slideDown();
                                }
                            }, 8000);
                            */
          },
          function (error) {
            console.log('FAILED...', error)
            var output =
              '<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong> Something went wrong. Please try again later.</div>'
            $('#contact_results').hide().html(output).slideDown()
          }
        )
      } catch (e) {
        console.error('Error when trying to send email:', e)
        var output =
          '<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong> Something went wrong. Please try again later.</div>'
        $('#contact_results').hide().html(output).slideDown()
      }
    }
  })

  // Reset previously set border colors and hide all messages on .keyup()
  $('#contact_form input[required], #contact_form textarea[required]').keyup(function () {
    $(this).css('background-color', '')
    $('#contact_results').slideUp()
  })
})
