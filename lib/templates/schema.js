Schema = {};
SimpleSchema.debug = true;
SimpleSchema.messages({
    "passwordMismatch": "Passwords do not match",
    "notUniqueUsername": "Username already exists",
    "notUniqueEmail": "Email already exists"
});
var schema = {
    emails: {
        type: [Object]
    },
    'emails.$.address': {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "E-mail address",
        unique: true,
        custom: function () {
            if (Meteor.isClient) {
                var userId = Router.current().getParams().userId;
                if (userId)
                    var currentEmail = Meteor.users.findOne({_id: userId}, {
                        fields: {
                            createdAt: false,
                            profile: false,
                            services: false,
                            username: false
                        }
                    }).emails[0].address;
            }
            if (currentEmail != this.value || !currentEmail) {
                if (Meteor.isClient && this.isSet) {
                    Meteor.call("checkEmailExisting", this.value, function (error, result) {
                        if (result === true) {
                            Meteor.users.simpleSchema().namedContext("createUserForm").addInvalidKeys([{
                                name: 'emails.0.address',
                                type: 'notUniqueEmail'
                            }]);
                        }
                    });
                }
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
            if (Meteor.isClient) {
                var userId = Router.current().getParams().userId;
                if (userId)
                    var currentUsername = Meteor.users.findOne({_id: userId}, {
                        fields: {
                            emails: false,
                            profile: false,
                            createdAt: false,
                            services: false
                        }
                    }).username;
            }
            if (currentUsername != this.value || !currentUsername) {
                if (Meteor.isClient && this.isSet) {
                    Meteor.call("checkUsernameExisting", this.value, function (error, result) {
                        if (result === true) {
                            Meteor.users.simpleSchema().namedContext("createUserForm").addInvalidKeys([{
                                name: 'username',
                                type: 'notUniqueUsername'
                            }]);
                        }
                    });
                }
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
    'profile.activated': {
        type: Boolean,
        label: "User status",
        defaultValue: true
    },
    'profile.fields': {
        type: [Object],
        optional: true,
        maxCount: 20
    },
    'profile.fields.$.key': {
        type: String,
        optional: true,
        max: 200,
        label: "Key Name"
    },
    'profile.fields.$.value': {
        type: String,
        optional: true,
        max: 200,
        label: "Value Name"
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
};

if(GroupManager.schemaGroups)
    _.merge(schema, GroupManager.schemaGroups);


Schema.user = new SimpleSchema(schema);
Meteor.users.attachSchema(Schema.user);