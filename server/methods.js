if (Meteor.isServer) {
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

    var generatePassword = function () {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 10;
        var randomstring = '';
        var charCount = 0;
        var numCount = 0;

        for (var i = 0; i < string_length; i++) {
            // If random bit is 0, there are less than 3 digits already saved, and there are not already 5 characters saved, generate a numeric value.
            if ((Math.floor(Math.random() * 2) == 0) && numCount < 3 || charCount >= 5) {
                var rnum = Math.floor(Math.random() * 10);
                randomstring += rnum;
                numCount += 1;
            } else {
                // If any of the above criteria fail, go ahead and generate an alpha character from the chars string
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
                charCount += 1;
            }
        }
        return randomstring;
    };

    var checkUserRight = function (userId, currentUserId) {

        if (currentUserId == userId)
            return true;

        var admin = Meteor.users.findOne({_id: currentUserId}, {
            _id: 0,
            createdAt: 0,
            emails: 0,
            services: 0,
            username: 0
        });
        if (admin) {
            if (admin.profile.superAdmin || admin.profile.admin)
                return true;
        }

        throw new Meteor.Error("checkUserRight", "You have no right to do this!!");

    };
    Meteor.methods({
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
                if (name == "")
                    throw new Meteor.error("group", "Name was not specified!");
                if (projectId == "")
                    throw new Meteor.Error("group", "Project id was not specified");
            }

            return true;
        },

        assignSubGroup: function (groupId, parentGroupId) {
            if (groupId && parentGroupId) {
                Groups.update({_id: grouId}, {
                    $set: {
                        parentGroup: parentGroupId
                    }
                });
            } else {
                if (parentGroupId == "")
                    throw new Meteor.error("group", "Parent group id was not specified!");
                if (groupId == "")
                    throw new Meteor.Error("group", "Group id was not specified");
            }
        },

        removeGroup: function (groupId) {
            if (groupId) {
                Groups.remove({_id: groupId});

                Meteor.users.update({
                    $pull: {groups: groupId}
                });
            }
        },

        shareAssetWithGroup: function (assetId, groupId) {
            if (assetId && groupId) {
                AssetFiles.update({
                    _id: assetId
                }, {
                    $addToSet: {sharedWithGroups: groupId}
                });
            } else {
                if (assetId == "")
                    throw new Meteor.error("asset", "Asset id was not specified!");
                if (groupId == "")
                    throw new Meteor.Error("asset", "Group id was not specified");
            }
        },

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
                if (folderId == "")
                    throw new Meteor.error("folder", "Folder id was not specified!");
                if (groupId == "")
                    throw new Meteor.Error("folder", "Group id was not specified");
            }
        },
        createUserWithoutPassword: function (doc) {
            // Important server-side check for security and data integrity
            if (checkUserRight("",Meteor.userId())) {
                check(doc, Schema.user);

                var password = generatePassword();
                var user = {
                    email: doc.email,
                    password: password,
                    username: doc.username,
                    profile: {
                        fullname: doc.fullname,
                        superAdmin: false,
                        admin: false
                    }
                };
                var user = Accounts.createUser(user);
                if (user)
                    Accounts.sendEnrollmentEmail(user);
                if (!user)
                    throw new Meteor.Error("user", "User has not been created");
            }
        },
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
                    if (userToRemove && userToRemove.profile.superAdmin == false) {

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
            }
        },
        updateUserInformation: function (doc) {
                check(doc, Schema.user);
            if (checkUserRight(doc.userId, Meteor.userId(), "admin")) {
                var email, username, fullname;

                var user = Meteor.users.update({
                        _id: doc.userId
                    }, {
                        $set: {
                            'emails.0.address': doc.email,
                            username: doc.username,
                            'profile.fullname': doc.fullname
                        }
                    }
                );
                if (!user)
                    throw new Meteor.Error("user", "updating the user failed");

                return true;
            }
        },
        promoteUserToAdmin: function (userId) {
            if(userId, checkUserRight(Meteor.userId())) {
                var user = Meteor.users.update({
                        _id: doc.userId
                    }, {
                        $set: {
                            'profile.admin': true
                        }
                    }
                );
            }
        },
        degradeUserFromAdmin: function (userId) {
            if(userId, checkUserRight(Meteor.userId())) {
                var user = Meteor.users.update({
                        _id: doc.userId
                    }, {
                        $set: {
                            'profile.admin': false
                        }
                    }
                );
            }
        }
    });
}