// Class that expand and condense CSS rules
// Support for: margin, padding, border-width, border
// Expected input: complete CSS rule (property + colon + values + (optional)semicolon)
// Expected output: array with as key the property and as value the property value

// InArray needed function
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

// Define the converter class
var rule = {
    
    syntax: {
        border: {
            properties: ['width', 'style', 'color'],
            values: {
                style: ['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','inherit']
            }   
        },
        topleftbottomright: {
            properties: ['top', 'left', 'bottom', 'right']
        }
    
    },
    
    expand: function (rule) {
        // Where the rule-specific properties will be stored
        var properties = {};   
        // Where the expanded code will be placed
        var expanded = {};
        // Assign to property the property name and strip starting and ending whitespaces
        var property = rule.split(":")[0].replace(/(^\s+|\s+$|;)/g, '');
        // Assign to values the values of the CSS rule and strip starting and ending whitespaces
        var values = rule.split(":")[1].replace(/(^\s+|\s+$|;)/g, '').split(" ");
        
        switch (property) {

            // Margin/Padding rule spotted, expand it:
            case 'margin':
            case 'padding':
            case 'border-width':

                // List of the single-properties variations
                properties = this.syntax.topleftbottomright.properties;

                // Our expanded CSS rule
                values.forEach(function (value, index) {
                    // put new property + value in array
                    expanded[property + '-' + properties[index]] = value ;
                });
                break;
                
            case 'border':
                
                // List of the single-properties variations
                properties = this.syntax.border.properties;
                var values_style = this.syntax.border.values.style;
                
                values.forEach(function (value) {
                    
                    // width property
                    if(value.indexOf("px") !== -1 || value === 0) { var index = 0; }
                    // style property
                    if(inArray(value, values_style)) { var index = 1; }
                    // color property
                    if( (value.indexOf("px") === -1 && value !== 0) && (!inArray(value, values_style)) ) { var index = 2; }
                    // put new property + value in array
                    expanded[property + '-' + properties[index]] = value;
                });
                             
                break;
                
            case 'border-color':
                

                // Not a valid property, return false
            default:
                expanded = false;
                break;

        }

        return expanded;
    },
    condense: function (rules) {

        // Clean input
        rules = rules.replace(/(^\s+|\s+$|;|^[\s\n]+|[\s\n]+$)/g, '');

        // Get array of rules        
        rules = rules.split("\n");

        console.log(rules);
        // Get array of values
        var values = [];
        //rules.forEach(function(rule)) {
        //    values.push( rule.split(":")[1] );
        //}

        values.forEach(function (value, index) {
            expanded += property + '-' + properties[index] + ': ' + value + ";";
        });
        
        return values;

    }

}


// Our input / condensed CSS rules
var border = 'border: 1px solid white;';
var padding = 'padding:1px 2px 3px 4px;';
var margin = 'margin : 1px 2px 3px 4px;';
var notvalid = 'color: red;';


// Border test
$("pre").append("border:\n\n");
$("pre").append(JSON.stringify(rule.expand(border)));

// Margin test
$("pre").append("\n\npadding:\n\n");
$("pre").append(JSON.stringify(rule.expand(padding)));