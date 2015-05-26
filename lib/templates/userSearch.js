UM.prototype.umSearchUserEvents = {
    "keyup #search-box": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        UserSearchNew.search(text);
    }, 200)
};
UM.prototype.umSearchUserRendered = function(){
  UserSearchNew.search('');
}
