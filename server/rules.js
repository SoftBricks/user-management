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
    deny: function (type, arg, userId, doc) {
        return doc._id !== userId;
    }
});

Security.defineMethod("ifIsNotCurrentUser", {
    fetch: [],
    deny: function (type, arg, userId, doc) {
        return doc._id === userId;
    }
});

Security.defineMethod("ifDoesNotEffectSuperAdmin", {
    fetch: [],
    deny: function (type, arg, userId, doc) {
        return Roles.userIsInRole(doc._id, 'superAdmin');
    }
});

Security.defineMethod("ifDoesNotEffectSuperAdminExceptHimself", {
    fetch: [],
    deny: function (type, arg, userId, doc) {
        if (Roles.userIsInRole(doc._id, 'superAdmin') === false) {
            return false;
        } else {
            if (Roles.userIsInRole(doc._id, 'superAdmin') === true) {
                if (doc._id === userId)
                    return false;
            }
        }
        return true;
    }
});

//Security.defineMethod("ifDoesChangeSuperAdminRole", {
//    fetch: [],
//    deny: function (type, arg, userId, doc, fields, modifier) {
//        if(typeof modifier !== 'undefined'){
//            console.log(modifier);
//            console.log("modifier");
//            if(_.includes(modifier, 'superAdmin'))
//                return true;
//            console.log("false");
//            return false;
//        }else{
//            if(_.includes(doc, 'superAdmin'))
//                return true;
//            return false;
//        }
//    }
//});

