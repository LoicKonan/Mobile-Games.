const unique_game_identifier = "Loickonan.soulcrusher";

/**
 * Saves the data object to localStorage under your game's identifier.
 * Overwrites any existing data!
 * @param {any} data 
 */

function saveObjectToLocal(data) 
{
    localStorage.setItem(unique_game_identifier, JSON.stringify(data));
}



/**
 * @returns {any} A JavaScript object loaded and parsed from localStorage under your
 * game's unique identifier
 */
function loadObjectFromLocal() 
{
    return JSON.parse(localStorage.getItem(unique_game_identifier));
}