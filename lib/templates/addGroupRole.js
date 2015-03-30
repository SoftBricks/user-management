UM.prototype.umAddGroupRoleHelper = {
    rolesInGroup: function(){
        return Meteor.roles.find({groupId: Router.current().params.groupId});
    },
    abort: function () {
        return __('abort');
    },
    currentGroup: function(){
        return Router.current().params.groupId;
    },
    roles: function(){
        return __('roles');
    },
    addRole: function(){
        return __('addRole');
    },
    add: function(){
        return __('add');
    },
    remove: function(){
        return __('remove');
    }
};

UM.prototype.umAddGroupRoleEvents = {
'click #addGroupRoleButton': function(e){
    var groupId = Router.current().params.groupId;
    var role = $('#addGroupRole').val();
    Roles.addGroupRole(groupId, role);
},
    'click .removeRole':function(e){
        var groupId = Router.current().params.groupId;
        var roleName = e.target.id;
        Roles.deleteGroupRole(groupId, roleName);
    }
};