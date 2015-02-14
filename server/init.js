Meteor.startup(function() {
    Accounts.urls.enrollAccount = function (token) {
        return Meteor.absoluteUrl('enroll-account/' + token);
    };
});