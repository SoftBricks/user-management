UM.prototype.umAddUserHelpers = {
    save: function () {
        return __('save');
    },
    abort: function () {
        return __('abort');
    },
    users: function(){
        return Meteor.users;
    }
};



UM.prototype.umAddUserRendered = function(){
    $('#createuser').leanModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .3, // Opacity of modal background
            in_duration: 500, // Transition in duration
            out_duration: 500 // Transition out duration
        }
    );
};

UM.prototype.umAddUserEvents = {
};