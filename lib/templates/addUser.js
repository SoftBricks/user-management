UM.prototype.umAddUserHelpers = {
    //userschema: function () {
    //    //var schema = ReactiveMethod.call('getCollection2UserSchema');
    //    //console.log(schema);
    //    //return schema;
    //    return Schema.user;
    //},
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
        var schema = ReactiveMethod.call('getUserSchemaKeys');
        var tempSchema = new SimpleSchema(schema);
        //if(typeof schema !== 'undefined'){
        //    return schema['profile.global'];
        //}
    },
    key: function(){
        //console.log(this);
    }
};