Template.registerHelper('umText', function (type, key) {
  if (UserManagementTemplates.texts.hasOwnProperty(type)) {
    if (UserManagementTemplates.texts[type].hasOwnProperty(key)) {
      return UserManagementTemplates.texts[type][key]();
    }
  }
});
