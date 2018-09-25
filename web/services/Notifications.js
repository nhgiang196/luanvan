/**
 * Created by wangyanyan on 14-3-7.
 */
define( ['app','angular'],function(app,angular){
    app.service('Notifications',['$filter','$timeout','$rootScope',function($filter,$timeout,$rootScope){
        return {
            notifications : [],
            consumers : [],

            addError: function(error) {
                if (!error.type) {
                    error.type = 'error';
                }
                this.add(error);
            },

            addMessage: function(message) {
                if (!message.type) {
                    message.type = 'information';
                }
                this.add(message);
            },

            /**
             *
             * Notification object may specify the following fields:
             *   type: type of the notification (information, warning, error, success)
             *   status: main status line
             *   message: detail message
             *   duration: time duration in ms the notification should be shown to the user
             *
             * @param notification {notification}
             * @returns {undefined}
             */
            add: function(notification) {
                $rootScope.isShowHttpAlter=true;
                $rootScope.httpMessage=notification.message;
                if(notification.status==="error") {
                    $rootScope.httpStatus = "danger";
                }
                if (notification.duration) {
                    this.cleartime(notification.duration);
                }else
                {
                    this.cleartime(8000);
                }
            },
            cleartime:function(time){
                $timeout(function() {
                    $rootScope.isShowHttpAlter=false;
                }, time);
            }
        }

    }]);
});