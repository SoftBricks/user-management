UserSchema = {
    initialized: false,
    schema: null,
    extendSchema: function () {
        var self = this;

        if (self.initialized === true) {
            return schema;
        }
        var userSchema = SchemaCol.findOne({identifier: 'user'});
        _.each(userSchema.fields, function (field) {
            SchemaPlain.user['profile.' + field.key] = {
                type: eval(field.type),
                label: field.label,
                optional: true
            };
        });

        Schemas.users = new SimpleSchema(SchemaPlain.user);
        Meteor.users.attachSchema(Schemas.users);

        this.schema = Schemas.users;
    },

    /*
     * extends the user schema and updates the stored schema
     * @param Object schemaObject
     * @return Boolean
     *      true = schema updated
     *      false = schema not updated
     */
    storeSchema: function (type, label, key) {

        schemaObject = {
            type: type,
            label: label,
            key: key
        };

        if (schemaObject) {
            var schema = SchemaCol.findOne({identifier: 'user'});
            if (typeof schema !== 'undefined') {
                SchemaCol.update({identifier: 'user'}, {
                    $addToSet: {
                        fields: schemaObject
                    }
                });
            } else {
                SchemaCol.insert({
                    fields: [schemaObject],
                    identifier: "user"
                });
            }
            this.extendSchema();
        } else {
            return false;
        }
        return true;
    },
    /*
     * returns the current user schema - if changed it returns from database
     * @return Object
     *      current User Schema
     */
    getGlobalKeys: function () {
        var schemaGlobal = SchemaCol.findOne({identifier: 'user'}).fields;
        var keys = [];
        _.each(schemaGlobal, function(obj){
            keys.push({name: 'profile.'+obj.key});
        });
        return keys;
    },
    /*
     * Changes the current user schema -> removes a key and updates the database
     * @return Boolean
     *      true = updated schema
     *      false = key to remove does not exists
     */
    removeUserKey: function (key) {
        var schema = SchemaCol.findOne({identifier: 'user'});
        var updatedSchema = {};
        var removeObj = {};
        updatedSchema = _.map(schema.user, function (obj) {
            if (obj.key !== key) {
                return obj
            }
        });
        if (Object.getOwnPropertyNames(updatedSchema).length > 0) {
            SchemaCol.update({identifier: 'user'}, {
                $pull: {
                    user: updatedSchema
                }
            });
            return true;
        } else {
            return false;
        }
    }
};

