UM.prototype.umSearchUserEvents = {
    "keyup #search-box": _.throttle(function(e) {
        var text = $(e.target).val().trim();
        UserSearch.search(text);
    }, 200)
};
UM.prototype.umSearchUserRendered = function(){
  UserSearch.search('');
}
