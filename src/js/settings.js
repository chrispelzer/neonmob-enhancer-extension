/**
 * @file NeonMob Enhancer
 * @name Client
 *
 * Extension client script code.
 *
 * @author Chris Pelzer <me@chrispelzer.com>
 */

import 'foundation-sites/js/foundation.core';
import 'foundation-sites/js/foundation.util.mediaQuery';
import 'foundation-sites/js/foundation.util.keyboard';
import 'foundation-sites/js/foundation.util.motion';

'use strict';

class ExtensionSettings {

    constructor() {
        // Default settings states
        var defaultSettings = {
            'pack': true,
            'count': true,
            'special': true,
        }

        // Set the default settings to localStorage if it's unset
        chrome.storage.local.get(Object.keys(defaultSettings), function(items){
            _.forEach(defaultSettings, function(value, key){
                var switchObj = document.getElementById(key);
                var state = false;
                var saveObj = {};

                // Set the default setting otherwise use the setting from the storage
                if(items[key] == ''){
                    state = defaultSettings[key];
                }else{
                    state = items[key];
                }

                // Set the switch property to the state it needs to be
                $(switchObj).prop('checked', state);

                // Save the state to storage
                saveObj[key] = state;
                chrome.storage.local.set(saveObj);

                // Set the onchange for the setting switch to save
                $(switchObj).on('change', function () {
                    var state = $(this).prop('checked');
                    var key = $(this).prop('id');
                    var obj = {};
                    obj[key] = state;
                    chrome.storage.local.set(obj);
                });
            });
        });
    }
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        new ExtensionSettings();
    }
}
