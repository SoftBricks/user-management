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
	// AutoForm.setDefaultTemplate('paper');
	// AutoForm.setDefaultTemplateForType('afFormGroup', 'polymer');

	

	//console.log(Pages);
	if(Meteor.isClient){
	    Pages.set({
	    	perPage: 10,
	    	sort: {
	    		title: -1
	    	}
	    });
	}
});