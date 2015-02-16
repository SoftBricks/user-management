Schema = {};
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
                console.log("call method");
                Meteor.call("checkUsernameExisting", this.value, function (error, result) {
                    console.log(result);
                    if (result === true) {
                        Meteor.users.simpleSchema().namedContext("userForm").addInvalidKeys([{name: "username", type: "notUnique"}]);
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
Schema.user.namedContext("userForm");

Meteor.users.attachSchema(Schema.user);

SimpleSchema.messages({
    "passwordMismatch": "Passwords do not match",
    "notUnique": "User already exists"
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