/**
 * Created by wangyanyan on 14-3-27.
 */
define( ['app','angular'],function(app,angular){
    app.service("Auth",[ '$rootScope','$cookieStore', function($rootScope,$cookieStore) {
       var user=null;
        var username = null;
        var nickname=null;
        var email=null;
        function saveUser(data,callback) {

            if (data){
                authentication.username = data.username;
                authentication.nickname= data.nickname;
                authentication.email=data.email;
                $cookieStore.put('username',data.username);
                console.log(data.nickname);
              callback("OK");
             }else{
                callback(null);
            }

        }
        var authentication = {
            name:nickname,
            username: username,
            email:email,
            saveUser:saveUser,
            isLoggedIn: function(user) {

            }
        };


        // register with root scope
        $rootScope.authentication = authentication;

        return authentication;

    }]);

    function parseAuthentication(response) {
        var data = response.data;

        if (response.status !== 200) {
            return null;
        }

        return {
            name: data.name,
            username: data.username,
            email:data.email
        };
    }
    app.factory("AuthenticationLoader",['Auth','$location','$q','$resource','$cookieStore','$http','$rootScope','EngineApi','Notifications','$translate'
        ,function(Auth,$location,$q,$resource,$cookieStore,$http,$rootScope,EngineApi,Notifications,$translate){
            function goToLogin(){
                $location.path('/login');
            };

            return function(){
                var delay = $q.defer();
                var Token= $location.search()['Token'];
                var Tokencode= $location.search()['code'];
                console.log("-----"+Token);
                console.log("-----"+Tokencode);
                if($location.search()['Language']){
                    var language=$location.search()['Language'];
                    if(language=="en-US"){
                        window.localStorage.lang= "EN";
                    }else {  //zh-CN  zh-TW
                        window.localStorage.lang= "CN";
                    }
                   $translate.use( window.localStorage.lang);
                   // window.location.reload();
                }
                if(!Auth.username && Token){
                 //   /authorize/loginToken
                    EngineApi.DologinValidate().loginToken( {token:Token}).$promise.then(function (datares) {
                        Auth.saveUser(datares,function(authres){
                            if(authres){
                                delay.resolve(datares.username);
                            }else{
                                goToLogin();
                            }
                        });
                    }, function (errResponse) {

                        Notifications.addError({'status': 'error', 'message': "Token don't get User information"});
                        return;
                    });
                }else if(!Auth.username && Tokencode){
                    //   /authorize/loginToken
                    EngineApi.DologinValidate().loginCode( {code:Tokencode}).$promise.then(function (datares) {
                        Auth.saveUser(datares,function(authres){
                            if(authres){
                                delay.resolve(datares.username);
                            }else{
                                goToLogin();
                            }
                        });
                    }, function (errResponse) {
                        alert(errResponse.data);

                        Notifications.addError({'status': 'error', 'message': "Token don't get User information"});

                    });
                }
                else if(!Auth.username & !Token){
                    var authapp =      $resource("/authorize/:operation/:id", { username: "@id" }, {
                        isLogin: { method: 'GET', params : {operation: "isLogin" }}
                    });
                    authapp.isLogin(function(data){
                        console.log(data);
                        if(!data.username){
                            goToLogin();
                        }
                        else{
                            Auth.saveUser(data,function(authres){
                                if(authres){
                                    delay.resolve(data.username);
                                }else{
                                    goToLogin();
                                }
                            });

                        }
                    },function(err){
                        goToLogin();
                    });
                }else{
                  //  delay.resolve({username:Auth.username,name:Auth.name,email:Auth.email});
                    console.log("--222---");
                   if( $cookieStore.get('username')){
                       delay.resolve( $cookieStore.get('username'));

                   }else{
                    goToLogin();
                   }
                }

                return delay.promise;
            }
        }])

});