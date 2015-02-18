Template.showUserp.helpers({
    user: function(){
        return Meteor.users.findOne({_id: Router.current().params.userId});
    },
    email: function(){
        return this.emails[0].address;
    },
    userschema: function(){
        return Schema.user;
    }
});