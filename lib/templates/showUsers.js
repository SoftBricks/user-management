UM.prototype.umShowUsersOnCreated = function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('users');
  });
};

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
    },
    grid: function(){
        var sidebar = Session.get('sidebar');
        if(sidebar === true){
            return "l7 m7 s0";
        }else{
            return "l12 m12 s12";
        }
    }
};

UM.prototype.umShowUsersEvents = {
    "click .perPage": function(e) {
        var pp;
        pp = $(e.currentTarget).data("pp");
        return Pages.set("perPage", pp);
    },
    "click .user-item": function(){
      FlowRouter.go(FlowRouter.current().path+'/:userId', {
        userId: this._id
      });
    }
};
