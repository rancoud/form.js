/* global FieldInspection,Rule */
/**
 * Form Helper.
 *
 * @class FormHelper
 */
// eslint-disable-next-line no-empty-function
function FormHelper() {}

// region Helpers
/**
 * Get HTML Element.
 *
 * @param {string} elemID - id
 * @returns {Error|HTMLElement}
 */
function getHTMLElement(elemID) {
    /** @type {HTMLElement} */
    var htmlElement = null;

    if (typeof elemID !== "string") {
        return new TypeError("Invalid argument elemID, expect string, get " + typeof elemID);
    }

    htmlElement = document.getElementById(elemID);
    if (!htmlElement) {
        return new Error("DOM element " + elemID + " not found");
    }

    return htmlElement;
}

/**
 * Set css class on input field.
 *
 * @param {HTMLElement} inputField - input field
 * @param {string}      cssClass   - css class to apply
 * @returns {undefined}
 */
function setInputCssClass(inputField, cssClass) {
    inputField.classList.remove("form__input--error", "form__input--success");
    if (cssClass.length > 0) {
        inputField.classList.add(cssClass);
    }
}

/**
 * Set css class on container form.
 *
 * @param {HTMLElement} container - HTML Element to target
 * @param {string}      cssClass  - css class to apply
 * @returns {undefined}
 */
function setContainerCssClass(container, cssClass) {
    if (!container.hasAttribute("data-form-has-container")) {
        return;
    }

    container.parentNode.classList.remove("form__container--error", "form__container--success");
    if (cssClass.length > 0) {
        container.parentNode.classList.add(cssClass);
    }
}

/**
 * Set css class on feedback span.
 *
 * @param {HTMLElement} elemObj  - HTML Element to target
 * @param {string}      cssClass - css class to apply
 * @returns {undefined}
 */
function setFeedbackCssClass(elemObj, cssClass) {
    /** @type {HTMLElement[]} */
    var feedbacks = findFeedbacks(elemObj);
    var idxFeedbacks = 0;
    var maxFeedbacks = feedbacks.length;

    for (; idxFeedbacks < maxFeedbacks; idxFeedbacks++) {
        feedbacks[idxFeedbacks].classList.remove("form__feedback--error", "form__feedback--loading", "form__feedback--success");
        if (cssClass.length > 0) {
            feedbacks[idxFeedbacks].classList.add(cssClass);
        }
    }
}

/**
 * SetFieldsetCssClass.
 *
 * @param {HTMLElement} elemObj  - a
 * @param {string}      cssClass - a
 */
function setFieldsetCssClass(elemObj, cssClass) {
    /** @type {HTMLFieldSetElement} */
    var fieldsetObj = findParentFieldset(elemObj);
    if (!fieldsetObj) {
        return;
    }

    fieldsetObj.classList.remove("form__fieldset--error", "form__fieldset--success");
    if (cssClass.length > 0) {
        fieldsetObj.classList.add(cssClass);
    }
}

/**
 * FindFeedbacks.
 *
 * @param {HTMLElement} elemObj - a
 * @returns {HTMLFieldSetElement[]}
 */
function findFeedbacks(elemObj) {
    var maxParentBouncing = 0;

    /** @type {HTMLElement} */
    var currentObj = elemObj;

    /** @type {HTMLFieldSetElement[]} */
    var feedbacks = [];

    var idxChilds = 0;
    var maxChilds = 0;

    do {
        currentObj = currentObj.parentNode;
        if (currentObj.tagName === "BODY" || currentObj.tagName === "FORM") {
            break;
        }

        idxChilds = 0;
        maxChilds = currentObj.children.length;
        for (; idxChilds < maxChilds; ++idxChilds) {
            if (currentObj.children[idxChilds].classList.contains("form__feedback")) {
                feedbacks.push(currentObj.children[idxChilds]);
                break;
            }
        }

        if (currentObj.tagName === "FIELDSET") {
            break;
        }

        maxParentBouncing += 1;
    } while (maxParentBouncing < 10);

    return feedbacks;
}

/**
 * FindParentFieldset.
 *
 * @param {HTMLElement} elemObj - a
 * @returns {HTMLFieldSetElement}
 */
function findParentFieldset(elemObj) {
    var maxParentBouncing = 0;

    /** @type {HTMLElement} */
    var fieldsetObj = elemObj;

    do {
        fieldsetObj = fieldsetObj.parentNode;
        if (fieldsetObj.tagName === "BODY" || fieldsetObj.tagName === "FORM") {
            return null;
        }

        if (fieldsetObj.classList.contains("form__fieldset")) {
            return fieldsetObj;
        }

        maxParentBouncing += 1;
    } while (maxParentBouncing < 10);

    return null;
}

