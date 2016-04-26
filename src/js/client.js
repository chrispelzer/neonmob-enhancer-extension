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
            // Set the Free Packs Stats
            ExtensionClient.getPacks(setId);

            // Set the Print count for the Variant/Chases
            ExtensionClient.getPieces(setId, 0, 100);

            // Set Card Stats
            ExtensionClient.getStats(setId);
        }
    }

    static getPacks(setId){
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
                    if ($('#status--free-packs').length === 0 || $('#status--free-packs').html().search('Free Packs Claimed Today') !== -1) {
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

                // Find the correct status id selector to append the message too
                if ($('#status--released')) {
                    $('#status--released').append(message);
                } else if ($('#status--free-packs')) {
                    $('#status--free-packs').append(message);
                } else if ($('#status--paid')) {
                    $('#status--paid').append(message);
                }
            });
    }

    static getStats(setId){
        // Get the Set data from the API based on the setId found
        $.get('https://www.neonmob.com/api/setts/' + setId + '/', {format: 'json'})
            .done(function (data) {
                // Grab the stats for the core and special rarities
                var stats = data.core_stats;
                stats.push.apply(stats, data.special_stats);

                // Loop through each rarity
                stats.forEach(function (rarity) {
                    // initialize for if we are not on a variant or chase
                    var stat_padding = 'padding-left: 25px';
                    var container_type = 'div';
                    var individual_count = 'Per Print Count: ' + rarity.total_prints / rarity.total +
                        '<br>Total Print Count: ' + rarity.total_prints;

                    // Find the stat span
                    var stat = $('.rarity-stats--rarity-list .text-rarity-' + rarity.class_name);
                    var stat_html = stat.html();

                    // Update the odd position
                    stat.parent().find('small').css('top', 3);

                    if(rarity.name == 'chase'){
                        if(rarity.total >= 100){
                            stat_padding = 'padding-left: 95px';
                        }else if(rarity.total >= 10) {
                            stat_padding = 'padding-left: 85px';
                        }else{
                            stat_padding = 'padding-left: 75px';
                        }
                        container_type = 'span';
                        individual_count = 'Total Print Count: ' + rarity.total_prints;
                    }else if(rarity.name == 'variant'){
                        if(rarity.total >= 100) {
                            stat_padding = 'padding-left: 103px';
                        }else if(rarity.total >= 10) {
                            stat_padding = 'padding-left: 93px';
                        }else{
                            stat_padding = 'padding-left: 83px';
                        }
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
            });
    }

    static getPieces(setId, offset, limit){
        $.get('https://www.neonmob.com/api/sets/' + setId + '/pieces/', {offset: offset, limit: limit})
            .done(function (data){
                var pieces = data.payload.results;
                pieces.forEach(function(piece){
                    var pieceObj = null;

                    if($('.variant #set-checklist--piece-' + piece.id).length !== 0) {
                        pieceObj = $('.variant #set-checklist--piece-' + piece.id + ' span');
                    }else if($('.chase #set-checklist--piece-' + piece.id).length !== 0){
                        pieceObj = $('.chase #set-checklist--piece-' + piece.id + ' span');
                    }

                    if(pieceObj !== null) {
                        var piece_html = $(pieceObj).html();
                        var message = piece_html + '<br>(Prints: ' + piece.num_prints_total + ')';
                        $(pieceObj).html(message);
                    }
                });

                if(data.payload.metadata.resultset.link.next !== null){
                    ExtensionClient.getPieces(setId, offset + limit, limit);
                }
            });
    }
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        var run = setInterval(function() {
            if($('[data-set-id]').data('set-id') !== undefined) {
                clearInterval(run);
                new ExtensionClient();
            }
        }, 500);
    }
}
