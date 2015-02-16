Template.createUser.helpers({
    userschema: function(){
        return Schema.user;
    },
    usernameError: function(){
        var userExists = Session.get("userExists");
        if(userExists)
            return "User already exists";
        return ""
    }
});

UM.prototype.umAddUserHelpers = {
	userschema: function(){
        return Schema.user;
    },
    fullnameError: 'Please enter the full name!',
    usernameError: {
    	empty: 'Please enter a username!',
    	existing: 'Username already existing!'
    },
    emailError: 'Please enter a valid email address!'
};

Template.createUser.events({
    'keyup #username': function(event, template) {
        var username = $(event.currentTarget).val();

        console.log("username");
        //var decorator = template.find('#usernameDecorator');
        //Meteor.call('checkUsernameExisting', username, function(error, usernameExisting) {
        //    var input = $(decorator).find('input');
        //    if(usernameExisting === true) {
        //        decorator.error = UserManagementTemplates.umAddUserHelpers.usernameError.existing;
        //        decorator.isInvalid = true;
        //    } else {
        //        decorator.error = UserManagementTemplates.umAddUserHelpers.usernameError.empty;
        //        decorator.isInvalid = !input[0].validity.valid;
        //    }
        //});
    }
});