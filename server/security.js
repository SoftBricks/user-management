Meteor.users.permit(['insert', 'remove', 'update']).never().apply();
// Meteor.users.permit('update').exceptProps(['admin', 'superAdmin']).apply();
Meteor.users.permit(['insert', 'remove', 'update']).ifHasRole('admin').apply();
// Meteor.users.permit('update').ifIsCurrentUserAndAdmin().apply();