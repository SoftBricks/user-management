UserSchema = {
	initialized: false,
	schema: null,
	getSchema: function() {
		var self = this;

		if(self.initialized === true){
			return schema;
		}
		var userSchema = SchemaCol.findOne({identifier: 'user'});

		_.each(userSchema.fields, function(field){
			SchemaPlain.user['profile.'+field.key] = {
				type: eval(field.type),
				label: field.label
			};
		});

        Schemas.users = new SimpleSchema(SchemaPlain.user);
        Meteor.users.attachSchema(Schemas.users);

        this.schema = Schemas.users;
	}
};