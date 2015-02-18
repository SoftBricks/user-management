Template.editUserp.helpers({
    userschema: function(){
        return Schema.user;
    },
    user: function () {
        return Meteor.users.findOne({_id: Router.current().params.userId});
    }
});

Template.editUserp.events({
    'click #removeUser':function(){
        userId = Router.current().getParams().userId;
        Meteor.call('removeUser', userId);
    }
})