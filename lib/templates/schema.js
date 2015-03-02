Schema = {};
SchemaPlain = {};
SimpleSchema.debug = true;


SchemaCol = new Mongo.Collection('schema');

SchemaPlain.schema = {
    user: {
        type: String,
        label: "User Schema"
    },
    identifier: {
        type: String,
        unique: true,
        index: true,
        label: "Identifier"
    }
};

SchemaPlain.user = {
    emails: {
        type: [Object]
    },
    'emails.$.address': {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: function() {
            return __("emailAddress");
        },
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
        label: function() {
            return __("fullname");
        },
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
        label: function() {
            return __("user_status");
        },
        defaultValue: true
    },
    'profile.fields': {
        type: [Object],
        optional: true,
        maxCount: 20,
        label: function() {
            return __("additionalFields");
        }
    },
    'profile.fields.$.key': {
        type: String,
        optional: true,
        max: 200,
        label: function() {
            return __("identifier");
        },
    },
    'profile.fields.$.value': {
        type: String,
        optional: true,
        max: 200,
        label: function() {
            return __("value");
        },
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


Meteor.startup(function(){
    Schema.schemaCol = new SimpleSchema(SchemaPlain.schema);
    SchemaCol.attachSchema(Schema.schemaCol);

    Schema.user = new SimpleSchema(SchemaPlain.user);

    var schemaUser = SchemaCol.findOne({identifier: 'user'});
    if(typeof schema !== 'undefined'){
        Meteor.users.attachSchema(JSON.parse(schemaUser.user));
    }else{
        Meteor.users.attachSchema(Schema.user);
    }


});

