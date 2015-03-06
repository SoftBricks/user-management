//If a user has only the role user he can only change his/her properties except roles
Meteor.users.permit(['update']).ifHasRole('user').ifIsCurrentUser().exceptProps(['roles']).apply();
//If a user has the role admin and wants to change his own profile he can change all properties except the roles
Meteor.users.permit(['update']).ifHasRole('admin').ifIsCurrentUser().exceptProps(['roles']).apply();
//If a user is superAdmin he can change all users except superAdmin users
Meteor.users.permit(['update']).ifHasRole('superAdmin').ifDoesChangeSuperAdminRole().ifDoesNotEffectSuperAdminExceptHimself().apply();
//If a user is admin he can change all user properties of other users except superAdmins
//He can not change his own roles
Meteor.users.permit(['update']).ifHasRole('admin').ifIsNotCurrentUser().ifDoesNotEffectSuperAdmin().apply();

Meteor.users.permit(['insert', 'remove', 'update']).never().apply();