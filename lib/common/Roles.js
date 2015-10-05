var Role = {
    name: {
        type: String,
        // unique: true,
        // index: true,
        label: "Name"
    },
    groupId: {
        type: String,
        // index:true,
        optional: true
    }
};

Meteor.roles.attachSchema(Role);
