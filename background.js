/*
Author: Abhishek Shingane
*/

/* debuging handler, if debug is false then LOG is empty function*/
const debug = true;
const LOG = debug ? console.log.bind(console) : function () {};




var config = {shortcuts : []}
/*Hardcode shortcuts for testing purpose, later develop a ui*/
config.shortcuts = [{key:"AltR",action:{type:"highlight", color:"green"}}];




function handle_command(command)
{
    var shortcut = config.shortcuts.find(s => s.key==command)
    if(shortcut == undefined)
    {
        LOG("Unable to find shortcut in config",command);
        return;
    }
    var action = shortcut.action;
    var msg = {action:action.type,color:action.color}
    send_message_to_active_tab(msg); // put this in try catch.
}

function send_message_to_active_tab(msg)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id,msg);
    });
}



/* Listen for keypresses, keypresses are declared in manifest.json, if key press detected, forward it to context script of active tab. */
chrome.commands.onCommand.addListener(handle_command);



