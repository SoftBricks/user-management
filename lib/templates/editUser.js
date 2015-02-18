UM.prototype.umEditUserHelpers = {
    userschema: function () {
        return Schema.user;
    },
    user: function () {
        return Meteor.users.findOne({_id: Router.current().params.userId});
    }
};

UM.prototype.umEditUserEvents = {
    'click #removeUser': function () {
        userId = Router.current().getParams().userId;
        Meteor.call('removeUser', userId);
    }
};

Template.umEditUser.helpers(UM.prototype.umEditUserHelpers);
Template.umEditUser.events(UM.prototype.umEditUserEvents);