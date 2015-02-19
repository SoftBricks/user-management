UM.prototype.umUserListItemHelpers = {
    email: function(){
        return this.emails[0].address;
    },
    fullname: function() {
        return this.profile.fullname
    }
};

UM.prototype.umUserListItemEvents = {
    "click .clickableRow": function(e) {
        Router.go("/showUser/"+this._id);
    }
};