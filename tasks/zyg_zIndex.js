/*
 * grunt-zyg-zIndex
 * https://github.com/zyg/grunt-zyg-zIndex
 *
 * Copyright (c) 2015 zhou-yg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  //查找 z-index的正则
  var zIndexRegExp = /(z-index:)[\n\s]*(\d+)/g,
      zIndexCharPre = 'ZINDEX_VALUE';

  function createChar(i){
    return zIndexCharPre + i;
  }

  grunt.registerMultiTask('zyg_zIndex', 'The best Grunt plugin ever.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    var allSrc = [],i= 0,
        charValueMap = [],
        basic = 1,
        dis = options.dis ? options.dis : 10;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return {
          filepath:filepath,
          dest: f.dest,
          src:grunt.file.read(filepath)
        };
      }).filter(function(fileObj){
        return fileObj.src.indexOf('z-index') !== -1;
      });

      allSrc = allSrc.concat(src);

      // Write the destination file.
      //grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('read all css.');
    });

    allSrc.forEach(function(srcObj){
      var src = srcObj.src;
      src.replace(zIndexRegExp,function(all,zIndex,value,index){
        var char = createChar(i++);
        value = parseInt(value);

        if(value!==0){
          charValueMap.push({
            char:char,
            value:value
          });
        }
        return zIndex + char;
      });
    });

    charValueMap.sort(function(pre,next){
      return pre.value > next.value;
    });
    console.log(dis,charValueMap);

    var old;
    charValueMap = charValueMap.map(function(ele,i){
      var pre = charValueMap[i-1];
      if(pre){
        if(old === ele.value){
          ele.value = pre.value;
        }else{
          old = ele.value;
          ele.value = basic + i * dis;
        }
      }else{
        old = ele.value;
        ele.value = basic + i * dis;
      }
      return ele;
    });

    console.log(charValueMap);
    allSrc.forEach(function(srcObj){
      var src = srcObj;

    });
  });
};