/**
 * Get Label Error ID.
 *
 * @param {HTMLElement} elemObj - html element
 * @returns {string}
 */
function getLabelErrorID(elemObj) {
    var inputID = "";
    var labelID = "";

    // eslint-disable-next-line no-negated-condition
    if (elemObj.getAttribute("type") !== "radio") {
        inputID = elemObj.getAttribute("id");
        labelID = inputID.replace("-input-", "-label-");
    } else {
        inputID = elemObj.getAttribute("name");
        labelID = inputID.replace("-input-", "-label-");
    }

    return labelID + "-error";
}

/**
 * Add Label Error.
 *
 * @param {HTMLElement} elemObj      - html element
 * @param {string}      errorMessage - message
 */
function addLabelError(elemObj, errorMessage) {
    var labelErrorID = getLabelErrorID(elemObj);

    /** @type {HTMLElement} */
    var labelObj = document.getElementById(labelErrorID);

    /** @type {HTMLLabelElement} */
    var label = null;

    var inputID = "";
    var labelID = "";

    /** @type {HTMLElement} */
    var fieldsetObj = null;

    if (labelObj) {
        labelObj.textContent = errorMessage;
    } else {
        label = document.createElement("label");
        inputID = elemObj.getAttribute("id");
        labelID = inputID.replace("-input-", "-label-");

        label.classList.add("form__label", "form__label--error");
        label.setAttribute("for", elemObj.getAttribute("id"));
        label.setAttribute("id", labelErrorID);
        label.appendChild(document.createTextNode(errorMessage));

        // eslint-disable-next-line no-negated-condition
        if (elemObj.getAttribute("type") !== "radio") {
            elemObj.setAttribute("aria-labelledby", labelID + " " + labelErrorID);
            if (elemObj.hasAttribute("data-form-has-container")) {
                elemObj.parentNode.insertAdjacentElement("afterend", label);
            } else {
                elemObj.insertAdjacentElement("afterend", label);
            }
        } else {
            label.removeAttribute("for");

            fieldsetObj = findParentFieldset(elemObj);
            /* istanbul ignore else */
            if (fieldsetObj) {
                fieldsetObj.appendChild(label);
            }
        }
    }
}

/**
 * Remove Label Error.
 *
 * @param {HTMLElement} elemObj - html element
 */
function removeLabelError(elemObj) {
    var labelID = "";

    var labelObj = document.getElementById(getLabelErrorID(elemObj));
    if (!labelObj) {
        return;
    }

    labelID = labelObj.getAttribute("id").replace("-error", "");

    if (elemObj.getAttribute("type") !== "radio") {
        elemObj.setAttribute("aria-labelledby", labelID);
    }

    labelObj.remove();
}
// endregion

// region Set Field Neutral
FormHelper.prototype.setFieldNeutral = function setFieldNeutral(elemID) {
    /** @type {HTMLElement} */
    var elemObj = getHTMLElement(elemID);
    if (!(elemObj instanceof HTMLElement)) {
        return elemObj;
    }

    elemObj.setAttribute("aria-invalid", "false");

    setInputCssClass(elemObj, "");
    setContainerCssClass(elemObj, "");
    setFeedbackCssClass(elemObj, "");
    setFieldsetCssClass(elemObj, "");

    removeLabelError(elemObj);
};
// endregion

// region Set Field Valid
FormHelper.prototype.setFieldValid = function setFieldValid(elemID) {
    var elemObj = getHTMLElement(elemID);
    if (!(elemObj instanceof HTMLElement)) {
        return elemObj;
    }

    elemObj.setAttribute("aria-invalid", "false");

    setInputCssClass(elemObj, "form__input--success");
    setContainerCssClass(elemObj, "form__container--success");
    setFeedbackCssClass(elemObj, "form__feedback--success");
    setFieldsetCssClass(elemObj, "form__fieldset--success");

    removeLabelError(elemObj);
};
// endregion

// region Set Field Invalid
FormHelper.prototype.setFieldInvalid = function setFieldInvalid(elemID, errorMessage) {
    var elemObj = getHTMLElement(elemID);
    if (!(elemObj instanceof HTMLElement)) {
        return elemObj;
    }

    if (typeof errorMessage !== "string") {
        return new TypeError("Invalid argument errorMessage, expect string, get " + typeof errorMessage);
    }

    if (errorMessage.length < 1) {
        return new Error("Argument errorMessage is empty");
    }

    elemObj.setAttribute("aria-invalid", "true");

    setInputCssClass(elemObj, "form__input--error");
    setContainerCssClass(elemObj, "form__container--error");
    setFeedbackCssClass(elemObj, "form__feedback--error");
    setFieldsetCssClass(elemObj, "form__fieldset--error");

    addLabelError(elemObj, errorMessage);
};
// endregion

