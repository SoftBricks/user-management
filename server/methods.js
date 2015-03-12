if (Meteor.isServer) {
    checkRights = {};


    /**
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
        /**
         * creates a user without password
         * @param Object doc
         * @return Boolean
         *      true = create user successfull
         */
        createUserWithoutPassword: function (doc) {
            // Important server-side check for security and data integrity
            if (Roles.userIsInRole(Meteor.userId(), ['admin', 'superAdmin'])) {
                var user = {
                    'username': doc.username,
                    'email': doc.emails[0].address,
                    'profile': doc.profile
                };
                user = Accounts.createUser(user);
                if (user) {
                    Roles.addUsersToRoles(user, 'user');
                    Accounts.sendEnrollmentEmail(user);
                    return true;
                }
                if (!user)
                    throw new Meteor.Error("user", "User has not been created");
            }
        },
        /**
         * removes a user
         * @param String userId
         * @return Boolean
         *      true = remove user successfull
         */
        removeUser: function (userId) {
            if (userId !== Meteor.userId()) {
                if (Roles.userIsInRole(Meteor.userId(), ['admin', 'superAdmin'])) {
                    if (userId) {
                        var userToRemove = Meteor.users.findOne({_id: userId}, {
                            _id: 0,
                            createdAt: 0,
                            emails: 0,
                            services: 0,
                            username: 0
                        });
                        if (userToRemove && Roles.userIsInRole(userId, 'superAdmin') === false) {

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
        /**
         * checks if a given username already exists
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
        /**
         * checks if a given email already exists
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
        }
    });
}