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
Meteor.startup(function(){
	TAPi18n.setLanguage('de')
			.done(function() {
				UserManagementTemplates.setupSchemaMessages();
			});
    UserManagementTemplates._init();
	// AutoForm.setDefaultTemplateForType('afFormGroup', 'polymer');
});