UM.prototype.umManageRolesHelper = {
  roles: function () {
    return Meteor.roles.find().fetch();
  },
  add: function () {
    return __('add');
  },
  remove: function () {
    return __('remove');
  }
};

UM.prototype.umManageRolesEvents = {
  'click .removeRole': function (e) {
    Meteor.call('removeRole', e.target.id);
  }
};
