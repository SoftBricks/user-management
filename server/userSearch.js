// //TODO Currently the same as searchLeader, do we really need a own SearchSource for users in Groups?
// Meteor.methods({
//     userSearch: function(searchText, options) {
//         var options = {
//             sort: {
//                 isoScore: -1
//             }
//         };
//         var selector = {};
//         if (searchText) {
//             var regExp = buildRegExp(searchText);
//             selector = {
//                 $or: [{
//                     username: regExp
//                 }, {
//                     'emails.0.address': regExp
//                 }, {
//                     'profile.fullname': regExp
//                 }]
//             };
//         }else{
//             return [];
//         }
//         var res = publishUsers(this, selector, options);
//         if(!res){
//             return [];
//         }
//         var search = res.fetch();
//         return search;
//     }
// });
//
// function buildRegExp(searchText) {
//     var parts = searchText.trim().split(' ');
//     return new RegExp("(" + parts.join('|') + ")", "ig");
// }

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
