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
                        if ($('#status--free-packs').length === 0) {
                            var freeHtml = $('#status--free-packs').html();

                            // Make sure the free-packs can actually be claimed
                            if(freeHtml.search('Free Packs Claimed Today') !== -1) {
                                message += '<div>' +
                                    data.free_packs_claimed_percent + '% Free Packs Claimed' +
                                    '</div>';
                            }
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

                    // Grab the stats for the core and special rarities
                    var stats = data.core_stats;
                    stats.push.apply(stats, data.special_stats);

                    // Loop through each rarity
                    stats.forEach(function (rarity) {
                        // initialize for if we are not on a variant or chase
                        var stat_padding = 'padding-left: 25px';
                        var container_type = 'div';
                        var individual_count = 'Per Print Count: ' + rarity.total_prints / rarity.total;

                        // Find the stat span
                        var stat = $('.rarity-stats--rarity-list .text-rarity-' + rarity.class_name);
                        var stat_html = stat.html();

                        // Update the odd position
                        stat.parent().find('small').css('top', 3);

                        if(rarity.name == 'chase'){
                            stat_padding = 'padding-left: 75px';
                            container_type = 'span';
                            individual_count = 'Total Print Count: ' + rarity.total_prints;
                        }else if(rarity.name == 'variant'){
                            stat_padding = 'padding-left: 83px';
                            container_type = 'span';
                            individual_count = 'Total Print Count: ' + rarity.total_prints;
                        }

                        // Build the stat html for the print counts
                        stat_html += '<' + container_type + ' style="' + stat_padding + '">' +
                            (container_type == 'span' ? '<br>' : '') +
                            individual_count +
                            '</' + container_type + '>';
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
                    
                });
        }
    }
}

new ExtensionClient();
