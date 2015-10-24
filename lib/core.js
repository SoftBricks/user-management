// Route configuration pattern to be checked with check
var ROUTE_PAT = {
    name: Match.Optional(String),
    path: Match.Optional(String),
    template: Match.Optional(String),
    layoutTemplate: Match.Optional(String),
    yieldRegions: Match.Optional(Object)
};

var SCHEMA_FIELD_PAT = {
    key: String,
    type: Match.Any,
    label: String,
    optional: Match.Optional(Boolean)
};

CONFIG_PAT = {
    extendedSignUp: Match.Optional(Boolean),
    showFields: Match.Optional(Object),
    userItemPrimaryText: Match.Optional(Function),
    userItemSecondaryText: Match.Optional(Function),
    openEnrollmentDialog: Match.Optional(Function),
    openDeleteUserDialog: Match.Optional(Function)
};

// Constructor
UM = function() {

};

/*
    Routes configuration can be done by calling UserManagementTemplates.configureRoute with the route name and the
    following options in a separate object. E.g. UserManagementTemplates.configureRoute("gingIn", option);
        name:           String (optional). A unique route"s name to be passed to iron-router
        path:           String (optional). A unique route"s path to be passed to iron-router
        template:       String (optional). The name of the template to be rendered
        layoutTemplate: String (optional). The name of the layout to be used
*/

UM.prototype.ROUTE_DEFAULT = {
    showUsers: {
        name: "umShowUsers",
        path: "/showUsers",
        waitOn: function() {
            return [Meteor.subscribe('users'), Meteor.subscribe('additionalUserFields')];
        }
    },
    showUser: {
        name: "umShowUser",
        path: "/showUser/:userId",
        waitOn: function() {
            return [Meteor.subscribe('users'), Meteor.subscribe('additionalUserFields')];
        }
    },
    editUser: {
        name: "umEditUser",
        path: "/editUser/:userId",
        waitOn: function() {
            return [Meteor.subscribe('users'),Meteor.subscribe('roles'), Meteor.subscribe('additionalUserFields')];
        }
    },
    addUser: {
        name: "umAddUser",
        path: "/addUser",
        waitOn: function() {
            return [Meteor.subscribe('users'), Meteor.subscribe('additionalUserFields')];
        }
    },
    addGroup: {
        name: "umAddGroup",
        path: "/addGroup",
        waitOn: function() {
            return [Meteor.subscribe('users'), Meteor.subscribe('additionalUserFields')];
        }
    },
    showGroups: {
        name: "umShowGroups",
        path: "/showGroups",
        waitOn: function() {
            return [Meteor.subscribe('groups')];
        }
    },
    showGroup: {
        name: "umShowGroup",
        path: "/showGroup/:groupId",
        waitOn: function() {
            return [Meteor.subscribe('groups', Router.current().params.groupId), Meteor.subscribe('usersInGroup', Router.current().params.groupId)];
        }
    },
    editGroup: {
        name: "umEditGroup",
        path: "/editGroup/:groupId",
        waitOn: function() {
            return [Meteor.subscribe('groups', Router.current().params.groupId), Meteor.subscribe('usersInGroup', Router.current().params.groupId)];
        }
    },
    manageRoles: {
        name: "umManageRoles",
        path: "/manageRoles",
        waitOn: function(){
            return Meteor.subscribe('roles');
        }
    },
    addRole: {
        name: "umAddRole",
        path: "/addRole",
        waitOn: function(){
            //return Meteor.subscribe('roles');
        }
    },
    addGroupRole: {
        name: "umAddGroupRole",
        path: "/editGroup/:groupId/addGroupRole",
        waitOn: function(){
            return [Meteor.subscribe('roles'), Meteor.subscribe('groups', Router.current().params.groupId)];
        }
    },
    addUserToGroupRole: {
        name: "umAddUserToGroupRole",
        path: "/editGroup/:groupId/addUserToGroupRole/:userId",
        waitOn: function(){
            return [Meteor.subscribe('roles'), Meteor.subscribe('groups', Router.current().params.groupId)];
        }
    }
};

UM.prototype.texts = {
  button: {
    'upload': function() {
      return __('upload');
    }
  }
};

UM.prototype.options = {
  extendedSignUp: false,
  userItemPrimaryText: function (user) {
    return user.username;
  },
  userItemSecondaryText: function (user) {
    return user.emails[0].address;
  },
  openEnrollmentDialog: function () {},
  openDeleteUserDialog: function () {}
};

//Hook for removing users
UM.prototype.onRemoveUser = [];

// Configured routes
UM.prototype.routes = {};

UM.prototype._initialized = false;

UM.prototype.configure = function(config) {

  // Updates the current configuration
  check(config, CONFIG_PAT);
  this.options = _.defaults(config, this.options);

  if (!!this.options.showFields) {
    this.options.showFields = this.transformShowFieldsToArr(this.options.showFields);
  }
};