// region Set Field Loading
FormHelper.prototype.setFieldLoading = function setFieldLoading(elemID) {
    var elemObj = getHTMLElement(elemID);
    if (!(elemObj instanceof HTMLElement)) {
        return elemObj;
    }

    setInputCssClass(elemObj, "");
    setContainerCssClass(elemObj, "");
    setFeedbackCssClass(elemObj, "form__feedback--loading");
    setFieldsetCssClass(elemObj, "");

    removeLabelError(elemObj);
};
// endregion

// region Remove General Error
// eslint-disable-next-line func-names
FormHelper.prototype.removeGeneralError = function (elemID) {
    var elemObj = getHTMLElement(elemID);
    if (!(elemObj instanceof HTMLElement)) {
        return elemObj;
    }

    removeGeneralError(elemObj);
};

/**
 * RemoveGeneralError.
 *
 * @param {HTMLElement} elemObj - a
 */
function removeGeneralError(elemObj) {
    var prevElem = elemObj.previousElementSibling;

    if (prevElem === null || prevElem.tagName !== "DIV" || prevElem.getAttribute("role") !== "alert") {
        return;
    }

    prevElem.remove();
}
// endregion

// region Set General Error
FormHelper.prototype.setGeneralError = function setGeneralError(elemID, title, listErrors) {
    /** @type Number */
    var countErrors = 0;

    /** @type Error */
    var err = null;

    /** @type HTMLDivElement */
    var generalInfo = null;

    /** @type HTMLHeadingElement */
    var generalTitle = null;

    /** @type HTMLUListElement */
    var listRoot = null;

    var elemObj = getHTMLElement(elemID);
    if (!(elemObj instanceof HTMLElement)) {
        return elemObj;
    }

    if (typeof title !== "string") {
        return new TypeError("Invalid argument title, expect string, get " + typeof title);
    }

    if (title.length < 1) {
        return new Error("Argument title is empty");
    }

    if (Object.prototype.toString.call(listErrors) !== "[object Array]") {
        return new TypeError("Invalid argument listErrors, expect Array, get " + typeof listErrors);
    }

    countErrors = listErrors.length;
    if (countErrors === 0) {
        return new Error("Argument listErrors is empty");
    }

    err = checkErrorFormat(listErrors);
    if (err) {
        return err;
    }

    generalInfo = createGeneralErrorDiv(elemID);
    generalTitle = createGeneralErrorTitle(title);
    listRoot = createGeneralErrorItems(listErrors);

    generalInfo.appendChild(generalTitle);
    generalInfo.appendChild(listRoot);

    removeGeneralError(elemObj);

    elemObj.insertAdjacentElement("beforebegin", generalInfo);
};

/**
 * CheckErrorFormat.
 *
 * @param {Array} listErrors - a
 * @returns {Error|null}
 */
function checkErrorFormat(listErrors) {
    var idxError = 0;
    var maxError = listErrors.length;
    for (; idxError < maxError; idxError++) {
        if (!listErrors[idxError] || typeof listErrors[idxError] !== "object") {
            return new Error("Invalid argument listErrors[" + idxError + "], expect Object");
        }

        // eslint-disable-next-line no-prototype-builtins
        if (!listErrors[idxError].hasOwnProperty("id") || typeof listErrors[idxError].id !== "string") {
            return new Error("Invalid argument listErrors[" + idxError + "].id, expect string");
        }

        if (listErrors[idxError].id.length < 1) {
            return new Error("Invalid argument listErrors[" + idxError + "].id is empty");
        }

        // eslint-disable-next-line no-prototype-builtins
        if (!listErrors[idxError].hasOwnProperty("message") || typeof listErrors[idxError].message !== "string") {
            return new Error("Invalid argument listErrors[" + idxError + "].message, expect string");
        }

        if (listErrors[idxError].message.length < 1) {
            return new Error("Invalid argument listErrors[" + idxError + "].message is empty");
        }

        // eslint-disable-next-line no-prototype-builtins
        if (listErrors[idxError].hasOwnProperty("more") && typeof listErrors[idxError].more !== "string") {
            return new Error("Invalid argument listErrors[" + idxError + "].more, expect string");
        }
    }

    return null;
}

