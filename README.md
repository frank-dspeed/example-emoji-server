# ECMAScript 2021 NodeJS & Browser Example EMOJ Counter
The Goal is to display EMoji's we use the utf8 emoj set to be compatible to all devices

Support for Realtime Updates as we got a fixed set of valid Emojis we can work with a Hashmap
as data structure and we can use the index of the key value to send smaller messages for updates.

Please Remember that this is a PoC it got created only for training and demo lessons it is nothing
that you should use in Production without Modification.

## Using node Below 15.10?
node --harmony-top-level-await server.js

## Using node below 14?
you need to use webpack or what ever you like maybe babel directly to make this compatible to older engines

we will not teach you to do old code that is useless and needs transpiling to even run on modern platforms
