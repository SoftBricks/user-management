UM.prototype.umEditUserHelpers = {
    userschema: function() {
        return Schema.user;
    },
    user: function() {
        return Meteor.users.findOne({
            _id: Router.current().params.userId
        });
    },
    save: function() {
        return __('save');
    },
    addField: function() {
        return __('addField');
    }
};

UM.prototype.umEditUserEvents = {
    'click #removeUser': function() {
        userId = Router.current().getParams().userId;
        Meteor.call('removeUser', userId);
    }
};