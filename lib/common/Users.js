Schema.User = {
    emails: {
        type: [Object]
    },
    'emails.$.address': {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: function() {
            return __("emailAddress");
        },
        optional: false,
        custom: function() {
            if (Meteor.isClient) {
                    var userId = FlowRouter.getParam('userId');
                    if (userId)
                        var currentEmail = Meteor.users.findOne({
                            _id: userId
                        }, {
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
                    Meteor.call("checkEmailExisting", this.value, function(error, result) {
                        if (result === true) {
                            var invalidKeys = [{
                                name: 'emails.0.address',
                                type: 'notUniqueEmail'
                            }];
                            Meteor.users.simpleSchema().namedContext("createUserForm").addInvalidKeys(invalidKeys);
                            Meteor.users.simpleSchema().namedContext("editUserForm").addInvalidKeys(invalidKeys);
                        }
                    });
                }
            }
        }
    },
    'emails.$.verified': {
        type: Boolean,
        label: function() {
            return __("emailVerified");
        },
        defaultValue: false
    },
    username: {
        type: String,
        optional: true,
        label: function() {
            return __('username');
        },
        custom: function() {
            if (Meteor.isClient) {
                    var userId = FlowRouter.getParam('userId');
                    if (userId)
                        var currentUsername = Meteor.users.findOne({
                            _id: userId
                        }, {
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
                    Meteor.call("checkUsernameExisting", this.value, function(error, result) {
                        if (result === true) {
                            var invalidKeys = [{
                                name: 'username',
                                type: 'notUniqueUsername'
                            }];
                            Meteor.users.simpleSchema().namedContext("createUserForm").addInvalidKeys(invalidKeys);
                            Meteor.users.simpleSchema().namedContext("editUserForm").addInvalidKeys(invalidKeys);
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
        optional: true,
        label: function() {
            return __("fullname");
        },
        max: 80
    },
    roles: {
        type: [String],
        optional: true,
        label: function() {
            return __("roles");
        }
    },
    'profile.activated': {
        type: Boolean,
        label: function() {
            return __("user_status");
        },
        defaultValue: true
    },
    'profile.fields': {
        type: Object,
        optional: true,
        label: function() {
            return __("additionalFields");
        }
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

Meteor.users.attachSchema(Schema.User);
