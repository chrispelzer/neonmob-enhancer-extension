## 0.1.2 (June 11, 2016)

Fixes:

    - Fix bug where the sold out dates weren't being shown and tweak the text shown
    - Fix deprecated warning for style insertRule index required

## 0.1.1 (June 10, 2016)

Fixes:

    - Added a temporary fix to add the background gradient color for the Chase rarity. Will remove once corrected

## 0.1.0 (May 3, 2016)

Features:

    - If a set is unlimited with an infinite # of prints available, display ∞

## 0.0.15 (April 28, 2016)

Features:

    - Changed displaying the print count for the Core Rarity Per/Total Prints. If they're the same, show just the Total
    - Chases/Variant Individual Print counts aren't surrounded by ()
    - Display the amount of days either the free packs sold out or the set went out of print since the released date
        
Fixes:

    - A lot of Optimizations

## 0.0.14 (April 25, 2016)

Fixes:

    - Fix issue if a set has more than 50 variant/chases that only the first 50 would show the print count.

## 0.0.13 (April 24, 2016)

Features:

    - Individual Print Counts are listed within the listing of the prints underneath the print name for Chases and Variants

Fixes:

    - Fix the ready state so loading of the counts and % should now work 98% of the time

## 0.0.12 (April 24, 2016)

Features:

    - Added Per Print Count listed within the Pack Odds area for each of the Core Set Rarities
    - Added Total Print Count of all Chase/Variant listed within the Pack Odds area (Due to the variety of print counts for each chase or variant print, it's impossible to list out ALL print counts)

Fixes:

    - Might have fixed the bug that would require a page refresh to display correctly
    - Permission update to not include ALL tabs but only the Active Tab for NeonMob (This should only show the permission now for only neonmob.com related sites, not all browsing history, Sorry if that caused confusion)

## 0.0.11 (April 23, 2016)

Fixes:

    - Issue with extension manifest version and the actual package version. This puts it back in line

## 0.0.8 (March 22, 2016)

Fixes:

    - Fix displaying to be the day of the month and not the day of the week for when the set sold out
    - Fix threshold percentage of when to stop displaying the free pack % and let NeonMob handle it

## 0.0.7 (March 20, 2016)

Fixes:

    - Fix for if a free pack % is higher than 70, let NeonMob show it
    
## 0.0.6 (March 20, 2016)

Fixes:

    - Fix for one more case for the status message area and fix for doubling output via @tgashby

## 0.0.5 (March 20, 2016)

Fixes:

    - Display the free packs if you still had packs to open

## 0.0.4 (March 19, 2016)

Features:

    - Display the day when the free packs sold out on

## 0.0.3 (March 19, 2016)

Fixes:

    - Fix breaking of extension from a fix to check null but not the string null

## 0.0.2 (March 19, 2016)

Fixes:

    - Only display the % information if the free packs are not sold out


## 0.0.1 (March 19, 2016)

Features:

    - Display the % of Free Packs claimed and the % of all packs claimed
