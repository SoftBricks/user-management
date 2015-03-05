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
    },
    admin: function(){
        var displayedUser = Router.current().getParams().userId;
        if(Roles.userIsInRole(displayedUser, 'admin')){
            return true;
        }
        return false;
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
    },
    'change input[type="checkbox"][name="admin"]': function (e) {
        var currentUserToUpdate = Router.current().getParams().userId;
        //if(e.target.checked){
        //    Meteor.call('updateAdminRole',currentUserToUpdate , 'admin');
        //}else{
        //    Meteor.call('updateAdminRole',currentUserToUpdate,  '');
        //}
        if(e.target.checked){
            Roles.addUsersToRoles(currentUserToUpdate, 'admin');
        }else{
            Roles.removeUsersFromRoles(currentUserToUpdate, 'admin');
        }

    }
};