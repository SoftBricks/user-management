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
  api.use(['aldeed:autoform@4.2.2']);
  api.imply('aldeed:autoform');
  api.use(['aldeed:simple-schema@1.3.0']);
  api.imply('aldeed:simple-schema');
  api.use(['aldeed:collection2@2.3.2']);
  api.imply('aldeed:collection2');
  api.use('tap:i18n@1.4.0', ['client', 'server']);

  api.use('email', ['server']);

  api.use('alethes:pages@1.8.3');
  api.imply('alethes:pages');
  api.use('stevezhu:lodash@1.0.2');
  api.imply('stevezhu:lodash');
  api.use('jparker:gravatar@0.3.1');
  api.imply('jparker:gravatar');


  // You must load your package's package-tap.i18n before you load any
  // template
  api.add_files("package-tap.i18n", ["client", "server"]);

  // server
  api.addFiles('server/publications.js', 'server');
  api.addFiles('server/methods.js', 'server');
  api.addFiles('server/init.js', 'server');

  // client
  api.addFiles(['lib/core.js', 'lib/server.js'], 'server');
  api.addFiles(['lib/core.js', 'lib/client.js'], 'client');
  //api.addFiles(['lib/umShowUsers.js'],'client');
  api.addFiles(['lib/templates/addUser.js','lib/router.js','lib/templates/editUser.js', 'lib/templates/userSearch.js'], 'client');
  api.addFiles(['lib/templates/showUsers.js','lib/templates/showUser.js'], 'client');
  api.addFiles('lib/templates/schema.js', ['client', 'server']);

  api.addFiles(['lib/templates/userListItem.js']);

  // i18n files
  api.addFiles(['i18n/user.de.i18n.json', 'i18n/user.en.i18n.json'], ['client', 'server']);
  api.addFiles(['i18n/group.de.i18n.json', 'i18n/group.en.i18n.json'], ['client', 'server']);
  api.addFiles(['i18n/errors.de.i18n.json', 'i18n/errors.en.i18n.json'], ['client', 'server']);
  api.addFiles(['i18n/actions.de.i18n.json', 'i18n/actions.en.i18n.json'], ['client', 'server']);

  api.export('UserManagementTemplates', ['client', 'server']);
  api.export('Schema',['client','server']);
  api.export('UM',['client','server']);
  api.export('SchemaPlain',['client','server']);
  
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('softbricks:user-management');
  api.addFiles('softbricks:user-management-tests.js');
});
