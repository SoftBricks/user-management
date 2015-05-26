UM.prototype._init = function() {
	// Meteor.subscribe('users');
	// Sets up configured routes
	this.setupRoutes();
	this.setupSchemaMessages();
	// Marks UserManagementTemplates as initialized
	this._initialized = true;
};
UserManagementTemplates = new UM();

// Initialization
Meteor.startup(function() {
	// T9n.setLanguage('de');
	// TAPi18n.setLanguage('de')
		// .done(function() {
			// UserManagementTemplates.setupSchemaMessages();
		// });
	UserManagementTemplates._init();
	// AutoForm.setDefaultTemplateForType('afFormGroup', 'polymer');
});

AccountsTemplates.removeField('email');
AccountsTemplates.addField({
    _id: 'email',
    type: 'email',
    required: true,
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'error.accounts.Invalid email',
    trim: true,
    lowercase: true
});
AccountsTemplates.removeField('password');
AccountsTemplates.addField({
    _id: 'password',
    type: 'password',
    displayName: "password",
    placeholder: {
        signUp: "password",
        signIn: "password",
        changePwd: "password"
    },
    required: true,
    minLength: 7,
    errStr: 'error.minChar'
});
AccountsTemplates.addField({
	_id: 'fullname',
	type: 'text',
	displayName: 'fullname',
	required: true,
	errStr: 'error.fullnameRequired'
});
AccountsTemplates.addField({
	_id: 'username',
	type: 'text',
	displayName: 'username',
	required: true,
	errStr: 'error.usernameRequired'
});

// UserSearch.fetchData = function(searchText, options, success) {
//   Meteor.call('userSearch', searchText, options, function(err, data) {
//     success(err, data);
//   });
// };
