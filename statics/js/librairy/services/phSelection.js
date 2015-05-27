'use strict';

/* services */

var librairyServices = angular.module('librairyServices');

/* defines a selection service for thumbs
 *
 * an element is selected if "element.selected" is true;
 * an element is active if "element.active" is true;
 * an element must have "element.id" unique in elements array
 *
 * each public functions must return an object like this:
 *  {
 *      ids: [array with selected elements id], active element is
 *      at index 0
 *      objects: [array with all selected elements, in order]
 *      active: active element if any, else selected element if only one,
 *      else false,
 *  }
 *
 */

librairyServices.factory('phSelection', function() {
    // initialise object to be return
    var selected = {
        'ids': [],
        'objects': [],
        'active': false,
    }

    var resetSelected = function() {
        // initialise object at default values
        selected.ids = [];
        selected.objects = [];
        selected.active = false;
    }

    var indexOf = function(array, value) {
        // returns index of given object or -1
        for (var i=0, len=array.length; i < len; i++) {
            if (array[i] === value) {
                return i;
            }
        }

        return -1
    }


    var exchangeIndex = function(array, value, index) {
        // put value at array[index]
        // put old value of array[index] at old index of value
        var value_index = indexOf(array, value);
        var index_value = array[index];
        array[index] = value;
        array[value_index] = index_value;

        return array;
    }


    var getOrderedSelectedElements = function(elements) {
        var table = [];
        for (var i=0, len=elements.length; i < len; i++) {
            if (elements[i].selected) {
                table.push(elements[i]);
            }
        }
        return table;
    }
    
    // return selected elements in service or in given array
    var getSelected = function(elements, fn) {
        /* 
         * elements -> array with all selectable elements objects
         * fn -> function to apply to each element in loop
         * fn is apply before checking if element is active or selected
         * if elements is given, scan elements to find selected items
         * else return selected object store in service
         *
         */
        // if we got no array, return store object
        if (! elements) {
            return selected;
        }

        // initialise object
        resetSelected();


        // if we got an array, scan it
        for (var i=0, len=elements.length; i < len; i++) {
            if (fn) {
                // apply given function on element
                fn(elements[i], i);
            }
            if (elements[i].active) {
                selected.active = elements[i];
                var active_index = i;
            }
            if (elements[i].selected) {
                // push selected elements in arrays
                selected.ids.push(elements[i].id);
                selected.objects.push(elements[i]);
            }
        }

        if (selected.active) {
            // exchange active index to 0
            exchangeIndex(selected.ids, selected.active.id, 0);
        }
        // if many selected and no active, active first one
        else if (selected.ids.length > 1) {
            selected.active = selected.objects[0];
            selected.active.active = true;
        }
        // if no active and one selected, it becomes active
        else if (selected.ids.length == 1) {
            selected.active = selected.objects[0];
        }
        
        /*console.log('active: ' + selected.active.id);
        var s = 'objects : ';
        for (var i=0; i < selected.objects.length; i++) { s = s + selected.objects[i].id + ' ';}
        console.log(s);
        console.log('ids: ' + selected.ids);*/
        return selected;
    }

    var unselectAll = function(elements) {
        // unselect and unactivate all elements in elements
        for (var i=0, len=elements.length; i < len; i++) {
            elements[i].selected = false;
            elements[i].active = false;
        }

        resetSelected();

        
        /*console.log('active: ' + selected.active.id);
        var s = 'objects : ';
        for (var i=0; i < selected.objects.length; i++) { s = s + selected.objects[i].id + ' '}
        console.log(s);
        console.log('ids: ' + selected.ids);*/
        return selected;
    }

    var selectAll = function(elements) {
        /* 
         * select all elements in elements
         *
         */
        var fn = function(element, i) {
            element.selected = true;
        }

        return getSelected(elements, fn);
    }

    var reverseSelected = function(elements) {
        /*
         * select unselected elements, 
         * unselect selected elements
         *
         */
        var fn = function(element, i) {
            if (element.selected) {
                element.selected = false;
                element.active = false;
            }
            else {
                element.selected = true;
            }
        }

        return getSelected(elements, fn);
    }

    var updateSelected = function(elements, filteredElements) {
        /*
         * unactivate and unselect elements which are not in
         * filteredElements
         *
         * must be fast: used on a $watch
         */
        
        for (var i=0, len=elements.length; i < len; i++) {
            if (! elements[i].selected) {
                // we don't care about not selected elements
                continue;
            }
            if (indexOf(filteredElements, elements[i]) == -1) {
                // if element is not in filtered ones
                elements[i].selected = false;
                elements[i].active = false;
            }
        }

        getSelected(filteredElements);

        if (selected.ids.length == 1) {
            selected.active.active = false;
        }

        
        /*console.log('active: ' + selected.active.id);
        var s = 'objects : ';
        for (var i=0; i < selected.objects.length; i++) { s = s + selected.objects[i].id + ' '}
        console.log(s);
        console.log('ids: ' + selected.ids);*/
        return selected;
    }

    var selectTheOne = function(elements, element) {
        // if element is not the only selected or is not selected
        if ((selected.ids.length > 1 && element.selected)
                || ( ! element.selected)) {
            var fn = function(current, i) {
                if (element == current) {
                    current.selected = true;
                    current.active = false
                }
                else {
                    current.selected = false;
                    current.active = false;
                }
            }
            return getSelected(elements, fn);    
        }
        
        /*console.log('active: ' + selected.active.id);
        var s = 'objects : ';
        for (var i=0; i < selected.objects.length; i++) { s = s + selected.objects[i].id + ' '}
        console.log(s);
        console.log('ids: ' + selected.ids);*/
        return selected;
    }

    var select = function(event, elements, element) {
        /*
         * event -> dom selection event
         * elements -> array with all selectable objects
         * element -> element object selection event appened on
         *
         */
        // shift was pressed
        if (event.shiftKey) { // shift key pressed
            // if element is active or is only selected
            if (element.active || selected.ids.length < 1) {
                // normal click behavior
                return selectTheOne(elements, element);
            }
            // if only one element is selected it becomes active
            // except if it's the one event append on
            if (selected.ids.length == 1) {
                if (selected.objects[0] == element) {
                
                    /*console.log('active: ' + selected.active.id);
                    var s = 'objects : ';
                    for (var i=0; i < selected.objects.length; i++) { s = s + selected.objects[i].id + ' '}
                    console.log(s);
                    console.log('ids: ' + selected.ids);*/
                    return selected;
                }
                selected.active.active = true
            }
            // get index of element and of active element
            var element_index = indexOf(elements, element);
            var active_index = indexOf(elements, selected.active);

            if (active_index < element_index) {
                var fn = function(current, i) {
                    if (active_index <= i && i <= element_index) {
                        current.selected = true;
                    }
                    else {
                        current.selected = false;
                    }
                }
            }
            else { // active_index > element_index
                var fn = function(current, i) {
                    if (active_index >= i && i >= element_index) {
                        current.selected = true;
                    }
                    else {
                        current.selected = false;
                    }
                }
            }
            return getSelected(elements, fn);
        }
        else if (event.ctrlKey) { // control key pressed
            
            // if element is selected
            if (element.selected) {
                if (element.active) {
                    var index = indexOf(selected.objects, element);
                    // active next selected
                    if (index == selected.objects.length - 1) {
                        selected.active = selected.objects[0];
                    }
                    else {
                        selected.active = selected.objects[index + 1];
                    }
                    element.active = false;
                    selected.active.active = true;
                }
                // unselect element
                element.selected = false;
                // if only one element remain selected
                if (selected.ids.length == 2) {
                    selected.active.active = false;
                }
                return getSelected(elements);
            }
            else { // if element is not selected
                // if only one element is selected activate it
                if (selected.ids.length == 1) {
                    selected.active.active = true;
                }
                // select element
                element.selected = true;
                return getSelected(elements);
            }
        }
        else { // no modkey pressed
            return selectTheOne(elements, element);
        }
    }

    var activate = function(event, elements, element) {
        /*
         * event -> dom selection event
         * elements -> array with all selectable objects
         * element -> element object selection event appened on
         *
         * activate element and unactivate old active one
         * if element is active do nothing
         * if element is not selected, or mod key was used
         * return select() (normal click behavior)
         *
         * add a timer for shift and ctrl click (else risk to open
         * no selected picture in single view (with ctrl) and wrong
         * selected picture in single view (with shift)
         *
         */
        // element is not selected or mod key: normal click behavior
        if (! element.selected || event.ctrlKey || event.shiftKey) {
            return select(event, elements, element);
        }
        // only one selected or element is active: nothing append
        if (selected.ids.length == 1 || element.active) {
        
            /*console.log('active: ' + selected.active.id);
            var s = 'objects : ';
            for (var i=0; i < selected.objects.length; i++) { s = s + selected.objects[i].id + ' '}
            console.log(s);
            console.log('ids: ' + selected.ids);*/
            return selected;
        }
        // unactivate active
        selected.active.active = false;
        // activate element
        selected.active = element;
        selected.active.active = true;
        exchangeIndex(selected.ids, selected.active.id, 0);
        
        /*console.log('active: ' + selected.active.id);
        var s = 'objects : ';
        for (var i=0; i < selected.objects.length; i++) { s = s + selected.objects[i].id + ' '}
        console.log(s);
        console.log('ids: ' + selected.ids);*/

        return selected;
    }

    var selectNextPrev = function(elements, direction) {
        if (selected.ids.length > 1) {
            // more than one selected, iterate through
            // selected elements
            var array = selected.objects;
            var property = 'active';
        }
        else {
            // only one selected (this should be check before launching
            // function) iterate through all elements
            var array = elements;
            var property = 'selected';
        }
        // get active element index in array
        var index = indexOf(array, selected.active);

        // determine new active index
        if (direction == 'prev') {
            if (index == 0) {
                var new_index = array.length - 1;
            }
            else {
                var new_index = index - 1;
            }
        }
        else { // direction should be 'next'
            if (index + 1 < array.length) {
                var new_index = index + 1;
            }
            else {
                var new_index = 0;
            }
        }

        // desactivate active, active new one
        selected.active[property] = false;
        selected.active = array[new_index];
        selected.active[property] = true;

        if (property == 'selected') {
            selected.ids = [selected.active.id];
            selected.objects = [selected.active];
        }
        else { // property should be active
            exchangeIndex(selected.ids, selected.active.id, 0);
        }
        
        /*console.log('active: ' + selected.active.id);
        var s = 'objects : ';
        for (var i=0; i < selected.objects.length; i++) { s = s + selected.objects[i].id + ' '}
        console.log(s);
        console.log('ids: ' + selected.ids);*/
        return selected;
    }

    var selectNext = function(elements) {
        return selectNextPrev(elements, 'next');
    }

    var selectPrev = function(elements) {
        return selectNextPrev(elements, 'prev');
    }

    return {
        'getSelected': getSelected,
        'unselectAll': unselectAll,
        'selectAll': selectAll,
        'reverseSelected': reverseSelected,
        'updateSelected': updateSelected,
        'select': select,
        'activate': activate,
        'selectNext': selectNext,
        'selectPrev': selectPrev
    }
});

