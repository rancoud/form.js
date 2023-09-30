describe("form_helper - setFieldValid", function(){
    beforeEach(function() {
        document.body.innerHTML = ``;
        require("../src/rule");
        require("../src/helper");
        require("../src/form");
    });

    it("should return error 'Invalid argument elemID' for setFieldValid", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        err = formHelper.setFieldValid(1);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get number");

        err = formHelper.setFieldValid(true);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get boolean");

        err = formHelper.setFieldValid(false);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get boolean");

        err = formHelper.setFieldValid([]);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get object");

        err = formHelper.setFieldValid({});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get object");

        err = formHelper.setFieldValid(NaN);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get number");

        err = formHelper.setFieldValid(undefined);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get undefined");

        err = formHelper.setFieldValid(null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get object");

        err = formHelper.setFieldValid(() => {});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument elemID, expect string, get function");

        done();
    });

    it("should return error 'DOM element not found' for setFieldValid", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        err = formHelper.setFieldValid("azerty");
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("DOM element azerty not found");

        done();
    });

    it("should work for setFieldValid -> 0 container + 0 feedback + 0 fieldset (call twice for assuring it's okay)", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <input aria-invalid="true" aria-labelledby="form-login-label-user form-login-label-user-error" aria-required="true" autocomplete="username" class="form__input form__input--error" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    <label class="form__label form__label--error" for="form-login-input-user" id="form-login-label-user-error">Username is required</label>
</div>`;

        err = formHelper.setFieldValid("form-login-input-user");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    
</div>`);

        err = formHelper.setFieldValid("form-login-input-user");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    
</div>`);

        done();
    });

    it("should work for setFieldValid -> 1 container + 0 feedback + 0 fieldset (call twice for assuring it's okay)", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <div class="form__container form__container--error">
        <input aria-invalid="true" aria-labelledby="form-login-label-user form-login-label-user-error" aria-required="true" autocomplete="username" class="form__input form__input--error" data-form-error-required="Username is required" data-form-has-container="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    </div>
    <label class="form__label form__label--error" for="form-login-input-user" id="form-login-label-user-error">Username is required</label>
</div>`;

        err = formHelper.setFieldValid("form-login-input-user");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <div class="form__container form__container--success">
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-has-container="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    </div>
    
</div>`);

        err = formHelper.setFieldValid("form-login-input-user");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <div class="form__container form__container--success">
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-has-container="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    </div>
    
</div>`);

        done();
    });

    it("should work for setFieldValid -> 0 container + 1 feedback + 0 fieldset (call twice for assuring it's okay)", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <input aria-invalid="true" aria-labelledby="form-login-label-user form-login-label-user-error" aria-required="true" autocomplete="username" class="form__input form__input--error" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text"><label class="form__label form__label--error" for="form-login-input-user" id="form-login-label-user-error">Username is required</label>
    <span class="form__feedback form__feedback--error"></span>
</div>`;

        err = formHelper.setFieldValid("form-login-input-user");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    <span class="form__feedback form__feedback--success"></span>
</div>`);

        err = formHelper.setFieldValid("form-login-input-user");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    <span class="form__feedback form__feedback--success"></span>
</div>`);

        done();
    });

    it("should work for setFieldValid -> 1 container + 1 feedback + 0 fieldset (call twice for assuring it's okay)", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <div class="form__container form__container--error">
        <input aria-invalid="true" aria-labelledby="form-login-label-user form-login-label-user-error" aria-required="true" autocomplete="username" class="form__input form__input--error" data-form-error-required="Username is required" data-form-has-container="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
        <span class="form__feedback form__feedback--error"></span>
    </div>
    <label class="form__label form__label--error" for="form-login-input-user" id="form-login-label-user-error">Username is required</label>
</div>`;

        err = formHelper.setFieldValid("form-login-input-user");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <div class="form__container form__container--success">
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-has-container="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
        <span class="form__feedback form__feedback--success"></span>
    </div>
    
