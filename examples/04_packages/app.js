//create Package name 'app'
Star.Package("app",

  //second argument is a class
  Star.Class("MyClass",null,{
    
    construct : function construct(){
      this.log("MyClass");
    },
    
    log:function log(msg){
      var el = document.getElementById('trace');
      el.innerHTML = msg+"<br/>"+el.innerHTML;
    }
    
  })
);

//create sub package of app
Star.Package("app.utils",
  
  
  Star.Class("Tool",app.MyClass,{
    
    construct:function construct(){
      this.log("Tool");
    }
   
  })

);

var myClass = app.MyClass();
var tool = app.utils.Tool();

//if in Star.Package first argument is "", the class is attached to window