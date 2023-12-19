jest.useFakeTimers();

window.wait10ms = function fnTrue(elemObj, callback) {
    var result = elemObj.getAttribute('value') === "aze";
    setTimeout(function() {
        callback(result);
    },10);
};

window.callbackConfirmTrue = function callbackConfirm(formObj, callback) {
    callback(true);
};

window.callbackConfirmFalse = function callbackConfirm(formObj, callback) {
    callback(false);
};

describe("form", function(){
    beforeEach(function() {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    </div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-pass" id="form-login-label-pass">Password</label>
        <a class="popin__link popin__link--right" href="#popin-forgot">Forgot your password?</a>
        <input aria-invalid="false" aria-labelledby="form-login-label-pass" aria-required="true" autocomplete="current-password" class="form__input" data-form-error-required="Password is required" data-form-rules="required" id="form-login-input-pass" name="form-login-input-pass" type="password">
    </div>
    <div class="form__element">
        <input class="form__input form__input--checkbox" id="form-login-checkbox-remember" type="checkbox" value="remember">
        <label class="form__label form__label--checkbox" for="form-login-checkbox-remember">Remember Me</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        require("../src/rule");
        require("../src/helper");
        require("../src/form");
    });

    it("should be defined", function(done) {
        expect(window.Form).toBeDefined();

        done();
    });

    it("should cancel previous callback onchange when new onchange is launched", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-callback="Username is required" data-form-rules="callback:wait10ms" id="form-login-input-user" name="form-login-input-user" type="text" value="">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": document.getElementById("form-login-input-user")
        };

        form.onChange(fakeEvent);

        // during onChange I decide to change input value to be correct, and I resend event
        jest.advanceTimersByTime(5);
        document.getElementById("form-login-input-user").setAttribute('value', 'aze');
        form.onChange(fakeEvent);

        // first callback cancelled
        jest.advanceTimersByTime(6);
        expect(document.body.innerHTML).toBe(`
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-callback="Username is required" data-form-rules="callback:wait10ms" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`);

        // second callback applied
        jest.advanceTimersByTime(5);
        expect(document.body.innerHTML).toBe(`
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-callback="Username is required" data-form-rules="callback:wait10ms" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`);

        jest.clearAllTimers();

        done();
    });

    it("should work when form is invalid", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    </div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-pass" id="form-login-label-pass">Password</label>
        <a class="popin__link popin__link--right" href="#popin-forgot">Forgot your password?</a>
        <input aria-invalid="false" aria-labelledby="form-login-label-pass" aria-required="true" autocomplete="current-password" class="form__input" data-form-error-required="Password is required" data-form-rules="required" id="form-login-input-pass" name="form-login-input-pass" type="password">
    </div>
    <div class="form__element">
        <input class="form__input form__input--checkbox" id="form-login-checkbox-remember" type="checkbox" value="remember">
        <label class="form__label form__label--checkbox" for="form-login-checkbox-remember">Remember Me</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));
        form.canFinallySubmit = function() {
            expect(this.hasError).toBe(true);
            expect(document.body.innerHTML).toBe(`
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="true" aria-labelledby="form-login-label-user form-login-label-user-error" aria-required="true" autocomplete="username" class="form__input form__input--error" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text"><label class="form__label form__label--error" for="form-login-input-user" id="form-login-label-user-error">Username is required</label>
    </div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-pass" id="form-login-label-pass">Password</label>
        <a class="popin__link popin__link--right" href="#popin-forgot">Forgot your password?</a>
        <input aria-invalid="true" aria-labelledby="form-login-label-pass form-login-label-pass-error" aria-required="true" autocomplete="current-password" class="form__input form__input--error" data-form-error-required="Password is required" data-form-rules="required" id="form-login-input-pass" name="form-login-input-pass" type="password"><label class="form__label form__label--error" for="form-login-input-pass" id="form-login-label-pass-error">Password is required</label>
    </div>
    <div class="form__element">
        <input class="form__input form__input--checkbox" id="form-login-checkbox-remember" type="checkbox" value="remember">
        <label class="form__label form__label--checkbox" for="form-login-checkbox-remember">Remember Me</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`);
            done();
        };

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": [
                document.getElementById("form-login-input-user"),
                document.getElementById("form-login-input-pass"),
                document.getElementById("form-login-checkbox-remember"),
            ],
        };

        form.onSubmit(fakeEvent);
    });

    it("should work when form is valid", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-pass" id="form-login-label-pass">Password</label>
        <a class="popin__link popin__link--right" href="#popin-forgot">Forgot your password?</a>
        <input aria-invalid="false" aria-labelledby="form-login-label-pass" aria-required="true" autocomplete="current-password" class="form__input" data-form-error-required="Password is required" data-form-rules="required" id="form-login-input-pass" name="form-login-input-pass" type="password" value="rty">
    </div>
    <div class="form__element">
        <input class="form__input form__input--checkbox" id="form-login-checkbox-remember" type="checkbox" value="remember">
        <label class="form__label form__label--checkbox" for="form-login-checkbox-remember">Remember Me</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));
        form.canFinallySubmit = function() {
            expect(this.hasError).toBe(false);
            expect(document.body.innerHTML).toBe(`
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-pass" id="form-login-label-pass">Password</label>
        <a class="popin__link popin__link--right" href="#popin-forgot">Forgot your password?</a>
        <input aria-invalid="false" aria-labelledby="form-login-label-pass" aria-required="true" autocomplete="current-password" class="form__input form__input--success" data-form-error-required="Password is required" data-form-rules="required" id="form-login-input-pass" name="form-login-input-pass" type="password" value="rty">
    </div>
    <div class="form__element">
        <input class="form__input form__input--checkbox" id="form-login-checkbox-remember" type="checkbox" value="remember">
        <label class="form__label form__label--checkbox" for="form-login-checkbox-remember">Remember Me</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`);
            done();
        };

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": [
                document.getElementById("form-login-input-user"),
                document.getElementById("form-login-input-pass"),
                document.getElementById("form-login-checkbox-remember"),
            ],
        };

        form.onSubmit(fakeEvent);
    });

    it("should not submit twice", function(done) {
        const form = new window.Form(document.getElementById('form-login'));
        form.canFinallySubmit = function() {
            done();
        };

        let err;

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": [
                document.getElementById("form-login-input-user"),
                document.getElementById("form-login-input-pass"),
                document.getElementById("form-login-checkbox-remember"),
            ],
        };

        err = form.onSubmit(fakeEvent);
        expect(err).toBeUndefined();
        err = form.onSubmit(fakeEvent);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Form is already in submit processing");
    });

    it("should show error label when form-rules in DOM is not filled correctly", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="min" id="form-login-input-user" name="form-login-input-user" type="text">
    </div>
</form>`;

        const form = new window.Form(document.getElementById('form-login'));
        form.canFinallySubmit = function() {
            expect(this.hasError).toBe(true);
            expect(document.body.innerHTML).toBe(`
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="true" aria-labelledby="form-login-label-user form-login-label-user-error" aria-required="true" autocomplete="username" class="form__input form__input--error" data-form-error-required="Username is required" data-form-rules="min" id="form-login-input-user" name="form-login-input-user" type="text"><label class="form__label form__label--error" for="form-login-input-user" id="form-login-label-user-error">Error: Invalid parameter rule min, expect number above 0</label>
    </div>
</form>`);
            done();
        };

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": [
                document.getElementById("form-login-input-user"),
            ],
        };

        form.onSubmit(fakeEvent);
    });

    it("should show generic error label when form-rules in DOM is not filled correctly - missing attribute", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    </div>
</form>`;

        const form = new window.Form(document.getElementById('form-login'));
        form.canFinallySubmit = function() {
            expect(this.hasError).toBe(true);
            expect(document.body.innerHTML).toBe(`
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="true" aria-labelledby="form-login-label-user form-login-label-user-error" aria-required="true" autocomplete="username" class="form__input form__input--error" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text"><label class="form__label form__label--error" for="form-login-input-user" id="form-login-label-user-error">Invalid field</label>
    </div>
</form>`);
            done();
        };

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": [
                document.getElementById("form-login-input-user"),
            ],
        };

        form.onSubmit(fakeEvent);
    });

    it("should show generic error label when form-rules in DOM is not filled correctly - empty attribute", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    </div>
</form>`;

        const form = new window.Form(document.getElementById('form-login'));
        form.canFinallySubmit = function() {
            expect(this.hasError).toBe(true);
            expect(document.body.innerHTML).toBe(`
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="true" aria-labelledby="form-login-label-user form-login-label-user-error" aria-required="true" autocomplete="username" class="form__input form__input--error" data-form-error-required="" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text"><label class="form__label form__label--error" for="form-login-input-user" id="form-login-label-user-error">Invalid field</label>
    </div>
</form>`);
            done();
        };

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": [
                document.getElementById("form-login-input-user"),
            ],
        };

        form.onSubmit(fakeEvent);
    });

    it("should work when one input is changed", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-pass" id="form-login-label-pass">Password</label>
        <a class="popin__link popin__link--right" href="#popin-forgot">Forgot your password?</a>
        <input aria-invalid="false" aria-labelledby="form-login-label-pass" aria-required="true" autocomplete="current-password" class="form__input" data-form-error-required="Password is required" data-form-rules="required" id="form-login-input-pass" name="form-login-input-pass" type="password" value="rty">
    </div>
    <div class="form__element">
        <input class="form__input form__input--checkbox" id="form-login-checkbox-remember" type="checkbox" value="remember">
        <label class="form__label form__label--checkbox" for="form-login-checkbox-remember">Remember Me</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": document.getElementById("form-login-input-user")
        };

        form.onChange(fakeEvent);

        setTimeout(function(){
            expect(document.body.innerHTML).toBe(`
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-pass" id="form-login-label-pass">Password</label>
        <a class="popin__link popin__link--right" href="#popin-forgot">Forgot your password?</a>
        <input aria-invalid="false" aria-labelledby="form-login-label-pass" aria-required="true" autocomplete="current-password" class="form__input" data-form-error-required="Password is required" data-form-rules="required" id="form-login-input-pass" name="form-login-input-pass" type="password" value="rty">
    </div>
    <div class="form__element">
        <input class="form__input form__input--checkbox" id="form-login-checkbox-remember" type="checkbox" value="remember">
        <label class="form__label form__label--checkbox" for="form-login-checkbox-remember">Remember Me</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`);
            done();
        }, 0);

        jest.advanceTimersByTime(1);
        jest.clearAllTimers();
    });

    it("should cancel all callbacks onchange when form submit", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-callback="Username is required" data-form-rules="callback:wait10ms" id="form-login-input-user" name="form-login-input-user" type="text" value="">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": document.getElementById("form-login-input-user")
        };

        form.onChange(fakeEvent);

        // during onChange I decide to change input value to be correct, and I resend event
        jest.advanceTimersByTime(5);
        document.getElementById("form-login-input-user").setAttribute('value', 'aze');

        // submit form
        form.canFinallySubmit = function() {
            expect(this.hasError).toBe(false);
            expect(document.body.innerHTML).toBe(`
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input form__input--success" data-form-error-callback="Username is required" data-form-rules="callback:wait10ms" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`);
            jest.clearAllTimers();
            done();
        };

        fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": [
                document.getElementById("form-login-input-user"),
            ],
        };
        form.onSubmit(fakeEvent);

        // new onChange is cancelled because form is in submit process
        fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": document.getElementById("form-login-input-user")
        };
        form.onChange(fakeEvent);

        // onChange callback cancelled because form submission
        jest.advanceTimersByTime(6);
        expect(document.body.innerHTML).toBe(`
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-callback="Username is required" data-form-rules="callback:wait10ms" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`);

        jest.advanceTimersByTime(10);
        jest.clearAllTimers();
    });

    it("should call confirm popin callback and return true", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" data-form-confirm-callback="callbackConfirmTrue" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        let callbacksLeft = 2;
        function callbackCalled(){
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        const form = new window.Form(document.getElementById('form-login'));

        var f = document.getElementById("form-login");
        f.submit = function() {callbackCalled();};
        form.setForm = function(form) { this.form = form; };
        form.setForm(f);

        var ret = form.callConfirmCallback();
        expect(ret).toBe(true);

        callbackCalled();
    });

    it("should call confirm popin callback and return false", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" data-form-confirm-callback="callbackConfirmFalse" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        let callbacksLeft = 2;
        function callbackCalled(){
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        const form = new window.Form(document.getElementById('form-login'));

        var f = document.getElementById("form-login");
        form.setForm = function(form) { this.form = form; };
        form.setForm(f);
        form.isSubmit  = function() {
            return this.canSubmit;
        };

        var ret = form.callConfirmCallback();
        expect(ret).toBe(true);

        callbackCalled();

        setTimeout(function() {
            expect(form.isSubmit()).toBe(true);
            callbackCalled();
        }, 10);

        jest.advanceTimersByTime(10);
        jest.clearAllTimers();
    });

    it("should not call confirm popin callback because not present in form attribute", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));

        var f = document.getElementById("form-login");
        form.setForm = function(form) { this.form = form; };
        form.setForm(f);

        var ret = form.callConfirmCallback();
        expect(ret).toBe(false);

        done();
    });

    it("should not call confirm popin callback because function not found", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" data-form-confirm-callback="undef" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));

        var f = document.getElementById("form-login");
        form.setForm = function(form) { this.form = form; };
        form.setForm(f);

        var ret = form.callConfirmCallback();
        expect(ret).toBe(false);

        done();
    });

    it("should not show confirm popin because not present in form attribute", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));

        var f = document.getElementById("form-login");
        form.setForm = function(form) { this.form = form; };
        form.setForm(f);

        var ret = form.showConfirm();
        expect(ret).toBe(false);

        done();
    });

    it("should not show confirm popin because popin title and content and not present in dom", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" data-form-confirm="" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));

        var f = document.getElementById("form-login");
        form.setForm = function(form) { this.form = form; };
        form.setForm(f);

        var ret = form.showConfirm();
        expect(ret).toBe(false);

        done();
    });

    it("should show confirm popin and return yes", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" data-form-confirm="" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>
<div id="popin-confirm"><div id="popin-confirm-h2"></div><div id="popin-confirm-div-content"></div></div>`;

        let callbacksLeft = 2;
        function callbackCalled(){
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        const form = new window.Form(document.getElementById('form-login'));

        var f = document.getElementById("form-login");
        f.submit = function() { callbackCalled(); };
        form.setForm = function(form) { this.form = form; };
        form.setForm(f);

        var ret = form.showConfirm();
        expect(ret).toBe(true);

        expect(window.location.hash).toBe('#popin-confirm');

        expect(document.body.innerHTML).toBe(`
<form action="#popin-login" data-form-confirm="" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>
<div id="popin-confirm"><div id="popin-confirm-h2">Do you confirm?</div><div id="popin-confirm-div-content"><button class="form__button form__button--small" id="popin-confirm-button-yes">Yes</button><button class="form__button form__button--secondary form__button--small" id="popin-confirm-button-no">No</button></div></div>`);

        document.getElementById('popin-confirm-button-yes').click();

        callbackCalled();
    });

    it("should show confirm popin and return no", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" data-form-confirm="" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>
<div id="popin-confirm"><div id="popin-confirm-h2"></div><div id="popin-confirm-div-content"></div></div>`;

        let callbacksLeft = 2;
        function callbackCalled(){
            callbacksLeft--;
            if (callbacksLeft === 0) {
                done();
            }
        }

        const form = new window.Form(document.getElementById('form-login'));

        var f = document.getElementById("form-login");
        form.setForm = function(form) { this.form = form; };
        form.setForm(f);
        form.isSubmit  = function() {
            return this.canSubmit;
        };

        var ret = form.showConfirm();
        expect(ret).toBe(true);

        expect(window.location.hash).toBe('#popin-confirm');

        expect(document.body.innerHTML).toBe(`
<form action="#popin-login" data-form-confirm="" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>
<div id="popin-confirm"><div id="popin-confirm-h2">Do you confirm?</div><div id="popin-confirm-div-content"><button class="form__button form__button--small" id="popin-confirm-button-yes">Yes</button><button class="form__button form__button--secondary form__button--small" id="popin-confirm-button-no">No</button></div></div>`);

        document.getElementById('popin-confirm-button-no').click();

        setTimeout(function() {
            expect(form.isSubmit()).toBe(true);
            callbackCalled();
        }, 10);

        jest.advanceTimersByTime(10);
        jest.clearAllTimers();

        callbackCalled();
    });

    it("should show confirm popin with custom texts from form attributes", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" data-form-confirm="" data-form-confirm-question="Are your sure?" data-form-confirm-yes="of course" data-form-confirm-no="no thanks" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>
<div id="popin-confirm"><div id="popin-confirm-h2"></div><div id="popin-confirm-div-content"></div></div>`;

        const form = new window.Form(document.getElementById('form-login'));

        var f = document.getElementById("form-login");
        form.setForm = function(form) { this.form = form; };
        form.setForm(f);

        var ret = form.showConfirm();
        expect(ret).toBe(true);

        expect(window.location.hash).toBe('#popin-confirm');

        expect(document.body.innerHTML).toBe(`
<form action="#popin-login" data-form-confirm="" data-form-confirm-question="Are your sure?" data-form-confirm-yes="of course" data-form-confirm-no="no thanks" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>
<div id="popin-confirm"><div id="popin-confirm-h2">Are your sure?</div><div id="popin-confirm-div-content"><button class="form__button form__button--small" id="popin-confirm-button-yes">of course</button><button class="form__button form__button--secondary form__button--small" id="popin-confirm-button-no">no thanks</button></div></div>`);

        done();
    });

    it("should show confirm popin and remove previous buttons", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" data-form-confirm="" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>
<div id="popin-confirm"><div id="popin-confirm-h2">Are your sure?</div><div id="popin-confirm-div-content"><button class="form__button form__button--small" id="popin-confirm-button-yes">of course</button><button class="form__button form__button--secondary form__button--small" id="popin-confirm-button-no">no thanks</button></div></div>`;

        const form = new window.Form(document.getElementById('form-login'));

        var f = document.getElementById("form-login");
        form.setForm = function(form) { this.form = form; };
        form.setForm(f);

        var ret = form.showConfirm();
        expect(ret).toBe(true);

        expect(window.location.hash).toBe('#popin-confirm');

        expect(document.body.innerHTML).toBe(`
<form action="#popin-login" data-form-confirm="" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text" value="aze">
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>
<div id="popin-confirm"><div id="popin-confirm-h2">Do you confirm?</div><div id="popin-confirm-div-content"><button class="form__button form__button--small" id="popin-confirm-button-yes">Yes</button><button class="form__button form__button--secondary form__button--small" id="popin-confirm-button-no">No</button></div></div>`);

        done();
    });

    it("should use updateFakeFileLabel when input file is used - input is empty", function(done) {
        document.body.innerHTML = `
<form action="#popin-ui" data-form-confirm="" id="form-ui" method="post">
    <div class="form__element">
        <label class="form__label" for="form-ui-input-file" id="form-ui-label-file">Input File</label>
        <div class="form__container form__container--file">
            <input aria-invalid="false" aria-labelledby="form-ui-label-file" aria-required="true" class="form__input form__input--invisible form__input--file" data-form-error-required="File is required" data-form-file-empty="Custom text file empty" data-form-has-container="" data-form-rules="required" id="form-ui-input-file" multiple="" name="form-ui-input-user" type="file">
            <span class="form__fake-file-label">Choose file</span>
            <span class="form__feedback"></span>
        </div>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-ui-submit" name="form-ui-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-ui'));

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": document.getElementById("form-ui-input-file"),
        };

        form.onChange(fakeEvent);

        setTimeout(function() {
            expect(document.body.innerHTML).toBe(`
<form action="#popin-ui" data-form-confirm="" id="form-ui" method="post">
    <div class="form__element">
        <label class="form__label" for="form-ui-input-file" id="form-ui-label-file">Input File</label>
        <div class="form__container form__container--file form__container--error">
            <input aria-invalid="true" aria-labelledby="form-ui-label-file form-ui-label-file-error" aria-required="true" class="form__input form__input--invisible form__input--file form__input--error" data-form-error-required="File is required" data-form-file-empty="Custom text file empty" data-form-has-container="" data-form-rules="required" id="form-ui-input-file" multiple="" name="form-ui-input-user" type="file">
            <span class="form__fake-file-label">Custom text file empty</span>
            <span class="form__feedback form__feedback--error"></span>
        </div><label class="form__label form__label--error" for="form-ui-input-file" id="form-ui-label-file-error">File is required</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-ui-submit" name="form-ui-submit" type="submit" value="Log in">
</form>`);
            done();
        }, 0);

        jest.advanceTimersByTime(1);
        jest.clearAllTimers();
    });

    it("should use updateFakeFileLabel when input file is used - input is filed", function(done) {
        document.body.innerHTML = `
<form action="#popin-ui" data-form-confirm="" id="form-ui" method="post">
    <div class="form__element">
        <label class="form__label" for="form-ui-input-file" id="form-ui-label-file">Input File</label>
        <div class="form__container form__container--file">
            <input aria-invalid="false" aria-labelledby="form-ui-label-file" aria-required="true" class="form__input form__input--invisible form__input--file" data-form-has-container="" id="form-ui-input-file" multiple="" name="form-ui-input-user" type="file">
            <span class="form__fake-file-label">Choose file</span>
            <span class="form__feedback"></span>
        </div>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-ui-submit" name="form-ui-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-ui'));

        var inputFile = document.getElementById("form-ui-input-file");
        var file = new File(['(⌐□_□)'], 'chucknorris.png', {
            type: 'image/png',
        });

        Object.defineProperty(inputFile, 'files', {
            get: jest.fn().mockImplementation(() => { return [file]; }),
            set: jest.fn().mockImplementation(() => {}),
        });

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": inputFile,
        };

        form.onChange(fakeEvent);

        setTimeout(function() {
            expect(document.body.innerHTML).toBe(`
<form action="#popin-ui" data-form-confirm="" id="form-ui" method="post">
    <div class="form__element">
        <label class="form__label" for="form-ui-input-file" id="form-ui-label-file">Input File</label>
        <div class="form__container form__container--file">
            <input aria-invalid="false" aria-labelledby="form-ui-label-file" aria-required="true" class="form__input form__input--invisible form__input--file" data-form-has-container="" id="form-ui-input-file" multiple="" name="form-ui-input-user" type="file">
            <span class="form__fake-file-label">chucknorris.png</span>
            <span class="form__feedback"></span>
        </div>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-ui-submit" name="form-ui-submit" type="submit" value="Log in">
</form>`);
            done();
        }, 0);

        jest.advanceTimersByTime(1);
        jest.clearAllTimers();
    });

    it("should use screenReaderSpeak when form is invalid", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    </div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-pass" id="form-login-label-pass">Password</label>
        <a class="popin__link popin__link--right" href="#popin-forgot">Forgot your password?</a>
        <input aria-invalid="false" aria-labelledby="form-login-label-pass" aria-required="true" autocomplete="current-password" class="form__input" data-form-error-required="Password is required" data-form-rules="required" id="form-login-input-pass" name="form-login-input-pass" type="password">
    </div>
    <div class="form__element">
        <input class="form__input form__input--checkbox" id="form-login-checkbox-remember" type="checkbox" value="remember">
        <label class="form__label form__label--checkbox" for="form-login-checkbox-remember">Remember Me</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": [
                document.getElementById("form-login-input-user"),
                document.getElementById("form-login-input-pass"),
                document.getElementById("form-login-checkbox-remember"),
            ],
        };

        form.canFinallySubmit = function() {
            this.form = document.getElementById("form-login");
            if (!this.hasError) {
                // eslint-disable-next-line jest/no-conditional-expect
                expect(false).toBe(true);
            } else {
                var generalErrorTitle = this.form.getAttribute('data-form-general-error');
                if (generalErrorTitle) {
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(false).toBe(true);
                    this.formHelper.setGeneralError(this.form.getAttribute('id'), generalErrorTitle, this.listErrors);
                } else {
                    var speak = [];
                    for (var i = 0; i < this.listErrors.length; i++) {
                        speak.push(this.listErrors[i].message);
                    }
                    var speakIntro = this.form.getAttribute('data-form-speak-error') || 'Form is invalid:';
                    var res = speakIntro + ' ' + speak.join(', ');
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(res).toBe(`Form is invalid: Username is required, Password is required`);
                }
                this.canSubmit = true;
            }

            done();
        };

        form.onSubmit(fakeEvent);
    });

    it("should set general error when form is invalid", function(done) {
        document.body.innerHTML = `
<form action="#popin-login" id="form-login" method="post" data-form-general-error="There is errors in form login">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="false" aria-labelledby="form-login-label-user" aria-required="true" autocomplete="username" class="form__input" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text">
    </div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-pass" id="form-login-label-pass">Password</label>
        <a class="popin__link popin__link--right" href="#popin-forgot">Forgot your password?</a>
        <input aria-invalid="false" aria-labelledby="form-login-label-pass" aria-required="true" autocomplete="current-password" class="form__input" data-form-error-required="Password is required" data-form-rules="required" id="form-login-input-pass" name="form-login-input-pass" type="password">
    </div>
    <div class="form__element">
        <input class="form__input form__input--checkbox" id="form-login-checkbox-remember" type="checkbox" value="remember">
        <label class="form__label form__label--checkbox" for="form-login-checkbox-remember">Remember Me</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`;

        const form = new window.Form(document.getElementById('form-login'));

        let fakeEvent = {
            "preventDefault": function() {},
            "currentTarget": [
                document.getElementById("form-login-input-user"),
                document.getElementById("form-login-input-pass"),
                document.getElementById("form-login-checkbox-remember"),
            ],
        };

        form.canFinallySubmit = function() {
            this.form = document.getElementById("form-login");
            if (!this.hasError) {
                // eslint-disable-next-line jest/no-conditional-expect
                expect(false).toBe(true);
            } else {
                var generalErrorTitle = this.form.getAttribute('data-form-general-error');
                if (generalErrorTitle) {
                    this.formHelper.setGeneralError(this.form.getAttribute('id'), generalErrorTitle, this.listErrors);
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(document.body.innerHTML).toBe(`
<div role="alert" class="block__info block__info--error" id="form-login-error"><h4 class="block__title block__title--small">There is errors in form login</h4><ul class="block__list"><li class="block__list-item"><a class="block__list-link" href="#form-login-input-user">Username is required</a></li><li class="block__list-item"><a class="block__list-link" href="#form-login-input-pass">Password is required</a></li></ul></div><form action="#popin-login" id="form-login" method="post" data-form-general-error="There is errors in form login">
    <div class="form__element">
        <label class="form__label" for="form-login-input-user" id="form-login-label-user">Username</label>
        <input aria-invalid="true" aria-labelledby="form-login-label-user form-login-label-user-error" aria-required="true" autocomplete="username" class="form__input form__input--error" data-form-error-required="Username is required" data-form-rules="required" id="form-login-input-user" name="form-login-input-user" type="text"><label class="form__label form__label--error" for="form-login-input-user" id="form-login-label-user-error">Username is required</label>
    </div>
    <div class="form__element">
        <label class="form__label" for="form-login-input-pass" id="form-login-label-pass">Password</label>
        <a class="popin__link popin__link--right" href="#popin-forgot">Forgot your password?</a>
        <input aria-invalid="true" aria-labelledby="form-login-label-pass form-login-label-pass-error" aria-required="true" autocomplete="current-password" class="form__input form__input--error" data-form-error-required="Password is required" data-form-rules="required" id="form-login-input-pass" name="form-login-input-pass" type="password"><label class="form__label form__label--error" for="form-login-input-pass" id="form-login-label-pass-error">Password is required</label>
    </div>
    <div class="form__element">
        <input class="form__input form__input--checkbox" id="form-login-checkbox-remember" type="checkbox" value="remember">
        <label class="form__label form__label--checkbox" for="form-login-checkbox-remember">Remember Me</label>
    </div>
    <input class="form__btn form__btn--large form__btn--primary" id="form-login-submit" name="form-login-submit" type="submit" value="Log in">
</form>`);
                } else {
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(false).toBe(true);
                    var speak = [];
                    for (var i = 0; i < this.listErrors.length; i++) {
                        speak.push(this.listErrors[i].message);
                    }
                    var speakIntro = this.form.getAttribute('data-form-speak-error') || 'Form is invalid:';
                    var res = speakIntro + ' ' + speak.join(', ');
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(res).toBe(`Form is invalid: Username is required, Password is required`);
                }
                this.canSubmit = true;
            }

            done();
        };

        form.onSubmit(fakeEvent);
    });
});
