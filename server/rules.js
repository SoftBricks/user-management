var pickDeep = function (obj, key) {
  if (_.has(obj, key)) // or just (key in obj)
    return [obj];
    // elegant:
  return _.flatten(_.map(obj, function (v) {
    return typeof v == 'object' ? pickDeep(v, key) : [];
  }), true);

    // or efficient:
  var res = [];
  _.forEach(obj, function (v) {
    if (typeof v == 'object' && (v = pickDeep(v, key)).length)
        res.push.apply(res, v);
  });
  return res;
}

Security.defineMethod('ifIsCurrentUser', {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    return doc._id !== userId;
  }
});

Security.defineMethod('ifIsNotCurrentUser', {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    return doc._id === userId;
  }
});

/**
 * checks if the user that is being edited is a superAdmin
 */
Security.defineMethod('ifDoesNotEffectSuperAdmin', {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    return Roles.userIsInRole(doc._id, 'superAdmin');
  }
});
Security.defineMethod('ifDoesNotChangeSuperAdmin', {
  fetch: [],
  deny: function (type, arg, userId, doc) {
    return Roles.userIsInRole(doc._id, 'superAdmin');
  }
});

Security.defineMethod('ifDoesNotEffectSuperAdminExceptHimself', {
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

Security.defineMethod('ifDoesChangeSuperAdminRole', {
  fetch: [],
  deny: function (type, arg, userId, doc, fields, modifier) {
    if (typeof modifier !== 'undefined') {
        var roles = pickDeep(modifier, 'roles');
            // console.log(roles[0].roles);
        if (roles.length > 0)
            {
            if (_.includes(roles[0].roles, 'superAdmin')) {
                console.log('NOT ALLOWED to change superAdmin Role');
                return true;
              } else if (_.includes(roles[0].roles['$each'], 'superAdmin')) {
                  console.log('NOT ALLOWED to change superAdmin Role');
                  return true;
                }
          }
        return false;
      }
    return true;
  }
});

Security.defineMethod('ifDoesNotChangeHisRoles', {
  fetch: [],
  deny: function (type, arg, userId, doc, fields, modifier) {
    if (typeof modifier !== 'undefined') {

        var roles = pickDeep(modifier, 'roles');
        if (roles && roles[0] && _.contains(roles[0].roles, 'admin')) {
            return true;
          }
      }
    return false;
  }
});
