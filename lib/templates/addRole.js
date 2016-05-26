UM.prototype.umAddRoleHelper = {
  collection: function () {
    return Meteor.roles;
  },
  abort: function () {
    return __('abort');
  },
  save: function () {
    return __('save');
  }
};
