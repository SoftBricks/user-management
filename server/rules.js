// Security.defineMethod("ifIsAdmin", {
// 	fetch: [],
// 	deny: function(type, arg, userId) {
// 		var admin = Meteor.users.findOne({
// 			_id: userId
// 		});
// 		if (admin && admin.superAdmin || admin.admin) {
// 			return false;
// 		}
// 		return true;
// 	}
// });

// Security.defineMethod("ifIsSuperAdmin", {
// 	fetch: [],
// 	deny: function(type, arg, userId) {
// 		var admin = Meteor.users.findOne({
// 			_id: userId
// 		});
// 		if (admin && admin.superAdmin) {
// 			return false;
// 		}
// 		return true;
// 	}
// });

Security.defineMethod("ifIsCurrentUser", {
	fetch: [],
	deny: function(type, arg, userId, doc) {
		return doc._id !== userId;
	}
});

Security.defineMethod("ifIsNotCurrentUser", {
	fetch: [],
	deny: function(type, arg, userId, doc) {
		return doc._id === userId;
	}
});

Security.defineMethod("ifDoesNotEffectSuperAdmin", {
	fetch: [],
	deny: function(type, arg, userId, doc) {
		return Roles.userIsInRole(doc._id, 'superAdmin');
	}
});

Security.defineMethod("ifDoesNotEffectSuperAdminExceptHimself", {
	fetch: [],
	deny: function(type, arg, userId, doc) {
		if(Roles.userIsInRole(doc._id, 'superAdmin')){
			if(doc._id === userId)
				return false;
		}
		return true;
	}
});