/**
 * CreateGeneralErrorDiv.
 *
 * @param {string} elemID - a
 * @returns {HTMLDivElement}
 */
function createGeneralErrorDiv(elemID) {
    var generalInfo = document.createElement("div");
    generalInfo.setAttribute("role", "alert");
    generalInfo.classList.add("block__info", "block__info--error");
    generalInfo.setAttribute("id", elemID + "-error");

    return generalInfo;
}

/**
 * CreateGeneralErrorTitle.
 *
 * @param {string} title - a
 * @returns {HTMLHeadingElement}
 */
function createGeneralErrorTitle(title) {
    var titleH4 = document.createElement("h4");
    titleH4.classList.add("block__title", "block__title--small");
    titleH4.appendChild(document.createTextNode(title));

    return titleH4;
}

/**
 * CreateGeneralErrorItems.
 *
 * @param {Array} listErrors - a
 * @returns {HTMLUListElement}
 */
function createGeneralErrorItems(listErrors) {
    var idxErrors = 0;
    var max = 0;
    var listItem = null;
    var listItemLink = null;
    var listRoot = document.createElement("ul");
    listRoot.classList.add("block__list");

    max = listErrors.length;
    for (;idxErrors < max; ++idxErrors) {
        listItem = document.createElement("li");
        listItem.classList.add("block__list-item");

        listItemLink = document.createElement("a");
        listItemLink.classList.add("block__list-link");
        listItemLink.setAttribute("href", "#" + listErrors[idxErrors].id);
        listItemLink.appendChild(document.createTextNode(listErrors[idxErrors].message));

        listItem.appendChild(listItemLink);
        if (listErrors[idxErrors].more && listErrors[idxErrors].more.length > 0) {
            listItem.appendChild(document.createElement("br"));
            listItem.appendChild(document.createTextNode(listErrors[idxErrors].more));
        }

        listRoot.appendChild(listItem);
    }

    return listRoot;
}
// endregion

// region Try Field Is Invalid
FormHelper.prototype.tryFieldIsInvalid = function tryFieldIsInvalid(elemID, rulesText, callback) {
    /** @type {HTMLElement} */
    var elemObj = null;

    var val = "";

    /** @type {string[]} */
    var rulesTextParts = [];

    /** @type {FieldInspection} */
    var fieldInspection = null;

    if (typeof callback !== "function") {
        return new TypeError("Invalid argument callback, expect function, get " + typeof callback);
    }

    elemObj = getHTMLElement(elemID);
    if (!(elemObj instanceof HTMLElement)) {
        return callback(elemObj);
    }

    if (typeof rulesText !== "string") {
        callback(new TypeError("Invalid argument rulesText, expect string, get " + typeof rulesText));

        return;
    }

    val = elemObj.value.trim();
    rulesTextParts = rulesText.split("|");
    fieldInspection = {
        elemObj: elemObj,
        val: val,
        len: val.length,
        idxOptionsTextParts: 0,
        rulesTextParts: rulesTextParts,
        maxOptionsTextParts: rulesTextParts.length
    };

    treatRulesLeft(fieldInspection, callback);
};

/**
 * Treat rules.
 *
 * @param {FieldInspection} fieldInspection - a
 * @param {Function}        callback        - a
 * @returns {undefined}
 */
function treatRulesLeft(fieldInspection, callback) {
    if (fieldInspection.idxOptionsTextParts < fieldInspection.maxOptionsTextParts) {
        treatCurrentRule(fieldInspection, function cb(err) {
            if (err === null) {
                fieldInspection.idxOptionsTextParts += 1;
                treatRulesLeft(fieldInspection, callback);
            } else {
                callback(err);
            }
        });
    } else {
        callback(null);
    }
}

/**
 * TreatCurrentRule.
 *
 * @param {FieldInspection} fieldInspection - aaa
 * @param {Function}        callback        - bbb
 */
function treatCurrentRule(fieldInspection, callback) {
    /** @type {string} */
    var currentRule = fieldInspection.rulesTextParts[fieldInspection.idxOptionsTextParts].split(":");

    /** @type {Rule} */
    var rule = new Rule();

    // eslint-disable-next-line no-negated-condition
    if (!rule[currentRule[0]]) {
        callback(new Error("Invalid rule " + currentRule[0]));
    } else {
        rule[currentRule[0]](currentRule, fieldInspection, callback);
    }
}
// endregion

window.FormHelper = FormHelper; /* BUILD REMOVE LINE */
