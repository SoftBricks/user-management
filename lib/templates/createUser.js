Template.createUser.helpers({
    userschema: function(){
        return Schema.user;
    }
});

UM.prototype.umAddUserHelpers = {
	userschema: function(){
        return Schema.user;
    },
    fullnameError: 'Please enter the full name!',
    usernameError: 'Please enter a username!',
    emailError: 'Please enter a valid email address!'
};