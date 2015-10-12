SearchSource.defineSource('usersearch', function(searchText, options, filter) {
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {
        $or: [{
            username: regExp
        }, {
            'emails.0.address': regExp
        }, {
            'profile.fullname': regExp
        }]
    };
    selector = _.extend(selector, filter);
    return Meteor.users.find(selector, options).fetch();
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
