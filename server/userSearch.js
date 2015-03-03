//TODO Currently the same as searchLeader, do we really need a own SearchSource for users in Groups?
Meteor.methods({
    userSearch: function(searchText, options) {
        var options = {
            sort: {
                isoScore: -1
            }
        };
        var selector = {};
        if (searchText) {
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
        }
        var res = publishUsers(this, selector, options);
        if(!res){
            return [];
        }
        var search = res.fetch();
        return search;
    }
});

function buildRegExp(searchText) {
    var parts = searchText.trim().split(' ');
    return new RegExp("(" + parts.join('|') + ")", "ig");
}