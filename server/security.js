this.Users = Meteor.users;
// If a user has only the role user he can only change his/her properties except roles
Security.permit(['update']).collections([Users]).ifIsCurrentUser().exceptProps(['roles']).apply();
// If a user has the role admin and wants to change his own profile he can change all properties except his roles
Security.permit(['update']).collections([Users]).ifHasRole('admin').ifDoesNotChangeSuperAdmin().ifDoesNotChangeHisRoles().apply();
// If a user is superAdmin he can change all users except superAdmin users
Security.permit(['update']).collections([Users]).ifHasRole('superAdmin').apply();
// If a user is admin he can change all user properties of other users except superAdmins
// He can not change his own roles
Security.permit(['update']).collections([Users]).ifHasRole('admin').ifIsNotCurrentUser().apply();

Security.permit(['insert']).collections([Users]).ifHasRole('admin').apply();
Security.permit(['insert']).collections([Users]).ifHasRole('superAdmin').apply();

Security.permit(['insert', 'remove', 'update']).collections([Users]).never().apply();

if (Meteor.roles) {
  Security.permit(['insert', 'remove', 'update']).collections([Meteor.roles]).ifHasRole('admin').apply();
  Security.permit(['insert', 'remove', 'update']).collections([Meteor.roles]).ifHasRole('superAdmin').apply();
  Security.permit(['insert', 'remove', 'update']).collections([Meteor.roles]).never().apply();
}

// AdditionalUserFields.permit(['insert', 'remove', 'update']).apply();
