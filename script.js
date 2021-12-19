import Validator from './validator.js'

// validator form
Validator({
    form: '.login-form',
    errorElement: '.form-message',
    formGroup: '.form-group',
    rules:[
        Validator.isRequired('#userName'),
        Validator.isRequired('#password'),
    ],
    onSubmit: function (data) {
        login (data)
    }
})

function login (data) {
    
    var url = "https://script.google.com/macros/s/AKfycbxt6XPwQ1zahaa6D95ZuJ1wuDkdxXs80zbzBRNwRxUvrVTJfu6fMujwO6fmEPLF1g4u0g/exec"

    var postBody = {
        postType: 'login',
        value: data
    }

    console.log (postBody)
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(postBody),      
        headers: {
            "Content-Type": "text/plain"
        }
    })
    .then (response => response.json())
    .then (result => console.log (result.type))
    .catch (error => {
        console.error ('Error', error)
    })
}