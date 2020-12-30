
/* debuging handler, if debug is false then LOG is empty function*/
const debug = true;
const LOG = debug ? console.log.bind(console) : function () {};



var id = 0;
var pageX = undefined;
var pageY = undefined;
var global_selection = undefined;
var global_close_id = undefined;
var highlighted_regions =[]; //{id,color,orginal_selection,original_range}



/* Handle incomming messages from background.js and popup.js */
chrome.runtime.onMessage.addListener(function (msg, sender) {
    LOG("Recivied incoming message on content.js",msg)
    if(msg.action == "highlight")
    {

        highlight(global_selection,msg.color,"highlighter");
        LOG("Highlight!!");
        return;
    }
    LOG("Detected incoming message in content.js with unknown action field",msg,sender);
    return;
});



/* Highlight text */
function highlight(selection, color, type)
{
    var span = document.createElement("span");
    span.setAttribute("id","hlt-"+id);
    span.className = type+"-"+color;
   // var highlight_data = {id:"htl-"+id,color:color,orginal_selection:selection,original_range:selection.getRangeAt(0).cloneRange()}
    if (selection.rangeCount) {
        var range = selection.getRangeAt(0).cloneRange();
        range.surroundContents(span);
        LOG(range);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    span = document.getElementById("hlt-"+id);
    span.onclick = (e)=>{open_secondary_tooltip("hlt-"+id,e)};
    id++;
}



function handle_selction(e)
{
    var selection = undefined;
    if(window.getSelection)
    {
        selection = window.getSelection();
        if(selection.toString().length > 0)
        {
            show_tooltip(e.pageX,e.pageY);
        }else{
            hide_tooltip();
            close_secondary_tooltip();
        }
        global_selection = selection;

    }else
    {
        global_selection = undefined;
        close_secondary_tooltip();
        hide_tooltip();
        return;
    }
}


function show_tooltip(pageX,pageY)
{
    $('.tooltip').fadeIn().css(({ left:  pageX, top: pageY -50 }));
}

function hide_tooltip()
{
    $('.tooltip').fadeOut();
}


function open_secondary_tooltip(span_id,e)
{
    LOG("opening the sec toolip",span_id);
    LOG(e);
    global_close_id = e.srcElement.id;
    $('.tooltip-secondary').fadeIn().css(({ left:  e.pageX, top: e.pageY }));
}
function close_secondary_tooltip()
{
    LOG("Closing the tooltip");
    //global_close_id = undefined;
    $('.tooltip-secondary').fadeOut();
}

function tooltip_btn_click(event)
{
    if(event.srcElement.id == "tooltip-btn-yellow")
    {
        highlight(global_selection, "yellow","highlighter");
    }
    if(event.srcElement.id == "tooltip-btn-red")
    {
        highlight(global_selection, "red","highlighter");
    }
    if(event.srcElement.id == "tooltip-btn-green")
    {
        highlight(global_selection, "green","highlighter");
    }
    if(event.srcElement.id == "tooltip-btn-close")
    {
        remove(global_close_id);    
    }
    close_secondary_tooltip();
    hide_tooltip();
}

function remove(span_id)
{
    LOG("removing",span_id);
    //document.getElementById(span_id).className = "";
    $('#'+span_id).contents().unwrap();
}

function create_tooltip()
{
    var tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    var yellow_img = document.createElement("img");
    yellow_img.src = chrome.extension.getURL('assets/img/yellow.png')
    yellow_img.setAttribute("id","tooltip-btn-yellow");
    yellow_img.addEventListener('click',tooltip_btn_click);
    tooltip.append(yellow_img);
    var red_img = document.createElement("img");
    red_img.src = chrome.extension.getURL('assets/img/red.png')
    red_img.setAttribute("id","tooltip-btn-red");
    red_img.addEventListener('click',tooltip_btn_click);
    tooltip.append(red_img);
    var green_img = document.createElement("img");
    green_img.src = chrome.extension.getURL('assets/img/green.png')
    green_img.setAttribute("id","tooltip-btn-green");
    green_img.addEventListener('click',tooltip_btn_click);
    tooltip.append(green_img);
    return tooltip;
}

function create_tooltip_secondary()
{
    var tooltip = document.createElement("div");
    tooltip.className = "tooltip-secondary";
    var close_img = document.createElement("img");
    close_img.src = chrome.extension.getURL('assets/img/close.png')
    close_img.setAttribute("id","tooltip-btn-close");
    close_img.addEventListener('click',tooltip_btn_click);
    tooltip.append(close_img);
    return tooltip;
}

//setup listener for mouseup event.
$('body').mouseup(handle_selction);

$(document).ready(function(){
    var tooltip = create_tooltip();
    var secondary_tooltop = create_tooltip_secondary();
    $('body').append(tooltip);
    $('body').append(secondary_tooltop);
});

