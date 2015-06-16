SimpleSchema.debug = true;
Schema = {};

Meteor.users.before.insert(function(userId, doc) {
  if(!userId) {
    doc.roles = ['user'];
  }
});
