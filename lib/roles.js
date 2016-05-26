if (typeof Roles !== 'undefined') {
    /**
     * check whether user has group role or not
     * @param String userId
     * @param String groupId
     * @param String role
     * @return id
     */
  Roles.userIsInGroupRole = function (userId, groupId, role) {
    if (typeof role !== 'undefined' &&
            typeof groupId !== 'undefined' &&
            typeof userId !== 'undefined') {

        var roles = [];
        var group = Groups.findOne(
            {
              _id: groupId
            });
        var userRoles = _.find(group.users, function (user) {
            if (user.id === userId)
                roles.push(user.roles);
          });
        return _.includes(roles, role);
      } else {
        throw new Meteor.Error('userIsInGroupRole', 'Failed to check roles');
      }
  };
    /**
     * add group role
     * @param String groupId
     * @param String role
     * @return id
     */
  Roles.addGroupRole = function (groupId, role) {
    if (Roles.userIsInGroupRole(Meteor.userId(), groupId, 'admin') || Roles.userIsInRole(Meteor.userId(), ['superAdmin', 'admin'])) {
        var id,
            match;

        if (!role
                || 'string' !== typeof role
                || role.trim().length === 0) {
            return;
          }

        try {
            id = Meteor.roles.insert({ 'name': role.trim(), 'groupId': groupId });
            return id;
          } catch (e) {
              if (e.name !== 'MongoError') throw e;
              match = e.err.match(/^E11000 duplicate key error index: ([^ ]+)/);
              if (!match) throw e;
              if (match[1].indexOf('$name') !== -1)
                throw new Meteor.Error(403, 'Role already exists.');
              throw e
            }
      } else {
        throw new Meteor.error('addGroupRole', 'You are not allowed to add a groupRole')
      }
  };
    /**
     * delete group role
     * @param String groupId
     * @param String role
     */
  Roles.deleteGroupRole = function (groupId, role) {
    if (Roles.userIsInGroupRole(Meteor.userId(), groupId, 'admin') || Roles.userIsInRole(Meteor.userId(), ['superAdmin', 'admin'])) {
        if (!role) return;

        var groupsUser = Groups.findOne({ _id:groupId }).users;
        var userInGroupsToUpdate = [];

        _.each(groupsUser, function (user) {
            if (_.contains(user.roles, role))
                userInGroupsToUpdate.push({ userId:user.id, role:role });
          });

        _.each(userInGroupsToUpdate, function (information) {
            Meteor.call('deleteUserRoleInGroup', groupId, information.userId, information.role);
          });

        var thisRole = Meteor.roles.findOne({ name: role, groupId: groupId });
        if (thisRole) {
            Meteor.roles.remove({ _id: thisRole._id });
          }
      } else {
        throw new Meteor.error('deleteGroupRole', 'You are not allowed to remove a groupRole')
      }
  };
    /**
     * find group roles
     * @param String groupId
     * @return cursor
     */
  Roles.rolesInGroup = function (groupId) {
    return Meteor.roles.find({ groupId: groupId });
  }
}
