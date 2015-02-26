UM.prototype._init = function() {
	Meteor.subscribe('users');
	// Sets up configured routes
	this.setupRoutes();
	this.setupSchemaMessages();
	// Marks UserManagementTemplates as initialized
	this._initialized = true;
};
UserManagementTemplates = new UM();

// Initialization
Meteor.startup(function() {
	console.log(T9n);
	T9n.setLanguage('de');
	TAPi18n.setLanguage('de')
		.done(function() {
			UserManagementTemplates.setupSchemaMessages();
		});
	UserManagementTemplates._init();
	// AutoForm.setDefaultTemplateForType('afFormGroup', 'polymer');
});

AccountsTemplates.addField({
	_id: 'fullname',
	type: 'text',
	displayName: 'Fullname',
	//placeholder: {
	//	signUp: __('fullname')
	//},
	required: true,
	errStr: 'is required'
});
AccountsTemplates.addField({
	_id: 'username',
	type: 'text',
	displayName: 'Username',
	//placeholder: {
	//	signUp: __('fullname')
	//},
	required: true,
	errStr: 'is required'
});