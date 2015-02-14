UM.prototype._init = function() {
	Meteor.subscribe('users');
    // Sets up configured routes
	UserManagementTemplates.setupRoutes();
	// Marks UserManagementTemplates as initialized
	this._initialized = true;
};

UserManagementTemplates = new UM();


// Initialization
Meteor.startup(function(){
    UserManagementTemplates._init();
});