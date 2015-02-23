#User Management
User Management is a suite of packages for the Meteor.js platform. It provides customizable user management UI templates for different front-end frameworks (currently only Polymer, but more will follow soon). At the moment it includes Forms for listing, showing, editing and creatign users. This package depends on and is built based on the useraccounts package suite, which you should look into if you are not familiar with it. (https://github.com/meteor-useraccounts/core)

#Documentation
##Features
- security aware
- robust validation
- fully reactive
- easily styleable and extandable

##Quick Start
###Available Versions
- softbricks:user-management-polymer styled for [Polymer](https://www.polymer-project.org/)
- plus others coming soon

###Setup
Choos one of the packages from the available styled versions and istall it:

    meteor add softbricks:user-management-polymer
    
<b>Note 1:</b> no additional packages nor CSS/LESS/SASS files providing styles are included by useraccounts packages. This is to let you choose your preferred way to include them!

<b>Note 2:</b> You don't have to add softbricks:user-management to your app! It is automatically added when you add useraccounts:<something>...

###Templates
available Templates for you to use in your code:
- umShowUsers
- umShowUser
- umEditUser
- umAddUser

You can add these to your code as you would with any other template:

    {{> umShowUsers}}
    
##Basic Customization
###I18n Support (Not done yet!)
i18n is achieved using [accounts-t9n](https://atmospherejs.com/softwarerero/accounts-t9n). The only thing you have to do is ensure

    T9n.setLanguage('<lang>');
    
is called somewhere, whenever you want to switch language.
###Configuration API
For configuration and interaction there is the UserManagementTemplates Object, which is exposed globally for you to use.
There are basically two different ways to interact with UserManagementTemplates for basic configuration:
- UserManagementTemplates.configureRoute(route_code, options);
- (UserManagementTemplates.configure(options); coming soon)

<b>These functions should be called in top-level code, not inside Meteor.startup().</b><br>
There is no specific order for the above calls to be effective, and you can do many of them possibly in different files

### Routing
There are no routes provided by default. But you can easily configure routes for showing a user list, showing specific users, editing users and adding users using UserManagementTemplates.configureRoute. This is done internally relying on the Iron-Router package.<br>
The simplest way is to make the call passing just the route code (available codes are: showUsers, showUser, editUser, addUser):

    UserManagementTemplates.configureRoute('showUsers');
    
This will setup the show users route with a list of all registered users.<br>
But you can also pass in more options to adapt it to your needs with:

    UserManagementTemplates.configureRoute(route_code, options);
    
The following is a complete example of a route configuration:

    AccountsTemplates.configureRoute('signIn', {
        name: 'signin',
        path: '/login',
        template: 'myLogin',
        layoutTemplate: 'myLayout',
    });

Fields `name`, `path`, `template`, and `layoutTemplate` are passed down directly to Router.map
<table>
    <tr>
        <th>Action</th>
        <th>route_code</th>
        <th>Route Name</th>
        <th>Route Path</th>
        <th>Template</th>
    </tr>
    <tr>
        <td>list all users</td>
        <td>showUsers</td>
        <td>umShowUsers</td>
        <td>/showUsers</td>
        <td>umShowUsers</td>
    </tr>
    <tr>
        <td>show details of one user</td>
        <td>showUser</td>
        <td>umShowUser</td>
        <td>/showUser/:userId</td>
        <td>umShowUser</td>
    </tr>
    <tr>
        <td>edit a user</td>
        <td>editUser</td>
        <td>umEditUser</td>
        <td>/editUser/:userId</td>
        <td>umEditUser</td>
    </tr>
    <tr>
        <td>add a user</td>
        <td>addUser</td>
        <td>umAddUser</td>
        <td>/addUser</td>
        <td>umAddUser</td>
    </tr>
</table>
If `layoutTemplate` is not specified, it falls back to what is currently set up with Iron-Router
