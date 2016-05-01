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
                var message = null;
                var soldOutDays = 0;
                var container = document.createElement('span');
                var months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];

                // Have the free packs been discontinued yet?
                if (data.freebies_discontinued == null) {
                    message = data.percent_sold_out + '% Total Packs Claimed';

                    // Don't show if Neonmob is already showing it
                    if ($('#status--free-packs').length === 0 || $('#status--free-packs').html().search('Free Packs Claimed Today') !== -1) {
                        message += '<br>' + data.free_packs_claimed_percent + '% Free Packs Claimed'
                    }
                }

                // If only the free packs were sold out then display the date they sold out on
                if(data.free_packs_available === false && data.packs_available === true) {
                    var free_soldout = new Date(data.freebies_discontinued);
                    soldOutDays = ExtensionClient.diffDays(new Date(data.released), free_soldout);

                    message = 'The free packs sold out within<br>'+
                        soldOutDays + ' day' +
                        (soldOutdays >= 2 ? ' s' : '') + ' on ' +
                        months[free_soldout.getMonth()] + ' ' +
                        free_soldout.getDate() + ', ' +
                        free_soldout.getFullYear();
                }

                // If both the free packs and paid packs were sold out, display the amount of days it sold out in
                if(data.free_packs_available === false && data.packs_available === false) {
                    soldOutDays = ExtensionClient.diffDays(new Date(data.released), new Date(data.discontinued));
                    message = 'The set sold out within<br>' + soldOutDays + ' day' +
                        (soldOutdays >= 2 ? 's' : '') +
                        ' since its release';
                }

                // Find the correct status id selector to append the message too
                var freeObj = null;
                if ($('.sett-status-message #status--released').length !== 0
                    && $('.sett-status-message #status--paid').length !== 0) {
                    freeObj = $('#status--paid');
                } else if ($('.sett-status-message #status--released').length !== 0
                    && $('.sett-status-message #status--free-packs').length !== 0) {
                    freeObj = $('#status--free-packs');
                } else if ($('.sett-status-message #status--released').length !== 0) {
                    freeObj = $('#status--released');
                }

                $(container).addClass('text-prominent');
                container.innerHTML = message;
                $(container).insertAfter(freeObj);
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
                    var individual_count = '';

                    // Find the stat span to append to
                    var stat = $('.rarity-stats--rarity-list .text-rarity-' + rarity.class_name);

                    // Update the odds 1 in # position
                    stat.parent().find('small').css('top', 3);

                    // Show Per Print count if there's more than one print of that rarity
                    if((rarity.total_prints / rarity.total) != rarity.total_prints){
                        individual_count = 'Per Print Count: ' + rarity.total_prints / rarity.total + '<br>';
                    }

                    // Set the Total Print Count
                    if(rarity.name == 'variant' || rarity.name == 'chase'){
                        // override for chase and variants to be total print count only
                        individual_count = 'Total Print Count: ' + rarity.total_prints;
                    }else{
                        individual_count += 'Total Print Count: ' + rarity.total_prints;
                    }

                    // Build the stat html for the print counts
                    var container = document.createElement('div');
                    $(container).addClass('text-rarity-' + rarity.class_name);
                    $(container).css({
                        'padding-left': '25px'
                    });
                    container.innerHTML = individual_count;
                    $(container).insertAfter(stat);
                });
            });
    }

    static getPieces(setId, offset, limit){
        $.get('https://www.neonmob.com/api/sets/' + setId + '/pieces/', {offset: offset, limit: limit})
            .done(function (data){
                // Get the Rarity types to match against
                var refs = data.refs
                var rarity_list = {};
                $.each(refs, (function(key, value){
                    if(key.indexOf('default:piece-rarity-') !== -1){
                        rarity_list[key] = value;
                    }
                }));

                var pieces = data.payload.results;
                var pieceObj = null;
                pieces.forEach(function(piece){
                    if(rarity_list[piece.rarity[1]]['class'] == 'variant' || rarity_list[piece.rarity[1]]['class'] == 'chase') {
                        pieceObj = $('.' + rarity_list[piece.rarity[1]]['class'] + ' #set-checklist--piece-' + piece.id);
                        if (pieceObj !== null) {
                            var message = 'Prints: ' + piece.num_prints_total;
                            var container = document.createElement('span');
                            $(container).css({
                                'display' : 'block'
                            });
                            container.innerHTML = message;
                            $(container).insertAfter(pieceObj.find('span'));
                        }
                        pieceObj = null;
                    }
                });

                if(data.payload.metadata.resultset.link.next !== null){
                    ExtensionClient.getPieces(setId, offset + limit, limit);
                }
            });
    }

    static diffDays (date1,date2){
        var ndays;
        var ts1 = date1.getTime();
        var ts2 = date2.getTime();

        ndays = (ts2 - ts1) / 1000 / 86400;
        ndays = Math.round(ndays - 0.5);
        return ndays;
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
