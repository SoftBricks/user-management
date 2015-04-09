UM.prototype.umShowUserHelpers = {
    user: function() {
        return Meteor.users.findOne({
            _id: Router.current().params.userId
        });
    },
    email: function() {
        console.log(this.emails);
        return this.emails[0].address;
    },
    userschema: function(){
        SchemaManager.extendSchema();
        return Schemas.users;
    },
    gravatar: function() {
        var email = this.emails[0].address;
        var options = {
            size: 250,
            secure: true
        };
        var md5Hash = Gravatar.hash(email);

        var url = Gravatar.imageUrl(email, options);
        return url;
    },
    edit: function() {
        return __('editUser');
    },
    abort: function() {
        return __('abort');
    },
    allowedToEdit: function(){
        showedUser = Router.current().getParams().userId;
        myUserId = Meteor.userId();
        if(showedUser === myUserId)
            return true;
        if(Roles.userIsInRole(showedUser, 'superAdmin') === true)
            return false;

        return true;
    }
};

UM.prototype.umShowUserRendered = function(){
        var mq = window.matchMedia('all and (max-width: 600px)');
        function resize(){
            if(mq.matches) {
                $('#subHeader').addClass("hide");
            } else {
                $('#subHeader').removeClass("hide");
            }
        }
        window.addEventListener ('resize', resize, true);
};