UM.prototype._init = function() {
	Meteor.subscribe('users');
};

UserManagementTemplates = new UM();


// Initialization
Meteor.startup(function(){
    UserManagementTemplates._init();
});