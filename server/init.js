Meteor.startup(function () {
  Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl('enroll-account/' + token);
  };

  if (Meteor.isServer) {
    if (typeof Meteor.roles.findOne({ name:'admin' }) === 'undefined') {
    Roles.createRole('admin');
  }

    if (typeof Meteor.roles.findOne({ name:'superAdmin' }) === 'undefined') {
    Roles.createRole('superAdmin');
  }
  }
});
