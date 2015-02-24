UM.prototype.umEditUserHelpers = {
    userschema: function () {
        return Schema.user;
    },
    user: function () {
        return Meteor.users.findOne({
            _id: Router.current().params.userId
        });
    },
    save: function () {
        return __('save');
    },
    addField: function () {
        return __('addField');
    },
    gravatar: function () {
        var email = this.emails[0].address;
        var options = {
            secure: true
        };
        var md5Hash = Gravatar.hash(email);

        var url = Gravatar.imageUrl(email, options);
        return url;
    }
};

UM.prototype.umEditUserEvents = {
    'click #removeUser': function () {
        userId = Router.current().getParams().userId;
        Meteor.call('removeUser', userId);
    }
};