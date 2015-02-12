UM.prototype.umUserListHelpers = {
	users: function() {
		console.log(Meteor.users.find().fetch());
		return Meteor.users.find();
	}
};


	// created = function() {
	// 		this.subHandle = Meteor.subscribe("users");
	// 	},
	// 	destroyed = function() {
	// 		// Make sure the data goes away when we don’t need it anymore
	// 		this.subHandle.stop();
	// 	},