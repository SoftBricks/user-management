var flatten = Npm.require("flat");
if (Meteor.isServer) {

    /*
     * checks the user rights to be allowed to to do special stuff
     * e.g. removing users, promote them to admins...
     * @param String userId
     * @param String currentUserId
     * @return Boolean
     *      true = user is allowed to do the action
     *      error = user is not allowed to do the action
     */
    checkRights = {
        'checkUserRight': function (userId, currentUserId) {
            if (typeof userId !== 'undefined' && typeof currentUserId !== 'undefined' && currentUserId === userId)
                return true;

            if (typeof currentUserId !== 'undefined') {
                var admin = Meteor.users.findOne({_id: currentUserId}, {
                    _id: 0,
                    createdAt: 0,
                    emails: 0,
                    services: 0,
                    username: 0
                });
                if (admin) {
                    if (admin.profile && (admin.profile.superAdmin || admin.profile.admin))
                        return true;
                }
            }

            throw new Meteor.Error("checkUserRight", "You have no right to do this!!");

        },
        'makeAndRemoveAdmin': function (userId, currentUserId, userObject) {
            if(typeof userObject !== 'undefined')
                var userObject = Meteor.users.findOne({_id: currentUserId});
            if (typeof userObject !== 'undefined') {
                if (currentUserId == userId && userObject.profile.superAdmin == false && userObject.profile.admin == false) {
                    return false;
                }
                if ((userObject.profile.superAdmin == true || userObject.profile.admin == true) && currentUserId !== userId) {
                    return true;
                }
            }

            return false;
        }
    };


    /*
     * Generates a random password
     * @return String
     *      password with length 10
     */
    generatePassword = function () {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 10;
        var randomstring = '';
        var charCount = 0;
        var numCount = 0;

        for (var i = 0; i < string_length; i++) {
            if ((Math.floor(Math.random() * 2) === 0) && numCount < 3 || charCount >= 5) {
                var rnum = Math.floor(Math.random() * 10);
                randomstring += rnum;
                numCount += 1;
            } else {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
                charCount += 1;
            }
        }
        return randomstring;
    };

    Meteor.methods({
        /*
         * shares a asset with a group
         * @param String assetId
         * @param String groupId
         * @return Boolean
         *      true = share asset with group successfull
         *      error = share asset with group failed
         */
        shareAssetWithGroup: function (assetId, groupId) {
            if (assetId && groupId) {
                AssetFiles.update({
                    _id: assetId
                }, {
                    $addToSet: {sharedWithGroups: groupId}
                });
            } else {
                if (assetId === "")
                    throw new Meteor.error("asset", "Asset id was not specified!");
                if (groupId === "")
                    throw new Meteor.Error("asset", "Group id was not specified");
            }
        },
        /*
         * shares a folder with a group
         * @param String folderId
         * @param String groupId
         * @return Boolean
         *      true = share folder with group successfull
         *      error = share folder with group failed
         */
        shareFolderWithGroup: function (folderId, groupId) {
            if (folderId && groupId) {
                Folders.update({
                    _id: folderId
                }, {
                    $addToSet: {
                        sharedWithGroups: groupId
                    }
                });
            } else {
                if (folderId === "")
                    throw new Meteor.error("folder", "Folder id was not specified!");
                if (groupId === "")
                    throw new Meteor.Error("folder", "Group id was not specified");
            }
        },
        /*
         * creates a user
         * @param Object doc
         * @return Boolean
         *      true = create user successfull
         *      error = create user failed
         */
        createUserWithoutPassword: function (doc) {
            // Important server-side check for security and data integrity
            if (checkRights.checkUserRight("", Meteor.userId())) {
                var user = {
                    'username': doc.username,
                    'email': doc.emails[0].addresses,
                    'profile': doc.profile
                };
                user = Accounts.createUser(user);
                if (user) {
                    Accounts.sendEnrollmentEmail(user);
                    return true;
                }
                if (!user)
                    throw new Meteor.Error("user", "User has not been created");
            }
        },
        /*
         * removes a user
         * @param String userId
         * @return Boolean
         *      true = remove user successfull
         *      error = remove user failed
         */
        removeUser: function (userId) {
            if (userId !== Meteor.userId()) {
                if (checkRights.checkUserRight(userId, Meteor.userId())) {
                    if (userId) {
                        var userToRemove = Meteor.users.findOne({_id: userId}, {
                            _id: 0,
                            createdAt: 0,
                            emails: 0,
                            services: 0,
                            username: 0
                        });
                        if (userToRemove && userToRemove.profile.superAdmin === false) {

                            var success = Meteor.users.remove({
                                _id: userId
                            });
                            if (success.nRemoved === 1) {

                                var to = userToRemove.emails[0].address;
                                var from = Meteor.user().emails[0].address;
                                var subject = "Your account was removed";
                                var text = "Your admin has deleted your Account. Please contact him to get further information.";

                                check([to, from, subject, text], [String]);

                                // Let other method calls from the same client start running,
                                // without waiting for the email sending to complete.
                                this.unblock();

                                Email.send({
                                    to: to,
                                    from: from,
                                    subject: subject,
                                    text: text
                                });

                                //Run hooked functions
                                _.each(UserManagementTemplates.onRemoveUser, function (func) {
                                    func(userId);
                                });
                            }

                        } else {
                            throw new Meteor.Error("user", "superAdmin can not be removed!");
                        }
                    } else {
                        throw new Meteor.Error("user", "no user id specified");
                    }
                    return true;
                }
            } else {
                throw new Meteor.Error("user", "You are not allowed to delete yourself");
            }
        },
        /*
         * updates user information
         * @param Object doc
         * @return Boolean
         *      true = update user information successfull
         *      error = update user information failed
         */
        //updateUserInformation: function (doc, mod, documentId) {
        //    if (checkRights.checkUserRight(documentId, Meteor.userId())) {
        //        var update
        //        if(checkRights.makeAndRemoveAdmin(documentId,Meteor.userId(), Meteor.user()) === true){
        //            update = {
        //                $set: {
        //                    'emails.0.address': doc.emails[0].address,
        //                    username: doc.username,
        //                    'profile.fullname': doc.profile.fullname,
        //                    'profile.admin': doc.profile.admin,
        //                    'profile.activated': doc.profile.activated,
        //                    'profile.fields': doc.profile.fields
        //
        //                }
        //            }
        //        }else{
        //            var globalFields = UserSchema.getGlobalKeys();
        //            var profile = {};
        //            profile['fullname'] = doc.profile.fullname;
        //            profile['fields'] = doc.profile.fields;
        //            console.log(doc);
        //            _.each(globalFields, function(value){
        //                console.log(value);
        //                profile[value] = doc[value];
        //            });
        //
        //            profile['fullname'] = doc.profile.fullname;
        //            update = {
        //                $set: {
        //                    'emails.0.address': doc.emails[0].address,
        //                    username: doc.username,
        //                    profile: profile
        //                }
        //            };
        //            console.log(update);
        //        }
        //        var user = Meteor.users.update({
        //                _id: documentId
        //            }, update
        //        );
        //
        //        if (user != 1)
        //            throw new Meteor.Error("user", "updating the user failed");
        //
        //        return true;
        //    }
        //},
        /*
         * gives admin rights to a user
         * @param String userId
         * @return Boolean
         *      true = set admin rights successfull
         *      error = set admin rights failed
         */
        promoteUserToAdmin: function (userId) {
            if (checkRights.checkUserRight(userId, Meteor.userId())) {
                var user = Meteor.users.update({
                        _id: doc.userId
                    }, {
                        $set: {
                            'profile.admin': true
                        }
                    }
                );
                if (user != 1)
                    throw new Meteor.Error("user", "Promote user to admin failed");

                return true;
            } else {
                throw new Meteor.Error("user", "You have no rights to promote this user to admin");
            }
        },
        /*
         * removes admin rights from a user
         * @param String userId
         * @return Boolean
         *      true = admin rights remove successfull
         *      error = admin rights remove failed
         */
        degradeUserFromAdmin: function (userId) {
            if (checkRights.checkUserRight(userId, Meteor.userId())) {
                var user = Meteor.users.update({
                        _id: doc.userId
                    }, {
                        $set: {
                            'profile.admin': false
                        }
                    }
                );
                if (user != 1)
                    throw new Meteor.Error("user", "Degrading of user failed");

                return true;
            } else {
                throw new Meteor.Error("user", "You have no rights to degrade this user");
            }
        },
        /*
         * activates a user
         * @param String userId
         * @return Boolean
         *      true = activation successfull
         *      error = activation failed
         */
        activateUser: function (userId) {
            if (checkRights.checkUserRight(userId, Meteor.userId())) {
                var user = Meteor.users.update({
                        _id: userId
                    }, {
                        $set: {
                            'profile.activated': true
                        }
                    }
                );

                if (user != 1)
                    throw new Meteor.Error("user", "User activation failed");

                return true;
            } else {
                throw new Meteor.Error("user", "You have no rights to activate this user");
            }
        },
        /*
         * deactivates a user
         * @param String userId
         * @return Boolean
         *      true = deactivation successfull
         *      error = deactivation failed
         */
        deactivateUser: function (userId) {
            if (checkRights.checkUserRight(userId, Meteor.userId())) {
                var user = Meteor.users.update({
                        _id: userId
                    }, {
                        $set: {
                            'profile.activated': false
                        }
                    }
                );
                if (user != 1)
                    throw new Meteor.Error("user", "User deactivation failed");

                return true;
            } else {
                throw new Meteor.Error("user", "You have no rights to activate this user");
            }
        },
        /*
         * checks if a given username is already existing in the database
         * @param String username
         * @return Boolean
         *      true = username is existing
         *      false = username not existing
         */
        checkUsernameExisting: function (username) {
            var existingUsers = Meteor.users.find({username: username}).fetch();
            if (existingUsers.length > 0)
                return true;

            return false;
        },
        /*
         * checks if a given email is already existing in the database
         * @param String email
         * @return Boolean
         *      true = email is existing
         *      false = email not existing
         */
        checkEmailExisting: function (email) {
            var emailArray = [
                {
                    address: email,
                    verified: true
                },
                {
                    address: email,
                    verified: false
                }
            ];

            var existingEmails = Meteor.users.find({emails: {$in: emailArray}}).fetch();

            if (existingEmails.length > 0)
                return true;

            return false;
        },
        //mergeObjectInSchema: function(mergeObj){
        //    console.log("merging");
        //    console.log(mergeObj);
        //
        //    var mySchemaObj = {};
        //
        //    mySchemaObj[mergeObj.key] = {
        //            type: eval(mergeObj.type),
        //            label: mergeObj.label
        //    };
        //
        //    console.log(mySchemaObj);
        //    if(Object.getOwnPropertyNames(mySchemaObj).length > 0){
        //        _.merge(SchemaPlain.user, mySchemaObj);
        //        Schemas.users = new SimpleSchema(SchemaPlain.user)
        //        Meteor.users.attachSchema(Schemas.users);
        //    }
        //},
        //
        //flattenObject: function (flatMe){
        //    return flatten.flatten(flatMe);
        //},
        //getCollection2UserSchema: function(){
        //    return Schemas.users;
        //}
    });
}