Schema = {};
SimpleSchema.messages({
    "passwordMismatch": "Passwords do not match"
});
//SimpleSchema.messages({
//    "notUnique": "User already exists"
//});
Schema.user = new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "E-mail address"
    },
    username: {
        type: String,
        label: "Username",
        unique: true,
        custom: function () {
            if (Meteor.isClient && this.isSet) {
                Meteor.call("checkUsernameExisting", this.value, function (error, result) {
                    if (result === true) {
                        Session.set("userExists", true);
                    }else{
                        Session.set("userExists", false);
                    }
                });
            }
        }
    },
    admin: {
        type: Boolean,
        label: "Admin"
    },
    superAdmin: {
        type: Boolean,
        label: "Super Admin"
    },
    profile: {
        type: [Object]
    },
    'profile.$.fullname' : {
        type: String,
        label: "Fullname",
        max: 80
    }
});
Meteor.users.attachSchema(Schema.user);


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