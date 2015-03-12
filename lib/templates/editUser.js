UM.prototype.umEditUserHelpers = {
    collection: function() {
        SchemaManager.extendSchema();
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

        return SchemaManager.getGlobalKeys()
    },
    admin: function(){
        var displayedUser = Router.current().getParams().userId;
        if(Roles.userIsInRole(displayedUser, 'admin')){
            return true;
        }
        return false;
    },
    email: function(){
        return this.emails[0].address
    },
    currentRoles: function(){
        var roles = [];
        _.each(Meteor.users.findOne({_id: Router.current().getParams().userId}).roles, function(role){
            roles.push({name:role});
        });

        return roles;
    },
    isField: function(field) {
        return this.name === field;
    },
    roles: function(){
        return Meteor.roles.find().fetch();
    },
    userHasRight: function(){
        var userId = Router.current().getParams().userId;
        if(Roles.userIsInRole(userId,this.name))
            return true;
        return false;
    }
};

UM.prototype.umEditUserEvents = {
    'click #removeUser': function () {
        var userId = Router.current().getParams().userId;
        Meteor.call('removeUser', userId, function(error, result){
            if(!error){
                Router.go('/showUsers');
            }
        });
    },
    'change input[type="checkbox"][name="roles"]': function (e) {
        var currentUserToUpdate = Router.current().getParams().userId;

        if(e.target.checked && e.target.id !== 'superAdmin'){
            Roles.addUsersToRoles(currentUserToUpdate, e.target.id);
        }else{
            Roles.removeUsersFromRoles(currentUserToUpdate, e.target.id);
        }
    }
};