Users = Meteor.users;
//If a user has only the role user he can only change his/her properties except roles
Security.permit(['update']).collections([Users]).ifHasRole('user').ifIsCurrentUser().exceptProps(['roles']).apply();
//If a user has the role admin and wants to change his own profile he can change all properties except the roles
Security.permit(['update']).collections([Users]).ifHasRole('admin').ifIsCurrentUser().exceptProps(['roles']).apply();
//If a user is superAdmin he can change all users except superAdmin users
Security.permit(['update']).collections([Users]).ifHasRole('superAdmin').ifDoesChangeSuperAdminRole().ifDoesNotEffectSuperAdminExceptHimself().apply();
//If a user is admin he can change all user properties of other users except superAdmins
//He can not change his own roles
Security.permit(['update']).collections([Users]).ifHasRole('admin').ifIsNotCurrentUser().ifDoesNotEffectSuperAdmin().apply();

Security.permit(['insert', 'remove', 'update']).collections([Users]).never().apply();
