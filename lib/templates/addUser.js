UM.prototype.umAddUserHelpers = {
    schema: function(){
        SchemaManager.extendSchema();
        return Schemas.users;
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
    },
    globalFields : function () {

        return SchemaManager.getGlobalKeys()
    }
};