var $$ = window.Dom7;


Template7.registerHelper('json_stringify', function (context) {
    return JSON.stringify(context);
});

// var student_selected = '';
window.localStorage.setItem("student_selected",'');

// getMarksChart(1,1,1,1,0);

// Initialize your app
var myApp = new Framework7({

    animateNavBackIcon: true,
    material:true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    template7Pages: true,
    // Specify Template7 data for pages
    template7Data: {
        'page:index':{
            student: [
                    {
                        "student_id": "1",
                        "student_name": "dummy",
                    },
                ]
        },
        'page:fees':{
            student: [
                    {
                        "student_id": "1",
                        "student_name": "dummy",
                    },
                ]
        },
        'page:notes':{
            class_id: '',
            subjects: [
                    {
                        "subject_id": "1",
                        "subject_name": "dummy",
                    },
                ]
        }
    }
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: false,
});

//------------------ app init start----------------------------------------------------------------------//

    myApp.onPageInit('index', function (page) {
            checkLoggedIn();
            $$('.students-select').on('change', function() {
                setStudentData($$('.students-select').val());
                window.localStorage.setItem("student_selected",$$('.students-select').val());
            })            
    }).trigger();

    $$('.js-generate-otp').on('click', function (e) {
        var phone = $$('#js-phone').val();
        if(phone == '' || phone.length != 10)
            myApp.alert("Incorrect phone number","Error!");
        else
            sendOtp(phone);
    });
    $$('.js-login-go-back').on('click', function (e) {
        $$('.js-phone-field').show();
        $$('.js-otp-field').hide();
        $$('#js-otp').val('');
        $$('.js-login-go-back').hide();
        $$('.js-submit-otp').hide();
        $$('.js-generate-otp').show();
    });
    $$('.js-submit-otp').on('click', function (e) {
        loginParent($$('#js-phone').val(),$$('#js-otp').val());
    });

    $$('.js-logout-parent').on('click',function(e){
        myApp.confirm('Are you sure you want to logout?',"Logout",function () {
            window.localStorage.clear();
            checkLoggedIn();
            //mainView.router.refreshPage()
            //myApp.loginScreen();
            // window.localStorage.removeItem("parent_id");
            // $$('#js-phone').val('');
            // $$('#js-pin').val('');
            // myApp.refreshPage();
        });
    });

    myApp.onPageInit('attendance', function (page) {

        var calendarDateFormat1 = myApp.calendar({
                input: '#start_date',
                dateFormat: 'dd-M-yyyy'
        });
        var calendarDateFormat2 = myApp.calendar({
                input: '#end_date',
                dateFormat: 'dd-M-yyyy'
        }); 

        var d = new Date();
        end_date = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        d.setMonth(d.getMonth() - 1);
        start_date = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

        // console.log(end_date);
        // console.log(start_date);

        calendarDateFormat1.setValue([start_date]);
        calendarDateFormat2.setValue([end_date]);

        createAttendanceTimeline(window.localStorage.getItem("student_selected"),start_date,end_date);

        $$('.js-fetch-attendance').on('click', function (e) {
            var start_date = new Date($$('#start_date').val());
            var end_date = new Date($$('#end_date').val());
            if(new Date(start_date) > new Date(end_date))
                myApp.alert('Start date should be less than the End date','Invalid dates!');
            else{
                start_date = new Date(start_date.getTime() - (start_date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                end_date = new Date(end_date.getTime() - (end_date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                createAttendanceTimeline(window.localStorage.getItem("student_selected"),start_date,end_date);
            }
        });



            // console.log($$('#js-notes-subject').val()+'notes class');
       //      var class_id = $$("#js-notes-subject").attr("data-class");
       //      var subject_id = $$("#js-notes-subject").val();
       //      createNotesTimeline(window.localStorage.getItem("student_selected"),subject_id,class_id);

       //  $$('#js-notes-subject').on('change', function() {
       //      var class_id = $$("#js-notes-subject").attr("data-class");
       //      var subject_id = $$("#js-notes-subject").val();
       //      createNotesTimeline(window.localStorage.getItem("student_selected"),subject_id,class_id);
       // })

    }).trigger();

    myApp.onPageInit('notes', function (page) {
            // console.log($$('#js-notes-subject').val()+'notes class');
            var class_id = $$("#js-notes-subject").attr("data-class");
            var subject_id = $$("#js-notes-subject").val();
            createNotesTimeline(window.localStorage.getItem("student_selected"),subject_id,class_id);

        $$('#js-notes-subject').on('change', function() {
            var class_id = $$("#js-notes-subject").attr("data-class");
            var subject_id = $$("#js-notes-subject").val();
            createNotesTimeline(window.localStorage.getItem("student_selected"),subject_id,class_id);
       })

    }).trigger();


    myApp.onPageInit('fees', function (page) {
            // console.log($$('#js-notes-subject').val()+'notes class');
/*            var class_id = $$("#js-notes-subject").attr("data-class");
            var subject_id = $$("#js-notes-subject").val();
            createNotesTimeline(window.localStorage.getItem("student_selected"),subject_id,class_id);*/

       //  $$('#js-notes-subject').on('change', function() {
       //      var class_id = $$("#js-notes-subject").attr("data-class");
       //      var subject_id = $$("#js-notes-subject").val();
       //      createNotesTimeline(window.localStorage.getItem("student_selected"),subject_id,class_id);
       // })
       var payFunction = function(amount,description,image,order_id,name,customer_name,customer_contact){
                // console.log('bla bla');
                var options = {
                  description: description,
                  image: image,
                  currency: 'INR',
                  key: 'rzp_test_WK0VgHaNtpBThp',
                  order_id: order_id,
                  amount: amount,
                  name: name,
                  prefill: {
                    email: '',
                    contact: customer_contact,
                    name: customer_name
                  },
                  theme: {
                    color: '#3f51b5'
                  }
                }

                var successCallback = function(success) {
                  alert('payment_id: ' + success.razorpay_payment_id)
                  var orderId = success.razorpay_order_id
                  var signature = success.razorpay_signature
                }

                var cancelCallback = function(error) {
                  // alert(error.description + ' (Error '+error.code+')')
                }

                RazorpayCheckout.on('payment.success', successCallback)
                RazorpayCheckout.on('payment.cancel', cancelCallback)
                RazorpayCheckout.open(options)
    }

    $$('.js-pay-fee').on('click', function (e){
            var student_id = $$('.student-fees-select').val();
            var enrollment_number = $$('.js-enrollment-number').val();
            var amount = $$('.js-fee-amount').val();
            console.log(amount);
            console.log(enrollment_number);
            console.log(student_id);
            payFunction(amount*100,'School Fees','http://www.clker.com/cliparts/Z/F/Y/E/X/y/logo-school-md.png',enrollment_number,window.localStorage.getItem("school_name"),window.localStorage.getItem("parent_name"),window.localStorage.getItem("parent_phone"));
            // console.log('usoads');
            // something();
    });

    // something();

    }).trigger();


    myApp.onPageInit('exam', function (page) {
            createExamTimeline(window.localStorage.getItem("student_selected"));
    }).trigger();

    myApp.onPageInit('performance', function (page) {
            createPerformanceScreen(window.localStorage.getItem("student_selected"));
    }).trigger();

    function checkLoggedIn(){
        if (window.localStorage.getItem("parent_id") == undefined){
            myApp.loginScreen();
        }else{
            myApp.closeModal($$('.login-screen'));
            var students = JSON.parse(window.localStorage.getItem("students"));

            myApp.template7Data['page:index']['student'] = students;
            myApp.template7Data['page:fees']['student'] = students;
            if(window.localStorage.getItem("student_selected") == ''){
                setStudentData(students[0]["student_id"]);
                window.localStorage.setItem("student_selected",students[0]["student_id"]);
            }
            else
                $$('.students-select').val(window.localStorage.getItem("student_selected")).change();

            if(students.length <= 1){
                $$('.js-welcome-students').hide();
                $$('.js-welcome-message').show();
                $$('.js-dashboard-header').css("padding", "15px");
            }else{
                $$('.js-welcome-students').show();
                $$('.js-welcome-message').hide();
                $$('.js-dashboard-header').css("padding", "2px");
            }

            mainView.router.refreshPage();
        }
    }

//------------------ app init end----------------------------------------------------------------------//

//------------------ app functionalities start----------------------------------------------------------------------//

$$(document).on('ajaxComplete', function (e) {
        myApp.hideIndicator();
});

$$(document).on('ajaxStart', function (e) {
        myApp.showIndicator();
});

function setStudentData(student_id){
            // console.log('setting student data for'+student_id);
            // $$('.students-select').val(student_id).change();
            // console.log(student_id);
            var students = JSON.parse(window.localStorage.getItem("students"));
            var subjects = [];
            var index = 0;
            for (var i = 0; i < students.length; i++) {
                if(students[i]["student_id"] == student_id){
                    subjects = students[i]['subjects']
                    break;
                }
                index++;
            }
            // console.log(subjects);
            myApp.template7Data['page:notes']['class_id'] = students[index]["class_id"];
            window.localStorage.setItem("school_name",students[index]["school_name"])
            myApp.template7Data['page:notes']['subjects'] = subjects;
}

function sendOtp(phone){
        var url = "http://139.59.34.36/master/parentapi/sendloginotp?phone="+phone
        $$.ajax({
            type: "GET",
            beforeSend: function(e) {
                e.setRequestHeader("Accept", "application/json"), 
                e.setRequestHeader("apikey", "app")
            },
            url: url,
            dataType: "json",
            timeout:50000,
            success: function(e) {
                $$('.js-phone-field').hide();
                $$('.js-otp-field').show();
                $$('.js-login-go-back').show();
                $$('.js-submit-otp').show();
                $$('.js-generate-otp').hide();                
            },
            error: function(xhr, status) {
                if(status == 'timeout')
                    myApp.alert('Please check your internet connection','Internet Down!');
                else
                    myApp.alert('Invalid Phone number','Access Denied');
            }
          })
 }
 function loginParent(phone,otp){
        var url = "http://139.59.34.36/master/parentapi/loginparent?phone="+phone+"&otp="+otp;
        $$.ajax({
            type: "GET",
            beforeSend: function(e) {
                e.setRequestHeader("Accept", "application/json"), 
                e.setRequestHeader("apikey", "app")
            },
            url: url,
            dataType: "json",
            timeout:50000,
            success: function(e) {
                $$('.js-phone-field').show();
                $$('.js-otp-field').hide();
                $$('.js-login-go-back').hide();
                $$('.js-submit-otp').hide();
                $$('.js-generate-otp').show();
                $$('.js-generate-otp').show();
                window.localStorage.clear();
                window.localStorage.setItem("parent_id",e.result.parent_id);
                window.localStorage.setItem("parent_name",e.result.parent_name);
                window.localStorage.setItem("parent_phone",e.result.parent_phone);
                window.localStorage.setItem("students",JSON.stringify(e.result.students));

                // window.localStorage.setItem("subjects",JSON.stringify(e.result.subjects));
                //myApp.closeModal();
                checkLoggedIn();
                // mainView.router.refreshPage();
                // myApp.refreshPage();                
            },
            error: function(xhr, status) {
                if(status == 'timeout')
                    myApp.alert('Please check your internet connection','Internet Down!');
                else
                    myApp.alert('Invalid OTP','OTP error!');
            }
          })
 }

//------------------ app functionalities end----------------------------------------------------------------------//

//------------------ exam functionalities start----------------------------------------------------------------------//

function createExamTimeline(student_id){
    if(student_id == undefined)
        return;
    var url = "http://139.59.34.36/master/parentapi/examchart?student_id=" + parseInt(student_id);
    $$.ajax({
        type: "GET",
        beforeSend: function(e) {
            e.setRequestHeader("Accept", "application/json"), 
            e.setRequestHeader("apikey", "app")
        },
        url: url,
        dataType: "json",
        timeout:50000,
        success: function(e) {
            //myApp.template7Data['page:homework']['today_homework'] = homework;
            // console.log(e.result);
            var template = $$('#examtemplate').html();
            var compiledTemplate = Template7.compile(template);
            var html = compiledTemplate({exam:e.result.exams});
            $$('.js-exam-chart').html(html);
            // console.log((e.result.notes).length);
            if((e.result.exams).length == 0)
                $$('.js-exam-chart').html('<p>There are no exams scheduled by now from your class teacher.</p>');
            // myApp.addNotification({
            //     message: 'Thank you teacher,your homework has been uploaded :)',
            // });
        },
        error: function(xhr, status) {
            if(status == 'timeout')
                myApp.alert('Please check your internet connection','Internet Down!');
        }
      })
}

//------------------ exam functionalities end----------------------------------------------------------------------//


//------------------ attendance functionalities start----------------------------------------------------------------------//

function createAttendanceTimeline(student_id,start_date,end_date){
    if(student_id == undefined)
        return;
    var url = "http://139.59.34.36/master/parentapi/attendancechart?student_id=" + parseInt(student_id)+"&start_date="+start_date+"&end_date="+end_date;
    $$.ajax({
        type: "GET",
        beforeSend: function(e) {
            e.setRequestHeader("Accept", "application/json"), 
            e.setRequestHeader("apikey", "app")
        },
        url: url,
        dataType: "json",
        timeout:50000,
        success: function(e) {
            // console.log(e.result.exams);
            //myApp.template7Data['page:homework']['today_homework'] = homework;
            // console.log(e.result);
            var template = $$('#attendancetemplate').html();
            var compiledTemplate = Template7.compile(template);
            var html = compiledTemplate({attendance:e.result.attendance});
            $$('.js-attendance-chart').html(html);
            // console.log((e.result.notes).length);
            if((e.result.attendance).length == 0)
                $$('.js-exam-chart').html('<p>There is no attendance uploaded by now by your class teacher.</p>');
            // myApp.addNotification({
            //     message: 'Thank you teacher,your homework has been uploaded :)',
            // });
        },
        error: function(xhr, status) {
            if(status == 'timeout')
                myApp.alert('Please check your internet connection','Internet Down!');
        }
      })
}

//------------------ attendance functionalities end----------------------------------------------------------------------//

//------------------ notes functionalities start----------------------------------------------------------------------//

function createNotesTimeline(student_id,subject_id,class_id){
    if(subject_id == undefined || student_id == undefined || class_id == undefined)
        return;
    var url = "http://139.59.34.36/master/parentapi/noteschart?student_id=" + parseInt(student_id)+"&subject_id="+parseInt(subject_id)+"&class_id="+parseInt(class_id);
    $$.ajax({
        type: "GET",
        beforeSend: function(e) {
            e.setRequestHeader("Accept", "application/json"), 
            e.setRequestHeader("apikey", "app")
        },
        url: url,
        dataType: "json",
        timeout:50000,
        success: function(e) {
            //myApp.template7Data['page:homework']['today_homework'] = homework;
            // console.log(e.result);
            var template = $$('#notestimeline').html();
            var compiledTemplate = Template7.compile(template);
            var html = compiledTemplate(e.result);
            $$('#js-notes-timeline').html(html);
            if((e.result.notes).length == 0)
                $$('#js-notes-timeline').html('<p>There are no curriculars or notes availaile by now from your class teacher.</p>');
            // myApp.addNotification({
            //     message: 'Thank you teacher,your homework has been uploaded :)',
            // });
        },
        error: function(xhr, status) {
            if(status == 'timeout')
                myApp.alert('Please check your internet connection','Internet Down!');
        }
      })
}

function browsePhotos(images){
    var res = images.split(",");
    notes_active_images = res;
    var template = $$('#notesbrowser').html();
    var compiledTemplate = Template7.compile(template);
    var html = compiledTemplate({});
    myPhotoBrowser = myApp.photoBrowser({
        zoom: 100,
        photos: res,
        navbar :true,
        navbarTemplate : html,
        theme: 'dark'
    });   
    myPhotoBrowser.open();
}

function downloadnote(){
    //new FileManager().download_file('http://139.59.34.36/master/uploads/1483080139.jpg','target_path',Log('downloaded success'));
    //downloadFile('http://139.59.34.36/master/uploads/1483080139.jpg');
    // var url = 'http://139.59.34.36/master/uploads/1483080139.jpg';
    var url = notes_active_images[myPhotoBrowser.activeIndex];
    var title = url.split("/uploads/");
    console.log(title);
    downloadFile(notes_active_images[myPhotoBrowser.activeIndex],title[1].split(".")[0]);
    
}
function downloadFile(url,title) {
window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {

  var fileTransfer = new FileTransfer();
  var uri = encodeURI(url);
  var path = "file:///sdcard/"+"School/"+title+".jpg";

  fileTransfer.download(
    uri,
    path,
    function(entry) {
//         // onSuccess Callback
// // This method accepts a JSON object, which contains the
// // message response
// //

// // window.cordova.plugins.FileOpener.canOpenFile("http://www.website.com/file.pdf", onSuccess, onError);
// window.cordova.plugins.FileOpener.openFile(path, onSuccess, onError);
        myPhotoBrowser.close();
        refreshMedia.refresh(path);
        myApp.addNotification({
        message: 'Download Complete',
        button: {
            text: 'View',
            color: 'lightblue'
        },
        onClose: function () {
            var onSuccess = function(data) {
                // alert('message: ' + data.message);
            };
            function onError(error) {
                // alert('message: ' + error.message);
            }
            window.cordova.plugins.FileOpener.openFile(path, onSuccess, onError);
        }
    });
        //externalApp.launch(['com.something', '', 'Please download the latest version of this app from the store', externalApp.alertType.OK]);
    },
    function(error) {
        console.log(JSON.stringify(error));
    },
    false,
    {
      headers: {
        "Authorization": "dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      }
    }
  );

});
}

//------------------notes functions end----------------------------------------------------------------------//

    function createPerformanceScreen(student_id){
    var url = "http://139.59.34.36/master/api/performance?student_id=" + parseInt(student_id);
    $$.ajax({
        type: "GET",
        beforeSend: function(e) {
            e.setRequestHeader("Accept", "application/json"), 
            e.setRequestHeader("apikey", "app")
        },
        url: url,
        dataType: "json",
        timeout:50000,
        success: function(e) {
            generatePerformanceScreen(e);
            var template = $$('#examscorechart').html();
            var compiledTemplate = Template7.compile(template);
            var html = compiledTemplate({student:e.result.scores});
            $$('.js-marks-chart').html(html);
            $$('.js-performance-description').html(e.result.performance_status);
        },
        error: function() {
        }
      });
    }

    function generatePerformanceScreen(e){
                    var chart = c3.generate({
                    bindto: '#chart1',
                    data: {
                        columns: [
                            ['data', 0]
                        ],
                        type: 'gauge',
                        onclick: function (d, i) { console.log("onclick", d, i); },
                        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                    },
                    gauge: {
                        label: {
                            // format: function(value, ratio) {
                            //     return value;
                            // },
                            show: false // to turn off the min/max labels.
                        },
                    // min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                    // max: 100, // 100 is default
                    // units: ' %',
                    width: 5 // for adjusting arc thickness
                    },
                    color: {
                        pattern: ['#B71C1C', '#BF360C', '#F57F17', '#1B5E20'], // the three color levels for the percentage values.
                        threshold: {
                //            unit: 'value', // percentage is default
                //            max: 200, // 100 is default
                            values: [30, 60, 90, 100]
                        }
                    },
                    size: {
                        height: 80
                    }
                });

                setTimeout(function () {
                    chart.load({
                        columns: [['data', e.result.attendance_percentage]]
                    });
                }, 1000);

                var chart2 = c3.generate({
                    bindto: '#chart2',
                    data: {
                        columns: [
                            ['data', 0]
                        ],
                        type: 'gauge',
                        onclick: function (d, i) { console.log("onclick", d, i); },
                        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                    },
                    gauge: {
                        label: {
                            format: function(value, ratio) {
                                return e.result.rank.rank+"/"+e.result.rank.total;
                            },
                            show: false // to turn off the min/max labels.
                        },
                    // min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                    // max: 100, // 100 is default
                    // units: ' %',
                    width: 5 // for adjusting arc thickness
                    },
                    color: {
                        pattern: ['#B71C1C', '#BF360C', '#F57F17', '#1B5E20'], // the three color levels for the percentage values.
                        threshold: {
                //            unit: 'value', // percentage is default
                //            max: 200, // 100 is default
                            values: [30, 60, 90, 100]
                        }
                    },
                    size: {
                        height: 80
                    }
                });

                setTimeout(function () {
                    if(e.result.rank.rank == e.result.rank.total)
                        var rank = ((((e.result.rank.rank+1)/e.result.rank.total)*100)) - 100;
                    else if(e.result.rank.rank == 1)
                        var rank = 100;
                    else
                        var rank = 100 - ((((e.result.rank.rank)/e.result.rank.total)*100));
                    chart2.load({
                        columns: [['data', rank]]
                    });
                }, 1000);
    }

//------------------ Detail Performance functions end----------------------------------------------------------------------//


//------------------ utility functions start----------------------------------------------------------------------//
function searchArrayofObjects(array,search_field,key){
    if(array != undefined){ 
        for (var i=0; i < array.length; i++) {
            if (array[i][key] === search_field) {
                return array[i];
            }
        }
    }else{
        return false;
    }
}

function CheckConnection()
{
     if( !navigator.network )
     {
         // set the parent windows navigator network object to the child window
         navigator.network = window.top.navigator.network;
     }

    // return the type of connection found
   return ( (navigator.network.connection.type === "none" || navigator.network.connection.type === null || 
          navigator.network.connection.type === "unknown" ) ? false : true );
}

// var $$ = Dom7;

//------------------ utility functions end----------------------------------------------------------------------//