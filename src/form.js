(function(){
    'use strict';

    function FormHelper() {}

    // region Helpers
    function getHTMLElement(elemID) {
        if (typeof elemID !== 'string') {
            return new TypeError('Invalid argument elemID, expect string, get ' + typeof elemID);
        }

        var elemObj = document.getElementById(elemID);
        if (!elemObj) {
            return new Error('DOM element ' + elemID + ' not found');
        }

        return elemObj;
    }

    function setInputCssClass(elemObj, cssClass) {
        elemObj.classList.remove('form__input--error', 'form__input--success');
        if (cssClass.length > 0) {
            elemObj.classList.add(cssClass);
        }
    }

    function setContainerCssClass(elemObj, cssClass) {
        if (!elemObj.hasAttribute('data-form-has-container')) {
            return;
        }

        elemObj.parentNode.classList.remove('form__container--error', 'form__container--success');
        if (cssClass.length > 0) {
            elemObj.parentNode.classList.add(cssClass);
        }
    }

    function setFeedbackCssClass(elemObj, cssClass) {
        var feedbacks = findFeedbacks(elemObj);
        var idxFeedbacks = 0;
        var maxFeedbacks = feedbacks.length;
        for (; idxFeedbacks < maxFeedbacks; idxFeedbacks++) {
            feedbacks[idxFeedbacks].classList.remove('form__feedback--error', 'form__feedback--loading', 'form__feedback--success');
            if (cssClass.length > 0) {
                feedbacks[idxFeedbacks].classList.add(cssClass);
            }
        }
    }

    function setFieldsetCssClass(elemObj, cssClass) {
        var fieldsetObj = findParentFieldset(elemObj);
        if (!fieldsetObj) {
            return;
        }

        fieldsetObj.classList.remove('form__fieldset--error', 'form__fieldset--success');
        if (cssClass.length > 0) {
            fieldsetObj.classList.add(cssClass);
        }
    }

    function findFeedbacks(elemObj) {
        var maxParentBouncing = 0;
        var currentObj = elemObj;
        var feedbacks = [];

        do {
            currentObj = currentObj.parentNode;
            if (currentObj.tagName === 'BODY' || currentObj.tagName === 'FORM') {
                break;
            }

            var idxChild = 0;
            var maxChild = currentObj.children.length;
            for(; idxChild < maxChild; idxChild++) {
                if (currentObj.children[idxChild].classList.contains('form__feedback')) {
                    feedbacks.push(currentObj.children[idxChild]);
                    break;
                }
            }

            if (currentObj.tagName === 'FIELDSET') {
                break;
            }

            maxParentBouncing++;
        } while(maxParentBouncing < 10);

        return feedbacks;
    }

    function findParentFieldset(elemObj) {
        var maxParentBouncing = 0;
        var fieldsetObj = elemObj;

        do {
            fieldsetObj = fieldsetObj.parentNode;
            if (fieldsetObj.tagName === 'BODY' || fieldsetObj.tagName === 'FORM') {
                return null;
            }

            if (fieldsetObj.classList.contains('form__fieldset')) {
                return fieldsetObj;
            } else {
                maxParentBouncing++;
            }
        } while(maxParentBouncing < 10);

        return null;
    }

    function getLabelErrorID(elemObj) {
        var inputID;
        var labelID;

        if (elemObj.getAttribute('type') !== 'radio') {
            inputID = elemObj.getAttribute('id');
            labelID = inputID.replace('-input-', '-label-');
        } else {
            inputID = elemObj.getAttribute('name');
            labelID = inputID.replace('-input-', '-label-');
        }

        return labelID + '-error';
    }

    function addLabelError(elemObj, errorMessage) {
        var labelErrorID = getLabelErrorID(elemObj);
        var labelObj = document.getElementById(labelErrorID);

        if (labelObj) {
            labelObj.textContent = errorMessage;
        } else {
            var label = document.createElement('label');
            var inputID = elemObj.getAttribute('id');
            var labelID = inputID.replace('-input-', '-label-');

            label.classList.add('form__label', 'form__label--error');
            label.setAttribute('for', elemObj.getAttribute('id'));
            label.setAttribute('id', labelErrorID);
            label.appendChild(document.createTextNode(errorMessage));

            if (elemObj.getAttribute('type') !== 'radio') {
                elemObj.setAttribute('aria-labelledby', labelID + ' ' + labelErrorID);
                if (elemObj.hasAttribute('data-form-has-container')) {
                    elemObj.parentNode.insertAdjacentElement('afterend', label);
                } else {
                    elemObj.insertAdjacentElement('afterend', label);
                }
            } else {
                label.removeAttribute('for');

                var fieldsetObj = findParentFieldset(elemObj);
                /* istanbul ignore else */
                if (fieldsetObj) {
                    fieldsetObj.appendChild(label);
                }
            }
        }
    }

    function removeLabelError(elemObj) {
        var labelObj = document.getElementById(getLabelErrorID(elemObj));
        if (!labelObj) {
            return;
        }

        var labelID = labelObj.getAttribute('id').replace('-error', '');

        if (elemObj.getAttribute('type') !== 'radio') {
            elemObj.setAttribute('aria-labelledby', labelID);
        }

        labelObj.remove();
    }
    // endregion

    // region Set Field Neutral
    FormHelper.prototype.setFieldNeutral = function(elemID) {
        var elemObj = getHTMLElement(elemID);
        if (!(elemObj instanceof HTMLElement)) {
            return elemObj;
        }

        elemObj.setAttribute('aria-invalid', 'false');

        setInputCssClass(elemObj, '');
        setContainerCssClass(elemObj, '');
        setFeedbackCssClass(elemObj, '');
        setFieldsetCssClass(elemObj, '');

        removeLabelError(elemObj);
    };
    // endregion

    // region Set Field Valid
    FormHelper.prototype.setFieldValid = function(elemID) {
        var elemObj = getHTMLElement(elemID);
        if (!(elemObj instanceof HTMLElement)) {
            return elemObj;
        }

        elemObj.setAttribute('aria-invalid', 'false');

        setInputCssClass(elemObj, 'form__input--success');
        setContainerCssClass(elemObj, 'form__container--success');
        setFeedbackCssClass(elemObj, 'form__feedback--success');
        setFieldsetCssClass(elemObj, 'form__fieldset--success');

        removeLabelError(elemObj);
    };
    // endregion

    // region Set Field Invalid
    FormHelper.prototype.setFieldInvalid = function(elemID, errorMessage) {
        var elemObj = getHTMLElement(elemID);
        if (!(elemObj instanceof HTMLElement)) {
            return elemObj;
        }

        if (typeof errorMessage !== 'string') {
            return new TypeError('Invalid argument errorMessage, expect string, get ' + typeof errorMessage);
        }

        if (errorMessage.length < 1) {
            return new Error('Argument errorMessage is empty');
        }

        elemObj.setAttribute('aria-invalid', 'true');

        setInputCssClass(elemObj, 'form__input--error');
        setContainerCssClass(elemObj, 'form__container--error');
        setFeedbackCssClass(elemObj, 'form__feedback--error');
        setFieldsetCssClass(elemObj, 'form__fieldset--error');

        addLabelError(elemObj, errorMessage);
    };
    // endregion

    // region Set Field Loading
    FormHelper.prototype.setFieldLoading = function(elemID) {
        var elemObj = getHTMLElement(elemID);
        if (!(elemObj instanceof HTMLElement)) {
            return elemObj;
        }

        setInputCssClass(elemObj, '');
        setContainerCssClass(elemObj, '');
        setFeedbackCssClass(elemObj, 'form__feedback--loading');
        setFieldsetCssClass(elemObj, '');

        removeLabelError(elemObj);
    };
    // endregion

    // region Remove General Error
    FormHelper.prototype.removeGeneralError = function(elemID) {
        var elemObj = getHTMLElement(elemID);
        if (!(elemObj instanceof HTMLElement)) {
            return elemObj;
        }

        removeGeneralError(elemObj);
    };

    function removeGeneralError(elemObj) {
        var prevElem = elemObj.previousElementSibling;

        if (prevElem === null || prevElem.tagName !== 'DIV' || prevElem.getAttribute('role') !== 'alert') {
            return;
        }

        prevElem.remove();
    }
    // endregion

    // region Set General Error
    FormHelper.prototype.setGeneralError = function(elemID, title, listErrors) {
        var elemObj = getHTMLElement(elemID);
        if (!(elemObj instanceof HTMLElement)) {
            return elemObj;
        }

        if (typeof title !== 'string') {
            return new TypeError('Invalid argument title, expect string, get ' + typeof title);
        }

        if (title.length < 1) {
            return new Error('Argument title is empty');
        }

        if (Object.prototype.toString.call(listErrors) !== '[object Array]') {
            return new TypeError('Invalid argument listErrors, expect Array, get ' + typeof listErrors);
        }

        var countErrors = listErrors.length;
        if (countErrors === 0) {
            return new Error('Argument listErrors is empty');
        }

        var err = checkErrorFormat(listErrors);
        if (err) {
            return err;
        }

        var generalInfo = createGeneralErrorDiv(elemID);
        var generalTitle = createGeneralErrorTitle(title);
        var listRoot = createGeneralErrorItems(listErrors);

        generalInfo.appendChild(generalTitle);
        generalInfo.appendChild(listRoot);

        removeGeneralError(elemObj);

        elemObj.insertAdjacentElement('beforebegin', generalInfo);
    };

    function checkErrorFormat(listErrors) {
        var idxError = 0;
        var maxError = listErrors.length;
        for(; idxError < maxError; idxError++) {
            if (!listErrors[idxError] || typeof listErrors[idxError] !== 'object') {
                return new Error('Invalid argument listErrors[' + idxError + '], expect Object');
            }

            if (!listErrors[idxError].hasOwnProperty('id') || typeof listErrors[idxError].id !== 'string') {
                return new Error('Invalid argument listErrors[' + idxError + '].id, expect string');
            }

            if (listErrors[idxError].id.length < 1) {
                return new Error('Invalid argument listErrors[' + idxError + '].id is empty');
            }

            if (!listErrors[idxError].hasOwnProperty('message') || typeof listErrors[idxError].message !== 'string') {
                return new Error('Invalid argument listErrors[' + idxError + '].message, expect string');
            }

            if (listErrors[idxError].message.length < 1) {
                return new Error('Invalid argument listErrors[' + idxError + '].message is empty');
            }

            if (listErrors[idxError].hasOwnProperty('more') && typeof listErrors[idxError].more !== 'string') {
                return new Error('Invalid argument listErrors[' + idxError + '].more, expect string');
            }
        }

        return null;
    }

    function createGeneralErrorDiv(elemID) {
        var generalInfo = document.createElement('div');
        generalInfo.setAttribute('role', 'alert');
        generalInfo.classList.add('block__info', 'block__info--error');
        generalInfo.setAttribute('id', elemID + '-error');

        return generalInfo;
    }

    function createGeneralErrorTitle(title) {
        var titleH4 = document.createElement('h4');
        titleH4.classList.add('block__title', 'block__title--small');
        titleH4.appendChild(document.createTextNode(title));

        return titleH4;
    }

    function createGeneralErrorItems(listErrors) {
        var listRoot = document.createElement('ul');
        listRoot.classList.add('block__list');

        var i = 0;
        var max = listErrors.length;
        for (;i < max; i++) {
            var listItem = document.createElement('li');
            listItem.classList.add('block__list-item');

            var listItemLink = document.createElement('a');
            listItemLink.classList.add('block__list-link');
            listItemLink.setAttribute('href', '#' + listErrors[i].id);
            listItemLink.appendChild(document.createTextNode(listErrors[i].message));

            listItem.appendChild(listItemLink);
            if (listErrors[i].more && listErrors[i].more.length > 0) {
                listItem.appendChild(document.createElement('br'));
                listItem.appendChild(document.createTextNode(listErrors[i].more));
            }

            listRoot.appendChild(listItem);
        }

        return listRoot;
    }
    // endregion

    // region Try Field Is Invalid
    FormHelper.prototype.tryFieldIsInvalid = function(elemID, rulesText, callback) {
        if (typeof callback !== 'function') {
            return new TypeError('Invalid argument callback, expect function, get ' + typeof callback);
        }

        var elemObj = getHTMLElement(elemID);
        if (!(elemObj instanceof HTMLElement)) {
            return callback(elemObj);
        }

        if (typeof rulesText !== 'string') {
            callback(new TypeError('Invalid argument rulesText, expect string, get ' + typeof rulesText));
            return;
        }

        var val = elemObj.value.trim();
        var rulesTextParts = rulesText.split('|');
        var fieldInspection = {
            'elemObj': elemObj,
            'val': val,
            'len': val.length,
            'idxOptionsTextParts': 0,
            'rulesTextParts': rulesTextParts,
            'maxOptionsTextParts': rulesTextParts.length
        };

        treatRulesLeft(fieldInspection, callback);
    };

    function treatRulesLeft(fieldInspection, callback) {
        if (fieldInspection.idxOptionsTextParts < fieldInspection.maxOptionsTextParts) {
            treatCurrentRule(fieldInspection, function(err) {
                if (err !== null) {
                    callback(err);
                } else {
                    fieldInspection.idxOptionsTextParts++;
                    treatRulesLeft(fieldInspection, callback);
                }
            });
        } else {
            callback(null);
        }
    }

    function treatCurrentRule(fieldInspection, callback) {
        var currentRule = fieldInspection.rulesTextParts[fieldInspection.idxOptionsTextParts].split(':');
        var rule = new Rule();
        if (!rule[currentRule[0]]) {
            callback(new Error('Invalid rule ' + currentRule[0]));
        } else {
            rule[currentRule[0]](currentRule, fieldInspection, callback);
        }
    }
    // endregion

    // region Rule
    function Rule() {}

    Rule.prototype.required = function(rules, fieldInspection, callback) {
        if (fieldInspection.len === 0) {
            callback(rules[0]);
        } else {
            callback(null);
        }
    };

    Rule.prototype.min = function(rules, fieldInspection, callback) {
        rules[1] = rules[1] >> 0;
        if (rules[1] === 0) {
            callback(new Error('Invalid parameter rule min, expect number above 0'));
            return;
        }

        if (fieldInspection.len < rules[1]) {
            callback(rules[0]);
        } else {
            callback(null);
        }
    };

    Rule.prototype.max = function(rules, fieldInspection, callback) {
        rules[1] = rules[1] >> 0;
        if (rules[1] === 0) {
            callback(new Error('Invalid parameter rule max, expect number above 0'));
            return;
        }

        if (fieldInspection.len > rules[1]) {
            callback(rules[0]);
        } else {
            callback(null);
        }
    };

    Rule.prototype.email = function(rules, fieldInspection, callback) {
        var posChar = fieldInspection.val.indexOf('@');
        if (posChar < 1 || posChar === (fieldInspection.len - 1)) {
            callback(rules[0]);
        } else {
            callback(null);
        }
    };

    Rule.prototype.equal_field = function(rules, fieldInspection, callback) {
        var elem = document.getElementById(rules[1]);
        if (!elem) {
            callback(new Error('Invalid parameter rule equal_field, DOM element ' + rules[1] + ' not found'));
            return;
        }

        if (fieldInspection.val !== elem.value.trim()) {
            callback(rules[0]);
        } else {
            callback(null);
        }
    };

    Rule.prototype.aria_invalid = function(rules, fieldInspection, callback) {
        if (fieldInspection.elemObj.getAttribute('aria-invalid') === 'true') {
            callback(rules[0]);
        } else {
            callback(null);
        }
    };

    Rule.prototype.callback = function(rules, fieldInspection, callback) {
        if (!rules[1]) {
            callback(new Error('Invalid parameter rule callback, callback ' + rules[1] + ' not found'));
            return;
        }

        var fn = getFunction(rules[1]);
        if (!fn) {
            callback(new Error('Invalid parameter rule callback, callback ' + rules[1] + ' not found'));
            return;
        }

        var args = [fieldInspection.elemObj, function(success) {
            if (success === true) {
                callback(null);
            } else {
                callback('callback');
            }
        }];

        if (rules[2]) {
            var parts = rules[2].split(',');
            for (var i = 0; i < parts.length; i++) {
                args.push(parts[i]);
            }
        }

        !fn.apply(null, args);
    };

    Rule.prototype.regex = function(rules, fieldInspection, callback) {
        var pattern = rules.slice(1).join(':');
        if (!new RegExp(pattern).exec(fieldInspection.elemObj.value)) {
            callback(rules[0]);
        } else {
            callback(null);
        }
    };

    Rule.prototype.checked = function(rules, fieldInspection, callback) {
        if (fieldInspection.elemObj.getAttribute('type') === 'radio') {
            var name = fieldInspection.elemObj.getAttribute('name');
            if (!name || name.length < 1) {
                callback(new Error('Attribute name is missing for ' + fieldInspection.elemObj.getAttribute('id')));
                return;
            }

            var radios = document.getElementsByName(name);
            var isOneRadioChecked = false;
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    isOneRadioChecked = true;
                }
            }

            if (isOneRadioChecked) {
                callback(null);
            } else {
                callback(rules[0]);
            }
        } else {
            if (!fieldInspection.elemObj.checked) {
                callback(rules[0]);
            } else {
                callback(null);
            }
        }
    };

    function getFunction(fn) {
        var scope = window;
        var fnParts = fn.split('.');
        var idxScopes = 0;
        var maxFnParts = fnParts.length;
        for (; idxScopes < maxFnParts - 1; idxScopes++) {
            if (fnParts[idxScopes] === 'window') {
                continue
            }

            scope = scope[fnParts[idxScopes]];

            if (scope === undefined) {
                return;
            }
        }

        return scope[fnParts[fnParts.length - 1]];
    }
    // endregion

    // region Form
    function Form(formObj) {
        this.canSubmit = true;
        this.formHelper = new FormHelper();
        this.listErrors = [];
        this.currentCallbacks = {};

        formObj.addEventListener('submit', this.onSubmit.bind(this), {passive: false});

        /* istanbul ignore next */
        if (false) { /* GULP REMOVE LINE */
            // dumb condition is necessary for avoiding fails unit test
            var idxNodes = 0;
            var maxNodes = formObj.length;
            for(; idxNodes < maxNodes; idxNodes++) {
                var type = formObj[idxNodes].getAttribute('type');
                if (type === 'checkbox' || type === 'radio' || type === 'file') {
                    formObj[idxNodes].addEventListener('change', this.onChange.bind(this), {passive: false});
                } else {
                    formObj[idxNodes].addEventListener('blur', this.onChange.bind(this), {passive: false});
                }
            }
        } /* GULP REMOVE LINE */
    }

    function updateFakeFileLabel(elemObj) {
        if (elemObj.getAttribute('type') !== 'file') {
            return;
        }

        var text = elemObj.getAttribute('data-form-file-empty') || 'Choose file';
        if (elemObj.files.length > 0) {
            var filenameParts = [];
            for (var idxFiles = 0; idxFiles < elemObj.files.length; idxFiles++) {
                filenameParts.push(elemObj.files[idxFiles].name);
            }
            text = filenameParts.join(', ');
        }

        var idxChild = 0;
        var maxChild = elemObj.parentNode.children.length;
        for(; idxChild < maxChild; idxChild ++) {
            if (elemObj.parentNode.children[idxChild].classList.contains('form__fake-file-label')) {
                elemObj.parentNode.children[idxChild].textContent = text;
            }
        }
    }

    Form.prototype.onChange = function(e) {
        if (this.canSubmit === false) {
            e.preventDefault();
            return;
        }

        var now = Date.now();
        this.currentCallbacks[e.currentTarget.id] = now;

        updateFakeFileLabel(e.currentTarget);
        this.checkFieldState(e.currentTarget, false, now);
    };

    Form.prototype.onSubmit = function(e) {
        e.preventDefault();

        if (this.canSubmit === false) {
            return new Error('Form is already in submit processing');
        }

        for(var k in this.currentCallbacks) {
            this.currentCallbacks[k] = -1;
        }

        this.canSubmit = false;
        this.form = e.currentTarget;
        this.currentIdxNodes = 0;
        this.maxNodes = this.form.length;
        this.hasError = false;
        this.listErrors = [];

        this.checkFormFieldsState(this.canFinallySubmit.bind(this));
    };

    Form.prototype.checkFormFieldsState = function(callback) {
        if (this.currentIdxNodes < this.maxNodes) {
            this.checkFieldState(this.form[this.currentIdxNodes], true, null, (function() {
                this.currentIdxNodes++;
                this.checkFormFieldsState(callback);
            }).bind(this))
        } else {
            callback();
        }
    };

    Form.prototype.checkFieldState = function(elemObj, isSubmitEvent, now, callback) {
        var currentID = elemObj.getAttribute('id');
        var currentRules = elemObj.getAttribute('data-form-rules');

        if (currentID === null || currentRules === null) {
            /* istanbul ignore else */
            if (callback) {
                callback(null);
            }

            return;
        }

        this.formHelper.setFieldLoading(currentID);
        this.formHelper.tryFieldIsInvalid(currentID, currentRules, (function(error) {
            if (now !== null && (this.currentCallbacks[currentID] && this.currentCallbacks[currentID] !== now)) {
                return;
            }

            var errorMessage = this.setFieldState(error, elemObj);

            if (isSubmitEvent && error !== null) {
                this.hasError = true;
                this.listErrors.push({
                    'id': currentID,
                    'message': errorMessage
                });
            }

            if (callback) {
                callback(error);
            }
        }).bind(this));
    };

    Form.prototype.setFieldState = function(error, elemObj) {
        var errorMessage;
        if (error !== null) {
            if (typeof error === 'string') {
                errorMessage = elemObj.getAttribute('data-form-error-' + error);
                if (!errorMessage || error.length === 0) {
                    errorMessage = 'Invalid field';
                }
            } else {
                errorMessage = 'Error: ' + error.message;
            }

            this.formHelper.setFieldInvalid(elemObj.getAttribute('id'), errorMessage);
        } else {
            this.formHelper.setFieldValid(elemObj.getAttribute('id'));
        }

        return errorMessage;
    };

    /* istanbul ignore next */
    // this function is always mock in tests because of form variable
    Form.prototype.canFinallySubmit = function() {
        if (!this.hasError) {
            if (this.callConfirmCallback()) {
                return;
            }

            if (this.showConfirm()) {
                return;
            }

            this.form.submit();
        } else {
            var generalErrorTitle = this.form.getAttribute('data-form-general-error');
            if (generalErrorTitle) {
                this.formHelper.setGeneralError(this.form.getAttribute('id'), generalErrorTitle, this.listErrors);
            } else {
                var speak = [];
                for (var i = 0; i < this.listErrors.length; i++) {
                    speak.push(this.listErrors[i].message);
                }
                var speakIntro = this.form.getAttribute('data-form-speak-error') || 'Form is invalid:';
                if (typeof window.screenReaderSpeak === 'function') {
                    //todo : have a "try catch" to protect if shit happens
                    window.screenReaderSpeak(speakIntro + ' ' + speak.join(', '));
                }
            }
            this.canSubmit = true;
        }
    };

    Form.prototype.callConfirmCallback = function() {
        var confirmCallback = this.form.getAttribute('data-form-confirm-callback');
        if (!confirmCallback) {
            return false;
        }

        var fn = getFunction(confirmCallback);
        if (!fn) {
            return false;
        }

        fn.apply(null, [this.form, (function(hasConfirmed) {
            if(hasConfirmed) {
                this.form.submit();
            } else {
                this.canSubmit = true;
            }
        }).bind(this)]);

        return true;
    };

    Form.prototype.showConfirm = function() {
        if (!this.form.hasAttribute('data-form-confirm')) {
            return false;
        }

        var popinConfirmQuestion = document.getElementById('popin-confirm-h2');
        var popinConfirmContent = document.getElementById('popin-confirm-div-content');

        if (!popinConfirmQuestion || !popinConfirmContent) {
            return false;
        }

        var oldBtnYes = document.getElementById('popin-confirm-button-yes');
        if (oldBtnYes) {
            oldBtnYes.remove();
        }

        var oldBtnNo = document.getElementById('popin-confirm-button-no');
        if (oldBtnNo) {
            oldBtnNo.remove();
        }

        var btnYes = document.createElement('button');
        btnYes.setAttribute('class', 'form__button form__button--small');
        btnYes.setAttribute('id', 'popin-confirm-button-yes');
        var btnNo = document.createElement('button');
        btnNo.setAttribute('class', 'form__button form__button--secondary form__button--small');
        btnNo.setAttribute('id', 'popin-confirm-button-no');

        popinConfirmQuestion.textContent = this.form.getAttribute('data-form-confirm-question') || 'Do you confirm?';
        btnYes.appendChild(document.createTextNode(this.form.getAttribute('data-form-confirm-yes') || 'Yes'));
        btnNo.appendChild(document.createTextNode(this.form.getAttribute('data-form-confirm-no') || 'No'));

        popinConfirmContent.appendChild(btnYes);
        popinConfirmContent.appendChild(btnNo);

        btnYes.addEventListener('click', (this.confirmYes).bind(this));
        btnNo.addEventListener('click', (this.confirmNo).bind(this));

        this.previousHash = window.location.hash;
        window.location.hash = '#popin-confirm';

        return true;
    };

    Form.prototype.confirmYes = function() {
        this.form.submit();
    };

    Form.prototype.confirmNo = function() {
        this.canSubmit = true;
        window.location.hash = this.previousHash;
    };
    // endregion

    // region Attach to root
    window.FormHelper = FormHelper;
    window.Form = Form;
    // endregion

    // region Init Forms
    var forms = document.querySelectorAll('form');
    var idxNodes = 0;
    var maxNodes = forms.length;
    for (; idxNodes < maxNodes; idxNodes++) {
        new Form(forms[idxNodes]);
    }
    // endregion
})();