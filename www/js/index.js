/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 var fs = null;
 
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        console.log(cordova.file);


      window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

      // Initiate filesystem on page load.
      if (window.requestFileSystem) {
        initFS();
      }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"138609279400","ecb":"app.onNotificationGCM"});
    },
    // result contains any message sent from the plugin call
    successHandler: function(result) {
        alert('Callback Success! Result = '+result)
    },
    errorHandler:function(error) {
        alert(error);
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    alert('registration id = '+e.regid);
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    }
};

      
      function errorHandler(e) {
        var msg = '';
        switch (e.code) {
          case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
          case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
          case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
          case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
          case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
          default:
            msg = 'Unknown Error';
            break;
        };
        document.querySelector('#example-list-fs-ul').innerHTML = 'Error: ' + msg;
      }
      
      function initFS() {
        window.requestFileSystem(window.TEMPORARY, 1024*1024, function(filesystem) {
          fs = filesystem;
        }, errorHandler);
      }
      
      var buttons = document.querySelectorAll('#example-list-fs button');
      var filelist = document.querySelector('#example-list-fs-ul');
      
      if (buttons.length >= 3) {
        buttons[0].addEventListener('click', function(e) {
            console.log(fs);
          if (!fs) {
            return;
          }
          fs.root.getFile('log.txt', {create: true}, null, errorHandler);
          fs.root.getFile('song.mp3', {create: true}, null, errorHandler);
          fs.root.getDirectory('mypictures', {create: true}, null, errorHandler);
          filelist.innerHTML = 'Files created.';
        }, false);
      
        buttons[1].addEventListener('click', function(e) {
          if (!fs) {
            return;
          }
      
          var dirReader = fs.root.createReader();
          dirReader.readEntries(function(entries) {
            if (!entries.length) {
              filelist.innerHTML = 'Filesystem is empty.';
            } else {
              filelist.innerHTML = '';
            }
      
            var fragment = document.createDocumentFragment();
            for (var i = 0, entry; entry = entries[i]; ++i) {
              var img = entry.isDirectory ? '<img src="http://www.html5rocks.com/static/images/tutorials/icon-folder.gif">' :
                                            '<img src="http://www.html5rocks.com/static/images/tutorials/icon-file.gif">';
              var li = document.createElement('li');
              li.innerHTML = [img, '<span>', entry.name, '</span>'].join('');
              fragment.appendChild(li);
            }
            filelist.appendChild(fragment);
          }, errorHandler);
        }, false);
      
        buttons[2].addEventListener('click', function(e) {
          if (!fs) {
            return;
          }
      
          var dirReader = fs.root.createReader();
          dirReader.readEntries(function(entries) {
            for (var i = 0, entry; entry = entries[i]; ++i) {
              if (entry.isDirectory) {
                entry.removeRecursively(function() {}, errorHandler);
              } else {
                entry.remove(function() {}, errorHandler);
              }
            }
            filelist.innerHTML = 'Directory emptied.';
          }, errorHandler);
        }, false);
      }