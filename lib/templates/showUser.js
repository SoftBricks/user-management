UM.prototype.umShowUserOnCreated = function() {
  var self = this;
  self.autorun(function() {
    var userId = FlowRouter.getParam('userId');
    self.subscribe('users', userId);
  });
};

UM.prototype.umShowUserHelpers = {
    user: function() {
        var currentUser = Meteor.users.findOne({
            _id: FlowRouter.getParam('userId')
        });
        if (!currentUser) {
            currentUser = Meteor.users.findOne({_id: Meteor.userId()});
        }
        return currentUser;
    },
    email: function() {
        console.log(this.emails);
        return this.emails[0].address;
    },
    userschema: function(){
        return Meteor.users.simpleSchema();
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
    },
    showFields: function () {
        return UserManagementTemplates.options.showFields;
    }
};

UM.prototype.umShowUserEvents = {
    'click #goBack': function() {
        FlowRouter.go('/userManagement');
    },
    "click [data-action='enrollment-dialog/open']": function () {
        UserManagementTemplates.options.openEnrollmentDialog(this);
    },
    "click [data-action='delete-user-dialog/open']": function () {
        UserManagementTemplates.options.openDeleteUserDialog(this);
    },
    "click [data-action='password/change']": function () {
        UserManagementTemplates.options.onClickPasswordChange(this);
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
