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

var pickDeep = function (obj, key) {
    if (_.has(obj, key)) // or just (key in obj)
        return [obj];
    // elegant:
    return _.flatten(_.map(obj, function(v) {
        return typeof v == "object" ? pickDeep(v, key) : [];
    }), true);

    // or efficient:
    var res = [];
    _.forEach(obj, function(v) {
        if (typeof v == "object" && (v = pickDeep(v, key)).length)
            res.push.apply(res, v);
    });
    return res;
}

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

Security.defineMethod("ifDoesChangeSuperAdminRole", {
    fetch: [],
    deny: function (type, arg, userId, doc, fields, modifier) {
        if(typeof modifier !== 'undefined'){

            var roles = pickDeep(modifier, 'roles');
            console.log(roles[0].roles);

            if(_.includes(roles[0].roles, 'superAdmin')){
                //Should always be shown
                console.log("NOT ALLOWED to change superAdmin Role");
                return true;
            }else if(_.includes(roles[0].roles['$each'], 'superAdmin')){
                //Should always be shown
                console.log("NOT ALLOWED to change superAdmin Role");
                return true;
            }
            //Should never happen :D
            console.log("allowed to change superAdmin Role");
            return false;
        }else{
            if(_.includes(doc, 'superAdmin'))
                return true;
            return false;
        }
    }
});