</div>`);

        err = formHelper.setFieldValid("form-login-input-user");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<div class="form__element">
    <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
    <div class="form__container form__container--success">
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-has-container="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
        <span class="form__feedback form__feedback--success"></span>
    </div>
    
</div>`);

        done();
    });

    it("should work for setFieldValid -> 1 container + 2 feedbacks + 1 fieldset (call twice for assuring it's okay)", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `
<fieldset class="form__fieldset form__fieldset--error">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--error"></span>

    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <div class="form__container form__container--error">
            <input aria-invalid="true" aria-labelledby="form-login-label-user form-login-label-user-error" aria-required="true" autocomplete="username" class="form__input form__input--error" data-form-error-required="Username is required" data-form-has-container="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
            <span class="form__feedback form__feedback--error"></span>
        </div>
        <label class="form__label form__label--error" for="form-login-input-user" id="form-login-label-user-error">Username is required</label>
    </div>
</fieldset>`;

        err = formHelper.setFieldValid("form-login-input-user");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<fieldset class="form__fieldset form__fieldset--success">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--success"></span>

    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <div class="form__container form__container--success">
            <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-has-container="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
            <span class="form__feedback form__feedback--success"></span>
        </div>
        
    </div>
</fieldset>`);

        err = formHelper.setFieldValid("form-login-input-user");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<fieldset class="form__fieldset form__fieldset--success">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--success"></span>

    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <div class="form__container form__container--success">
            <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-has-container="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
            <span class="form__feedback form__feedback--success"></span>
        </div>
        
    </div>
</fieldset>`);

        done();
    });

    it("should work for setFieldValid -> 1 input checkbox (call twice for assuring it's okay)", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `
<fieldset class="form__fieldset form__fieldset--error">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--error"></span>

    <div class="form__element">
        <div class="form__container form__container--invisible form__container--error">
            <input aria-invalid="true" aria-labelledby="form-login-label-cgu form-login-label-cgu-error" class="form__input form__input--checkbox form__input--error" data-form-error-checked="CGU is required" data-form-has-container="" data-form-rules="checked" id="form-login-input-cgu" name="form-login-input-cgu" type="checkbox" value="remember">
            <label class="form__label form__label--checkbox" for="form-login-input-cgu" id="form-login-label-cgu">
                <span aria-hidden="true" class="form__fake-checkbox">
                    <svg class="form__fake-checkbox-svg" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path class="form__fake-checkbox-path" d="M461.6,109.6l-54.9-43.3c-1.7-1.4-3.8-2.4-6.2-2.4c-2.4,0-4.6,1-6.3,2.5L194.5,323c0,0-78.5-75.5-80.7-77.7  c-2.2-2.2-5.1-5.9-9.5-5.9c-4.4,0-6.4,3.1-8.7,5.4c-1.7,1.8-29.7,31.2-43.5,45.8c-0.8,0.9-1.3,1.4-2,2.1c-1.2,1.7-2,3.6-2,5.7  c0,2.2,0.8,4,2,5.7l2.8,2.6c0,0,139.3,133.8,141.6,136.1c2.3,2.3,5.1,5.2,9.2,5.2c4,0,7.3-4.3,9.2-6.2L462,121.8  c1.2-1.7,2-3.6,2-5.8C464,113.5,463,111.4,461.6,109.6z"></path>
                    </svg>
                </span>
                CGU
            </label>
            <span class="form__feedback form__feedback--error"></span>
        </div><label class="form__label form__label--error" for="form-login-input-cgu" id="form-login-label-cgu-error">azerty 2</label>
    </div>
</fieldset>`;

        err = formHelper.setFieldValid("form-login-input-cgu");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<fieldset class="form__fieldset form__fieldset--success">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--success"></span>

    <div class="form__element">
        <div class="form__container form__container--invisible form__container--success">
            <input aria-invalid="false" aria-labelledby="form-login-label-cgu" class="form__input form__input--checkbox form__input--success" data-form-error-checked="CGU is required" data-form-has-container="" data-form-rules="checked" id="form-login-input-cgu" name="form-login-input-cgu" type="checkbox" value="remember">
            <label class="form__label form__label--checkbox" for="form-login-input-cgu" id="form-login-label-cgu">
                <span aria-hidden="true" class="form__fake-checkbox">
                    <svg class="form__fake-checkbox-svg" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path class="form__fake-checkbox-path" d="M461.6,109.6l-54.9-43.3c-1.7-1.4-3.8-2.4-6.2-2.4c-2.4,0-4.6,1-6.3,2.5L194.5,323c0,0-78.5-75.5-80.7-77.7  c-2.2-2.2-5.1-5.9-9.5-5.9c-4.4,0-6.4,3.1-8.7,5.4c-1.7,1.8-29.7,31.2-43.5,45.8c-0.8,0.9-1.3,1.4-2,2.1c-1.2,1.7-2,3.6-2,5.7  c0,2.2,0.8,4,2,5.7l2.8,2.6c0,0,139.3,133.8,141.6,136.1c2.3,2.3,5.1,5.2,9.2,5.2c4,0,7.3-4.3,9.2-6.2L462,121.8  c1.2-1.7,2-3.6,2-5.8C464,113.5,463,111.4,461.6,109.6z"></path>
                    </svg>
                </span>
                CGU
            </label>
            <span class="form__feedback form__feedback--success"></span>
        </div>
    </div>
</fieldset>`);

        err = formHelper.setFieldValid("form-login-input-cgu");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<fieldset class="form__fieldset form__fieldset--success">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--success"></span>

    <div class="form__element">
        <div class="form__container form__container--invisible form__container--success">
            <input aria-invalid="false" aria-labelledby="form-login-label-cgu" class="form__input form__input--checkbox form__input--success" data-form-error-checked="CGU is required" data-form-has-container="" data-form-rules="checked" id="form-login-input-cgu" name="form-login-input-cgu" type="checkbox" value="remember">
            <label class="form__label form__label--checkbox" for="form-login-input-cgu" id="form-login-label-cgu">
                <span aria-hidden="true" class="form__fake-checkbox">
                    <svg class="form__fake-checkbox-svg" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path class="form__fake-checkbox-path" d="M461.6,109.6l-54.9-43.3c-1.7-1.4-3.8-2.4-6.2-2.4c-2.4,0-4.6,1-6.3,2.5L194.5,323c0,0-78.5-75.5-80.7-77.7  c-2.2-2.2-5.1-5.9-9.5-5.9c-4.4,0-6.4,3.1-8.7,5.4c-1.7,1.8-29.7,31.2-43.5,45.8c-0.8,0.9-1.3,1.4-2,2.1c-1.2,1.7-2,3.6-2,5.7  c0,2.2,0.8,4,2,5.7l2.8,2.6c0,0,139.3,133.8,141.6,136.1c2.3,2.3,5.1,5.2,9.2,5.2c4,0,7.3-4.3,9.2-6.2L462,121.8  c1.2-1.7,2-3.6,2-5.8C464,113.5,463,111.4,461.6,109.6z"></path>
                    </svg>
                </span>
                CGU
            </label>
            <span class="form__feedback form__feedback--success"></span>
        </div>
    </div>
</fieldset>`);

        done();
    });

    it("should work for setFieldValid -> 1 input file (call twice for assuring it's okay)", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `
<fieldset class="form__fieldset form__fieldset--error">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--error"></span>

    <div class="form__element">
        <label class="form__label" for="form-login-input-file" id="form-login-label-file">Input File</label>
        <div class="form__container form__container--file form__container--error">
            <input aria-invalid="true" aria-labelledby="form-login-label-file form-login-label-file-error" aria-required="true" class="form__input form__input--invisible form__input--file form__input--error" data-form-error-required="File is required" data-form-file-empty="Choose file" data-form-has-container="" data-form-rules="required" id="form-login-input-file" multiple="" name="form-login-input-file" type="file">
            <span class="form__fake-file-label">Choose file</span>
            <span class="form__feedback form__feedback--error"></span>
        </div><label class="form__label form__label--error" for="form-login-input-file" id="form-login-label-file-error">azerty 5</label>
    </div>
</fieldset>`;

        err = formHelper.setFieldValid("form-login-input-file");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<fieldset class="form__fieldset form__fieldset--success">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--success"></span>

    <div class="form__element">
        <label class="form__label" for="form-login-input-file" id="form-login-label-file">Input File</label>
        <div class="form__container form__container--file form__container--success">
            <input aria-invalid="false" aria-labelledby="form-login-label-file" aria-required="true" class="form__input form__input--invisible form__input--file form__input--success" data-form-error-required="File is required" data-form-file-empty="Choose file" data-form-has-container="" data-form-rules="required" id="form-login-input-file" multiple="" name="form-login-input-file" type="file">
            <span class="form__fake-file-label">Choose file</span>
            <span class="form__feedback form__feedback--success"></span>
        </div>
    </div>
</fieldset>`);

        err = formHelper.setFieldValid("form-login-input-file");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<fieldset class="form__fieldset form__fieldset--success">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--success"></span>

    <div class="form__element">
        <label class="form__label" for="form-login-input-file" id="form-login-label-file">Input File</label>
        <div class="form__container form__container--file form__container--success">
            <input aria-invalid="false" aria-labelledby="form-login-label-file" aria-required="true" class="form__input form__input--invisible form__input--file form__input--success" data-form-error-required="File is required" data-form-file-empty="Choose file" data-form-has-container="" data-form-rules="required" id="form-login-input-file" multiple="" name="form-login-input-file" type="file">
            <span class="form__fake-file-label">Choose file</span>
            <span class="form__feedback form__feedback--success"></span>
        </div>
    </div>
</fieldset>`);

        done();
    });

    it("should work for setFieldValid -> 2 inputs radio (call twice for assuring it's okay)", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `
<fieldset class="form__fieldset">
    <legend>My Form</legend>
    <span class="form__feedback"></span>

    <div class="form__element">
        <fieldset class="form__fieldset form__fieldset--error">
            <legend class="form__legend">Choose one</legend>
            <span class="form__feedback form__feedback--error"></span>

            <input aria-invalid="true" class="form__input form__input--radio form__input--error" data-form-error-checked="Twitch is required" data-form-rules="checked" id="form-login-input-twitch-yes" name="form-login-input-twitch" type="radio" value="yes">
            <label class="form__label form__label--radio" for="form-login-input-twitch-yes" id="form-login-label-twitch-yes">
                <span aria-hidden="true" class="form__fake-radio">
                    <svg class="form__fake-radio-svg" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <circle class="form__fake-radio-path" cx="50%" cy="50%" r="40%"></circle>
                    </svg>
                </span>
                Yes
            </label>

            <div class="form__container form__container--invisible form__container--error">
                <input aria-invalid="true" class="form__input form__input--radio form__input--error" data-form-error-checked="Twitch is required" data-form-has-container="" data-form-rules="checked" id="form-login-input-twitch-no" name="form-login-input-twitch" type="radio" value="no">
                <label class="form__label form__label--radio" for="form-login-input-twitch-no" id="form-login-label-twitch-no">
                    <span aria-hidden="true" class="form__fake-radio">
                        <svg class="form__fake-radio-svg" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <circle class="form__fake-radio-path" cx="50%" cy="50%" r="40%"></circle>
                        </svg>
                    </span>
                    No
                </label>
            </div>
        <label class="form__label form__label--error" id="form-login-label-twitch-error">azerty 4</label></fieldset>
    </div>
</fieldset>`;

        err = formHelper.setFieldValid("form-login-input-twitch-yes");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<fieldset class="form__fieldset">
    <legend>My Form</legend>
    <span class="form__feedback"></span>

    <div class="form__element">
        <fieldset class="form__fieldset form__fieldset--success">
            <legend class="form__legend">Choose one</legend>
            <span class="form__feedback form__feedback--success"></span>

            <input aria-invalid="false" class="form__input form__input--radio form__input--success" data-form-error-checked="Twitch is required" data-form-rules="checked" id="form-login-input-twitch-yes" name="form-login-input-twitch" type="radio" value="yes">
            <label class="form__label form__label--radio" for="form-login-input-twitch-yes" id="form-login-label-twitch-yes">
                <span aria-hidden="true" class="form__fake-radio">
                    <svg class="form__fake-radio-svg" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <circle class="form__fake-radio-path" cx="50%" cy="50%" r="40%"></circle>
                    </svg>
                </span>
                Yes
            </label>

            <div class="form__container form__container--invisible form__container--error">
                <input aria-invalid="true" class="form__input form__input--radio form__input--error" data-form-error-checked="Twitch is required" data-form-has-container="" data-form-rules="checked" id="form-login-input-twitch-no" name="form-login-input-twitch" type="radio" value="no">
                <label class="form__label form__label--radio" for="form-login-input-twitch-no" id="form-login-label-twitch-no">
                    <span aria-hidden="true" class="form__fake-radio">
                        <svg class="form__fake-radio-svg" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <circle class="form__fake-radio-path" cx="50%" cy="50%" r="40%"></circle>
                        </svg>
                    </span>
                    No
                </label>
            </div>
        </fieldset>
    </div>
</fieldset>`);

        err = formHelper.setFieldValid("form-login-input-twitch-no");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<fieldset class="form__fieldset">
    <legend>My Form</legend>
    <span class="form__feedback"></span>

    <div class="form__element">
        <fieldset class="form__fieldset form__fieldset--success">
            <legend class="form__legend">Choose one</legend>
            <span class="form__feedback form__feedback--success"></span>

            <input aria-invalid="false" class="form__input form__input--radio form__input--success" data-form-error-checked="Twitch is required" data-form-rules="checked" id="form-login-input-twitch-yes" name="form-login-input-twitch" type="radio" value="yes">
            <label class="form__label form__label--radio" for="form-login-input-twitch-yes" id="form-login-label-twitch-yes">
                <span aria-hidden="true" class="form__fake-radio">
                    <svg class="form__fake-radio-svg" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <circle class="form__fake-radio-path" cx="50%" cy="50%" r="40%"></circle>
                    </svg>
                </span>
                Yes
            </label>

            <div class="form__container form__container--invisible form__container--success">
                <input aria-invalid="false" class="form__input form__input--radio form__input--success" data-form-error-checked="Twitch is required" data-form-has-container="" data-form-rules="checked" id="form-login-input-twitch-no" name="form-login-input-twitch" type="radio" value="no">
                <label class="form__label form__label--radio" for="form-login-input-twitch-no" id="form-login-label-twitch-no">
                    <span aria-hidden="true" class="form__fake-radio">
                        <svg class="form__fake-radio-svg" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <circle class="form__fake-radio-path" cx="50%" cy="50%" r="40%"></circle>
                        </svg>
                    </span>
                    No
                </label>
            </div>
        </fieldset>
    </div>
</fieldset>`);

        done();
    });

    it("should work for setFieldValid -> fieldset recursion stopped after 10 tries", function(done) {
        const formHelper = new window.FormHelper();
        let err;

        document.body.innerHTML = `
<fieldset class="form__fieldset form__fieldset--error">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--error"></span>

    <div><div><div><div><div><div><div><div><div><div><div><div><div><div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-file" id="form-login-label-file">Input File</label>
        <div class="form__container form__container--file form__container--error">
            <input aria-invalid="true" aria-labelledby="form-login-label-file form-login-label-file-error" aria-required="true" class="form__input form__input--invisible form__input--file form__input--error" data-form-error-required="File is required" data-form-file-empty="Choose file" data-form-has-container="" data-form-rules="required" id="form-login-input-file" multiple="" name="form-login-input-file" type="file">
            <span class="form__fake-file-label">Choose file</span>
            <span class="form__feedback form__feedback--error"></span>
        </div><label class="form__label form__label--error" for="form-login-input-file" id="form-login-label-file-error">azerty 5</label>
    </div>
    </div></div></div></div></div></div></div></div></div></div></div></div></div></div>
</fieldset>`;

        err = formHelper.setFieldValid("form-login-input-file");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<fieldset class="form__fieldset form__fieldset--error">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--error"></span>

    <div><div><div><div><div><div><div><div><div><div><div><div><div><div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-file" id="form-login-label-file">Input File</label>
        <div class="form__container form__container--file form__container--success">
            <input aria-invalid="false" aria-labelledby="form-login-label-file" aria-required="true" class="form__input form__input--invisible form__input--file form__input--success" data-form-error-required="File is required" data-form-file-empty="Choose file" data-form-has-container="" data-form-rules="required" id="form-login-input-file" multiple="" name="form-login-input-file" type="file">
            <span class="form__fake-file-label">Choose file</span>
            <span class="form__feedback form__feedback--success"></span>
        </div>
    </div>
    </div></div></div></div></div></div></div></div></div></div></div></div></div></div>
</fieldset>`);

        err = formHelper.setFieldValid("form-login-input-file");
        expect(err).toBeUndefined();
        expect(document.body.innerHTML).toBe(`
<fieldset class="form__fieldset form__fieldset--error">
    <legend>My Form</legend>
    <span class="form__feedback form__feedback--error"></span>

    <div><div><div><div><div><div><div><div><div><div><div><div><div><div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-file" id="form-login-label-file">Input File</label>
        <div class="form__container form__container--file form__container--success">
            <input aria-invalid="false" aria-labelledby="form-login-label-file" aria-required="true" class="form__input form__input--invisible form__input--file form__input--success" data-form-error-required="File is required" data-form-file-empty="Choose file" data-form-has-container="" data-form-rules="required" id="form-login-input-file" multiple="" name="form-login-input-file" type="file">
            <span class="form__fake-file-label">Choose file</span>
            <span class="form__feedback form__feedback--success"></span>
        </div>
    </div>
    </div></div></div></div></div></div></div></div></div></div></div></div></div></div>
</fieldset>`);

        done();
    });
});
