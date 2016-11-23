/**
* StarBuilder 1.0.0
* author DARRIET GUILLAUME 
* https://lebonnumero.fr/
*
*/
(function(){
  Star.Builder = {};

  var BuilderConfig = {
    name:'build',
    exludedPaths : [],
    fileTypes:{
      script : {
        added : true,
        removeScriptComments : true,
        removeHtmlComments : true,
        removeTabulations : true,
        removeBreakLines : true,
        removeMultiWhiteSpaces : true
      },
      text:{
        added : false,
        removeScriptComments : false,
        removeHtmlComments : false,
        removeTabulations : false,
        removeBreakLines : false,
        removeMultiWhiteSpaces : false
      },
      json : {
        added : false,
        removeScriptComments : false,
        removeHtmlComments : false,
        removeTabulations : true,
        removeBreakLines : true,
        removeMultiWhiteSpaces : true
      },
      css : {
        added : false,
        removeScriptComments : true,
        removeHtmlComments : false,
        removeTabulations : true,
        removeBreakLines : true,
        removeMultiWhiteSpaces : true
      },
      html : {
        added : false,
        removeScriptComments : false,
        removeHtmlComments : true,
        removeTabulations : true,
        removeBreakLines : true,
        removeMultiWhiteSpaces : true
      }
    },
    regexpFunctions:{
      removeScriptComments:function(data){return data.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm,"");},
      removeHtmlComments:function(data){return data.replace(/<!--[\s\S]*?-->/gm,"");},
      removeTabulations:function(data){return data.replace(/\t/gm," ");},
      removeBreakLines:function(data){return data.replace(/(\r\n|\n|\r)/gm," ");},
      removeMultiWhiteSpaces:function(data){return data.replace(/\s{2,}/gm," ");}
    },
    regexpExecutionOrder : ['removeScriptComments','removeHtmlComments','removeTabulations','removeBreakLines','removeMultiWhiteSpaces']
  }
  
  /**
  * Public Function
  */
  Star.Builder.SetConfig = function(conf){
    Star.SetConfig(conf,BuilderConfig);
  }
  /**
  * Private function
  */
  function unglify(file,type){
    var fct,fctName;
    for(var i=0;i<BuilderConfig.regexpExecutionOrder.length;i++){
      fctName = BuilderConfig.regexpExecutionOrder[i];
      if(BuilderConfig.fileTypes[type] && BuilderConfig.fileTypes[type][fctName] === true){
        fct = BuilderConfig.regexpFunctions[fctName];
        file = fct(file);
      }
    }
    return file;
  }
  
  //Save the Star.Import
  var StarImport = Star.Import;
  //first in last out
  var firstImport = false;
  //Launch Builder
  function onStackComplete(){
    var build = {};
    var StarCache = Star.GetCacheCopy();
    var cache,exclude,file;
    for(var url in StarCache){
      cache = StarCache[url];
      //type filter
      if(BuilderConfig.fileTypes[cache.type] && BuilderConfig.fileTypes[cache.type].added===true){
        exclude = false;
        //path filter
        for(var path in BuilderConfig.exludedPaths){
          if(BuilderConfig.exludedPaths[path] && url.indexOf(path) === 0){
            exclude = true;
            break;
          }
        }
        if(!exclude){
          file = unglify(cache.file,cache.type);
          build[url] = {
            file:file,
            type:cache.type
          }
        }
      }
    }
    var data = JSON.stringify(build);
    data = "Star.AddCachePreload("+data+");";
    download(data,BuilderConfig.name+".js","text/plain");
  }
  
  //
  function download(data, filename, type) {
    var a = document.createElement("a"),
        file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
      var url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
    }
  }
  
  //override Star.Import 
  Star.Import = function(orders,callback){
    callback = function(){};
    if(!firstImport){
      callback = onStackComplete;
      firstImport = true;
    }
    return StarImport(orders,callback);
  }
})();