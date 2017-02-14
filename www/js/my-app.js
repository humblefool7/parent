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

    myApp.onPageInit('notes', function (page) {
            // console.log($$('#js-notes-subject').val()+'notes class');
            var class_id = $$("#js-notes-subject").attr("data-class");
            var subject_id = $$("#js-notes-subject").val();
            createNotesTimeline(window.localStorage.getItem("student_selected"),subject_id,class_id);

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
            console.log('setting student data for'+student_id);
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
                console.log(e);
                $$('.js-phone-field').show();
                $$('.js-otp-field').hide();
                $$('.js-login-go-back').hide();
                $$('.js-submit-otp').hide();
                $$('.js-generate-otp').show();
                $$('.js-generate-otp').show();
                window.localStorage.clear();
                window.localStorage.setItem("parent_id",e.result.parent_id);
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
            console.log((e.result.notes).length);
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
    var url = 'http://139.59.34.36/master/uploads/1483080139.jpg';
    downloadFile(url);
    
}

var folderName = 'curriculars';
var fileName;

function downloadFile(URL) {
    //step to request a file system 
    // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

    // function fileSystemSuccess(fileSystem) {
    //     var download_link = encodeURI(URL);
    //     fileName = download_link.substr(download_link.lastIndexOf('/') + 1); //Get filename of URL
    //     var directoryEntry = fileSystem.root; // to get root path of directory
    //     directoryEntry.getDirectory(folderName, {
    //         create: true,
    //         exclusive: false
    //     }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
    //     var rootdir = fileSystem.root;
    //     var fp = fileSystem.root.toURL();  // Returns Fullpath of local directory

    //     fp = fp + "/" + folderName + "/" + fileName; // fullpath and name of the file which we want to give
    //     // download function call
    //     filetransfer(download_link, fp);
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {

  var fileTransfer = new FileTransfer();
  var uri = encodeURI(URL);
  var path = fileSystem.root.toURL() + "appName/example.jpg";
  // var path = "file://data/user/0/"+"nishant/example.jpg"
  console.log(path);

  fileTransfer.download(
    uri,
    path,
    function(entry) {
        console.log("download complete: " + entry.toURL());
        refreshMedia.refresh(URI);
      // refreshMedia.refresh(path); // Refresh the image gallery
    },
    function(error) {
      console.log(error.source);
      console.log(error.target);
      console.log(error.code);
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

    function onDirectorySuccess(parent) {
        // Directory created successfuly
    }

    function onDirectoryFail(error) {
        //Error while creating directory
        alert("Unable to create new directory: " + error.code);

    }

    function fileSystemFail(evt) {
        //Unable to access file system
        alert(evt.target.error.code);
    }
// }

function filetransfer(download_link, fp) {
    var fileTransfer = new FileTransfer();
    // File download function with URL and local path
    fileTransfer.download(download_link, fp,
        function(entry) {
            alert("download complete: " + entry.fullPath);
        },
        function(error) {
            //Download abort errors or download failed errors
            alert("download error source " + error.source);
        }
    );
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
            console.log(e);
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