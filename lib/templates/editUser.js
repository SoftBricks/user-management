UM.prototype.umEditUserHelpers = {
  user: function () {
    var currentUser = Meteor.users.findOne({
        _id: FlowRouter.current().params.userId
      });
    if (!currentUser) {
        currentUser = Meteor.user();
      }
    return currentUser;
  },
  verified: function () {
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
  admin: function () {
    var displayedUser = FlowRouter.getParam('userId');
    if (Roles.userIsInRole(displayedUser, 'admin')) {
        return true;
      }
    return false;
  },
  email: function () {
    return this.emails[0].address;
  },
  currentRoles: function () {
    var roles = [];
    _.each(Meteor.users.findOne({ _id: FlowRouter.getParam('userId') }).roles, function (role) {
        roles.push({ name:role });
      });

    return roles;
  },
  isField: function (field) {
    return this.name === field;
  },
  roles: function () {
    return Meteor.roles.find();
  },
  userHasRight: function () {
    var userId = FlowRouter.getParam('userId');
    if (Roles.userIsInRole(userId, this.name))
        return true;
    return false;
  },
  users: function () {
    return Meteor.users;
  },
  isCurrentUser: function (currentUser) {
    return Meteor.userId() === currentUser._id;
  },
  isAdminRole: function () {
    return this.name === 'admin';
  },
  showFields: function () {
    return UserManagementTemplates.options.showFields;
  }
};

UM.prototype.umEditUserEvents = {
  'click #removeUser': function () {
    var userId = FlowRouter.getParam('userId');
    Meteor.call('removeUser', userId, function (error, result) {
        if (!error) {
            Router.go('/showUsers');
          }
      });
  },
  'change input[type="checkbox"][name="roles"]': function (e) {
    var currentUserToUpdate = FlowRouter.getParam('userId');

    if (e.target.checked && e.target.id !== 'superAdmin') {
        Roles.addUsersToRoles(currentUserToUpdate, e.target.id);
      } else {
        Roles.removeUsersFromRoles(currentUserToUpdate, e.target.id);
      }
  }
};
AutoForm.addHooks('editUserForm', {
  onSuccess: function () {
    FlowRouter.go('/showUser/:userId/', {
        userId: FlowRouter.getParam('userId')
      });
  }
});
