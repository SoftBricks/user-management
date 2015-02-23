UM.prototype.umAddUserHelpers = {
    userschema: function () {
        return Schema.user;
    },
    groups : function(){
        if(SchemaPlain.user['profile.groups'])
            return true;
    },
    fullnameError: 'Please enter the full name!',
    usernameError: {
        empty: 'Please enter a username!',
        existing: 'Username already existing!'
    },
    emailError: {
        empty: 'Please enter a email!',
        existing: 'Email already existing!',
        invalid: 'Please enter a valid email address!'
    }
};