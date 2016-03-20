/**
 * @file NeonMob Enhancer
 * @name Client
 *
 * Extension client script code.
 *
 * @author Chris Pelzer <me@chrispelzer.com>
 */

'use strict';

class ExtensionClient {
    constructor() {
        var setId = $('span.loadTarget').data('set-id');

        if(setId > 0) {
            $.get('https://www.neonmob.com/api/setts/' + setId + '/', {format: 'json'})
                .done(function (data) {
                    if(data.freebies_discontinued == null) {
                        $('#status--free-packs').append(
                            '<div>' +
                            data.percent_sold_out + '%' + ' of packs sold out' +
                            '</div>' +
                            '<div>' +
                            data.free_packs_claimed_percent + '%' + ' of free packs claimed' +
                            '</div>'
                        );
                    }else{
                        var free_soldout = new Date(data.freebies_discontinued);
                        var months = [ "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December" ];
                        $('#status--free-packs').append(
                            '<div>' +
                                'The free packs sold out on <br>' +
                                months[free_soldout.getMonth()] + ' ' +
                                free_soldout.getDay() + ', ' +
                                free_soldout.getFullYear() +
                            '</div>'
                        );
                    }
                });
        }
    }
}

new ExtensionClient();
