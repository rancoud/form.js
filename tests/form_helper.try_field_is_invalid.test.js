window.fnTrue = function fnTrue(elemObj, callback) {
    setTimeout(function() {
        callback(elemObj && elemObj.getAttribute('id') === 'form-input');
    },100);
};

window.fnTrueWithArg = function fnTrueWithArg(elemObj, callback, a) {
    setTimeout(function() {
        callback((elemObj && elemObj.getAttribute('id') === 'form-input') && a === "1");
    },100);
};

window.fnTrueWithTwoArgs = function fnTrueWithArg(elemObj, callback, a, b) {
    setTimeout(function() {
        callback((elemObj && elemObj.getAttribute('id') === 'form-input') && a === "1" && b === "5");
    },100);
};

window.MyNamespace = {};
window.MyNamespace.MyFunc = function MyFunc(elemObj, callback) {
    setTimeout(function() {
        window.fnTrue(elemObj, callback);
    },100);
};
window.fnSpecial = function fnTrueWithArg(elemObj, callback, a, b) {
    setTimeout(function() {
        callback((elemObj && elemObj.getAttribute('id') === 'form-input') && a === "spe" && b === "cial");
    },100);
};
window.fnFalse = function fnTrue(elemObj, callback) {
    setTimeout(function() {
        callback(false);
    },10);
};

