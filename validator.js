 
export default function Validator(options) {

    // function return parent element to show validate effect
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var selectorRules = {}
    // function to show validate result
    function validate (inputElement, rule) {
        var parentElement = getParent(inputElement, options.formGroup)
        var errorElement = parentElement.querySelector(options.errorElement)
        var errorMessage

        // get all rule test of element
        var rules = selectorRules[rule.selector]

        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) break
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage
            parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = ""
            parentElement.classList.remove('invalid')
        }

        return !errorMessage
    }

    // get form element
    var formElement = document.querySelector(options.form);


    if (formElement) {
        // submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // loop through all rule and validate
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false
                }
            })

            if (isFormValid) {
                // submit with JS
                if (typeof options.onSubmit === 'function') {
                    var enableInput = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInput).reduce(function (values, input){
                        values[input.name] = input.value
                        return values
                    },{})
                }
                options.onSubmit(formValues)
            }
        }

        options.rules.forEach(function(rule){

            var inputElement = formElement.querySelector(rule.selector)
            var errorElement = inputElement.parentElement.querySelector(options.errorElement)
    
            // save all rule into obj
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }


            // handle blur event
            inputElement.onblur = function() {
                validate(inputElement, rule)
            }

            // remove invalid when select element
            inputElement.onfocus = function() {
                errorElement.innerText = ""
                inputElement.parentElement.classList.remove('invalid')                }
        })
        
    }
}

Validator.isRequired = function(selector) {
    return{
        selector: selector,
        test: function(value) {
            return value ? undefined : "Vui lòng nhập trường này"
        }
    }
}

Validator.isEmail = function (selector) {
    return{
        selector: selector,
        test: function (value) {
            var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return emailRegex.text(value) ? undefined : 'Thông tin email không chính xác'
        }
    }
}


