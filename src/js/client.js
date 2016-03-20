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
                    var message = '';

                    if(data.freebies_discontinued == null) {
                        message = '<div>' +
                            data.percent_sold_out + '% Total Packs Claimed' +
                            '</div>';
                        if(!$('#status--released')){
                            message += '<div>' +
                                data.free_packs_claimed_percent + '% Free Packs Claimed' +
                                '</div>';
                        }
                    }else{
                        var free_soldout = new Date(data.freebies_discontinued);
                        var months = [ "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December" ];
                        message = '<div>' +
                            'The free packs sold out on <br>' +
                            months[free_soldout.getMonth()] + ' ' +
                            free_soldout.getDay() + ', ' +
                            free_soldout.getFullYear() +
                            '</div>';
                    }

                    if($('#status--released')) {
                        $('#status--released').append(message);
                    } else if($('#status--free-packs')){
                        $('#status--free-packs').append(message);
                    } else if($('#status--paid')) {
                        $('#status--paid').append(message);
                    }
                });
        }
    }
}

new ExtensionClient();
