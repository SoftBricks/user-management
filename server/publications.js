Meteor.publish("users", function () {
   return publishUsers(this);
});

publishUsers = function(context){
    if(context.userId){
        var user = Meteor.users.findOne({_id: context.userId});
        if (user.profile.admin === true || user.profile.superAdmin === true) {
            return Meteor.users.find();
        } else {
            return Meteor.users.find({_id: context.userId});
        }
    }
};