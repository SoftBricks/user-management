var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['username', 'email.0.address', 'profile.fullname'];

UserSearch = new SearchSource('usersearch', fields, options);
