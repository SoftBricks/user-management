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

  api.use(['templating'], 'client');
  api.use(['accounts-password', 'underscore', 'check'], ['client', 'server']);
  api.use(['useraccounts:core']);
  api.use(['aldeed:autoform@4.2.2']);
  api.imply('aldeed:autoform');
  api.use(['aldeed:simple-schema@1.3.0']);
  api.imply('aldeed:simple-schema');

  // server
  api.addFiles('server/publications.js', 'server');
  api.addFiles('server/methods.js', 'server');
  api.addFiles('server/init.js', 'server');

  // client
  api.addFiles(['lib/core.js', 'lib/server.js'], 'server');
  api.addFiles(['lib/core.js', 'lib/client.js'], 'client');
  api.addFiles(['lib/umShowUsers.js', 'lib/templates/addUser.js'],'client');
  api.addFiles('lib/templates/schema.js', ['client', 'server']);
  api.addFiles(['lib/templates/createUser.html','lib/templates/createUser.js','lib/router.js'], 'client');

  api.export('UserManagementTemplates', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('softbricks:user-management');
  api.addFiles('softbricks:user-management-tests.js');
});
