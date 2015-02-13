Schema = {};
Schema.user = new SimpleSchema({
    fullname: {
        type: String,
        label: "Fullname",
        max: 80
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "E-mail address"
    },
    username: {
        type: String,
        label: "Username",
        max: 30
    }
});
SimpleSchema.messages({
    "passwordMismatch": "Passwords do not match"
});
Schema.passwordChange = new SimpleSchema({
    password: {
        type: String,
        label: "Enter a password",
        min: 8
    },
    confirmPassword: {
        type: String,
        label: "Enter the password again",
        min: 8,
        custom: function () {
            if (this.value !== this.field('password').value) {
                return "passwordMismatch";
            }
        }
    }
});