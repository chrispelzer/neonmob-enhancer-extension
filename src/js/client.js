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
        // Grab the set id integer from the data-set-id data attribute
        var setId = $('[data-set-id]').data('set-id');

        // Did we find a setId?
        if (setId > 0) {
            // Get the Set data from the API based on the setId found
            $.get('https://www.neonmob.com/api/setts/' + setId + '/', {format: 'json'})
                .done(function (data) {
                    var message = '';

                    // Have the free packs been discontinued yet?
                    if (data.freebies_discontinued == null) {
                        message = '<div>' +
                            data.percent_sold_out + '% Total Packs Claimed' +
                            '</div>';

                        // Don't show if Neonmob is already showing it
                        if (!$('#status--free-packs')) {
                            message += '<div>' +
                                data.free_packs_claimed_percent + '% Free Packs Claimed' +
                                '</div>';
                        }
                    } else {
                        // If the free packs were sold out then display the date they sold out on
                        var free_soldout = new Date(data.freebies_discontinued);
                        var months = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
                        message = '<div>' +
                            'The free packs sold out on <br>' +
                            months[free_soldout.getMonth()] + ' ' +
                            free_soldout.getDate() + ', ' +
                            free_soldout.getFullYear() +
                            '</div>';
                    }
                    console.log('test');
                    // Find the rarity area
                    var core_stats = data.core_stats;
                    var special_stats = data.special_stats;
                    // Loop through each rarity
                    core_stats.forEach(function (rarity) {
                        // Find the stat span
                        var stat = $('.text-rarity-' + rarity.class_name);
                        var stat_html = stat.html();

                        // Update the odd position
                        stat.parent().find('small').css('top', 3);

                        // Add total print data
                        stat_html += '<div style="padding-left: 25px">' +
                            'Total Print:' + rarity.total_prints +
                            '</div>';
                        stat.html(stat_html);
                    });

                    // Loop through each rarity
                    special_stats.forEach(function (rarity) {
                        // Find the stat span
                        var stat = $('.text-rarity-' + rarity.class_name);
                        var stat_html = stat.html();

                        // Update the odd position
                        stat.parent().find('small').css('top', 3);
                        if(rarity.name == 'chase'){
                            var stat_padding = 'padding-left: 75px';
                        }else if(rarity.name == 'variant'){
                            var stat_padding = 'padding-left: 83px';
                        }
                        // Add total print data
                        stat_html += '<span style="' + stat_padding + '">' +
                            '<br>Total Print:' + rarity.total_prints +
                            '</span>';
                        stat.html(stat_html);
                    });

                    // Find the correct status id selector to append the message too
                    if ($('#status--released')) {
                        $('#status--released').append(message);
                    } else if ($('#status--free-packs')) {
                        $('#status--free-packs').append(message);
                    } else if ($('#status--paid')) {
                        $('#status--paid').append(message);
                    }
                })
                .error(function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                });
        }
    }
}

new ExtensionClient();
