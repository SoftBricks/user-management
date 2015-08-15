UM.prototype.umShowUserOnCreated = function() {
  var self = this;
  self.autorun(function() {
    var userId = FlowRouter.getParam('userId');
    self.subscribe('users', userId);
  });
};

UM.prototype.umShowUserHelpers = {
    user: function() {
        return Meteor.users.findOne({
            _id: FlowRouter.current().params.userId
        });
    },
    email: function() {
        console.log(this.emails);
        return this.emails[0].address;
    },
    userschema: function(){
        return Schema.User;
    },
    gravatar: UM.prototype.umShowUsersHelpers.gravatar,
    edit: function() {
        return __('editUser');
    },
    abort: function() {
        return __('abort');
    },
    allowedToEdit: function(){
        showedUser = FlowRouter.current().getParams().userId;
        myUserId = Meteor.userId();
        if(showedUser === myUserId)
            return true;
        if(Roles.userIsInRole(showedUser, 'superAdmin') === true)
            return false;

        return true;
    }
};

UM.prototype.umShowUserEvents = {
    'click #goBack': function() {
        FlowRouter.go('/userManagement');
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
