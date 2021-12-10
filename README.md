# form.js

[![Test workflow](https://img.shields.io/github/workflow/status/rancoud/form.js/tests?label=tests&logo=github)](https://github.com/rancoud/form.js/actions?workflow=tests)
[![Codecov](https://img.shields.io/codecov/c/github/rancoud/form.js?logo=codecov)](https://codecov.io/gh/rancoud/form.js)

JS Form Manager take care of your forms by validating inputs, use feedbacks and add accessibility.  

## Installation
You need to download the js file from `dist` folder, then you can include it in your HTML at the end of your body.
```html
<script src="/form.min.js"></script>
```
Then it automatically scan all `form` tag and addEventListener on them.

## How to use it?
### Form already done
For example you have a form for login.
```html
<form method="post">
    <div>
        <label for="username">Username</label>
        <input type="text" id="username" data-form-rules="required" data-form-error-required="username is required"/>
    </div>
    <div>
        <label for="password">Password</label>
        <input type="password" id="password" data-form-rules="required" data-form-error-required="password is required"/>
    </div>
    <input type="submit" value="Log in">
</form>
```
As you can see, no need of javascript if your form is already in your HTML DOM.

### Form appended later
But if your form is appended later
```html
<form id="my-form"></form>
```
You can use
```js
new Form(document.getElementById('my-form'));
```

### Explanations
When submitting a form or updating an input the Form Manager will check all `data-form-rules`.  
If a rule failed, it will:
1. block the form's submit
2. add class `form__input--error` to the failed input
3. add label with the error message associated to the failed rule
4. also add `aria-labelledby` with label and label error
5. update the attribute `aria-invalid`
6. if there is a `form__feedback` next to input it will be updated with `form__feedback--error`

## Rules available
* `aria_invalid`: check the aria-invalid attribute is set to false
* `callback:functionName`: use function given, you can also set arguments
* `checked`: verify if the checkbox / radio is checked
* `email`: check if the input is a valid email (the test is to check if there is an @ inside)
* `equal_field:elem_id`: check if the other input (by giving the id) has equal value
* `max:x`: check if the length of the value is x length maximal (not include)
* `min:x`: check if the length of the value is x length minimal (not include)
* `regex:regex`: use regex to validate the input
* `required`: check if the input has value

### Rules errors messages
For each rules you can define a specific error message using this pattern `data-form-error-RULE`

### Rules combined
You can combined rules, they will be check in order from left to right.  
For example you can have:
* required
* max 12 length
* use regex `^[a-z]*`
* checkValidate(input, callback)

```html
<input type="text" data-form-rules="required|max:12|regex:^[a-z]*$|callback:checkValidate"
    data-form-error-required="this field is required"
    data-form-error-max="max length is 12"
    data-form-error-regex="you can only use lower case letters"
    data-form-error-callback="this is already used"
/>
```

## Feedbacks
You can add this html next to your input
```html
<input type="text" id="username" data-form-rules="required" data-form-error-required="username is required"/>
<span class="form__feedback"></span>
```
According to the rules, it will add the corresponding class `form__feedback--error`, `form__feedback--success`, `form__feedback--loading` to the sibling `form__feedback`.

## Popin
Sometimes form need a popin

## CSS classes used
* `form__input--error`
* `form__input--success`
* `form__container--error`
* `form__container--success`
* `form__feedback--error`
* `form__feedback--success`
* `form__feedback--loading`
* `form__fieldset--error`
* `form__fieldset--success`
* `form__label`
* `form__label--error`
* `form__fake-file-label`

## FormHelper functions
`elemID` is the id of the input you can select with `document.getElementById()`
* setFieldNeutral(elemID: string)
* setFieldValid(elemID: string)
* setFieldInvalid(elemID: string, errorMessage: string)
* setFieldLoading(elemID: string)
* removeGeneralError(elemID: string)
* setGeneralError(elemID: string, title: string, listErrors: array)
* tryFieldIsInvalid(elemID: string, rulesText: string, callback: function)

## Data Form Attributes
### Form
* `data-form-speak-error="error message for screen reader"`
* `data-form-confirm-callback`
* `data-form-general-error="Form is incorrect"`
* `data-form-confirm-question="question?"`
* `data-form-confirm-yes="yes"`
* `data-form-confirm-no="no"`
### Div
* `data-form-has-container`
### Input
* `data-form-rules="rule1|rule2"`
* `data-form-error-aria_invalid="error message"`
* `data-form-error-callback="error message"`
* `data-form-error-checked="error message"`
* `data-form-error-email="error message"`
* `data-form-error-equal_field="error message"`
* `data-form-error-max="error message"`
* `data-form-error-min="error message"`
* `data-form-error-regex="error message"`
* `data-form-error-required="error message"`

## Demo
You can check the [demo](./demo/index.html) for all possibilites in action.

## How to Dev
`npm test` for test and coverage