var $$ = window.Dom7;

var notes_url;

var myPhotoBrowser;

var notes_active_images;

Template7.registerHelper('json_stringify', function (context) {
    return JSON.stringify(context);
});

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
        'page:classwork':{
            // today_homework: '',
            // last_homework: '',
            work: [
                    {
                        "id":1,
                        "subject_name": "Dummy",
                        "class_name": "Logout and login again",
                        "subject_id": 1,
                        "class_id": 1
                    },
                ]
        }
    }
});


var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: false,
});

if (window.localStorage.getItem("teacher_id") == undefined){
    myApp.loginScreen();
}else{
    document.getElementById('js-welcome-message').innerHTML = "Welcome "+window.localStorage.getItem("teacher_name");
    //document.getElementById('js-school-details').innerHTML = window.localStorage.getItem("school_name")+","+window.localStorage.getItem("address");
    // myApp.template7Data['page:index']['school_details'] = JSON.parse(window.localStorage.getItem("work"));
    myApp.template7Data['page:homework']['work'] = JSON.parse(window.localStorage.getItem("work"));
    myApp.template7Data['page:attendance']['work'] = JSON.parse(window.localStorage.getItem("attendance_work"));
    myApp.template7Data['page:notes']['work'] = JSON.parse(window.localStorage.getItem("work"));
    myApp.template7Data['page:marks']['work'] = JSON.parse(window.localStorage.getItem("work"));
    myApp.template7Data['page:exam']['work'] = JSON.parse(window.localStorage.getItem("work"));
    myApp.template7Data['page:classwork']['work'] = JSON.parse(window.localStorage.getItem("work"));
    myApp.template7Data['page:performance']['work'] = JSON.parse(window.localStorage.getItem("work"));
    if(window.localStorage.getItem("school_details") != undefined)
    myApp.template7Data['page:index']['school_details'] = window.localStorage.getItem("school_details");

    // myApp.template7Data['page:announcement']['work'] = JSON.parse(window.localStorage.getItem("work"));
}
//------------------ app functionalities start----------------------------------------------------------------------//

$$('.js-login-teacher').on('click', function (e) {
        var phone = $$('#js-phone').val();
        var pin = $$('#js-pin').val();
        loginTeacher(phone,pin);

});

$$('.js-logout-teacher').on('click',function(e){
    myApp.confirm('Are you sure you want to logout?',"Logout",function () {
        window.localStorage.removeItem("teacher_id");
        $$('#js-phone').val('');
        $$('#js-pin').val('');
        myApp.loginScreen();
    });
});

$$(document).on('ajaxComplete', function (e) {
        myApp.hideIndicator();
});

// 
// $$.ajax({timeout: 3000});

$$(document).on('ajaxStart', function (e) {
        myApp.showIndicator();
});

function loginTeacher(phone,pin){
        // alert(phone);
        // alert(pin);
        // console.log(phone);
        // console.log(pin);
        var url = "http://139.59.34.36/master/api/login?phone="+phone+"&pin="+pin;
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
                window.localStorage.clear();
                window.localStorage.setItem("teacher_id",e.result.teacher_id);
                window.localStorage.setItem("teacher_name",e.result.teacher_name);
                window.localStorage.setItem("school_name",e.result.school_name);
                window.localStorage.setItem("address",e.result.address);
                document.getElementById('js-welcome-message').innerHTML = "Welcome "+e.result.teacher_name;
                // document.getElementById('js-school-details').innerHTML = e.result.school_name+","+e.result.address;
                myApp.template7Data['page:index']['school_details'] = e.result.school_name+","+e.result.address;
                window.localStorage.setItem("school_id",e.result.school_id);
                window.localStorage.setItem("school_details",e.result.school_name+","+e.result.address);
                window.localStorage.setItem("work",JSON.stringify(e.result.work));
                window.localStorage.setItem("attendance_work",JSON.stringify(e.result.attendance_work));
                myApp.template7Data['page:homework']['work'] = e.result.work;
                myApp.template7Data['page:attendance']['work'] = e.result.attendance_work;
                myApp.template7Data['page:notes']['work'] = e.result.work;
                myApp.template7Data['page:exam']['work'] = e.result.work;
                myApp.template7Data['page:performance']['work'] = e.result.work;
                myApp.template7Data['page:classwork']['work'] = e.result.work;
                // myApp.template7Data['page:index']['school_details'] = 
                // myApp.template7Data['page:announcement']['work'] = e.result.work;
                //var selected_work = searchArrayofObjects(myApp.template7Data['page:homework']['work'],1,"id");
                //getHomework(e.result.teacher_id,selected_work.subject_id,e.result.school_id,selected_work.class_id);
                myApp.closeModal();
                 
            },
            error: function(xhr, status) {
                if(status == 'timeout')
                    myApp.alert('Please check your internet connection','Internet Down!');
                else
                    myApp.alert('Please check your login credentials','Invalid Login Credentials');
            }
          })
 }

//------------------ app functionalities end----------------------------------------------------------------------//

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