/* global FormHelper, getFunction */
/**
 * Form Class definition.
 *
 * @class Form
 * @param {HTMLFormElement} formElement - HTML Form Element Object.
 * @returns {undefined}
 */
function Form(formElement) {
    /** @type {number} */
    var idxNodes = 0;
    /** @type {number} */
    var maxNodes = formElement.length;
    /** @type {string} */
    var inputType;

    /** @type {boolean} */
    this.canSubmit = true;
    /** @type {FormHelper} */
    this.formHelper = new FormHelper();
    /** @type {object[]} */
    this.listErrors = [];
    /** @type {object} */
    this.currentCallbacks = {};

    formElement.addEventListener("submit", this.onSubmit.bind(this), {passive: false});

    /* istanbul ignore next */
    // eslint-disable-next-line no-constant-condition
    if (false) { // BUILD REMOVE LINE - dumb condition is necessary for avoiding fails unit test
        for (; idxNodes < maxNodes; ++idxNodes) {
            inputType = formElement[idxNodes].getAttribute("type");
            if (inputType === "checkbox" || inputType === "radio" || inputType === "file") {
                formElement[idxNodes].addEventListener("change", this.onChange.bind(this), {passive: false});
            } else {
                formElement[idxNodes].addEventListener("blur", this.onChange.bind(this), {passive: false});
            }
        }
    } // BUILD REMOVE LINE
}

/**
 * Update input file label on change.
 *
 * @param {HTMLInputElement} elemObj - HTML Input Element Object.
 * @returns {undefined}
 */
function updateFakeFileLabel(elemObj) {
    /** @type {string} */
    var text;
    /** @type {string[]} */
    var filenameParts;
    /** @type {number} */
    var idxFiles = 0;
    /** @type {number} */
    var maxFiles;
    /** @type {number} */
    var idxChilds = 0;
    /** @type {number} */
    var maxChilds;

    if (elemObj.getAttribute("type") !== "file") {
        return;
    }

    text = elemObj.getAttribute("data-form-file-empty") || "Choose file";
    if (elemObj.files.length > 0) {
        filenameParts = [];

        for (maxFiles = elemObj.files.length; idxFiles < maxFiles; ++idxFiles) {
            filenameParts.push(elemObj.files[idxFiles].name);
        }

        text = filenameParts.join(", ");
    }

    for (maxChilds = elemObj.parentNode.children.length; idxChilds < maxChilds; ++idxChilds) {
        if (elemObj.parentNode.children[idxChilds].classList.contains("form__fake-file-label")) {
            elemObj.parentNode.children[idxChilds].textContent = text;
        }
    }
}

/**
 * OnChange event.
 *
 * @param {Event} event - Event triggered.
 * @returns {undefined}
 */
Form.prototype.onChange = function onChange(event) {
    /** @type {number} */
    var now = Date.now();

    if (this.canSubmit === false) {
        event.preventDefault();

        return;
    }

    this.currentCallbacks[event.currentTarget.id] = now;

    updateFakeFileLabel(event.currentTarget);

    this.checkFieldState(event.currentTarget, false, now);
};

/**
 * OnSubmit Event.
 *
 * @param {Event} event - Event triggered.
 * @returns {(Error|undefined)}
 */
Form.prototype.onSubmit = function onSubmit(event) {
    /** @type {string} */
    var key;

    event.preventDefault();

    if (this.canSubmit === false) {
        return new Error("Form is already in submit processing");
    }

    for (key in this.currentCallbacks) {
        if (Object.hasOwn(this.currentCallbacks, key)) {
            this.currentCallbacks[key] = -1;
        }
    }

    this.canSubmit = false;
    this.form = event.currentTarget;
    this.currentIdxNodes = 0;
    this.maxNodes = this.form.length;
    this.hasError = false;
    this.listErrors = [];

    this.checkFormFieldsState(this.canFinallySubmit.bind(this));

    return undefined;
};

/**
 * Check Form Fields State.
 *
 * @param {Function} callback - callback
 * @returns {undefined}
 */
Form.prototype.checkFormFieldsState = function checkFormFieldsState(callback) {
    if (this.currentIdxNodes < this.maxNodes) {
        this.checkFieldState(this.form[this.currentIdxNodes], true, null, function cb() {
            this.currentIdxNodes = this.currentIdxNodes + 1;
            this.checkFormFieldsState(callback);
        }.bind(this));
    } else {
        callback();
    }
};

/**
 * Check Field State.
 *
 * @param {HTMLElement}   elemObj       - callback
 * @param {boolean}       isSubmitEvent - callback
 * @param {(string|null)} now           - callback
 * @param {Function}      callback      - callback
 * @returns {undefined}
 */
Form.prototype.checkFieldState = function checkFieldState(elemObj, isSubmitEvent, now, callback) {
    /** @type {string} */
    var currentID = elemObj.getAttribute("id");
    /** @type {string} */
    var currentRules = elemObj.getAttribute("data-form-rules");
    /** @type {object} */
    var errorMessage = null;

    if (currentID === null || currentRules === null) {
        /* istanbul ignore else */
        if (callback) {
            callback(null);
        }

        return;
    }

    this.formHelper.setFieldLoading(currentID);
    this.formHelper.tryFieldIsInvalid(currentID, currentRules, function cb(error) {
        if (now !== null && (this.currentCallbacks[currentID] && this.currentCallbacks[currentID] !== now)) {
            return;
        }

        errorMessage = this.setFieldState(error, elemObj);

        if (isSubmitEvent && error !== null) {
            this.hasError = true;
            this.listErrors.push({
                id     : currentID,
                message: errorMessage
            });
        }

        if (callback) {
            callback(error);
        }
    }.bind(this));
};