describe("form_helper - tryFieldIsInvalid", function(){
    beforeEach(function() {
        document.body.innerHTML = ``;
        require("../src/rule");
        require("../src/helper");
        require("../src/form");
    });

    // region tryFieldIsInvalid
    it("should return error 'Invalid argument callback' for tryFieldIsInvalid", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        err = formHelper.tryFieldIsInvalid("", "", 1);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument callback, expect function, get number");

        err = formHelper.tryFieldIsInvalid("", "", true);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument callback, expect function, get boolean");

        err = formHelper.tryFieldIsInvalid("", "", false);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument callback, expect function, get boolean");

        err = formHelper.tryFieldIsInvalid("", "", []);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument callback, expect function, get object");

        err = formHelper.tryFieldIsInvalid("", "", {});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument callback, expect function, get object");

        err = formHelper.tryFieldIsInvalid("", "", NaN);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument callback, expect function, get number");

        err = formHelper.tryFieldIsInvalid("", "", undefined);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument callback, expect function, get undefined");

        err = formHelper.tryFieldIsInvalid("", "", null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument callback, expect function, get object");

        done();
    });

    it("should not return error 'Invalid argument callback' for tryFieldIsInvalid", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        err = formHelper.tryFieldIsInvalid("", "", () => {});
        expect(err).toBeUndefined();

        done();
    });

    it("should callback error 'Invalid argument elemID' for tryFieldIsInvalid", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        let callbacksLeft = 10;
        function callbackCalled(){
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        err = formHelper.tryFieldIsInvalid(1, null, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument elemID, expect string, get number");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid(true, null, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument elemID, expect string, get boolean");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid(false, null, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument elemID, expect string, get boolean");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid([], null, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument elemID, expect string, get object");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid({}, null, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument elemID, expect string, get object");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid(NaN, null, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument elemID, expect string, get number");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid(undefined, null, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument elemID, expect string, get undefined");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid(null, null, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument elemID, expect string, get object");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid(() => {}, null, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument elemID, expect string, get function");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        callbackCalled();
    });

    it("should callback error 'Invalid argument rulesText' for tryFieldIsInvalid", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        let callbacksLeft = 10;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text">`;

        err = formHelper.tryFieldIsInvalid("form-input", 1, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument rulesText, expect string, get number");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid("form-input", true, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument rulesText, expect string, get boolean");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid("form-input", false, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument rulesText, expect string, get boolean");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid("form-input", [], function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument rulesText, expect string, get object");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid("form-input", {}, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument rulesText, expect string, get object");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid("form-input", NaN, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument rulesText, expect string, get number");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid("form-input", undefined, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument rulesText, expect string, get undefined");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid("form-input", null, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument rulesText, expect string, get object");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        err = formHelper.tryFieldIsInvalid("form-input", () => {}, function(err) {
            expect(err).toBeInstanceOf(TypeError);
            expect(err.message).toBe("Invalid argument rulesText, expect string, get function");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        callbackCalled();
    });

    it("should callback error 'Invalid rule' for tryFieldIsInvalid", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        let callbacksLeft = 2;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="a">`;

        err = formHelper.tryFieldIsInvalid("form-input", "aze", function(err) {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe("Invalid rule aze");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        callbackCalled();
    });

    it("should callback error 'DOM element not found' for tryFieldIsInvalid", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        let callbacksLeft = 2;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        err = formHelper.tryFieldIsInvalid("azerty", "", function(err) {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe("DOM element azerty not found");
            callbackCalled();
        });
        expect(err).toBeUndefined();

        callbackCalled();
    });
    // endregion

    // region tryFieldIsInvalid -> Rule required
    it("should work for tryFieldIsInvalid and rule required - invalid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "required", function(ruleFailed) {
            expect(ruleFailed).toBe('required');
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule required - valid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="a">`;

        formHelper.tryFieldIsInvalid("form-input", "required", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });
    // endregion

    // region tryFieldIsInvalid -> Rule min
    it("should work for tryFieldIsInvalid and rule min - error", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 2;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "min", function(ruleFailed) {
            expect(ruleFailed).toBeInstanceOf(Error);
            expect(ruleFailed.message).toBe("Invalid parameter rule min, expect number above 0");
            callbackCalled();
        });

        formHelper.tryFieldIsInvalid("form-input", "min:aze", function(ruleFailed) {
            expect(ruleFailed).toBeInstanceOf(Error);
            expect(ruleFailed.message).toBe("Invalid parameter rule min, expect number above 0");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule min - invalid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="abc">`;

        formHelper.tryFieldIsInvalid("form-input", "min:4", function(ruleFailed) {
            expect(ruleFailed).toBe('min');
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule min - valid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 2;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="abc">`;

        formHelper.tryFieldIsInvalid("form-input", "min:2", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });

        formHelper.tryFieldIsInvalid("form-input", "min:3", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });
    // endregion

    // region tryFieldIsInvalid -> Rule max
    it("should work for tryFieldIsInvalid and rule max - error", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 2;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "max", function(ruleFailed) {
            expect(ruleFailed).toBeInstanceOf(Error);
            expect(ruleFailed.message).toBe("Invalid parameter rule max, expect number above 0");
            callbackCalled();
        });

        formHelper.tryFieldIsInvalid("form-input", "max:aze", function(ruleFailed) {
            expect(ruleFailed).toBeInstanceOf(Error);
            expect(ruleFailed.message).toBe("Invalid parameter rule max, expect number above 0");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule max - invalid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="abc">`;

        formHelper.tryFieldIsInvalid("form-input", "max:2", function(ruleFailed) {
            expect(ruleFailed).toBe("max");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule max - valid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 2;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="abc">`;

        formHelper.tryFieldIsInvalid("form-input", "max:3", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });


        formHelper.tryFieldIsInvalid("form-input", "max:4", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });
    // endregion

    // region tryFieldIsInvalid -> Rule email
    it("should work for tryFieldIsInvalid and rule email - invalid (empty)", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "email", function(ruleFailed) {
            expect(ruleFailed).toBe('email');
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule email - invalid (no @)", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="a">`;

        formHelper.tryFieldIsInvalid("form-input", "email", function(ruleFailed) {
            expect(ruleFailed).toBe('email');
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule email - invalid (end with @)", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="a@">`;

        formHelper.tryFieldIsInvalid("form-input", "email", function(ruleFailed) {
            expect(ruleFailed).toBe('email');
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule email - invalid (start with @)", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="@a">`;

        formHelper.tryFieldIsInvalid("form-input", "email", function(ruleFailed) {
            expect(ruleFailed).toBe('email');
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule email - valid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="a@a">`;

        formHelper.tryFieldIsInvalid("form-input", "email", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });
    // endregion

    // region tryFieldIsInvalid -> Rule equal_field
    it("should work for tryFieldIsInvalid and rule equal_field - error", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 2;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "equal_field", function(ruleFailed) {
            expect(ruleFailed).toBeInstanceOf(Error);
            expect(ruleFailed.message).toBe("Invalid parameter rule equal_field, DOM element undefined not found");
            callbackCalled();
        });

        formHelper.tryFieldIsInvalid("form-input", "equal_field:1", function(ruleFailed) {
            expect(ruleFailed).toBeInstanceOf(Error);
            expect(ruleFailed.message).toBe("Invalid parameter rule equal_field, DOM element 1 not found");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule equal_field - invalid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="a"><input id="a" type="text" value="b">`;

        formHelper.tryFieldIsInvalid("form-input", "equal_field:a", function(ruleFailed) {
            expect(ruleFailed).toBe('equal_field');
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule equal_field - valid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="a"><input id="a" type="text" value="a">`;

        formHelper.tryFieldIsInvalid("form-input", "equal_field:a", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule equal_field - valid (trim spaces)", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text" value="a"><input id="a" type="text" value="a    ">`;

        formHelper.tryFieldIsInvalid("form-input", "equal_field:a", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });
    // endregion

    // region tryFieldIsInvalid -> Rule callback
    it("should work for tryFieldIsInvalid and rule callback - error", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 3;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "callback", function(ruleFailed) {
            expect(ruleFailed).toBeInstanceOf(Error);
            expect(ruleFailed.message).toBe("Invalid parameter rule callback, callback undefined not found");
            callbackCalled();
        });

        formHelper.tryFieldIsInvalid("form-input", "callback:a", function(ruleFailed) {
            expect(ruleFailed).toBeInstanceOf(Error);
            expect(ruleFailed.message).toBe("Invalid parameter rule callback, callback a not found");
            callbackCalled();
        });

        formHelper.tryFieldIsInvalid("form-input", "callback:window.WrongNamespace.MyFunc:3", function(ruleFailed) {
            expect(ruleFailed).toBeInstanceOf(Error);
            expect(ruleFailed.message).toBe("Invalid parameter rule callback, callback window.WrongNamespace.MyFunc not found");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule callback - invalid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "callback:fnTrueWithArg:3", function(ruleFailed) {
            expect(ruleFailed).toBe("callback");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule callback - valid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 4;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "callback:fnTrue", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });

        formHelper.tryFieldIsInvalid("form-input", "callback:fnTrueWithArg:1", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });

        formHelper.tryFieldIsInvalid("form-input", "callback:window.MyNamespace.MyFunc:1", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });

        formHelper.tryFieldIsInvalid("form-input", "callback:fnTrueWithTwoArgs:1,5", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });
    // endregion

    // region tryFieldIsInvalid -> Rule aria_invalid
    it("should work for tryFieldIsInvalid and rule aria_invalid - invalid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input aria-invalid="true" id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "aria_invalid", function(ruleFailed) {
            expect(ruleFailed).toBe('aria_invalid');
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule aria_invalid - valid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input aria-invalid="false" id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "aria_invalid", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule aria_invalid - valid (no aria-invalid)", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input" type="text">`;

        formHelper.tryFieldIsInvalid("form-input", "aria_invalid", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });
    // endregion

    // region tryFieldIsInvalid -> Rule regex
    it("should work for tryFieldIsInvalid and rule regex - invalid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input aria-invalid="false" id="form-input" type="text" value="aze@aze">`;

        formHelper.tryFieldIsInvalid("form-input", "regex:^[a-zA-Z0-9._-]*$", function(ruleFailed) {
            expect(ruleFailed).toBe("regex");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule regex - valid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input aria-invalid="false" id="form-input" type="text" value="aze@aze">`;

        formHelper.tryFieldIsInvalid("form-input", "regex:^[a-zA-Z0-9._@-]*$", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule regex - valid (recompose regex when using ':')", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input aria-invalid="false" id="form-input" type="text" value="az:e@aze">`;

        formHelper.tryFieldIsInvalid("form-input", "regex:^[a-zA-Z0-9._:@-]*$", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });
    // endregion

    // region tryFieldIsInvalid -> Rule checked (checkbox)
    it("should work for tryFieldIsInvalid and rule checked (checkbox) - invalid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input aria-invalid="false" id="form-input-checkbox" type="checkbox">`;

        formHelper.tryFieldIsInvalid("form-input-checkbox", "checked", function(ruleFailed) {
            expect(ruleFailed).toBe("checked");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule checked (checkbox) - valid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input aria-invalid="false" id="form-input-checkbox" type="checkbox" checked>`;

        formHelper.tryFieldIsInvalid("form-input-checkbox", "checked", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });
    // endregion

    // region tryFieldIsInvalid -> Rule checked (radio)
    it("should work for tryFieldIsInvalid and rule checked (radio) - error", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input-radio-1" type="radio">`;

        formHelper.tryFieldIsInvalid("form-input-radio-1", "checked", function(ruleFailed) {
            expect(ruleFailed).toBeInstanceOf(Error);
            expect(ruleFailed.message).toBe("Attribute name is missing for form-input-radio-1");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule checked (radio) - invalid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input-radio-1" type="radio" name="form-input-radio">`;

        formHelper.tryFieldIsInvalid("form-input-radio-1", "checked", function(ruleFailed) {
            expect(ruleFailed).toBe("checked");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule checked (radio) - valid (one radio)", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input-radio-1" type="radio" name="form-input-radio" checked>`;

        formHelper.tryFieldIsInvalid("form-input-radio-1", "checked", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and rule checked (radio) - valid (two radio)", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input id="form-input-radio-1" type="radio" name="form-input-radio">
<input id="form-input-radio-2" type="radio" name="form-input-radio" checked>`;

        formHelper.tryFieldIsInvalid("form-input-radio-1", "checked", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });
    // endregion

    // region tryFieldIsInvalid -> combine rules
    it("should work for tryFieldIsInvalid and all rules - valid", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input aria-invalid="false" id="form-input" type="text" value="az@az.az">
<input aria-invalid="false" id="form-input-2" type="text" value="az@az.az">`;

        formHelper.tryFieldIsInvalid("form-input", "required|min:2|max:12|email|equal_field:form-input-2|aria_invalid|callback:fnSpecial:spe,cial|regex:^[a-zA-Z0-9._@-]*$", function(ruleFailed) {
            expect(ruleFailed).toBe(null);
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and all rules - invalid (one failed)", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 1;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input aria-invalid="false" id="form-input" type="text" value="azaz.az">
<input aria-invalid="false" id="form-input-2" type="text" value="azaz.az">`;

        formHelper.tryFieldIsInvalid("form-input", "required|min:2|max:12|email|equal_field:form-input-2|aria_invalid|callback:yolo|regex:^[a-zA-Z0-9._@-]*$", function(ruleFailed) {
            expect(ruleFailed).toBe("email");
            callbackCalled();
        });
    });

    it("should work for tryFieldIsInvalid and all rules - invalid (one failed inside callback)", function(done) {
        const formHelper = new window.FormHelper();

        let callbacksLeft = 2;
        function callbackCalled() {
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        document.body.innerHTML = `<input aria-invalid="false" id="form-input" type="text" value="azaz.az">
<input aria-invalid="false" id="form-input-2" type="text" value="azaz.az">`;

        formHelper.tryFieldIsInvalid("form-input", "required|callback:fnTrue|min:2|max:12|email|equal_field:form-input-2|aria_invalid|regex:^[a-zA-Z0-9._@-]*$", function(ruleFailed) {
            expect(ruleFailed).toBe("email");
            callbackCalled();
        });

        formHelper.tryFieldIsInvalid("form-input", "required|callback:fnTrue|callback:fnFalse|min:2|max:12|email|equal_field:form-input-2|aria_invalid|regex:^[a-zA-Z0-9._@-]*$", function(ruleFailed) {
            expect(ruleFailed).toBe("callback");
            callbackCalled();
        });
    });
    // endregion
});
