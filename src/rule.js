/* global FieldInspection */
/**
 * Get function to use as callback.?????
 * To change with register callback to avoid dynamic injection.
 *
 * @param {string} fn - function in string to fetch.?????
 * @returns {(Function|undefined)}
 */
function getFunction(fn) {
    var scope = window;
    var fnParts = fn.split(".");
    var idxScopes = 0;
    var maxFnParts = fnParts.length;

    for (; idxScopes < maxFnParts - 1; ++idxScopes) {
        if (fnParts[idxScopes] === "window") {
            continue;
        }

        scope = scope[fnParts[idxScopes]];

        if (typeof scope === "undefined") {
            return undefined;
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
    /** @type {(HTMLElement|null)} */
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
    /** @type {(Function|undefined)} */
    var fn;
    /** @type {any[]} */
    var args;
    /** @type {string[]} */
    var parts;
    /** @type {number} */
    var idxParts = 0;
    /** @type {number} */
    var lenParts;

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
        }
    ];

    if (rules[2]) {
        parts = rules[2].split(",");
        for (lenParts = parts.length; idxParts < lenParts; ++idxParts) {
            args.push(parts[idxParts]);
        }
    }

    // eslint-disable-next-line no-unused-expressions
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
    /** @type {(string|null)} */
    var name;
    /** @type {HTMLElement[]} */
    var radios;
    /** @type {boolean} */
    var isOneRadioChecked;
    /** @type {number} */
    var idxRadio = 0;
    /** @type {number} */
    var lenRadio;

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

window.Rule = Rule; /* BUILD REMOVE LINE */
window.getFunction = getFunction; /* BUILD REMOVE LINE */
