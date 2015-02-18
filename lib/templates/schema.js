Schema = {};
SimpleSchema.debug = true;
SimpleSchema.messages({
    "passwordMismatch": "Passwords do not match",
    "notUniqueUsername": "Username already exists",
    "notUniqueEmail": "Email already exists"
});
Schema.user = new SimpleSchema({
    emails: {
      type: [Object]
    },
    'emails.$.address': {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "E-mail address",
        unique: true,
        custom: function () {
            if (Meteor.isClient && this.isSet) {
                Meteor.call("checkEmailExisting", this.value, function (error, result) {
                    if(result === true){
                        Meteor.users.simpleSchema().namedContext("createUserForm").addInvalidKeys([{name: 'emails.0.address', type: 'notUniqueEmail'}]);
                    }
                });
            }
        }
    },
    'emails.$.verified': {
        type: Boolean,
        label: "Email address is verified",
        defaultValue: false
    },
    username: {
        type: String,
        label: "Username",
        unique: true,
        custom: function () {
            if (Meteor.isClient && this.isSet) {
                Meteor.call("checkUsernameExisting", this.value, function (error, result) {
                    if(result === true){
                        Meteor.users.simpleSchema().namedContext("createUserForm").addInvalidKeys([{name: 'username', type: 'notUniqueUsername'}]);
                    }
                });
            }
        }
    },
    profile: {
        type: Object
    },
    'profile.fullname': {
        type: String,
        label: "Fullname",
        max: 80
    },
    'profile.admin': {
        type: Boolean,
        label: "Admin",
        defaultValue: false
    },
    'profile.superAdmin': {
        type: Boolean,
        label: "Super Admin",
        defaultValue: false
    },
    'profile.fields':{
        type: [Object],
        optional:true
    },
    createdAt: {
        type: Date,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    }
});
Meteor.users.attachSchema(Schema.user);