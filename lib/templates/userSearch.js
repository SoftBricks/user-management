UM.prototype.umUserSearchEvents = {
    "keyup #search-box": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        //Meteor.subscribe('users', text);
        Pages.set({
            filters: {$or:[{username:text},{'emails.0.address':text},{'profile.fullname':text}]}
        });
    }, 200)
};

