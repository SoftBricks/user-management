Package.describe({
  name: 'softbricks:user-management',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');

  api.use(['templating', 'session'], 'client');

  api.use(['accounts-password', 'underscore', 'check', 'tracker'], ['client', 'server']);

  api.use(['useraccounts:core']);
  api.use(['useraccounts:flow-routing']);

  api.use(['aldeed:autoform@5.4.0']);
  api.imply('aldeed:autoform');
  api.use(['aldeed:simple-schema@1.3.3']);
  api.imply('aldeed:simple-schema');
  api.use(['aldeed:collection2@2.3.3']);
  api.imply('aldeed:collection2');

  api.use('ongoworks:security@1.2.0');
  api.imply('ongoworks:security');

  api.use('tap:i18n@1.6.1', ['client', 'server']);

  api.use('softwarerero:accounts-t9n@1.0.6', ['client', 'server']);

  api.use('email', ['server']);

  api.use('matb33:collection-hooks@0.7.13');

  api.use('stevezhu:lodash@3.6.0');

  api.use('jparker:gravatar@0.3.1');
  api.imply('jparker:gravatar');

  api.use('simple:reactive-method@1.0.0');
  api.imply('simple:reactive-method');

  api.use('meteorhacks:search-source@1.2.0');
  api.imply('meteorhacks:search-source');

  api.use('alanning:roles@1.2.12');
  api.imply('alanning:roles');

  // You must load your package's package-tap.i18n before you load any
  // template
  api.add_files("package-tap.i18n", ["client", "server"]);

  // common
  api.addFiles('lib/common/common.js', ['client','server']);
  api.addFiles('lib/common/Users.js', ['client','server']);
  api.addFiles('lib/common/AdditionalUserFields.js', ['client','server']);
  api.addFiles(['lib/common/Roles.js'], ['client','server']);
  api.addFiles(['lib/common/Groups.js'],['server','client']);
  api.addFiles(['lib/roles.js'],['client','server']);

  // server
  api.addFiles('server/publications.js', 'server');
  api.addFiles('server/methods.js', 'server');
  api.addFiles('server/init.js', 'server');
  api.addFiles('server/userSearch.js', 'server');
  api.addFiles('server/rules.js', ['server']);
  api.addFiles('server/security.js', ['server']);


  // client
  api.addFiles(['lib/core.js', 'lib/server.js'], 'server');
  api.addFiles(['lib/userSearch.js'],'client');
  api.addFiles(['lib/core.js', 'lib/client.js'], 'client');
  api.addFiles(['lib/templates/helpers.js'], 'client');
  api.addFiles(['lib/templates/addUser.js','lib/router.js','lib/templates/editUser.js', 'lib/templates/userSearch.js'], 'client');
  api.addFiles(['lib/templates/showUsers.js','lib/templates/showUser.js'], 'client');

  api.addFiles(['lib/templates/userListItem.js']);

  api.addFiles(['lib/templates/manageRoles.js','lib/templates/addRole.js','lib/templates/addGroupRole.js',
    'lib/templates/addUserToGroupRole.js'], 'client');

  // i18n files
  api.addFiles(['i18n/user.de.i18n.json', 'i18n/user.en.i18n.json'], ['client', 'server']);
  api.addFiles(['i18n/role.de.i18n.json', 'i18n/role.en.i18n.json'], ['client', 'server']);
  api.addFiles(['i18n/group.de.i18n.json', 'i18n/group.en.i18n.json'], ['client', 'server']);
  api.addFiles(['i18n/errors.de.i18n.json', 'i18n/errors.en.i18n.json'], ['client', 'server']);
  api.addFiles(['i18n/actions.de.i18n.json', 'i18n/actions.en.i18n.json'], ['client', 'server']);

  api.export('UserManagementTemplates', ['client', 'server']);
  api.export('UM',['client','server']);
  api.export('SchemaPlain',['client','server']);
  api.export('checkRights',['server']);
  api.export('__', ['client','server']);
  api.export('UserSearch', ['client', 'server']);
  api.export('AdditionalUserFields', ['client']);

});

//Package.onTest(function(api) {
//  api.use('tinytest');
//  api.use('softbricks:user-management');
//  api.addFiles('softbricks:user-management-tests.js');
//});
