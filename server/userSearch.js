SearchSource.defineSource('usersearch', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    var selector = {};
      var regExp = buildRegExp(searchText);
      selector = {
          $or: [{
              username: regExp
          }, {
              'emails.0.address': regExp
          }, {
              'profile.fullname': regExp
          }]
      };
    return Meteor.users.find(selector, options).fetch();
  } else {
    return Meteor.users.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
