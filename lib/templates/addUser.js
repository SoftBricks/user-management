UM.prototype.umAddUserHelpers = {
    userschema: function () {
        return Schema.user;
    },
    groups : function(){
        if(SchemaPlain.user['profile.groups'])
            return true;
    },
    save: function () {
        return __('save');
    },
    abort: function () {
        return __('abort');
    }
};