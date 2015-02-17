Template.editUserp.helpers({
    userschema: function(){
        return Schema.user;
    },
    user: function () {
        return Meteor.users.findOne({_id: Router.current().params.userId});
    }
});