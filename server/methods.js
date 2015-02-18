if (Meteor.isServer) {
    /*
     * Generates a random password
     * @return String
     *      password with length 10
     */
    var generatePassword = function () {
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
    /*
     * checks the user rights to be allowed to to do special stuff
     * e.g. removing users, promote them to admins...
     * @param String userId
     * @param String currentUserId
     * @return Boolean
     *      true = user is allowed to do the action
     *      error = user is not allowed to do the action
     */
    var checkUserRight = function (userId, currentUserId) {

        if (currentUserId === userId)
            return true;

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

        throw new Meteor.Error("checkUserRight", "You have no right to do this!!");

    };
    Meteor.methods({
        /*
         * assigns a user to a group
         * @param String groupId
         * @param String userId
         * @param String email
         * @return Boolean
         *      true = assigned user to group successfull
         *      error = assigning user to group failed
         */
        assignUserToGroup: function (groupId, userId, email) {
            if (groupId) {
                //TODO Check if team exists
                var update = {$addToSet: {groups: groupId}}
                var user;

                if (userId != "" && userId != undefined) {
                    var user = Meteor.users.update({_id: userId}, update);
                } else if (email != "" && userId != undefined) {
                    var user = Meteor.users.update({'emails.0.address': email}, update);
                }

                if (!user)
                    throw new Meteor.error("user", "Found no user!");
            } else {
                throw new Meteor.error("group", "Found no group with specified groupid!");
            }
            return true;
        },
        /*
         * removes a user from a group
         * @param String groupId
         * @param String userId
         * @param String email
         * @return Boolean
         *      true = removed user from group successfull
         *      error = removing user from group failed
         */
        removeUserFromGroup: function (groupId, userId, email) {
            if (groupId) {
                var update = {$pull: {groups: groupId}}
                var user;

                if (userId != "" && userId != undefined) {
                    var user = Meteor.users.update({_id: userId}, update);
                } else if (email != "" && userId != undefined) {
                    var user = Meteor.users.update({'emails.0.address': email}, update);
                }

                if (!user)
                    throw new Meteor.error("user", "Found no user!");
            } else {
                throw new Meteor.error("group", "Found no group with specified groupid!");
            }
            return true;
        },
        /*
         * creates a group
         * @param String name
         * @param String projectId
         * @param String parentGroup
         * @return Boolean
         *      true = created group successfull
         *      error = creating group failed
         */
        createGroup: function (name, projectId, parentGroup) {
            //TODO check if project exists
            if (name && projectId) {
                var group = Groups.insert({
                    name: name,
                    projectId: projectId,
                    parentGroup: parentGroup
                });
                if (!group)
                    throw new Meteor.error("group", "Create group failed!");
            } else {
                if (name === "")
                    throw new Meteor.error("group", "Name was not specified!");
                if (projectId === "")
                    throw new Meteor.Error("group", "Project id was not specified");
            }

            return true;
        },
        /*
         * assigns a sub group to a group
         * @param String groupId
         * @param String parentGroupId
         * @return Boolean
         *      true = assign subgroup successfull
         *      error = assign subgroup failed
         */
        assignSubGroup: function (groupId, parentGroupId) {
            if (groupId && parentGroupId) {
                Groups.update({_id: grouId}, {
                    $set: {
                        parentGroup: parentGroupId
                    }
                });
            } else {
                if (parentGroupId === "")
                    throw new Meteor.error("group", "Parent group id was not specified!");
                if (groupId === "")
                    throw new Meteor.Error("group", "Group id was not specified");
            }
        },
        /*
         * removes a group
         * @param String groupId
         * @return Boolean
         *      true = removed group successfull
         *      error = removing group failed
         */
        removeGroup: function (groupId) {
            if (groupId) {
                Groups.remove({_id: groupId});

                Meteor.users.update({
                    $pull: {groups: groupId}
                });
            }
        },
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
        createUserWithoutPassword: function (doc){
            // Important server-side check for security and data integrity
            //TODO checkUserRight
            if (true) { //checkUserRight("",Meteor.userId())
                //check(doc, Schema.user);
                //var password = generatePassword();
                var user = {
                    email: doc.emails[0].address,
                    //password: password,
                    username: doc.username,
                    superAdmin: false,
                    admin: doc.admin,
                    profile: {
                        fullname: doc.profile.fullname
                    }
                };
                user = Accounts.createUser(user);
                if (user)
                    Accounts.sendEnrollmentEmail(user);
                if (!user)
                    throw new Meteor.Error("user", "User has not been created");
            }else{
                throw new Meteor.Error("user", "You have no rights to create a new User");
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
            if (checkUserRight(userId,Meteor.userId())) {
                if (userId) {
                    var userToRemove = Meteor.users.findOne({_id: userId}, {
                        _id: 0,
                        createdAt: 0,
                        emails: 0,
                        services: 0,
                        username: 0
                    });
                    if (userToRemove && userToRemove.profile.superAdmin === false) {

                        Meteor.users.remove({
                            _id: userId
                        });

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
                    } else {
                        throw new Meteor.Error("user", "superAdmin can not be removed!");
                    }
                } else {
                    throw new Meteor.Error("user", "no user id specified");
                }
                return true;
            }else{
                throw new Meteor.Error("user", "You have no rights to remove a user");
            }
        },
        /*
         * updates user information
         * @param Object doc
         * @return Boolean
         *      true = update user information successfull
         *      error = update user information failed
         */
        updateUserInformation: function (doc) {
                //check(doc, Schema.user);
            //TODO checkUserRight
            if (true) {//checkUserRight(doc.userId, Meteor.userId(), "admin")

                var user = Meteor.users.update({
                        _id: doc.userId
                    }, {
                        $set: {
                            'emails.0.address': doc.emails[0].address,
                            username: doc.username,
                            'profile.fullname': doc.profile.fullname,
                            admin: doc.admin
                        }
                    }
                );
                if (!user)
                    throw new Meteor.Error("user", "updating the user failed");

                return true;
            }else{
                throw new Meteor.Error("user", "You have no rights to edit a user");
            }
        },
        /*
         * gives admin rights to a user
         * @param String userId
         * @return Boolean
         *      true = set admin rights successfull
         *      error = set admin rights failed
         */
        promoteUserToAdmin: function (userId) {
            if(checkUserRight(userId, Meteor.userId())) {
                var user = Meteor.users.update({
                        _id: doc.userId
                    }, {
                        $set: {
                            'profile.admin': true
                        }
                    }
                );
                if(user)
                    return true;

                throw new Meteor.Error("user", "Promote user to admin failed");
            }else{
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
            if(checkUserRight(userId, Meteor.userId())) {
                var user = Meteor.users.update({
                        _id: doc.userId
                    }, {
                        $set: {
                            'profile.admin': false
                        }
                    }
                );
                if(user)
                    return true;

                throw new Meteor.Error("user", "Degrading the user failed");
            }else{
                throw new Meteor.Error("user", "You have no rights to degrade this user");
            }
        },
        /*
         * inserts arbitrary fields to the profile of a user
         * @param String userId
         * @param Object fieldObject
         * @return Boolean
         *      true = insert successfull
         *      false = insert failed
         */
        addProfileFields: function(userId, fieldObject){

        },
        /*
         * checks if a given username is already existing in the database
         * @param String username
         * @return Boolean
         *      true = username is existing
         *      false = username not existing
         */
        checkUsernameExisting: function(username) {
            var existingUsers = Meteor.users.find({username: username}).fetch();
            if(existingUsers.length > 0)
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
        checkEmailExisting: function(email) {
            var emailArray = [
                {
                    address: email,
                    verified: true
                },
                {
                    address:email,
                    verified: false
                }
            ];

            var existingEmails = Meteor.users.find({emails: {$in: emailArray}}).fetch();

            if(existingEmails.length > 0)
                return true;

            return false;
        }
    });
}