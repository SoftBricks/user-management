UM.prototype.umAddUserHelpers = {
    schema: function(){
        return Schemas.users;
        //return ReactiveMethod.call("getCollection2UserSchema");
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
        //var schema = ReactiveMethod.call('getUserSchemaKeys');
        //var tempSchema = new SimpleSchema(schema);
        //if(typeof schema !== 'undefined'){
        //    return schema['profile.global'];
        //}
        var schemaGlobal = SchemaCol.findOne({identifier: 'user'}).user;
        console.log("schemaGlobal", schemaGlobal);
        var keys = [];
        _.each(schemaGlobal, function(obj){
            keys.push(obj.key);
        });
        return keys;
    },
    key: function(){
        //console.log(this);
    }
};