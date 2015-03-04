UM.prototype.umEditUserHelpers = {
    userschema: function(){
        return Schemas.users;
    },
    collection: function() {
        UserSchema.extendSchema();
        return Meteor.users;
    },
    user: function () {
        var user = Meteor.users.findOne({
            _id: Router.current().params.userId
        });
        return user;
    },
    verified: function() {
        return this.emails[0].verified;
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
    },
    abort: function () {
        return __('abort');
    },
    remove: function () {
        return __('remove');
    },
    globalFields : function () {

        return UserSchema.getGlobalKeys()
    }
};

UM.prototype.umEditUserEvents = {
    'click #removeUser': function () {
        userId = Router.current().getParams().userId;
        Meteor.call('removeUser', userId, function(error, result){
            if(!error){
                Router.go('/showUsers');
            }
        });
    }
};