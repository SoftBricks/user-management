UM.prototype.umShowUserHelpers = {
    user: function(){
        return Meteor.users.findOne({_id: Router.current().params.userId});
    },
    email: function(){
        return this.emails[0].address;
    },
    userschema: function(){
        return Schema.user;
    },
    gravatar : function(){
        var email = this.emails[0].address;
        var options = {
            size:250,
            secure: true
        };
        var md5Hash = Gravatar.hash(email);

        var url = Gravatar.imageUrl(email, options);
        return url;
    }
};