// AdditionalUserFields = new Mongo.Collection('additionalUserFields');
//
// userFieldsSchema = {
// 	key: {
// 		type: String
// 	},
// 	label: {
// 		type: String
// 	}
// };
//
// AdditionalUserFields.attachSchema(userFieldsSchema);
//
// AdditionalUserFields.find().observe({
// 	added: function() {
// 		var fields = AdditionalUserFields.find();
// 		var extendingSchema = {};
// 		fields.forEach(function(field) {
// 			extendingSchema['profile.fields.'+field.key] = {
// 				type: String,
// 				label: field.label,
// 				optional: true
// 			};
// 		});
// 		Meteor.users.attachSchema(extendingSchema); // wont overwrite but will extend :)
// 	}
// });
