describe("form_helper", function() {
    beforeEach(function() {
        document.body.innerHTML = ``;
        require("../src/rule");
        require("../src/helper");
        require("../src/form");
    });

    it("should be defined", function(done) {
        expect(window.FormHelper).toBeDefined();

        done();
    });

    it("should work without error with empty dom", function(done) {
        let err = null;
        const formHelper = new window.FormHelper();

        err = formHelper.setFieldNeutral("azerty", "a");
        expect(err).toBeInstanceOf(Error);

        err = formHelper.setFieldValid("azerty");
        expect(err).toBeInstanceOf(Error);

        err = formHelper.setFieldInvalid("azerty", "error");
        expect(err).toBeInstanceOf(Error);

        err = formHelper.setFieldLoading("azerty");
        expect(err).toBeInstanceOf(Error);

        err = formHelper.removeGeneralError("azerty");
        expect(err).toBeInstanceOf(Error);

        err = formHelper.setGeneralError("azerty", ["infos"]);
        expect(err).toBeInstanceOf(Error);

        err = formHelper.tryFieldIsInvalid("azerty", "", function() {});
        expect(err).toBeUndefined();

        done();
    });
});
