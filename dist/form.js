/**
 * form.js (v1.0.0)
 * https://github.com/rancoud/form.js
 * 
 * MIT License
 * 
 * Copyright (c) 2023 Rancoud
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function () {
  "use strict";

  /**
   * Represent a node with it's parent GUID.
   *
   * @typedef  FieldInspection
   * @property {object} elemObj             - aaaa
   * @property {string} val                 - aaaa
   * @property {number} len                 - aaaa
   * @property {number} idxOptionsTextParts - aaaa
   * @property {object} rulesTextParts      - aaaa
   * @property {number} maxOptionsTextParts - aaaa
   */

  /* global FieldInspection */
  /**
   * Get function to use as callback.?????
   * To change with register callback to avoid dynamic injection.
   *
   * @param {string} fn - function in string to fetch.?????
   * @returns {undefined|Function}
   */
  function getFunction(fn) {
    var scope = window;
    var fnParts = fn.split(".");
    var idxScopes = 0;
    var maxFnParts = fnParts.length;

    for (; idxScopes < maxFnParts - 1; idxScopes++) {
      if (fnParts[idxScopes] === "window") {
        continue;
      }

      scope = scope[fnParts[idxScopes]];

      if (scope === undefined) {
        return;
      }
    }

    return scope[fnParts[fnParts.length - 1]];
  }

  /**
   * Rule Class definition.
   *
   * @class Rule
   * @returns {undefined}
   */
  // eslint-disable-next-line no-empty-function
  function Rule() {}

  /**
   * Rule required, return false if empty.
   *
   * @param {Array}           rules           - 4
   * @param {FieldInspection} fieldInspection - 5
   * @param {Function}        callback        - 6
   * @returns {undefined}
   */
  Rule.prototype.required = function required(rules, fieldInspection, callback) {
    if (fieldInspection.len === 0) {
      callback(rules[0]);
    } else {
      callback(null);
    }
  };

  /**
   * Min.
   *
   * @param {Array}           rules           - a
   * @param {FieldInspection} fieldInspection - a
   * @param {Function}        callback        - a
   */
  Rule.prototype.min = function min(rules, fieldInspection, callback) {
    // eslint-disable-next-line operator-assignment
    rules[1] = rules[1] >> 0;

    if (rules[1] === 0) {
      callback(new Error("Invalid parameter rule min, expect number above 0"));
      return;
    }

    if (fieldInspection.len < rules[1]) {
      callback(rules[0]);
    } else {
      callback(null);
    }
  };

  /**
   * Max.
   *
   * @param {Array}           rules           - a
   * @param {FieldInspection} fieldInspection - a
   * @param {Function}        callback        - a
   */
  Rule.prototype.max = function max(rules, fieldInspection, callback) {
    // eslint-disable-next-line operator-assignment
    rules[1] = rules[1] >> 0;

    if (rules[1] === 0) {
      callback(new Error("Invalid parameter rule max, expect number above 0"));
      return;
    }

    if (fieldInspection.len > rules[1]) {
      callback(rules[0]);
    } else {
      callback(null);
    }
  };

  /**
   * Email.
   *
   * @param {Array}           rules           - a
   * @param {FieldInspection} fieldInspection - a
   * @param {Function}        callback        - a
   */
  Rule.prototype.email = function email(rules, fieldInspection, callback) {
    var posChar = fieldInspection.val.indexOf("@");

    if (posChar < 1 || posChar === fieldInspection.len - 1) {
      callback(rules[0]);
    } else {
      callback(null);
    }
  };

  /**
   * Equal Field.
   *
   * @param {Array}           rules           - a
   * @param {FieldInspection} fieldInspection - a
   * @param {Function}        callback        - a
   */
  // eslint-disable-next-line camelcase
  Rule.prototype.equal_field = function equal_field(rules, fieldInspection, callback) {
    var elem = document.getElementById(rules[1]);

    if (!elem) {
      callback(new Error("Invalid parameter rule equal_field, DOM element " + rules[1] + " not found"));
      return;
    }

    // eslint-disable-next-line no-negated-condition
    if (fieldInspection.val !== elem.value.trim()) {
      callback(rules[0]);
    } else {
      callback(null);
    }
  };

  /**
   * Aria Invalid.
   *
   * @param {Array}           rules           - a
   * @param {FieldInspection} fieldInspection - a
   * @param {Function}        callback        - a
   */
  // eslint-disable-next-line camelcase
  Rule.prototype.aria_invalid = function aria_invalid(rules, fieldInspection, callback) {
    if (fieldInspection.elemObj.getAttribute("aria-invalid") === "true") {
      callback(rules[0]);
    } else {
      callback(null);
    }
  };

  /**
   * Callback.
   *
   * @param {Array}           rules            - a
   * @param {FieldInspection} fieldInspection  - a
   * @param {Function}        callbackFunction - a
   */
  Rule.prototype.callback = function callback(rules, fieldInspection, callbackFunction) {
    var fn = null;
    var args = [];
    var parts = [];
    var idxParts = 0;
    var lenParts = 0;

    if (!rules[1]) {
      callbackFunction(new Error("Invalid parameter rule callback, callback " + rules[1] + " not found"));
      return;
    }

    fn = getFunction(rules[1]);
    if (!fn) {
      callbackFunction(new Error("Invalid parameter rule callback, callback " + rules[1] + " not found"));
      return;
    }

    args = [
    fieldInspection.elemObj,
    function cb(success) {
      if (success === true) {
        callbackFunction(null);
      } else {
        callbackFunction("callback");
      }
    }];


    if (rules[2]) {
      parts = rules[2].split(",");
      for (lenParts = parts.length; idxParts < lenParts; ++idxParts) {
        args.push(parts[idxParts]);
      }
    }

    // eslint-disable-next-line no-unused-expressions,prefer-spread
    !fn.apply(null, args);
  };

  /**
   * Regex.
   *
   * @param {Array}           rules           - a
   * @param {FieldInspection} fieldInspection - a
   * @param {Function}        callback        - a
   */
  Rule.prototype.regex = function regex(rules, fieldInspection, callback) {
    var pattern = rules.slice(1).join(":");

    // eslint-disable-next-line no-negated-condition
    if (!new RegExp(pattern).exec(fieldInspection.elemObj.value)) {
      callback(rules[0]);
    } else {
      callback(null);
    }
  };

  /**
   * Checked.
   *
   * @param {Array}           rules           - a
   * @param {FieldInspection} fieldInspection - a
   * @param {Function}        callback        - a
   */
  Rule.prototype.checked = function checked(rules, fieldInspection, callback) {
    var name = "";
    var radios = [];
    var isOneRadioChecked = false;
    var idxRadio = 0;
    var lenRadio = 0;

    if (fieldInspection.elemObj.getAttribute("type") === "radio") {
      name = fieldInspection.elemObj.getAttribute("name");
      if (!name || name.length < 1) {
        callback(new Error("Attribute name is missing for " + fieldInspection.elemObj.getAttribute("id")));
        return;
      }

      radios = document.getElementsByName(name);
      isOneRadioChecked = false;
      for (lenRadio = radios.length; idxRadio < lenRadio; ++idxRadio) {
        if (radios[idxRadio].checked) {
          isOneRadioChecked = true;
        }
      }

      if (isOneRadioChecked) {
        callback(null);
      } else {
        callback(rules[0]);
      }
    } else {
      // eslint-disable-next-line no-negated-condition,no-lonely-if
      if (!fieldInspection.elemObj.checked) {
        callback(rules[0]);
      } else {
        callback(null);
      }
    }
  };


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
    for (; idxErrors < max; ++idxErrors) {
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
    var inputType = "";

    /** @type {boolean} */
    this.canSubmit = true;

    /** @type {FormHelper} */
    this.formHelper = new FormHelper();

    /** @type {object[]} */
    this.listErrors = [];

    /** @type {object} */
    this.currentCallbacks = {};

    formElement.addEventListener("submit", this.onSubmit.bind(this), { passive: false });

    /* istanbul ignore next */
    // eslint-disable-next-line no-constant-condition
    for (; idxNodes < maxNodes; ++idxNodes) {
      inputType = formElement[idxNodes].getAttribute("type");
      if (inputType === "checkbox" || inputType === "radio" || inputType === "file") {
        formElement[idxNodes].addEventListener("change", this.onChange.bind(this), { passive: false });
      } else {
        formElement[idxNodes].addEventListener("blur", this.onChange.bind(this), { passive: false });
      }
    }
  }

  /**
   * Update input file label on change.
   *
   * @param {HTMLInputElement} elemObj - HTML Input Element Object.
   * @returns {undefined}
   */
  function updateFakeFileLabel(elemObj) {
    /** @type {string} */
    var text = "";

    /** @type {string[]} */
    var filenameParts = [];

    /** @type {number} */
    var idxFiles = 0;

    /** @type {number} */
    var maxFiles = 0;

    /** @type {number} */
    var idxChilds = 0;

    /** @type {number} */
    var maxChilds = 0;

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
   * @returns {Error|undefined}
   */
  Form.prototype.onSubmit = function onSubmit(event) {
    var key = null;

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
        this.currentIdxNodes += 1;
        this.checkFormFieldsState(callback);
      }.bind(this));
    } else {
      callback();
    }
  };

  /**
   * Check Field State.
   *
   * @param {HTMLElement} elemObj       - callback
   * @param {boolean}     isSubmitEvent - callback
   * @param {string|null} now           - callback
   * @param {Function}    callback      - callback
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
      if (now !== null && this.currentCallbacks[currentID] && this.currentCallbacks[currentID] !== now) {
        return;
      }

      errorMessage = this.setFieldState(error, elemObj);

      if (isSubmitEvent && error !== null) {
        this.hasError = true;
        this.listErrors.push({
          id: currentID,
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
    /** @type {string} */
    var generalErrorTitle = "";

    /** @type {string[]} */
    var speak = [];

    /** @type {number} */
    var idx = 0;

    /** @type {number} */
    var max = this.listErrors.length;

    /** @type {string} */
    var speakIntro = "";

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
    /** @type {Function} */
    var fn = null;

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
    }.bind(this)]
    );

    return true;
  };

  /**
   * Show Confirm.
   *
   * @returns {boolean}
   */
  Form.prototype.showConfirm = function showConfirm() {
    /** @type {HTMLElement} */
    var popinConfirmQuestion = null;

    /** @type {HTMLElement} */
    var popinConfirmContent = null;

    /** @type {HTMLElement} */
    var oldBtnYes = null;

    /** @type {HTMLElement} */
    var oldBtnNo = null;

    /** @type {HTMLElement} */
    var btnYes = null;

    /** @type {HTMLElement} */
    var btnNo = null;

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
   * ConfirmYes.
   *
   * @returns {undefined}
   */
  Form.prototype.confirmYes = function confirmYes() {
    this.form.submit();
  };

  /**
   * ConfirmYes.
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

})();