UM.prototype.configureRoute = function(route, options) {
    check(route, String);
    check(options, Match.OneOf(undefined, ROUTE_PAT));
    options = _.clone(options);
    // Route Configuration can be done only before initialization
    if (this._initialized)
        throw new Error("Route Configuration can be done only before UserManagementTemplates._init!");
    // Only allowed routes can be configured
    if (!(route in this.ROUTE_DEFAULT))
        throw new Error("Unknown Route!");

    // Possibly adds a initial / to the provided path
    if (options && options.path && options.path[0] !== "/")
        options.path = "/" + options.path;
    // Updates the current configuration
    options = _.defaults(options || {}, this.ROUTE_DEFAULT[route]);
    this.routes[route] = options;
};

UM.prototype.transformShowFieldsToArr = function (showFields) {
    var fields = [];
    _.each(showFields, function (field, key) {
        field["key"] = key;
        fields.push(field);
    });
    return fields;
}

UM.prototype.setupRoutes = function() {
    //
    //// Determines the default layout to be used in case no specific one is specified for single routes
    //var defaultLayout = UserManagementTemplates.options.defaultLayout || Router.options.layoutTemplate;
    //
    //_.each(UserManagementTemplates.routes, function(options, route) {
    //
    //    var name = options.name; // Default provided...
    //    var path = options.path; // Default provided...
    //    var template = options.template || options.name;
    //    var layoutTemplate = options.layoutTemplate || defaultLayout;
    //    var waitOn = options.waitOn;
    //    var yieldRegions = options.yieldRegions;
    //    var onBeforeAction = options.onBeforeAction;
    //
    //    Router.route(path, {
    //        name: name,
    //        template: template,
    //        layoutTemplate: layoutTemplate,
    //        waitOn: waitOn,
    //        yieldRegions: yieldRegions,
    //        onBeforeAction: onBeforeAction
    //    });
    //});
};

UM.prototype.setupSchemaMessages = function() {
    SimpleSchema.messages({
        required: __('schema-required'),
        minString: __('schema-minString'),
        maxString: __('schema-maxString'),
        minNumber: __('schema-minNumber'),
        maxNumber: __('schema-maxNumber'),
        minDate: __('schema-minDate'),
        maxDate: __('schema-maxDate'),
        minCount: __('schema-minCount'),
        maxCount: __('schema-maxCount'),
        noDecimal: __('schema-noDecimal'),
        notAllowed: __('schema-notAllowed'),
        expectedString: __('schema-expectedString'),
        expectedNumber: __('schema-expectedNumber'),
        expectedBoolean: __('schema-expectedBoolean'),
        expectedArray: __('schema-expectedArray'),
        expectedObject: __('schema-expectedObject'),
        expectedConstructor: __('schema-expectedConstructor'),
        regEx: [{
            msg: __('schema-validRegularEx')
        }, {
            exp: SimpleSchema.RegEx.Email,
            msg: __('schema-validEmail')
        }, {
            exp: SimpleSchema.RegEx.WeakEmail,
            msg: __('schema-validEmail')
        }, {
            exp: SimpleSchema.RegEx.Domain,
            msg: __('schema-validDomain')
        }, {
            exp: SimpleSchema.RegEx.WeakDomain,
            msg: __('schema-validDomain')
        }, {
            exp: SimpleSchema.RegEx.IP,
            msg: __('schema-validIp46')
        }, {
            exp: SimpleSchema.RegEx.IPv4,
            msg: __('schema-validIp4')
        }, {
            exp: SimpleSchema.RegEx.IPv6,
            msg: __('schema-validIp6')
        }, {
            exp: SimpleSchema.RegEx.Url,
            msg: __('schema-validUrl')
        }, {
            exp: SimpleSchema.RegEx.Id,
            msg: __('schema-validId')
        }],
        keyNotInSchema: __('schema-keyNotInSchema'),
        passwordMismatch: __('schema-passwordMismatch'),
        notUniqueUsername: __('schema-notUniqueUsername'),
        notUniqueEmail: __('schema-notUniqueEmail'),
        groupnameExisting: __('schema-groupnameExisting'),
        groupnameNotExisting: __('schema-groupnameNotExisting'),
        parentGroupNotSelf: __('schema-parentGroupNotSelf')
    });
};

Meteor.startup(function() {
    //Pages = new Meteor.Pagination(Meteor.users, {
    //    auth: function(skip, subscription) {
    //        return publishUsers(subscription);
    //    },
    //    availableSettings: {
    //        perPage: 25,
    //        sort: true,
    //        filters: true
    //    },
    //    templateName: 'umShowUsers',
    //    itemTemplate: 'userListItem'
    //});
    //if (Meteor.isClient) {
    //    Tracker.autorun(function() {
    //        var user = Meteor.users.findOne(Meteor.userId());
    //        Pages.reload();
    //    });
    //}
});
