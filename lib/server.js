UserManagementTemplates = new UM();

// for(var i=0;  i< 500; i++){
//    Meteor.setInterval(function () {
//        var random = generatePassword();
//        var profile = {
//            superAdmin: false,
//            admin: false,
//            fullname: generatePassword(),
//            fields: [
//                {
//                    key: random,
//                    value: random
//                }
//            ]
//        };

//        var user = {
//            email: generatePassword() + "@" + generatePassword() + ".de",
//            password: generatePassword(),
//            username: generatePassword(),
//            profile: profile
//        };

//        Accounts.createUser(user);
//    },20);
// }