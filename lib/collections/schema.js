SchemaCol = new Mongo.Collection('schema');
console.log(Schemas);
SchemaCol.attachSchema(Schemas.schema);

var schema = SchemaCol.findOne({identifier: 'user'});
if(typeof schema !== 'undefined') {
    console.log("attaching new schema");
    _.each(schema.user, function(schemaObj){
        console.log("calling merge");
        Meteor.call('flattenObject', schemaObj, function(err, res){
            Meteor.call('mergeObjectInSchema',res);
        });
    });
}else{
    console.log("undefined");
    Meteor.users.attachSchema(Schemas.users);
}