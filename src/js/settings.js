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

!function ($) {
    'use strict';

    class ExtensionSettings {
        constructor() {
            // Default settings
            var settings = {
                'pack-info': true,
                'count-info': true,
                'special-info': true,
            }

            // Set the default settings to localStorage
            _.forEach(settings, function (value, key) {
                if (localStorage[key] == '') {
                    localStorage[key] = value;
                }
            });

            this.setEvents(settings);
        }

        setEvents(settings) {
            $('#pack-info').on('change', function (e) {
                console.log(e);
            });
        }
    }

    new ExtensionSettings();
}
