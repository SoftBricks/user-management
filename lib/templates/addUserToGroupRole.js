UM.prototype.umAddUserToGroupRoleHelpers = {
    rolesInGroup: function () {
        return Meteor.roles.find({groupId: Router.current().params.groupId});
    },
    abort: function () {
        return __('abort');
    },
    currentGroup: function () {
        return Router.current().params.groupId;
    },
    userRoles: function () {
        var userId = Router.current().params.userId;
        var roles = [];
        var group = Groups.findOne(
            {
                _id: Router.current().params.groupId
            });
        var userRoles = _.find(group.users, function(user){
            return user.id === userId;
        });
        _.each(userRoles.roles, function(role){
           roles.push({name:role});
        });
        return roles;

    },
    userIsInRole: function(name){
        var userId = Router.current().params.userId;
        var groupId = Router.current().params.groupId;
        var roles = [];
        var group = Groups.findOne(
            {
                _id: groupId
            });
        var userRoles = _.find(group.users, function(user){
            return user.id === userId;
        });
        return _.includes(userRoles.roles,name);

        //console.log(Roles.userIsInGroupRole(userId, groupId,name));
        //return Roles.userIsInGroupRole(userId, groupId,name);
    },
    abort: function () {
        return __('abort');
    },
    currentGroup: function(){
        return Router.current().params.groupId;
    },
    userRolesI: function(){
        return __('userRoles');
    },
    availableGroupRoles: function(){
        return __('groupRoles');
    }
};

UM.prototype.umAddUserToGroupRoleEvents = {
    'change input[type="checkbox"][name="roles"]': function(e){
        var userId = Router.current().params.userId;
        var groupId = Router.current().params.groupId;
        if(e.target.checked){
            Meteor.call('addUserRoleInGroup',groupId,userId, e.target.id);
        }else{
            Meteor.call('deleteUserRoleInGroup',groupId,userId, e.target.id);
        }
    }
};