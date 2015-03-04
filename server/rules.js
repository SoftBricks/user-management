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

Security.defineMethod("ifIsCurrentUserAndAdmin", {
	fetch: [],
	deny: function(type, arg, userId, doc) {
		console.log(userId, doc._id);
		return doc._id !== userId;
	}
});