UM.prototype.umShowUsersHelpers = {
    users: function(){
       return Meteor.users.find().fetch();
    },
    email: function(){
        return this.emails[0].address;
    },
    perPage: function() {
        Session.get(Pages.id + ".ready");
        return Pages.perPage;
    },
    //pages: function(){
    //  console.log(Pages);
    //},
    gravatar: function() {
        var email = this.emails[0].address;
        var options = {
            size: 40,
            secure: true
        };
        var md5Hash = Gravatar.hash(email);

        var url = Gravatar.imageUrl(email, options);
        return url;
    },
    clicked: function(){
        if (Session.get("currentUser") === this._id)
            return "active";
    }
};

UM.prototype.umShowUsersEvents = {
    "click .perPage": function(e) {
        var pp;
        pp = $(e.currentTarget).data("pp");
        return Pages.set("perPage", pp);
    },
    "click .collection-item": function(e){
        Session.set("currentUser", e.currentTarget.id);

        $('#pagination').removeClass("l12");
        $('#pagination').addClass("l8");
        $('#sidebar').removeClass("hide");
        $('#sidebar').addClass('col l4 z-depth-2');
    }
};