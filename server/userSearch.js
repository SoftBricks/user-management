SearchSource.defineSource('usersearch', function(searchText, config, filter) {
  var options = _.extend({sort: {isoScore: -1}, limit: 20}, config.options);

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {
        $or: [{
            username: regExp
        }, {
            'emails.0.address': regExp
        }, {
            'profile.firstname': regExp
        }, {
            'profile.lastname': regExp
        }, {
            'profile.fullname': regExp
        }]
    };
    if (config.filter) {
      selector = {
        $and: [selector, config.filter]
      }
    }
    return publishUsers({userId: Meteor.userId()}, selector, options).fetch();
  } else {
    // return Meteor.users.find({}, options).fetch();
    return [];
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
