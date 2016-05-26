UM.prototype._init = function () {
	// Meteor.subscribe('users');
	// Sets up configured routes
	    this.setupRoutes();
	    this.setupSchemaMessages();
	// Marks UserManagementTemplates as initialized
	    this._initialized = true;
};
UserManagementTemplates = new UM();

// Initialization
Meteor.startup(function () {
	    UserManagementTemplates._init();
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
  displayName: 'password',
  placeholder: {
    signUp: 'password',
    signIn: 'password',
    changePwd: 'password'
  },
  required: true,
  minLength: 7,
  errStr: 'error.minChar'
});

// optional sign up fields
if (AccountsTemplates.options.extendedSignUp === true) {
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
}
