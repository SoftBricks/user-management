// Route configuration pattern to be checked with check
var ROUTE_PAT = {
    name: Match.Optional(String),
    path: Match.Optional(String),
    template: Match.Optional(String),
    layoutTemplate: Match.Optional(String),
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
            return Meteor.subscribe('users');
        }
    },
    showUser: {
        name: "umShowUser",
        path: "/showUser/:userId",
        waitOn: function() {
            return Meteor.subscribe('users');
        }
    },
    editUser: {
        name: "umEditUser",
        path: "/editUser/:userId",
        waitOn: function() {
            return Meteor.subscribe('users');
        }
    },
    addUser: {
        name: "umAddUser",
        path: "/addUser",
        waitOn: function() {
            return Meteor.subscribe('users');
        }
    },
    addGroup: {
        name: "umAddGroup",
        path: "/addGroup",
        waitOn: function() {
            return [Meteor.subscribe('users'), Meteor.subscribe('groups')];
        }
    }
};

UM.prototype.options = {};

// Configured routes
UM.prototype.routes = {};

UM.prototype._initialized = false;

UM.prototype.configure = function() {
    this.options = {};
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

UM.prototype.setupRoutes = function() {

    // Determines the default layout to be used in case no specific one is specified for single routes
    var defaultLayout = UserManagementTemplates.options.defaultLayout || Router.options.layoutTemplate;

    _.each(UserManagementTemplates.routes, function(options, route) {

        var name = options.name; // Default provided...
        var path = options.path; // Default provided...
        var template = options.template || options.name;
        var layoutTemplate = options.layoutTemplate || defaultLayout;
        var waitOn = options.waitOn;

        Router.route(path, {
            name: name,
            template: template,
            layoutTemplate: layoutTemplate,
            waitOn: waitOn
        });
    });
};

Meteor.startup(function() {
    Pages = new Meteor.Pagination(Meteor.users, {
        availableSettings: {
            perPage: 25,
            sort: true,
            filters: true
        },
        templateName: 'umShowUsers',
        itemTemplate: 'userListItem'
    });
});