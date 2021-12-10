describe("form_helper", function(){
    beforeEach(function() {
        document.body.innerHTML = ``;
        require("../src/form");
    });

    it("should be defined", function(done) {
        expect(window.FormHelper).toBeDefined();

        done();
    });

    it("should work without error with empty dom", function(done) {
        const formHelper = new window.FormHelper();

        formHelper.setFieldNeutral("azerty", "a");

        formHelper.setFieldValid("azerty");

        formHelper.setFieldInvalid("azerty", "error");

        formHelper.setFieldLoading("azerty");

        formHelper.removeGeneralError("azerty");

        formHelper.setGeneralError("azerty", ["infos"]);

        formHelper.tryFieldIsInvalid("azerty", "", function() {});

        done();
    });
});