/**
 * Set Field State.
 *
 * @param {Error}       error   - aa
 * @param {HTMLElement} elemObj - ca
 * @returns {undefined}
 */
Form.prototype.setFieldState = function setFieldState(error, elemObj) {
    /** @type {(string|null)} */
    var errorMessage = null;

    if (error === null) {
        this.formHelper.setFieldValid(elemObj.getAttribute("id"));

        return errorMessage;
    }

    if (typeof error === "string") {
        errorMessage = elemObj.getAttribute("data-form-error-" + error);
        if (!errorMessage || error.length === 0) {
            errorMessage = "Invalid field";
        }
    } else {
        errorMessage = "Error: " + error.message;
    }

    this.formHelper.setFieldInvalid(elemObj.getAttribute("id"), errorMessage);

    return errorMessage;
};

/**
 * Can Finally Submit.
 *
 * @returns {undefined}
 */
/* istanbul ignore next */
// This function is always mock in tests because of form variable
Form.prototype.canFinallySubmit = function canFinallySubmit() {
    /** @type {(string|null)} */
    var generalErrorTitle;
    /** @type {string[]} */
    var speak;
    /** @type {number} */
    var idx = 0;
    /** @type {number} */
    var max = this.listErrors.length;
    /** @type {(string|null)} */
    var speakIntro;

    if (this.hasError) {
        generalErrorTitle = this.form.getAttribute("data-form-general-error");
        if (generalErrorTitle) {
            this.formHelper.setGeneralError(this.form.getAttribute("id"), generalErrorTitle, this.listErrors);
        } else {
            speak = [];
            for (; idx < max; ++idx) {
                speak.push(this.listErrors[idx].message);
            }

            speakIntro = this.form.getAttribute("data-form-speak-error") || "Form is invalid:";
            if (typeof window.screenReaderSpeak === "function") {
                // Have a "try catch" to protect if shit happens
                window.screenReaderSpeak(speakIntro + " " + speak.join(", "));
            }
        }

        this.canSubmit = true;
    } else {
        if (this.callConfirmCallback()) {
            return;
        }

        if (this.showConfirm()) {
            return;
        }

        this.form.submit();
    }
};

/**
 * Call Confirm Callback.
 *
 * @returns {boolean}
 */
Form.prototype.callConfirmCallback = function callConfirmCallback() {
    /** @type {(Function|undefined)} */
    var fn;
    /** @type {string} */
    var confirmCallback = this.form.getAttribute("data-form-confirm-callback");

    if (!confirmCallback) {
        return false;
    }

    fn = getFunction(confirmCallback);
    if (!fn) {
        return false;
    }

    // eslint-disable-next-line no-useless-call
    fn.apply(null, [
        this.form, function cb(hasConfirmed) {
            if (hasConfirmed) {
                this.form.submit();
            } else {
                this.canSubmit = true;
            }
        }.bind(this)
    ]);

    return true;
};

/**
 * Show Confirm.
 *
 * @returns {boolean}
 */
Form.prototype.showConfirm = function showConfirm() {
    /** @type {(HTMLElement|null)} */
    var popinConfirmQuestion;
    /** @type {(HTMLElement|null)} */
    var popinConfirmContent;
    /** @type {(HTMLElement|null)} */
    var oldBtnYes;
    /** @type {(HTMLElement|null)} */
    var oldBtnNo;
    /** @type {(HTMLElement|null)} */
    var btnYes;
    /** @type {(HTMLElement|null)} */
    var btnNo;

    if (!this.form.hasAttribute("data-form-confirm")) {
        return false;
    }

    popinConfirmQuestion = document.getElementById("popin-confirm-h2");
    popinConfirmContent = document.getElementById("popin-confirm-div-content");

    if (!popinConfirmQuestion || !popinConfirmContent) {
        return false;
    }

    oldBtnYes = document.getElementById("popin-confirm-button-yes");
    if (oldBtnYes) {
        oldBtnYes.remove();
    }

    oldBtnNo = document.getElementById("popin-confirm-button-no");
    if (oldBtnNo) {
        oldBtnNo.remove();
    }

    btnYes = document.createElement("button");
    btnYes.setAttribute("class", "form__button form__button--small");
    btnYes.setAttribute("id", "popin-confirm-button-yes");

    btnNo = document.createElement("button");
    btnNo.setAttribute("class", "form__button form__button--secondary form__button--small");
    btnNo.setAttribute("id", "popin-confirm-button-no");

    popinConfirmQuestion.textContent = this.form.getAttribute("data-form-confirm-question") || "Do you confirm?";
    btnYes.appendChild(document.createTextNode(this.form.getAttribute("data-form-confirm-yes") || "Yes"));
    btnNo.appendChild(document.createTextNode(this.form.getAttribute("data-form-confirm-no") || "No"));

    popinConfirmContent.appendChild(btnYes);
    popinConfirmContent.appendChild(btnNo);

    btnYes.addEventListener("click", this.confirmYes.bind(this));
    btnNo.addEventListener("click", this.confirmNo.bind(this));

    this.previousHash = window.location.hash;
    window.location.hash = "#popin-confirm";

    return true;
};

/**
 * Confirm Yes.
 *
 * @returns {undefined}
 */
Form.prototype.confirmYes = function confirmYes() {
    this.form.submit();
};

/**
 * Confirm No.
 *
 * @returns {undefined}
 */
Form.prototype.confirmNo = function confirmNo() {
    this.canSubmit = true;

    window.location.hash = this.previousHash;
};

// region Attach to root
window.Form = Form;
// endregion
