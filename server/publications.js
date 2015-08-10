Meteor.publish("users", function () {
    var res = publishUsers(this);
    if (!res) {
        this.ready();
    } else {
        return res;
    }
});
Meteor.publish("additionalUserFields", function () {
    return AdditionalUserFields.find();
});
Meteor.publish(null, function () {
    if (Roles.userIsInRole(this.userId,['admin', 'superAdmin'])){
      if (!Roles.userIsInRole(this.userId,['superAdmin'])) {
          return Meteor.roles.find({name: {$ne: 'superAdmin'}});
      } else {
          return Meteor.roles.find();
      }
    } else {
      // user not authorized. do not publish secrets
      this.stop();
      return;
    }
});

publishUsers = function (context, selector, options) {
    selector = selector || {};
    options = options || {};
    if (context.userId) {
        var user = Meteor.users.findOne({
            _id: context.userId
        });
        if (Roles.userIsInRole(context.userId, 'admin') || Roles.userIsInRole(context.userId, 'superAdmin')) {
            return Meteor.users.find(selector, options);
        } else {
            return Meteor.users.find(_.extend({
                _id: context.userId
            }, selector), options);
        }
    }
};

Meteor.publish("roles", function () {
    if (Roles.userIsInRole(this.userId, 'admin') || Roles.userIsInRole(this.userId, 'superAdmin')) {
        return Meteor.roles.find();
    }else{
        this.ready();
    }
});
