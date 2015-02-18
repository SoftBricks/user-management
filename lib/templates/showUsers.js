UM.prototype.umShowUsersHelpers = {
    users: function(){
        return Meteor.users.find().fetch();
    },
    email: function(){
        return this.emails[0].address;
    }
};

Template.umShowUsers.helpers(UserManagementTemplates.umShowUsersHelpers);
