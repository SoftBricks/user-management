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
    usernameError: {
    	empty: 'Please enter a username!',
    	existing: 'Username already existing!'
    },
    emailError: 'Please enter a valid email address!'
};