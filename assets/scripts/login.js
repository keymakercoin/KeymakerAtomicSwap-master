var Login = function() {


    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "showDuration": "5000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    var handleLogin = function() {

        $('.login-form').validate({
            //errorElement: 'span', //default input error message container
            //errorClass: 'help-block', // default input error message class
            //focusInvalid: false, // do not focus the last invalid input
            rules: {
                password: {
                    required: true
                }
            },

            messages: {
                password: {
                    required: "Password is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                var IguanaLoginData = {
                    'handle': $('#wallet-handle').val(),
                    'password': $('#password').val(),
                    'timeout': '2592000'
                }
                //console.log('== Data Collected ==');
                //console.log(IguanaLoginData);
                // Use AJAX to post the object to login user
                $.ajax({
                    type: 'GET',
                    data: IguanaLoginData,
                    url: 'http://127.0.0.1:7778/api/bitcoinrpc/walletpassphrase',
                    dataType: 'text',
                    success: function(data, textStatus, jqXHR) {
                        var LoginOutput = JSON.parse(data);
                        var LoginDataToStore = JSON.stringify(data);
                        sessionStorage.setItem('IguanaActiveAccount', LoginDataToStore);
                        console.log(sessionStorage);
                        console.log('== Data OutPut ==');
                        console.log(LoginOutput);

                        if (LoginOutput.result === 'success') {
                            console.log('Success');
                            //swal("Success", "Login Successfully.", "success");
                            toastr.success("Login Successfull", "Account Notification")
                            
                            $('#password').val('')
                            $('#wallet-login').hide();
                            $('#wallet-core').fadeIn();
                            $('body').removeClass( "page-login layout-full page-dark" ).addClass( "" );
                            $('link[id=loginStyle]')[0].disabled=true;
                            location.reload();
                        }
                        else {
                            // If something goes wrong, alert the error message that our service returned
                            //swal("Oops...", "Something went wrong!", "error");
                            if (LoginOutput.error === 'bitcoinrpc needs coin') {
                                toastr.info("Seems like there's no coin running. Activating BTC.", "Coin Notification");
                                var logincoinnames = []; $('#logincoinslist input[type=checkbox]:checked').each(function() { logincoinnames.push(this.value); }); console.log(logincoinnames);
                                $.each(logincoinnames, function( index, value ) {
                                    if ( value == 'BTC' ) {
                                        var logincoinmodeval = $("input[name='logincoinbtcmode']:checked").val();
                                        var logincoin_data = {"coin": value, "mode": logincoinmodeval};
                                        Iguana_addcoinLogin(logincoin_data);
                                    }
                                    if ( value == 'BTCD' ) {
                                        var logincoinmodeval = $("input[name='logincoinbtcdmode']:checked").val();
                                        var logincoin_data = {"coin": value, "mode": logincoinmodeval};
                                        Iguana_addcoinLogin(logincoin_data);
                                    }
                                });
                            } else {
                                toastr.warning("Opps... Something went wrong!", "Account Notification");
                            }
                            console.log(data.statusText);
                            console.log(textStatus);
                            console.log(jqXHR);
                        }
                    },
                    error: function(xhr, textStatus, error) {
                        console.log('failure');
                        console.log(xhr.statusText);
                        if ( xhr.readyState == 0 ) {
                            Iguana_ServiceUnavailable();
                        }
                        console.log(textStatus);
                        console.log(error);
                        //swal("Oops...", "Something went wrong!", "error");
                        //toastr.warning("Opps... Something went wrong!", "Account Notification")
                    }
                });
                
                $('#section-dashboard').show();
                $('#section-easydex').hide();
                $('#section-about-iguana').hide();
                $('#nav-dashboard').removeClass( "" ).addClass( "active open" );
                $('#nav-easydex').removeClass( " active open" ).addClass( "" );
                $('#nav-about-iguana').removeClass( " active open" ).addClass( "" );
                //form.submit(); // form validation success, call ajax form submit
            }
        });

        $('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });

        $('input[name=PassPhraseOptions]').on('change', function() {
            if ( $('input[name=PassPhraseOptions]:checked', '.register-form').val() === 'PassPhraseOptionsIguana' ) {
                console.log('PassPhraseOptionsIguana');
                $('#walletseed').text(PassPhraseGenerator.generatePassPhrase(256))
            }
            if ( $('input[name=PassPhraseOptions]:checked', '.register-form').val() === 'PassPhraseOptionsWaves' ) {
                console.log('PassPhraseOptionsWaves');
                $('#walletseed').text(PassPhraseGenerator.generatePassPhrase(160))
            }
            if ( $('input[name=PassPhraseOptions]:checked', '.register-form').val() === 'PassPhraseOptionsNXT' ) {
                console.log('PassPhraseOptionsNXT');
                $('#walletseed').text(PassPhraseGenerator.generatePassPhrase(128))
            }
        });
    }

    var handleRegister = function() {

        $('.register-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {

                walletseed: {
                    required: true
                },

                rwalletseed: {
                    equalTo: "#walletseed"
                },

                /*password: {
                    required: true
                },
                rpassword: {
                    equalTo: "#register_password"
                },*/

                
            },

            messages: {
                rwalletseed: {
                    required: "Wallet seed is required."
                }
            },

            

            invalidHandler: function(event, validator) { //display error alert on form submit   

            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                if (element.attr("name") == "backupconfirm") { // insert checkbox errors after the container                  
                    error.insertAfter($('#register_backupconfirm_error'));
                } else if (element.closest('.input-icon').size() === 1) {
                    error.insertAfter(element.closest('.input-icon'));
                } else {
                    error.insertAfter(element);
                }
            },

            submitHandler: function(form) {
                swal({
                    title: 'Have you taken backup?',
                    text: "You'll only see and use your wallet passphrase this time. Make sure you have it backed up. Also make sure to have your wallet password backed up. Without both you'll not be able to access your wallet again!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, I have taken backup.'
                }).then(function() {
                    //swal('Deleted!', 'Your file has been deleted.', 'success' );
                    var IguanaCreateWaletData = {
                        'password': $('#rpassword').val(),
                        'passphrase': $('#walletseed').val()
                    }
                    //console.log('== Data Collected ==');
                    //console.log(IguanaCreateWaletData);
                    // Use AJAX to post the object to login user
                    $.ajax({
                        type: 'GET',
                        data: IguanaCreateWaletData,
                        url: 'http://127.0.0.1:7778/api/bitcoinrpc/encryptwallet',
                        dataType: 'text',
                        success: function(data, textStatus, jqXHR) {
                            var CreateWalletOutput = JSON.parse(data);
                            //console.log(sessionStorage);
                            //console.log('== Data OutPut ==');
                            //console.log(CreateWalletOutput);

                            if (CreateWalletOutput.result === 'success') {
                                console.log('Success');
                                //swal("Success", "Login Successfully.", "success");
                                toastr.success("Wallet created successfully", "Account Notification")

                                $('#wallet-handle').val('')
                                $('#password').val('')
                            }
                            else {
                                // If something goes wrong, alert the error message that our service returned
                                //swal("Oops...", "Something went wrong!", "error");
                                toastr.warning("Opps... Something went wrong!", "Account Notification")
                                console.log(CreateWalletOutput)
                                if (CreateWalletOutput.error === 'bitcoinrpc needs coin') {
                                    toastr.info("Seems like there's no coin running. Activating BTC.", "Coin Notification");
                                    var logincoinnames = []; $('#logincoinslist input[type=checkbox]:checked').each(function() { logincoinnames.push(this.value); }); console.log(logincoinnames);
                                    $.each(logincoinnames, function( index, value ) {
                                        if ( value == 'BTC' ) {
                                            var logincoinmodeval = $("input[name='logincoinbtcmode']:checked").val();
                                            var logincoin_data = {"coin": value, "mode": logincoinmodeval, "reload": false};
                                            Iguana_addcoin(logincoin_data);
                                            if (index == '0' ) {
                                                console.log(value+' '+index);
                                                $('.register-form').submit();
                                                toastr.success("Wallet created successfully", "Account Notification")
                                            }
                                        }
                                        if ( value == 'BTCD' ) {
                                            var logincoinmodeval = $("input[name='logincoinbtcdmode']:checked").val();
                                            var logincoin_data = {"coin": value, "mode": logincoinmodeval, "reload": false};
                                            Iguana_addcoin(logincoin_data);
                                            if (index == '0' ) {
                                                console.log(value+' '+index);
                                                $('.register-form').submit();
                                                toastr.success("Wallet created successfully", "Account Notification")
                                            }
                                        }
                                    });
                                } else {
                                    toastr.warning("Opps... Something went wrong!", "Account Notification");
                                }
                                console.log(data.statusText);
                                if ( data.readyState == 0 ) {
                                    Iguana_ServiceUnavailable();
                                }
                                console.log(textStatus);
                                console.log(jqXHR);

                            }
                        },
                        error: function(xhr, textStatus, error) {
                            console.log('failure');
                            console.log(xhr.statusText);
                            if ( xhr.readyState == 0 ) {
                                Iguana_ServiceUnavailable();
                            }
                            console.log(textStatus);
                            console.log(error);
                            //swal("Oops...", "Something went wrong!", "error");
                            toastr.warning("Opps... Something went wrong!", "Account Notification")
                            
                        }
                    });

                    $('#section-login').fadeIn();
                    $('#section-register').hide();
                    $('#walletseed').text(PassPhraseGenerator.generatePassPhrase(256));
                    $('#rwalletseed').val('')
                    $('#register_password').val('')
                    $('#rpassword').val('')
                })

                //form.submit();
            }
        });


        $('.register-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.register-form').validate().form()) {
                    $('.register-form').submit();
                }
                return false;
            }
        });

        jQuery('#register-btn').click(function() {
            event.preventDefault();
            $('#section-login').hide();
            $('#section-register').fadeIn();
            $('#walletseed').text(PassPhraseGenerator.generatePassPhrase(256));
        });

        jQuery('#register-back-btn').click(function() {
            event.preventDefault();
            $('#section-login').fadeIn();
            $('#section-register').hide();
        });


    }

    var handleLogout = function() {

        $('#logout-account').click(function() {
            $.ajax({
                type: 'GET',
                url: 'http://127.0.0.1:7778/api/bitcoinrpc/walletlock',
                dataType: 'text',
                success: function(data, textStatus, jqXHR) {
                    var LogoutOutput = JSON.parse(data);
                    sessionStorage.clear();
                    console.log('== Logout Data OutPut ==');
                    console.log(LogoutOutput);

                    if (LogoutOutput.result === 'success') {
                        console.log('Success');
                        //swal("Success", "Logout Successfully.", "success");
                        toastr.success("Logout Successfull", "Account Notification")
                        $('#wallet-login').show();
                        $('body').removeClass( "" ).addClass( "page-login layout-full page-dark" );
                        $('#wallet-core').hide();
                        $('link[id=loginStyle]')[0].disabled=false;

                        //Make sure these fields are unhidden.
                        $('#login-welcome').text('Welcome.');
                        $('#wallet-handle').show();
                        $('.create-account').show();
                        $('#register-btn').show();
                        $('#logint-another-wallet').hide();
                        $("#loginbtn").text('Sign in');

                        //Stop SetInterval Calls
                        StopShowCoinHistory();
                        StopTotalFiatValue();

                    }
                    else {
                        // If something goes wrong, alert the error message that our service returned
                        //swal("Oops...", "Something went wrong!", "error");
                        toastr.warning("Opps... Something went wrong!", "Account Notification")
                        console.log(data.statusText);
                        if ( xhr.readyState == 0 ) {
                            Iguana_ServiceUnavailable();
                        }
                        console.log(textStatus);
                        console.log(jqXHR);

                    }
                },
                error: function(xhr, textStatus, error) {
                    console.log('failure');
                    console.log(xhr.statusText);
                    if ( xhr.readyState == 0 ) {
                        Iguana_ServiceUnavailable();
                    }
                    console.log(textStatus);
                    console.log(error);
                    //swal("Oops...", "Something went wrong!", "error");
                    toastr.warning("Opps... Something went wrong!", "Account Notification")
                    
                }
            });
        });
    };

    var handleLock = function() {
        //Begin Lock Active Wallet
        $('#lock-screen').click(function() {
            $.ajax({
                type: 'GET',
                url: 'http://127.0.0.1:7778/api/bitcoinrpc/walletlock',
                dataType: 'text',
                success: function(data, textStatus, jqXHR) {
                    var LockOutput = JSON.parse(data);

                    //Begin Check Active Wallet's status
                    $.ajax({
                        type: 'GET',
                        url: 'http://127.0.0.1:7778/api/SuperNET/activehandle',
                        dataType: 'text',
                        success: function(data, textStatus, jqXHR) {
                            var ActiveHandleOutput = JSON.parse(data);
                            var ActiveHandleDataToStore = JSON.stringify(data);
                            sessionStorage.setItem('IguanaActiveAccount', ActiveHandleDataToStore);
                            console.log('== Data OutPut - Active Handle ==');
                            console.log(ActiveHandleOutput);

                            if (ActiveHandleOutput.status === 'locked') {
                                console.log('Success');
                                //swal("Success", "Wallet Locked Successfully.", "success");
                                toastr.success("Wallet Locked Successfully", "Account Notification")

                                $('#wallet-login').show();
                                $('body').removeClass( "" ).addClass( "page-login layout-full page-dark" );
                                $('#wallet-core').hide();
                                $('link[id=loginStyle]')[0].disabled=false;
                                $("#loginbtn").text('Unlock');
                                //Hide some login fields not needing at lock screen
                                console.log('Wallet is Locked.');
                                $('#login-welcome').text('Wallet Locked. Please login.');
                                $('#register-btn').hide();
                                $('#logint-another-wallet').show();
                                $('#logincoinslist').hide();
                            }
                            else {
                                // If something goes wrong, alert the error message that our service returned
                                //swal("Oops...", "Something went wrong!", "error");
                                toastr.warning("Opps... Something went wrong!", "Account Notification")
                                console.log(data.statusText);
                                if ( xhr.readyState == 0 ) {
                                    Iguana_ServiceUnavailable();
                                }
                                console.log(textStatus);
                                console.log(jqXHR);

                            }
                        },
                        error: function(xhr, textStatus, error) {
                            console.log('failure');
                            console.log(xhr.statusText);
                            if ( xhr.readyState == 0 ) {
                                Iguana_ServiceUnavailable();
                            }
                            console.log(textStatus);
                            console.log(error);
                            //swal("Oops...", "Something went wrong!", "error");
                            toastr.warning("Opps... Something went wrong!", "Account Notification")
                            
                        }
                    });
                    //End Check Active Wallet's status

                    //console.log('== Data OutPut - Wallet Lock ==');
                    //console.log(LockOutput);
                },
                error: function(xhr, textStatus, error) {
                    console.log('failure');
                    console.log(xhr.statusText);
                    if ( xhr.readyState == 0 ) {
                        Iguana_ServiceUnavailable();
                    }
                    console.log(textStatus);
                    console.log(error);
                    //swal("Oops...", "Something went wrong!", "error");
                    toastr.warning("Opps... Something went wrong!", "Account Notification")
                    
                }
            });
        });
        //End Lock Active Wallet
    };

    var handleCheckLogin = function() {
        Iguana_activehandle();
        //console.log('Iguana_activehandle_output: '+Iguana_activehandle_output);
        if ( sessionStorage.getItem('IguanaActiveAccount') === null ) {
            console.log('There\'s no active wallet logged in. Please Login.');
            $('#logint-another-wallet').hide();
        } else {
            var CheckLoginData = JSON.parse(sessionStorage.getItem('IguanaActiveAccount'));
            if ( JSON.parse(CheckLoginData).pubkey != Iguana_activehandle_output.pubkey ) {
                //console.log("Login: sessionStorage data and activehandle data doesn't match");
                //console.log('Iguana_activehandle_output: '+Iguana_activehandle_output.rmd160);
                //console.log('CheckLoginData: ' + JSON.parse(CheckLoginData).rmd160);
                ClearOnLogout(false, false);
            }
            if ( JSON.parse(CheckLoginData).status === 'unlocked' ) {
                console.log(JSON.parse(CheckLoginData).status);
                $('#password').val('')
                $('#wallet-login').hide();
                $('body').removeClass( "page-login layout-full page-dark" ).addClass( "" );
                $('#wallet-core').fadeIn();
            } else if ( JSON.parse(CheckLoginData).status === 'locked' ) {
                console.log('Wallet is Locked.');
                $('#login-welcome').text('Wallet Locked. Please login');
                $('#register-btn').hide();
                $("#loginbtn").text('Unlock');
            }
        }
        
    };

    var handleCoinsRunningCheck = function() {
        
        /*$.each([ 'basilisk', 'full', 'virtual' ], function( index, value ) {
            var allcoinsvalues = {"agent":"InstantDEX","method":"allcoins"};
            $.ajax({
                type: 'POST',
                data: JSON.stringify(allcoinsvalues),
                url: 'http://127.0.0.1:7778',
                //dataType: 'text',
                success: function(data, textStatus, jqXHR) {
                    var allcoinsData = JSON.parse(data);
                    console.log('== Data OutPut ==');
                    console.log(allcoinsData);
                    $.each(allcoinsData[value], function(index) {
                        if ( allcoinsData[value][index] == 'BTC' ) { console.log('Index: '+ index + ' and Value: BTC'); }
                        if ( allcoinsData[value][index] == 'BTCD' ) { console.log('Index: '+ index + ' and Value: BTCD'); }
                        var coinvals = {"coin":"BTCD","portp2p":14631,"mode":0}
                        Iguana_addcoin(coinvals);
                    });
                    
                },
                error: function(xhr, textStatus, error) {
                    console.log('failed getting Coin History.');
                    console.log(xhr.statusText);
                    console.log(textStatus);
                    console.log(error);
                    toastr.error("Unable to complete transaction", "Transaction Notification")
                }
            });
        });
        

        if ( sessionStorage.getItem('IguanaActiveAccount') === null ) {
            $.each([ 'BTC', 'BTCD' ], function( index, value ) {
                var AddCoinBasiliskData = {
                    "poll": 100,
                    "active": 1,
                    "newcoin": value,
                    "startpend": 1,
                    "endpend": 1,
                    "services": 128,
                    "maxpeers": 16,
                    "RELAY": 0,
                    "VALIDATE": 0,
                    "portp2p": 14631
                }
                //Start BitcoinDark in Basilisk mode
                $.ajax({
                    type: 'GET',
                    data: AddCoinBasiliskData,
                    url: 'http://127.0.0.1:7778/api/iguana/addcoin',
                    dataType: 'text',
                    success: function(data, textStatus, jqXHR) {
                        var CoinBasiliskDataOutput = JSON.parse(data);
                        //console.log('== Data OutPut ==');
                        //console.log(CoinBasiliskDataOutput);

                        if (CoinBasiliskDataOutput.result === 'coin added') {
                            console.log('coin added');
                            toastr.success(value + " started in Basilisk Mode", "Coin Notification");
                        } else if (CoinBasiliskDataOutput.result === 'coin already there') {
                            console.log('coin already there');
                            //toastr.info("Looks like" + value + "already running.", "Coin Notification");
                        } else if (CoinBasiliskDataOutput.result === null) {
                            console.log('coin already there');
                            //toastr.info("Looks like" + value + "already running.", "Coin Notification");
                        }
                    },
                    error: function(xhr, textStatus, error) {
                        console.log('failed starting BitcoinDark.');
                        console.log(xhr.statusText);
                        console.log(textStatus);
                        console.log(error);
                        //swal("Oops...", "Something went wrong!", "error");
                        if (xhr.readyState == '0' ) {
                            toastr.error("Unable to connect to Iguana", "Account Notification")
                        }
                    }
                });
            });
        }*/
        
            
    }

    var handleLoginAnotherWallet = function() {
        $('#logint-another-wallet').click(function() {
            $('#logint-another-wallet').show();
            $.ajax({
                type: 'GET',
                url: 'http://127.0.0.1:7778/api/bitcoinrpc/walletlock',
                dataType: 'text',
                success: function(data, textStatus, jqXHR) {
                    var LogoutOutput = JSON.parse(data);
                    sessionStorage.clear();
                    //console.log('== Data OutPut ==');
                    //console.log(LogoutOutput);

                    if (LogoutOutput.result === 'success') {
                        console.log('Success');
                        //swal("Success", "Logout Successfully.", "success");
                        toastr.success("Logout Successfull", "Account Notification")

                        $('#wallet-login').show();
                        $('body').removeClass( "" ).addClass( "page-login layout-full page-dark" );
                        $('#wallet-core').hide();
                        $('link[id=loginStyle]')[0].disabled=false;

                        //Make sure these fields are unhidden.
                        $('#login-welcome').text('Welcome. Please login.');
                        $('.create-account').show();
                        $('#register-btn').show();
                        $('#logint-another-wallet').hide();
                        $("#loginbtn").text('Sign in');
                        $('#logincoinslist').show();

                    }
                    else {
                        // If something goes wrong, alert the error message that our service returned
                        //swal("Oops...", "Something went wrong!", "error");
                        toastr.warning("Opps... Something went wrong!", "Account Notification")
                        console.log(data.statusText);
                        if ( xhr.readyState == 0 ) {
                            Iguana_ServiceUnavailable();
                        }
                        console.log(textStatus);
                        console.log(jqXHR);
                    }
                },
                error: function(xhr, textStatus, error) {
                    console.log('failure');
                    console.log(xhr.statusText);
                    if ( xhr.readyState == 0 ) {
                        Iguana_ServiceUnavailable();
                    }
                    console.log(textStatus);
                    console.log(error);
                    //swal("Oops...", "Something went wrong!", "error");
                    toastr.warning("Opps... Something went wrong!", "Account Notification")
                }
            });
        });
    };

    return {
        //main function to initiate the module
        init: function() {

            //handleCoinsRunningCheck();
            handleLogin();
            handleLock();
            handleRegister();
            handleLogout();
            handleCheckLogin();
            handleLoginAnotherWallet();

        }

    };

}();

jQuery(document).ready(function() {
    Login.init();
});


function ClearOnLogout(cleardata, stopinterval) {
    if ( cleardata === true ) {
        sessionStorage.clear();
    }
    if ( cleardata === false || cleardata === null ) {
        console.log('sessionStorage data not cleared.');
    }
    if ( stopinterval === true ) {
        //Stop SetInterval Calls
        StopShowCoinHistory();
        StopTotalFiatValue();
    }
    if ( stopinterval === false || stopinterval === null ) {
        console.log('SetInterval data not cleared.');
    }
    $('#wallet-login').show();
    $('body').removeClass( "" ).addClass( "page-login layout-full page-dark" );
    $('#wallet-core').hide();
    $('link[id=loginStyle]')[0].disabled=false;
    $('#logint-another-wallet').hide();

    //Make sure these fields are unhidden.
    $('#login-welcome').text('Welcome.');
    $('#wallet-handle').show();
    $('.create-account').show();
    $('#register-btn').show();
    $('#logint-another-wallet').hide();
    $("#loginbtn").text('Sign in');
}