var Collections = {};
SchemaPlain = {};
SimpleSchema.debug = true;
Schemas = {};

SchemaPlain.schema = {
    fields: {
        type: [Object],
        label: "User Schema",
        blackbox: true
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
        optional: false,
        unique: true,
        custom: function() {
            if (Meteor.isClient) {
                var userId = Router.current().getParams().userId;
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
        label: "Email address is verified",
        defaultValue: false
    },
    username: {
        type: String,
        label: function() {
            return __('username');
        },
        unique: true,
        custom: function() {
            if (Meteor.isClient) {
                var userId = Router.current().getParams().userId;
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
        label: function() {
            return __("fullname");
        },
        max: 80
    },
    'profile.admin': {
        type: Boolean,
        label: "Admin",
        defaultValue: false
        //custom: function(){
        //    if(Meteor.isServer){
        //        console.log(this);
        //
        //            console.log("###############noadmin##########");
        //            var invalidKeys = [{
        //                name: 'username',
        //                type: 'notUniqueUsername'
        //            }];
        //            Meteor.users.simpleSchema().namedContext("createUserForm").addInvalidKeys(invalidKeys);
        //            Meteor.users.simpleSchema().namedContext("editUserForm").addInvalidKeys(invalidKeys);
        //        }
        //    }
        //}
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

Schemas.schema = new SimpleSchema(SchemaPlain.schema);
Schemas.users = new SimpleSchema(SchemaPlain.user);


SchemaCol = Collections.SchemaCol = new Mongo.Collection('schema');

SchemaCol.attachSchema(Schemas.schema);
Collections.Users = Meteor.users;


Meteor.startup(function(){
    if(Meteor.isServer) {

        //if (typeof schema !== 'undefined') {
        //    _.each(schema.user, function (schemaObj) {
        //        console.log("calling merge");
        //        Meteor.call('flattenObject', schemaObj, function (err, res) {
        //            Meteor.call('mergeObjectInSchema', res);
        //        });
        //    });
        //} else {
        //    Meteor.users.attachSchema(Schemas.users);
        //}

        UserSchema.extendSchema();
    }
});

Meteor.users.deny({
    update: function (userId, docs, fields, modifier) {
        console.log(doc);
        //if(checkRights.checkUserRight(doc._id, ))
        return _.contains(fields, 'owner');
    },
    remove: function (userId, doc) {
        // can't remove locked documents
        return doc.locked;
    },
    fetch: ['locked'] // no need to fetch 'owner'
});
