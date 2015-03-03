Meteor.publish("users", function() {
    var res = publishUsers(this);
    if (!res) {
        this.ready();
    }else{
        return res;
    }
});

publishUsers = function(context, selector, options) {
    selector = selector || {};
    options = options || {};
    if (context.userId) {
        var user = Meteor.users.findOne({
            _id: context.userId
        });
        if (user.profile.admin === true || user.profile.superAdmin === true) {
            return Meteor.users.find(selector, options);
        } else {
            return Meteor.users.find(_.extend({
                _id: context.userId
            }, selector), options);
        }
    }
};