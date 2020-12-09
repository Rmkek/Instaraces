// ==UserScript==
// @name         Instaraces
// @namespace    https://play.typeracer.com/
// @version      1.0
// @description  Restarts your race as soon as you finish it.
// @author       Rmk1337
// @match        https://play.typeracer.com/*
// @grant        none
// ==/UserScript==

var keys = [];

window.executeHotkeyTest = function(callback, keyValues){
    if (typeof callback !== "function") {
        throw new TypeError("Expected callback as first argument");
    }
    if (typeof keyValues !== "object" && (!Array.isArray || Array.isArray(keyValues))) {
        throw new TypeError("Expected array as second argument");
    }

    var allKeysValid = true;

    for (var i = 0; i < keyValues.length; ++i) {
        allKeysValid = allKeysValid && keys[keyValues[i]];
    }

    if (allKeysValid) {
        callback();
    }
};

window.addGlobalHotkey = function(callback,keyValues){
    if (typeof keyValues === "number") {
        keyValues = [keyValues];
    }

    var fnc = function(cb,val){
        return function(e){
            keys[e.keyCode] = true;
            window.executeHotkeyTest(cb,val);
        };
    }(callback,keyValues);
    window.addEventListener('keydown',fnc);
    return fnc;
};

window.addEventListener('keyup',function(e){
    keys[e.keyCode] = false;
});


(function() {
    'use strict';
    var instaRacesLayer = document.createElement('div');
    instaRacesLayer.id = 'instaRacesLayer';
    instaRacesLayer.style.position = 'absolute';
    instaRacesLayer.style.left = '1em';
    instaRacesLayer.style.bottom = '1em';
    instaRacesLayer.style.width = '11.5em';
    instaRacesLayer.style.height = '1.75em';
    instaRacesLayer.style.padding = '0.25em';
    instaRacesLayer.style.background = '#FF4136';
    instaRacesLayer.innerHTML = '<b>Instaraces not running.</b>';
    document.body.appendChild(instaRacesLayer);

    let intervalCallback = null;
    let clicked = false;
    window.addGlobalHotkey(() => {
        if (!intervalCallback) {
            instaRacesLayer.style.background = '#01FF70';
            instaRacesLayer.innerHTML = '<b>Instaraces running.</b>';
            instaRacesLayer.style.width = '9em';
            instaRacesLayer.style.height = '1.75em';

            intervalCallback = setInterval(() => {
                let raceAgainBtn = document.getElementsByClassName('raceAgainLink') ? document.getElementsByClassName('raceAgainLink')[0] : null;

                if (raceAgainBtn && raceAgainBtn.style.display !== 'none' && !clicked) {
                    raceAgainBtn.click();
                    clicked = true;
                    setTimeout(() => { clicked = false; } , 1000)
                }
            }, 100);
        } else {
            instaRacesLayer.style.background = '#FF4136';
            instaRacesLayer.innerHTML = '<b>Instaraces not running.</b>';
            instaRacesLayer.style.width = '11.5em';

            clearTimeout(intervalCallback);
            intervalCallback = null;
        }
    }, [83,16,17]);

})();
