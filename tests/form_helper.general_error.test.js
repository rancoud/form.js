describe("form_helper - GeneralError", function(){
    beforeEach(function() {
        document.body.innerHTML = ``;
        require("../src/form");
    });

    // region removeGeneralError
    it("should return error 'Invalid argument elemID' for removeGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        err = formHelper.removeGeneralError(1);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get number");

        err = formHelper.removeGeneralError(true);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get boolean");

        err = formHelper.removeGeneralError(false);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get boolean");

        err = formHelper.removeGeneralError([]);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get object");

        err = formHelper.removeGeneralError({});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get object");

        err = formHelper.removeGeneralError(NaN);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get number");

        err = formHelper.removeGeneralError(undefined);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get undefined");

        err = formHelper.removeGeneralError(null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get object");

        err = formHelper.removeGeneralError(() => {});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get function");

        done();
    });

    it("should return error 'DOM element not found' for removeGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        err = formHelper.removeGeneralError("azerty");
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("DOM element azerty not found");

        done();
    });

    it("should work for removeGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `<form id="form-action"></form>`;

        err = formHelper.removeGeneralError("form-action");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`<form id="form-action"></form>`);

        err = formHelper.removeGeneralError("form-action");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`<form id="form-action"></form>`);

        document.body.innerHTML = `<div role="alert" class="block__info block__info--error" id="form-action-error"><h4 class="block__title block__title--small">There are 1 error in this form</h4><ul class="block__list"><li class="block__list-item"><a class="block__list-link" href="#a">b</a></li></ul></div><form id="form-action"></form>`;

        err = formHelper.removeGeneralError("form-action");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`<form id="form-action"></form>`);

        err = formHelper.removeGeneralError("form-action");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`<form id="form-action"></form>`);

        done();
    });
    // endregion

    // region setGeneralError
    it("should return error 'Invalid argument elemID' for setGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        err = formHelper.setGeneralError(1, null, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get number");

        err = formHelper.setGeneralError(true, null, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get boolean");

        err = formHelper.setGeneralError(false, null, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get boolean");

        err = formHelper.setGeneralError([], null, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get object");

        err = formHelper.setGeneralError({}, null, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get object");

        err = formHelper.setGeneralError(NaN, null, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get number");

        err = formHelper.setGeneralError(undefined, null, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get undefined");

        err = formHelper.setGeneralError(null, null, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get object");

        err = formHelper.setGeneralError(() => {}, null, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get function");

        done();
    });

    it("should return error 'Invalid argument title' for setGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `<div id="general-feedback"></div>`;

        err = formHelper.setGeneralError("general-feedback", 1, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument title, expect string, get number");

        err = formHelper.setGeneralError("general-feedback", true, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument title, expect string, get boolean");

        err = formHelper.setGeneralError("general-feedback", false, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument title, expect string, get boolean");

        err = formHelper.setGeneralError("general-feedback", [], null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument title, expect string, get object");

        err = formHelper.setGeneralError("general-feedback", {}, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument title, expect string, get object");

        err = formHelper.setGeneralError("general-feedback", NaN, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument title, expect string, get number");

        err = formHelper.setGeneralError("general-feedback", undefined, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument title, expect string, get undefined");

        err = formHelper.setGeneralError("general-feedback", null, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument title, expect string, get object");

        err = formHelper.setGeneralError("general-feedback", () => {}, null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument title, expect string, get function");

        done();
    });

    it("should return error 'Argument title is empty' for setGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `<div id="general-feedback"></div>`;

        err = formHelper.setGeneralError("general-feedback", "", null);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Argument title is empty");

        done();
    });

    it("should return error 'Invalid argument listErrors' for setGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `<div id="general-feedback"></div>`;

        err = formHelper.setGeneralError("general-feedback", "title", 1);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument listErrors, expect Array, get number");

        err = formHelper.setGeneralError("general-feedback", "title", true);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument listErrors, expect Array, get boolean");

        err = formHelper.setGeneralError("general-feedback", "title", false);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument listErrors, expect Array, get boolean");

        err = formHelper.setGeneralError("general-feedback", "title", "");
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument listErrors, expect Array, get string");

        err = formHelper.setGeneralError("general-feedback", "title", {});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument listErrors, expect Array, get object");

        err = formHelper.setGeneralError("general-feedback", "title", NaN);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument listErrors, expect Array, get number");

        err = formHelper.setGeneralError("general-feedback", "title", undefined);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument listErrors, expect Array, get undefined");

        err = formHelper.setGeneralError("general-feedback", "title", null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument listErrors, expect Array, get object");

        err = formHelper.setGeneralError("general-feedback", "title", () => {});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument listErrors, expect Array, get function");

        err = formHelper.setGeneralError("general-feedback", "title", 1);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument listErrors, expect Array, get number");

        done();
    });

    it("should return error 'Argument listErrors is empty' for setGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `<div id="general-feedback"></div>`;

        err = formHelper.setGeneralError("general-feedback", "title", []);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Argument listErrors is empty");

        done();
    });

    it("should return error 'Invalid argument listErrors[0]' for setGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;
        let listErrors;

        document.body.innerHTML = `<div id="general-feedback"></div>`;

        listErrors = [null];
        err = formHelper.setGeneralError("general-feedback", "There are 1 error in this form", listErrors);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid argument listErrors[0], expect Object");

        listErrors = [[]];
        err = formHelper.setGeneralError("general-feedback", "There are 1 error in this form", listErrors);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid argument listErrors[0].id, expect string");

        listErrors = [{}];
        err = formHelper.setGeneralError("general-feedback", "There are 1 error in this form", listErrors);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid argument listErrors[0].id, expect string");

        listErrors = [{"id": 1}];
        err = formHelper.setGeneralError("general-feedback", "There are 1 error in this form", listErrors);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid argument listErrors[0].id, expect string");

        listErrors = [{"id": "1"}];
        err = formHelper.setGeneralError("general-feedback", "There are 1 error in this form", listErrors);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid argument listErrors[0].message, expect string");

        listErrors = [{"id": ""}];
        err = formHelper.setGeneralError("general-feedback", "There are 1 error in this form", listErrors);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid argument listErrors[0].id is empty");

        listErrors = [{"id": "1", "message": 1}];
        err = formHelper.setGeneralError("general-feedback", "There are 1 error in this form", listErrors);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid argument listErrors[0].message, expect string");

        listErrors = [{"id": "1", "message": ""}];
        err = formHelper.setGeneralError("general-feedback", "There are 1 error in this form", listErrors);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid argument listErrors[0].message is empty");

        listErrors = [{"id": "1", "message": "1", "more": 1}];
        err = formHelper.setGeneralError("general-feedback", "There are 1 error in this form", listErrors);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Invalid argument listErrors[0].more, expect string");

        done();
    });

    it("should return error 'DOM element not found' for setGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        err = formHelper.setGeneralError("azerty", "ytreza", [{"id": "a", "message": "a"}]);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("DOM element azerty not found");

        done();
    });

    it("should work for setGeneralError", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `<form id="form-action"></form>`;

        err = formHelper.setGeneralError("form-action", "There are 1 error in this form", [{"id": "a", "message": "b"}]);
        expect(err).toBeUndefined();

        expect(document.body.innerHTML).toBe(`<div role="alert" class="block__info block__info--error" id="form-action-error"><h4 class="block__title block__title--small">There are 1 error in this form</h4><ul class="block__list"><li class="block__list-item"><a class="block__list-link" href="#a">b</a></li></ul></div><form id="form-action"></form>`);

        err = formHelper.setGeneralError("form-action", "There are 1 error in this form", [{"id": "b", "message": "c"}]);
        expect(err).toBeUndefined();

        expect(document.body.innerHTML).toBe(`<div role="alert" class="block__info block__info--error" id="form-action-error"><h4 class="block__title block__title--small">There are 1 error in this form</h4><ul class="block__list"><li class="block__list-item"><a class="block__list-link" href="#b">c</a></li></ul></div><form id="form-action"></form>`);

        err = formHelper.setGeneralError("form-action", "There are 2 errors in this form", [{"id": "c", "message": "d"},{"id": "<img src=\"x\" onerror='alert(1)'>", "message": "<img src='x' onerror='alert(1)'>", "more": "<img src='x' onerror='alert(1)'>"}]);
        expect(err).toBeUndefined();

        expect(document.body.innerHTML).toBe(`<div role="alert" class="block__info block__info--error" id="form-action-error"><h4 class="block__title block__title--small">There are 2 errors in this form</h4><ul class="block__list"><li class="block__list-item"><a class="block__list-link" href="#c">d</a></li><li class="block__list-item"><a class="block__list-link" href="#<img src=&quot;x&quot; onerror='alert(1)'>">&lt;img src='x' onerror='alert(1)'&gt;</a><br>&lt;img src='x' onerror='alert(1)'&gt;</li></ul></div><form id="form-action"></form>`);

        done();
    });
    // endregion
});