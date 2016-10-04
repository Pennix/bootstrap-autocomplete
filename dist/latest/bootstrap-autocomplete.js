/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* =============================================================
	 * bootstrap-autocomplete.js v0.0.1
	 * https://github.com/xcash/bootstrap-autocomplete
	 * =============================================================
	 * Forked from bootstrap3-typeahead.js v3.1.0
	 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
	 * =============================================================
	 * Original written by @mdo and @fat
	 * =============================================================
	 * Copyright 2016 Paolo Casciello @xcash666 and contributors
	 *
	 * Licensed under the MIT License (the 'License');
	 * you may not use this file except in compliance with the License.
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an 'AS IS' BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 * ============================================================ */
	var resolvers_1 = __webpack_require__(1);
	var dropdown_1 = __webpack_require__(2);
	var AutoCompleteNS;
	(function (AutoCompleteNS) {
	    var AutoComplete = (function () {
	        function AutoComplete(element, options) {
	            this._selectedItem = null;
	            this._defaultValue = null;
	            this._defaultText = null;
	            this._isSelectElement = false;
	            this._settings = {
	                resolver: 'ajax',
	                resolverSettings: {},
	                minLength: 3,
	                valueKey: 'value',
	                formatResult: this.defaultFormatResult,
	                autoSelect: true,
	                events: {
	                    typed: null,
	                    searchPre: null,
	                    search: null,
	                    searchPost: null,
	                    select: null,
	                    focus: null,
	                }
	            };
	            this._el = element;
	            this._$el = $(this._el);
	            // element type
	            if (this._$el.is('select')) {
	                this._isSelectElement = true;
	            }
	            // inline data attributes
	            this.manageInlineDataAttributes();
	            // constructor options
	            if (typeof options === 'object') {
	                this._settings = $.extend(true, {}, this.getSettings(), options);
	            }
	            if (this._isSelectElement) {
	                this.convertSelectToText();
	            }
	            // console.log('initializing', this._settings);
	            this.init();
	        }
	        AutoComplete.prototype.manageInlineDataAttributes = function () {
	            // updates settings with data-* attributes
	            var s = this.getSettings();
	            if (this._$el.data('url')) {
	                s['resolverSettings'].url = this._$el.data('url');
	            }
	            if (this._$el.data('default-value')) {
	                this._defaultValue = this._$el.data('default-value');
	            }
	            if (this._$el.data('default-text')) {
	                this._defaultText = this._$el.data('default-text');
	            }
	        };
	        AutoComplete.prototype.getSettings = function () {
	            return this._settings;
	        };
	        AutoComplete.prototype.convertSelectToText = function () {
	            // create hidden field
	            var hidField = $('<input>');
	            hidField.attr('type', 'hidden');
	            hidField.attr('name', this._$el.attr('name'));
	            if (this._defaultValue) {
	                hidField.val(this._defaultValue);
	            }
	            this._selectHiddenField = hidField;
	            hidField.insertAfter(this._$el);
	            // create search input element
	            var searchField = $('<input>');
	            // copy all attributes
	            searchField.attr('type', 'text');
	            searchField.attr('name', this._$el.attr('name') + '_text');
	            searchField.attr('id', this._$el.attr('id'));
	            searchField.attr('disabled', this._$el.attr('disabled'));
	            searchField.addClass(this._$el.attr('class'));
	            if (this._defaultText) {
	                searchField.val(this._defaultText);
	            }
	            // attach class
	            searchField.data(AutoCompleteNS.AutoComplete.NAME, this);
	            // replace original with searchField
	            this._$el.replaceWith(searchField);
	            this._$el = searchField;
	            this._el = searchField.get(0);
	        };
	        AutoComplete.prototype.init = function () {
	            // bind default events
	            this.bindDefaultEventListeners();
	            // RESOLVER
	            if (this._settings.resolver === 'ajax') {
	                // configure default resolver
	                this.resolver = new resolvers_1.AjaxResolver(this._settings.resolverSettings);
	            }
	            // Dropdown
	            this._dd = new dropdown_1.Dropdown(this._$el, this._settings.formatResult, this._settings.autoSelect);
	        };
	        AutoComplete.prototype.bindDefaultEventListeners = function () {
	            var _this = this;
	            this._$el.on('keydown', function (evt) {
	                switch (evt.which) {
	                    case 40:
	                        // arrow DOWN
	                        evt.stopPropagation();
	                        evt.preventDefault();
	                        break;
	                    case 38:
	                        evt.stopPropagation();
	                        evt.preventDefault();
	                        break;
	                    case 9:
	                        if (_this._settings.autoSelect) {
	                            // if autoSelect enabled selects on blur the currently selected item
	                            _this._dd.selectFocusItem();
	                        }
	                        break;
	                }
	            });
	            this._$el.on('focus keyup', function (evt) {
	                // check key
	                switch (evt.which) {
	                    case 16: // shift
	                    case 17: // ctrl
	                    case 18: // alt
	                    case 39: // right
	                    case 37:
	                        break;
	                    case 40:
	                        // arrow DOWN
	                        _this._dd.focusNextItem();
	                        break;
	                    case 38:
	                        _this._dd.focusPreviousItem();
	                        break;
	                    case 13:
	                        _this._dd.selectFocusItem();
	                        break;
	                    case 27:
	                        // ESC
	                        _this._dd.hide();
	                        break;
	                    default:
	                        var newValue = _this._$el.val();
	                        _this.handlerTyped(newValue);
	                }
	            });
	            this._$el.on('blur', function (evt) {
	                // console.log(evt);
	                if (!_this._dd.isMouseOver) {
	                    if (_this._isSelectElement) {
	                        // if it's a select element you must
	                        if (_this._dd.isItemFocused) {
	                            _this._dd.selectFocusItem();
	                        }
	                        else if ((_this._selectedItem !== null) && (_this._$el.val() !== '')) {
	                            // reselect it
	                            _this._$el.trigger('autocomplete.select', _this._selectedItem);
	                        }
	                        else if ((_this._$el.val() !== '') && (_this._defaultValue !== null)) {
	                            // select Default
	                            _this._$el.val(_this._defaultText);
	                            _this._selectHiddenField.val(_this._defaultValue);
	                            _this._selectedItem = null;
	                        }
	                        else {
	                            // empty the values
	                            _this._$el.val('');
	                            _this._selectHiddenField.val('');
	                            _this._selectedItem = null;
	                        }
	                    }
	                    _this._dd.hide();
	                }
	            });
	            // selected event
	            this._$el.on('autocomplete.select', function (evt, item) {
	                _this._selectedItem = item;
	                _this.itemSelectedDefaultHandler(item);
	            });
	        };
	        AutoComplete.prototype.handlerTyped = function (newValue) {
	            // field value changed
	            // custom handler may change newValue
	            if (this._settings.events.typed !== null) {
	                newValue = this._settings.events.typed(newValue);
	                if (!newValue)
	                    return;
	            }
	            // if value >= minLength, start autocomplete
	            if (newValue.length >= this._settings.minLength) {
	                this._searchText = newValue;
	                this.handlerPreSearch();
	            }
	            else {
	                this._dd.hide();
	            }
	        };
	        AutoComplete.prototype.handlerPreSearch = function () {
	            // do nothing, start search
	            // custom handler may change newValue
	            if (this._settings.events.searchPre !== null) {
	                var newValue = this._settings.events.searchPre(this._searchText);
	                if (!newValue)
	                    return;
	                this._searchText = newValue;
	            }
	            this.handlerDoSearch();
	        };
	        AutoComplete.prototype.handlerDoSearch = function () {
	            var _this = this;
	            // custom handler may change newValue
	            if (this._settings.events.search !== null) {
	                this._settings.events.search(this._searchText, function (results) {
	                    _this.postSearchCallback(results);
	                });
	            }
	            else {
	                // Default behaviour
	                // search using current resolver
	                if (this.resolver) {
	                    this.resolver.search(this._searchText, function (results) {
	                        _this.postSearchCallback(results);
	                    });
	                }
	            }
	        };
	        AutoComplete.prototype.postSearchCallback = function (results) {
	            // console.log('callback called', results);
	            // custom handler may change newValue
	            if (this._settings.events.searchPost) {
	                results = this._settings.events.searchPost(results);
	                if ((typeof results === 'boolean') && !results)
	                    return;
	            }
	            this.handlerStartShow(results);
	        };
	        AutoComplete.prototype.handlerStartShow = function (results) {
	            // console.log("defaultEventStartShow", results);
	            // for every result, draw it
	            this._dd.updateItems(results, this._searchText);
	            this._dd.show();
	        };
	        AutoComplete.prototype.itemSelectedDefaultHandler = function (item) {
	            // console.log('itemSelectedDefaultHandler', item);
	            // default behaviour is set elment's .val()
	            var itemFormatted = this._settings.formatResult(item);
	            if (typeof itemFormatted === 'string') {
	                itemFormatted = { text: itemFormatted };
	            }
	            this._$el.val(itemFormatted.text);
	            // if the element is a select
	            if (this._isSelectElement) {
	                this._selectHiddenField.val(itemFormatted.value);
	            }
	            // save selected item
	            this._selectedItem = item;
	            // and hide
	            this._dd.hide();
	        };
	        AutoComplete.prototype.defaultFormatResult = function (item) {
	            if (typeof item === 'string') {
	                return { text: item };
	            }
	            else if (item.text) {
	                return item;
	            }
	            else {
	                // return a toString of the item as last resort
	                // console.error('No default formatter for item', item);
	                return { text: item.toString() };
	            }
	        };
	        AutoComplete.NAME = 'autoComplete';
	        return AutoComplete;
	    }());
	    AutoCompleteNS.AutoComplete = AutoComplete;
	})(AutoCompleteNS || (AutoCompleteNS = {}));
	(function ($, window, document) {
	    $.fn[AutoCompleteNS.AutoComplete.NAME] = function (options) {
	        return this.each(function () {
	            var pluginClass;
	            pluginClass = $(this).data(AutoCompleteNS.AutoComplete.NAME);
	            if (!pluginClass) {
	                pluginClass = new AutoCompleteNS.AutoComplete(this, options);
	                $(this).data(AutoCompleteNS.AutoComplete.NAME, pluginClass);
	            }
	        });
	    };
	})(jQuery, window, document);
	// (function (root, factory) {
	//   'use strict';
	//   factory(jQuery);
	// }(this, function ($) {
	//   'use strict';
	//   // jshint laxcomma: true
	//  /* TYPEAHEAD PUBLIC CLASS DEFINITION
	//   * ================================= */
	//   var Typeahead = function (element, options) {
	//     this.$element = $(element);
	//     this.options = $.extend({}, $.fn.typeahead.defaults, options);
	//     this.matcher = this.options.matcher || this.matcher;
	//     this.sorter = this.options.sorter || this.sorter;
	//     this.select = this.options.select || this.select;
	//     this.autoSelect = typeof this.options.autoSelect == 'boolean' ? this.options.autoSelect : true;
	//     this.highlighter = this.options.highlighter || this.highlighter;
	//     this.render = this.options.render || this.render;
	//     this.updater = this.options.updater || this.updater;
	//     this.displayText = this.options.displayText || this.displayText;
	//     this.selectedText = this.options.selectedText || this.selectedText;
	//     this.source = this.options.source;
	//     this.delay = this.options.delay;
	//     this.$menu = $(this.options.menu);
	//     this.$appendTo = this.options.appendTo ? $(this.options.appendTo) : null;
	//     this.fitToElement = typeof this.options.fitToElement == 'boolean' ? this.options.fitToElement : false;
	//     this.shown = false;
	//     this.listen();
	//     this.showHintOnFocus = typeof this.options.showHintOnFocus == 'boolean' || this.options.showHintOnFocus === "all" ? this.options.showHintOnFocus : false;
	//     this.afterSelect = this.options.afterSelect;
	//     this.addItem = false;
	//     this.value = this.$element.val() || this.$element.text();
	//   };
	//   Typeahead.prototype = {
	//     constructor: Typeahead,
	//     select: function () {
	//       var val = this.$menu.find('.active').data('value');
	//       this.$element.data('active', val);
	//       if (this.autoSelect || val) {
	//         var newVal = this.updater(val);
	//         // Updater can be set to any random functions via "options" parameter in constructor above.
	//         // Add null check for cases when updater returns void or undefined.
	//         if (!newVal) {
	//           newVal = '';
	//         }
	//         var selectedVal = this.selectedText(newVal);
	//         if (selectedVal !== false) {
	//           this.$element
	//             .val(selectedVal)
	//             .text(this.displayText(newVal) || newVal)
	//             .change();
	//         }
	//         this.afterSelect(newVal);
	//       }
	//       return this.hide();
	//     },
	//     updater: function (item) {
	//       return item;
	//     },
	//     setSource: function (source) {
	//       this.source = source;
	//     },
	//     show: function () {
	//       var pos = $.extend({}, this.$element.position(), {
	//         height: this.$element[0].offsetHeight
	//       });
	//       var scrollHeight = typeof this.options.scrollHeight == 'function' ?
	//           this.options.scrollHeight.call() :
	//           this.options.scrollHeight;
	//       var element;
	//       if (this.shown) {
	//         element = this.$menu;
	//       } else if (this.$appendTo) {
	//         element = this.$menu.appendTo(this.$appendTo);
	//         this.hasSameParent = this.$appendTo.is(this.$element.parent());
	//       } else {
	//         element = this.$menu.insertAfter(this.$element);
	//         this.hasSameParent = true;
	//       }      
	//       if (!this.hasSameParent) {
	//           // We cannot rely on the element position, need to position relative to the window
	//           element.css("position", "fixed");
	//           var offset = this.$element.offset();
	//           pos.top =  offset.top;
	//           pos.left = offset.left;
	//       }
	//       // The rules for bootstrap are: 'dropup' in the parent and 'dropdown-menu-right' in the element.
	//       // Note that to get right alignment, you'll need to specify `menu` in the options to be:
	//       // '<ul class="typeahead dropdown-menu" role="listbox"></ul>'
	//       var dropup = $(element).parent().hasClass('dropup');
	//       var newTop = dropup ? 'auto' : (pos.top + pos.height + scrollHeight);
	//       var right = $(element).hasClass('dropdown-menu-right');
	//       var newLeft = right ? 'auto' : pos.left;
	//       // it seems like setting the css is a bad idea (just let Bootstrap do it), but I'll keep the old
	//       // logic in place except for the dropup/right-align cases.
	//       element.css({ top: newTop, left: newLeft }).show();
	//       if (this.options.fitToElement === true) {
	//           element.css("width", this.$element.outerWidth() + "px");
	//       }
	//       this.shown = true;
	//       return this;
	//     },
	//     hide: function () {
	//       this.$menu.hide();
	//       this.shown = false;
	//       return this;
	//     },
	//     lookup: function (query) {
	//       var items;
	//       if (typeof(query) != 'undefined' && query !== null) {
	//         this.query = query;
	//       } else {
	//         this.query = this.$element.val() || this.$element.text() || '';
	//       }
	//       if (this.query.length < this.options.minLength && !this.options.showHintOnFocus) {
	//         return this.shown ? this.hide() : this;
	//       }
	//       var worker = $.proxy(function () {
	//         if ($.isFunction(this.source)) {
	//           this.source(this.query, $.proxy(this.process, this));
	//         } else if (this.source) {
	//           this.process(this.source);
	//         }
	//       }, this);
	//       clearTimeout(this.lookupWorker);
	//       this.lookupWorker = setTimeout(worker, this.delay);
	//     },
	//     process: function (items) {
	//       var that = this;
	//       items = $.grep(items, function (item) {
	//         return that.matcher(item);
	//       });
	//       items = this.sorter(items);
	//       if (!items.length && !this.options.addItem) {
	//         return this.shown ? this.hide() : this;
	//       }
	//       if (items.length > 0) {
	//         this.$element.data('active', items[0]);
	//       } else {
	//         this.$element.data('active', null);
	//       }
	//       // Add item
	//       if (this.options.addItem){
	//         items.push(this.options.addItem);
	//       }
	//       if (this.options.items == 'all') {
	//         return this.render(items).show();
	//       } else {
	//         return this.render(items.slice(0, this.options.items)).show();
	//       }
	//     },
	//     matcher: function (item) {
	//       var it = this.displayText(item);
	//       return ~it.toLowerCase().indexOf(this.query.toLowerCase());
	//     },
	//     sorter: function (items) {
	//       var beginswith = [];
	//       var caseSensitive = [];
	//       var caseInsensitive = [];
	//       var item;
	//       while ((item = items.shift())) {
	//         var it = this.displayText(item);
	//         if (!it.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
	//         else if (~it.indexOf(this.query)) caseSensitive.push(item);
	//         else caseInsensitive.push(item);
	//       }
	//       return beginswith.concat(caseSensitive, caseInsensitive);
	//     },
	//     highlighter: function (item) {
	//       var html = $('<div></div>');
	//       var query = this.query;
	//       var i = item.toLowerCase().indexOf(query.toLowerCase());
	//       var len = query.length;
	//       var leftPart;
	//       var middlePart;
	//       var rightPart;
	//       var strong;
	//       if (len === 0) {
	//         return html.text(item).html();
	//       }
	//       while (i > -1) {
	//         leftPart = item.substr(0, i);
	//         middlePart = item.substr(i, len);
	//         rightPart = item.substr(i + len);
	//         strong = $('<strong></strong>').text(middlePart);
	//         html
	//           .append(document.createTextNode(leftPart))
	//           .append(strong);
	//         item = rightPart;
	//         i = item.toLowerCase().indexOf(query.toLowerCase());
	//       }
	//       return html.append(document.createTextNode(item)).html();
	//     },
	//     render: function (items) {
	//       var that = this;
	//       var self = this;
	//       var activeFound = false;
	//       var data = [];
	//       var _category = that.options.separator;
	//       $.each(items, function (key,value) {
	//         // inject separator
	//         if (key > 0 && value[_category] !== items[key - 1][_category]){
	//           data.push({
	//             __type: 'divider'
	//           });
	//         }
	//         // inject category header
	//         if (value[_category] && (key === 0 || value[_category] !== items[key - 1][_category])){
	//           data.push({
	//             __type: 'category',
	//             name: value[_category]
	//           });
	//         }
	//         data.push(value);
	//       });
	//       items = $(data).map(function (i, item) {
	//         if ((item.__type || false) == 'category'){
	//           return $(that.options.headerHtml).text(item.name)[0];
	//         }
	//         if ((item.__type || false) == 'divider'){
	//           return $(that.options.headerDivider)[0];
	//         }
	//         var text = self.displayText(item);
	//         i = $(that.options.item).data('value', item);
	//         i.find('a').html(that.highlighter(text, item));
	//         if (text == self.$element.val()) {
	//           i.addClass('active');
	//           self.$element.data('active', item);
	//           activeFound = true;
	//         }
	//         return i[0];
	//       });
	//       if (this.autoSelect && !activeFound) {
	//         items.filter(':not(.dropdown-header)').first().addClass('active');
	//         this.$element.data('active', items.first().data('value'));
	//       }
	//       this.$menu.html(items);
	//       return this;
	//     },
	//     displayText: function (item) {
	//       return typeof item !== 'undefined' && typeof item.name != 'undefined' && item.name || item;
	//     },
	//     selectedText: function(item) {
	//       return typeof item !== 'undefined' && typeof item.name != 'undefined' && item.name || item;
	//     },
	//     next: function (event) {
	//       var active = this.$menu.find('.active').removeClass('active');
	//       var next = active.next();
	//       if (!next.length) {
	//         next = $(this.$menu.find('li')[0]);
	//       }
	//       next.addClass('active');
	//     },
	//     prev: function (event) {
	//       var active = this.$menu.find('.active').removeClass('active');
	//       var prev = active.prev();
	//       if (!prev.length) {
	//         prev = this.$menu.find('li').last();
	//       }
	//       prev.addClass('active');
	//     },
	//     listen: function () {
	//       this.$element
	//         .on('focus',    $.proxy(this.focus, this))
	//         .on('blur',     $.proxy(this.blur, this))
	//         .on('keypress', $.proxy(this.keypress, this))
	//         .on('input',    $.proxy(this.input, this))
	//         .on('keyup',    $.proxy(this.keyup, this));
	//       if (this.eventSupported('keydown')) {
	//         this.$element.on('keydown', $.proxy(this.keydown, this));
	//       }
	//       this.$menu
	//         .on('click', $.proxy(this.click, this))
	//         .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
	//         .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
	//         .on('mousedown', $.proxy(this.mousedown,this));
	//     },
	//     destroy : function () {
	//       this.$element.data('typeahead',null);
	//       this.$element.data('active',null);
	//       this.$element
	//         .off('focus')
	//         .off('blur')
	//         .off('keypress')
	//         .off('input')
	//         .off('keyup');
	//       if (this.eventSupported('keydown')) {
	//         this.$element.off('keydown');
	//       }
	//       this.$menu.remove();
	//       this.destroyed = true;
	//     },
	//     eventSupported: function (eventName) {
	//       var isSupported = eventName in this.$element;
	//       if (!isSupported) {
	//         this.$element.setAttribute(eventName, 'return;');
	//         isSupported = typeof this.$element[eventName] === 'function';
	//       }
	//       return isSupported;
	//     },
	//     move: function (e) {
	//       if (!this.shown) return;
	//       switch (e.keyCode) {
	//         case 9: // tab
	//         case 13: // enter
	//         case 27: // escape
	//           e.preventDefault();
	//           break;
	//         case 38: // up arrow
	//           // with the shiftKey (this is actually the left parenthesis)
	//           if (e.shiftKey) return;
	//           e.preventDefault();
	//           this.prev();
	//           break;
	//         case 40: // down arrow
	//           // with the shiftKey (this is actually the right parenthesis)
	//           if (e.shiftKey) return;
	//           e.preventDefault();
	//           this.next();
	//           break;
	//       }
	//     },
	//     keydown: function (e) {
	//       this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
	//       if (!this.shown && e.keyCode == 40) {
	//         this.lookup();
	//       } else {
	//         this.move(e);
	//       }
	//     },
	//     keypress: function (e) {
	//       if (this.suppressKeyPressRepeat) return;
	//       this.move(e);
	//     },
	//     input: function (e) {
	//       // This is a fixed for IE10/11 that fires the input event when a placehoder is changed
	//       // (https://connect.microsoft.com/IE/feedback/details/810538/ie-11-fires-input-event-on-focus)
	//       var currentValue = this.$element.val() || this.$element.text();
	//       if (this.value !== currentValue) {
	//         this.value = currentValue;
	//         this.lookup();
	//       }
	//     },
	//     keyup: function (e) {
	//       if (this.destroyed) {
	//         return;
	//       }
	//       switch (e.keyCode) {
	//         case 40: // down arrow
	//         case 38: // up arrow
	//         case 16: // shift
	//         case 17: // ctrl
	//         case 18: // alt
	//           break;
	//         case 9: // tab
	//         case 13: // enter
	//           if (!this.shown) return;
	//           this.select();
	//           break;
	//         case 27: // escape
	//           if (!this.shown) return;
	//           this.hide();
	//           break;
	//       }
	//     },
	//     focus: function (e) {
	//       if (!this.focused) {
	//         this.focused = true;
	//         if (this.options.showHintOnFocus && this.skipShowHintOnFocus !== true) {
	//           if(this.options.showHintOnFocus === "all") {
	//             this.lookup(""); 
	//           } else {
	//             this.lookup();
	//           }
	//         }
	//       }
	//       if (this.skipShowHintOnFocus) {
	//         this.skipShowHintOnFocus = false;
	//       }
	//     },
	//     blur: function (e) {
	//       if (!this.mousedover && !this.mouseddown && this.shown) {
	//         this.hide();
	//         this.focused = false;
	//       } else if (this.mouseddown) {
	//         // This is for IE that blurs the input when user clicks on scroll.
	//         // We set the focus back on the input and prevent the lookup to occur again
	//         this.skipShowHintOnFocus = true;
	//         this.$element.focus();
	//         this.mouseddown = false;
	//       } 
	//     },
	//     click: function (e) {
	//       e.preventDefault();
	//       this.skipShowHintOnFocus = true;
	//       this.select();
	//       this.$element.focus();
	//       this.hide();
	//     },
	//     mouseenter: function (e) {
	//       this.mousedover = true;
	//       this.$menu.find('.active').removeClass('active');
	//       $(e.currentTarget).addClass('active');
	//     },
	//     mouseleave: function (e) {
	//       this.mousedover = false;
	//       if (!this.focused && this.shown) this.hide();
	//     },
	//    /**
	//      * We track the mousedown for IE. When clicking on the menu scrollbar, IE makes the input blur thus hiding the menu.
	//      */
	//     mousedown: function (e) {
	//       this.mouseddown = true;
	//       this.$menu.one("mouseup", function(e){
	//         // IE won't fire this, but FF and Chrome will so we reset our flag for them here
	//         this.mouseddown = false;
	//       }.bind(this));
	//     },
	//   };
	//   /* TYPEAHEAD PLUGIN DEFINITION
	//    * =========================== */
	//   var old = $.fn.typeahead;
	//   $.fn.typeahead = function (option) {
	//     var arg = arguments;
	//     if (typeof option == 'string' && option == 'getActive') {
	//       return this.data('active');
	//     }
	//     return this.each(function () {
	//       var $this = $(this);
	//       var data = $this.data('typeahead');
	//       var options = typeof option == 'object' && option;
	//       if (!data) $this.data('typeahead', (data = new Typeahead(this, options)));
	//       if (typeof option == 'string' && data[option]) {
	//         if (arg.length > 1) {
	//           data[option].apply(data, Array.prototype.slice.call(arg, 1));
	//         } else {
	//           data[option]();
	//         }
	//       }
	//     });
	//   };
	//   $.fn.typeahead.defaults = {
	//     source: [],
	//     items: 8,
	//     menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
	//     item: '<li><a class="dropdown-item" href="#" role="option"></a></li>',
	//     minLength: 1,
	//     scrollHeight: 0,
	//     autoSelect: true,
	//     afterSelect: $.noop,
	//     addItem: false,
	//     delay: 0,
	//     separator: 'category',
	//     headerHtml: '<li class="dropdown-header"></li>',
	//     headerDivider: '<li class="divider" role="separator"></li>'
	//   };
	//   $.fn.typeahead.Constructor = Typeahead;
	//  /* TYPEAHEAD NO CONFLICT
	//   * =================== */
	//   $.fn.typeahead.noConflict = function () {
	//     $.fn.typeahead = old;
	//     return this;
	//   };
	//  /* TYPEAHEAD DATA-API
	//   * ================== */
	//   $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
	//     var $this = $(this);
	//     if ($this.data('typeahead')) return;
	//     $this.typeahead($this.data());
	//   });
	// }));


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var BaseResolver = (function () {
	    function BaseResolver(options) {
	        this._settings = $.extend(true, {}, this.getDefaults(), options);
	    }
	    BaseResolver.prototype.getDefaults = function () {
	        return {};
	    };
	    BaseResolver.prototype.getResults = function (limit, start, end) {
	        return this.results;
	    };
	    BaseResolver.prototype.search = function (q, cbk) {
	        cbk(this.getResults());
	    };
	    return BaseResolver;
	}());
	var AjaxResolver = (function (_super) {
	    __extends(AjaxResolver, _super);
	    function AjaxResolver(options) {
	        _super.call(this, options);
	        // console.log('resolver settings', this._settings);
	    }
	    AjaxResolver.prototype.getDefaults = function () {
	        return {
	            url: '',
	            method: 'get',
	            queryKey: 'q',
	            extraData: {},
	            timeout: undefined,
	        };
	    };
	    AjaxResolver.prototype.search = function (q, cbk) {
	        var _this = this;
	        if (this.jqXHR != null) {
	            this.jqXHR.abort();
	        }
	        var data = {};
	        data[this._settings.queryKey] = q;
	        $.extend(data, this._settings.extraData);
	        this.jqXHR = $.ajax(this._settings.url, {
	            method: this._settings.method,
	            data: data,
	            timeout: this._settings.timeout
	        });
	        this.jqXHR.done(function (result) {
	            cbk(result);
	        });
	        this.jqXHR.fail(function (err) {
	            // console.log(err);
	        });
	        this.jqXHR.always(function () {
	            _this.jqXHR = null;
	        });
	    };
	    return AjaxResolver;
	}(BaseResolver));
	exports.AjaxResolver = AjaxResolver;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	/*
	 *	Dropdown class. Manages the dropdown drawing
	 */
	var Dropdown = (function () {
	    function Dropdown(e, formatItemCbk, autoSelect) {
	        this.initialized = false;
	        this.shown = false;
	        this.items = [];
	        this._$el = e;
	        this.formatItem = formatItemCbk;
	        this.autoSelect = autoSelect;
	        this.init();
	    }
	    Dropdown.prototype.init = function () {
	        var _this = this;
	        // Initialize dropdown
	        var pos = $.extend({}, this._$el.position(), {
	            height: this._$el[0].offsetHeight
	        });
	        // create element
	        this._dd = $('<ul />');
	        // add our class and basic dropdown-menu class
	        this._dd.addClass('bootstrap-autocomplete dropdown-menu');
	        this._dd.insertAfter(this._$el);
	        this._dd.css({ left: pos.left, width: this._$el.outerWidth() });
	        // click event on items
	        this._dd.on('click', 'li', function (evt) {
	            // console.log('clicked', evt.currentTarget);
	            //console.log($(evt.currentTarget));
	            var item = $(evt.currentTarget).data('item');
	            _this.itemSelectedLaunchEvent(item);
	        });
	        this._dd.on('keyup', function (evt) {
	            if (_this.shown) {
	                switch (evt.which) {
	                    case 27:
	                        // ESC
	                        _this.hide();
	                        _this._$el.focus();
	                        break;
	                }
	                return false;
	            }
	        });
	        this._dd.on('mouseenter', 'li', function (evt) {
	            $(evt.currentTarget).closest('ul').find('li.active').removeClass('active');
	            $(evt.currentTarget).addClass('active');
	            _this.mouseover = true;
	        });
	        this._dd.on('mouseleave', 'li', function (evt) {
	            _this.mouseover = false;
	        });
	        this.initialized = true;
	    };
	    Object.defineProperty(Dropdown.prototype, "isMouseOver", {
	        get: function () {
	            return this.mouseover;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Dropdown.prototype.focusNextItem = function (reversed) {
	        // get selected
	        var currElem = this._dd.find('li.active');
	        var nextElem = reversed ? currElem.prev() : currElem.next();
	        if (nextElem.length == 0) {
	            // first 
	            nextElem = reversed ? this._dd.find('li').last() : this._dd.find('li').first();
	        }
	        currElem.removeClass('active');
	        nextElem.addClass('active');
	    };
	    Dropdown.prototype.focusPreviousItem = function () {
	        this.focusNextItem(true);
	    };
	    Dropdown.prototype.focusItem = function (index) {
	        // Focus an item in the list
	        if (this.shown && (this.items.length > index))
	            this._dd.find('li').eq(index).find('a').focus();
	    };
	    Dropdown.prototype.selectFocusItem = function () {
	        this._dd.find('li.active').trigger('click');
	    };
	    Object.defineProperty(Dropdown.prototype, "isItemFocused", {
	        get: function () {
	            if (this._dd.find('li.active').length > 0) {
	                return true;
	            }
	            return false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Dropdown.prototype.show = function () {
	        if (!this.shown) {
	            this._dd.dropdown().show();
	            this.shown = true;
	        }
	    };
	    Dropdown.prototype.isShown = function () {
	        return this.shown;
	    };
	    Dropdown.prototype.hide = function () {
	        if (this.shown) {
	            this._dd.dropdown().hide();
	            this.shown = false;
	        }
	    };
	    Dropdown.prototype.updateItems = function (items, searchText) {
	        // console.log('updateItems', items);
	        this.items = items;
	        this.searchText = searchText;
	        this.refreshItemList();
	    };
	    Dropdown.prototype.showMatchedText = function (text, qry) {
	        var startIndex = text.toLowerCase().indexOf(qry.toLowerCase());
	        if (startIndex > -1) {
	            var endIndex = startIndex + qry.length;
	            return text.slice(0, startIndex) + '<b>'
	                + text.slice(startIndex, endIndex) + '</b>'
	                + text.slice(endIndex);
	        }
	        return text;
	    };
	    Dropdown.prototype.refreshItemList = function () {
	        var _this = this;
	        this._dd.empty();
	        var liList = [];
	        this.items.forEach(function (item) {
	            var itemFormatted = _this.formatItem(item);
	            if (typeof itemFormatted === 'string') {
	                itemFormatted = { text: itemFormatted };
	            }
	            var itemText;
	            var itemHtml;
	            itemText = _this.showMatchedText(itemFormatted.text, _this.searchText);
	            if (itemFormatted.html !== undefined) {
	                itemHtml = itemFormatted.html;
	            }
	            else {
	                itemHtml = itemText;
	            }
	            var li = $('<li >');
	            li.append($('<a>').attr('href', '#').html(itemHtml))
	                .data('item', item);
	            liList.push(li);
	        });
	        this._dd.append(liList);
	    };
	    Dropdown.prototype.itemSelectedLaunchEvent = function (item) {
	        // launch selected event
	        // console.log('itemSelectedLaunchEvent', item);
	        this._$el.trigger('autocomplete.select', item);
	    };
	    return Dropdown;
	}());
	exports.Dropdown = Dropdown;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDk4NmM5OWUxZGUwODE5OTQ0MzkiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Jlc29sdmVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQW1Ca0U7QUFDbEUsdUNBQTZCLENBQWEsQ0FBQztBQUMzQyxzQ0FBeUIsQ0FBWSxDQUFDO0FBRXRDLEtBQU8sY0FBYyxDQW1UcEI7QUFuVEQsWUFBTyxjQUFjLEVBQUMsQ0FBQztLQUNyQjtTQWdDRSxzQkFBWSxPQUFlLEVBQUUsT0FBVzthQXpCaEMsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsa0JBQWEsR0FBTyxJQUFJLENBQUM7YUFDekIsaUJBQVksR0FBVSxJQUFJLENBQUM7YUFDM0IscUJBQWdCLEdBQVcsS0FBSyxDQUFDO2FBR2pDLGNBQVMsR0FBRztpQkFDbEIsUUFBUSxFQUFVLE1BQU07aUJBQ3hCLGdCQUFnQixFQUFPLEVBQUU7aUJBQ3pCLFNBQVMsRUFBVSxDQUFDO2lCQUNwQixRQUFRLEVBQVUsT0FBTztpQkFDekIsWUFBWSxFQUFZLElBQUksQ0FBQyxtQkFBbUI7aUJBQ2hELFVBQVUsRUFBVyxJQUFJO2lCQUN6QixNQUFNLEVBQUU7cUJBQ04sS0FBSyxFQUFZLElBQUk7cUJBQ3JCLFNBQVMsRUFBWSxJQUFJO3FCQUN6QixNQUFNLEVBQVksSUFBSTtxQkFDdEIsVUFBVSxFQUFZLElBQUk7cUJBQzFCLE1B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QUM7QUFBRCxFQUFDO0FBcExZLGlCQUFRLFdBb0xwQiIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBkOTg2Yzk5ZTFkZTA4MTk5NDQzOVxuICoqLyIsIi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIGJvb3RzdHJhcC1hdXRvY29tcGxldGUuanMgdjAuMC4xXG4gKiBodHRwczovL2dpdGh1Yi5jb20veGNhc2gvYm9vdHN0cmFwLWF1dG9jb21wbGV0ZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogRm9ya2VkIGZyb20gYm9vdHN0cmFwMy10eXBlYWhlYWQuanMgdjMuMS4wXG4gKiBodHRwczovL2dpdGh1Yi5jb20vYmFzc2pvYnNlbi9Cb290c3RyYXAtMy1UeXBlYWhlYWRcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE9yaWdpbmFsIHdyaXR0ZW4gYnkgQG1kbyBhbmQgQGZhdFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTYgUGFvbG8gQ2FzY2llbGxvIEB4Y2FzaDY2NiBhbmQgY29udHJpYnV0b3JzXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlICh0aGUgJ0xpY2Vuc2UnKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiAnQVMgSVMnIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuaW1wb3J0IHsgQWpheFJlc29sdmVyIH0gZnJvbSAnLi9yZXNvbHZlcnMnO1xuaW1wb3J0IHsgRHJvcGRvd24gfSBmcm9tICcuL2Ryb3Bkb3duJztcblxubW9kdWxlIEF1dG9Db21wbGV0ZU5TIHtcbiAgZXhwb3J0IGNsYXNzIEF1dG9Db21wbGV0ZSB7XG4gICAgcHVibGljIHN0YXRpYyBOQU1FOnN0cmluZyA9ICdhdXRvQ29tcGxldGUnO1xuXG4gICAgcHJpdmF0ZSBfZWw6RWxlbWVudDtcbiAgICBwcml2YXRlIF8kZWw6SlF1ZXJ5O1xuICAgIHByaXZhdGUgX2RkOkRyb3Bkb3duO1xuICAgIHByaXZhdGUgX3NlYXJjaFRleHQ6c3RyaW5nO1xuICAgIHByaXZhdGUgX3NlbGVjdGVkSXRlbTphbnkgPSBudWxsO1xuICAgIHByaXZhdGUgX2RlZmF1bHRWYWx1ZTphbnkgPSBudWxsO1xuICAgIHByaXZhdGUgX2RlZmF1bHRUZXh0OnN0cmluZyA9IG51bGw7XG4gICAgcHJpdmF0ZSBfaXNTZWxlY3RFbGVtZW50OmJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9zZWxlY3RIaWRkZW5GaWVsZDpKUXVlcnk7XG5cbiAgICBwcml2YXRlIF9zZXR0aW5ncyA9IHtcbiAgICAgIHJlc29sdmVyOjxzdHJpbmc+ICdhamF4JyxcbiAgICAgIHJlc29sdmVyU2V0dGluZ3M6PGFueT4ge30sXG4gICAgICBtaW5MZW5ndGg6PG51bWJlcj4gMyxcbiAgICAgIHZhbHVlS2V5OjxzdHJpbmc+ICd2YWx1ZScsXG4gICAgICBmb3JtYXRSZXN1bHQ6PEZ1bmN0aW9uPiB0aGlzLmRlZmF1bHRGb3JtYXRSZXN1bHQsXG4gICAgICBhdXRvU2VsZWN0Ojxib29sZWFuPiB0cnVlLFxuICAgICAgZXZlbnRzOiB7XG4gICAgICAgIHR5cGVkOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoUHJlOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgICAgc2VhcmNoUG9zdDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIHNlbGVjdDo8RnVuY3Rpb24+IG51bGwsXG4gICAgICAgIGZvY3VzOjxGdW5jdGlvbj4gbnVsbCxcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSByZXNvbHZlcjtcblxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6RWxlbWVudCwgb3B0aW9ucz86e30pIHtcbiAgICAgIHRoaXMuX2VsID0gZWxlbWVudDtcbiAgICAgIHRoaXMuXyRlbCA9ICQodGhpcy5fZWwpO1xuICAgICAgLy8gZWxlbWVudCB0eXBlXG4gICAgICBpZiAodGhpcy5fJGVsLmlzKCdzZWxlY3QnKSkge1xuICAgICAgICB0aGlzLl9pc1NlbGVjdEVsZW1lbnQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgLy8gaW5saW5lIGRhdGEgYXR0cmlidXRlc1xuICAgICAgdGhpcy5tYW5hZ2VJbmxpbmVEYXRhQXR0cmlidXRlcygpO1xuICAgICAgLy8gY29uc3RydWN0b3Igb3B0aW9uc1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmdldFNldHRpbmdzKCksIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2lzU2VsZWN0RWxlbWVudCkge1xuICAgICAgICB0aGlzLmNvbnZlcnRTZWxlY3RUb1RleHQoKTtcbiAgICAgIH0gXG4gICAgICBcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpbml0aWFsaXppbmcnLCB0aGlzLl9zZXR0aW5ncyk7XG4gICAgICBcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWFuYWdlSW5saW5lRGF0YUF0dHJpYnV0ZXMoKSB7XG4gICAgICAvLyB1cGRhdGVzIHNldHRpbmdzIHdpdGggZGF0YS0qIGF0dHJpYnV0ZXNcbiAgICAgIGxldCBzID0gdGhpcy5nZXRTZXR0aW5ncygpO1xuICAgICAgaWYgKHRoaXMuXyRlbC5kYXRhKCd1cmwnKSkge1xuICAgICAgICBzWydyZXNvbHZlclNldHRpbmdzJ10udXJsID0gdGhpcy5fJGVsLmRhdGEoJ3VybCcpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuXyRlbC5kYXRhKCdkZWZhdWx0LXZhbHVlJykpIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdFZhbHVlID0gdGhpcy5fJGVsLmRhdGEoJ2RlZmF1bHQtdmFsdWUnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC10ZXh0JykpIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdFRleHQgPSB0aGlzLl8kZWwuZGF0YSgnZGVmYXVsdC10ZXh0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTZXR0aW5ncygpOnt9IHtcbiAgICAgIHJldHVybiB0aGlzLl9zZXR0aW5ncztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbnZlcnRTZWxlY3RUb1RleHQoKSB7XG4gICAgICAvLyBjcmVhdGUgaGlkZGVuIGZpZWxkXG5cbiAgICAgIGxldCBoaWRGaWVsZDpKUXVlcnkgPSAkKCc8aW5wdXQ+Jyk7XG4gICAgICBoaWRGaWVsZC5hdHRyKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgaGlkRmllbGQuYXR0cignbmFtZScsIHRoaXMuXyRlbC5hdHRyKCduYW1lJykpO1xuICAgICAgaWYgKHRoaXMuX2RlZmF1bHRWYWx1ZSkge1xuICAgICAgICBoaWRGaWVsZC52YWwodGhpcy5fZGVmYXVsdFZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkID0gaGlkRmllbGQ7XG4gICAgICBcbiAgICAgIGhpZEZpZWxkLmluc2VydEFmdGVyKHRoaXMuXyRlbCk7XG5cbiAgICAgIC8vIGNyZWF0ZSBzZWFyY2ggaW5wdXQgZWxlbWVudFxuICAgICAgbGV0IHNlYXJjaEZpZWxkOkpRdWVyeSA9ICQoJzxpbnB1dD4nKTtcbiAgICAgIC8vIGNvcHkgYWxsIGF0dHJpYnV0ZXNcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ3R5cGUnLCAndGV4dCcpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cignbmFtZScsIHRoaXMuXyRlbC5hdHRyKCduYW1lJykgKyAnX3RleHQnKTtcbiAgICAgIHNlYXJjaEZpZWxkLmF0dHIoJ2lkJywgdGhpcy5fJGVsLmF0dHIoJ2lkJykpO1xuICAgICAgc2VhcmNoRmllbGQuYXR0cignZGlzYWJsZWQnLCB0aGlzLl8kZWwuYXR0cignZGlzYWJsZWQnKSk7XG4gICAgICBzZWFyY2hGaWVsZC5hZGRDbGFzcyh0aGlzLl8kZWwuYXR0cignY2xhc3MnKSk7XG4gICAgICBpZiAodGhpcy5fZGVmYXVsdFRleHQpIHtcbiAgICAgICAgc2VhcmNoRmllbGQudmFsKHRoaXMuX2RlZmF1bHRUZXh0KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gYXR0YWNoIGNsYXNzXG4gICAgICBzZWFyY2hGaWVsZC5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCB0aGlzKTtcblxuICAgICAgLy8gcmVwbGFjZSBvcmlnaW5hbCB3aXRoIHNlYXJjaEZpZWxkXG4gICAgICB0aGlzLl8kZWwucmVwbGFjZVdpdGgoc2VhcmNoRmllbGQpO1xuICAgICAgdGhpcy5fJGVsID0gc2VhcmNoRmllbGQ7XG4gICAgICB0aGlzLl9lbCA9IHNlYXJjaEZpZWxkLmdldCgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5pdCgpOnZvaWQge1xuICAgICAgLy8gYmluZCBkZWZhdWx0IGV2ZW50c1xuICAgICAgdGhpcy5iaW5kRGVmYXVsdEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAvLyBSRVNPTFZFUlxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLnJlc29sdmVyID09PSAnYWpheCcpIHtcbiAgICAgICAgLy8gY29uZmlndXJlIGRlZmF1bHQgcmVzb2x2ZXJcbiAgICAgICAgdGhpcy5yZXNvbHZlciA9IG5ldyBBamF4UmVzb2x2ZXIodGhpcy5fc2V0dGluZ3MucmVzb2x2ZXJTZXR0aW5ncyk7XG4gICAgICB9XG4gICAgICAvLyBEcm9wZG93blxuICAgICAgdGhpcy5fZGQgPSBuZXcgRHJvcGRvd24odGhpcy5fJGVsLCB0aGlzLl9zZXR0aW5ncy5mb3JtYXRSZXN1bHQsIHRoaXMuX3NldHRpbmdzLmF1dG9TZWxlY3QpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGJpbmREZWZhdWx0RXZlbnRMaXN0ZW5lcnMoKTp2b2lkIHtcbiAgICAgIHRoaXMuXyRlbC5vbigna2V5ZG93bicsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QpID0+IHtcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDQwOlxuXHRcdFx0XHRcdFx0Ly8gYXJyb3cgRE9XTlxuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDk6IC8vIFRBQlxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmF1dG9TZWxlY3QpIHtcbiAgICAgICAgICAgICAgLy8gaWYgYXV0b1NlbGVjdCBlbmFibGVkIHNlbGVjdHMgb24gYmx1ciB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGl0ZW1cbiAgICAgICAgICAgICAgdGhpcy5fZGQuc2VsZWN0Rm9jdXNJdGVtKCk7XG4gICAgICAgICAgICB9XG5cdFx0XHRcdFx0XHRicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICAgIHRoaXMuXyRlbC5vbignZm9jdXMga2V5dXAnLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG4gICAgICAgIC8vIGNoZWNrIGtleVxuXHRcdFx0XHRzd2l0Y2ggKGV2dC53aGljaCkge1xuICAgICAgICAgIGNhc2UgMTY6IC8vIHNoaWZ0XG4gICAgICAgICAgY2FzZSAxNzogLy8gY3RybFxuICAgICAgICAgIGNhc2UgMTg6IC8vIGFsdFxuICAgICAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgICAgY2FzZSAzNzogLy8gbGVmdCBcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNDA6XG5cdFx0XHRcdFx0XHQvLyBhcnJvdyBET1dOXG4gICAgICAgICAgICB0aGlzLl9kZC5mb2N1c05leHRJdGVtKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICAgICAgdGhpcy5fZGQuZm9jdXNQcmV2aW91c0l0ZW0oKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTM6IC8vIEVOVEVSXG4gICAgICAgICAgICB0aGlzLl9kZC5zZWxlY3RGb2N1c0l0ZW0oKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMjc6XG5cdFx0XHRcdFx0XHQvLyBFU0NcbiAgICAgICAgICAgIHRoaXMuX2RkLmhpZGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLl8kZWwudmFsKCk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZXJUeXBlZChuZXdWYWx1ZSk7XG5cdFx0XHRcdH1cbiAgICAgICAgXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fJGVsLm9uKCdibHVyJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhldnQpO1xuICAgICAgICBpZiAoIXRoaXMuX2RkLmlzTW91c2VPdmVyKSB7XG5cbiAgICAgICAgICBpZiAodGhpcy5faXNTZWxlY3RFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBpZiBpdCdzIGEgc2VsZWN0IGVsZW1lbnQgeW91IG11c3RcbiAgICAgICAgICAgIGlmICh0aGlzLl9kZC5pc0l0ZW1Gb2N1c2VkKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2RkLnNlbGVjdEZvY3VzSXRlbSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggKHRoaXMuX3NlbGVjdGVkSXRlbSAhPT0gbnVsbCkgJiYgKHRoaXMuXyRlbC52YWwoKSAhPT0gJycpICkge1xuICAgICAgICAgICAgICAvLyByZXNlbGVjdCBpdFxuICAgICAgICAgICAgICB0aGlzLl8kZWwudHJpZ2dlcignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIHRoaXMuX3NlbGVjdGVkSXRlbSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAodGhpcy5fJGVsLnZhbCgpICE9PSAnJykgJiYgKHRoaXMuX2RlZmF1bHRWYWx1ZSAhPT0gbnVsbCkgKSB7XG4gICAgICAgICAgICAgIC8vIHNlbGVjdCBEZWZhdWx0XG4gICAgICAgICAgICAgIHRoaXMuXyRlbC52YWwodGhpcy5fZGVmYXVsdFRleHQpO1xuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RIaWRkZW5GaWVsZC52YWwodGhpcy5fZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGVtcHR5IHRoZSB2YWx1ZXNcbiAgICAgICAgICAgICAgdGhpcy5fJGVsLnZhbCgnJyk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbCgnJyk7XG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gc2VsZWN0ZWQgZXZlbnRcbiAgICAgIHRoaXMuXyRlbC5vbignYXV0b2NvbXBsZXRlLnNlbGVjdCcsIChldnQ6SlF1ZXJ5RXZlbnRPYmplY3QsIGl0ZW06YW55KSA9PiB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbSA9IGl0ZW07XG4gICAgICAgIHRoaXMuaXRlbVNlbGVjdGVkRGVmYXVsdEhhbmRsZXIoaXRlbSk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGhhbmRsZXJUeXBlZChuZXdWYWx1ZTpzdHJpbmcpOnZvaWQge1xuICAgICAgLy8gZmllbGQgdmFsdWUgY2hhbmdlZFxuXG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnR5cGVkICE9PSBudWxsKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5fc2V0dGluZ3MuZXZlbnRzLnR5cGVkKG5ld1ZhbHVlKTtcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHZhbHVlID49IG1pbkxlbmd0aCwgc3RhcnQgYXV0b2NvbXBsZXRlXG4gICAgICBpZiAobmV3VmFsdWUubGVuZ3RoID49IHRoaXMuX3NldHRpbmdzLm1pbkxlbmd0aCkge1xuICAgICAgICB0aGlzLl9zZWFyY2hUZXh0ID0gbmV3VmFsdWU7XG4gICAgICAgIHRoaXMuaGFuZGxlclByZVNlYXJjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGQuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlclByZVNlYXJjaCgpOnZvaWQge1xuICAgICAgLy8gZG8gbm90aGluZywgc3RhcnQgc2VhcmNoXG4gICAgICBcbiAgICAgIC8vIGN1c3RvbSBoYW5kbGVyIG1heSBjaGFuZ2UgbmV3VmFsdWVcbiAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUHJlICE9PSBudWxsKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZTpzdHJpbmcgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUHJlKHRoaXMuX3NlYXJjaFRleHQpO1xuICAgICAgICBpZiAoIW5ld1ZhbHVlKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fc2VhcmNoVGV4dCA9IG5ld1ZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZXJEb1NlYXJjaCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlckRvU2VhcmNoKCk6dm9pZCB7XG4gICAgICAvLyBjdXN0b20gaGFuZGxlciBtYXkgY2hhbmdlIG5ld1ZhbHVlXG4gICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZXZlbnRzLnNlYXJjaCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoKHRoaXMuX3NlYXJjaFRleHQsIChyZXN1bHRzOmFueSkgPT4ge1xuICAgICAgICAgIHRoaXMucG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERlZmF1bHQgYmVoYXZpb3VyXG4gICAgICAgIC8vIHNlYXJjaCB1c2luZyBjdXJyZW50IHJlc29sdmVyXG4gICAgICAgIGlmICh0aGlzLnJlc29sdmVyKSB7XG4gICAgICAgICAgdGhpcy5yZXNvbHZlci5zZWFyY2godGhpcy5fc2VhcmNoVGV4dCwgKHJlc3VsdHM6YW55KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvc3RTZWFyY2hDYWxsYmFjayhyZXN1bHRzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcG9zdFNlYXJjaENhbGxiYWNrKHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsYmFjayBjYWxsZWQnLCByZXN1bHRzKTtcbiAgICAgIFxuICAgICAgLy8gY3VzdG9tIGhhbmRsZXIgbWF5IGNoYW5nZSBuZXdWYWx1ZVxuICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmV2ZW50cy5zZWFyY2hQb3N0KSB7XG4gICAgICAgIHJlc3VsdHMgPSB0aGlzLl9zZXR0aW5ncy5ldmVudHMuc2VhcmNoUG9zdChyZXN1bHRzKTtcbiAgICAgICAgaWYgKCAodHlwZW9mIHJlc3VsdHMgPT09ICdib29sZWFuJykgJiYgIXJlc3VsdHMpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmhhbmRsZXJTdGFydFNob3cocmVzdWx0cyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVyU3RhcnRTaG93KHJlc3VsdHM6YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiZGVmYXVsdEV2ZW50U3RhcnRTaG93XCIsIHJlc3VsdHMpO1xuICAgICAgLy8gZm9yIGV2ZXJ5IHJlc3VsdCwgZHJhdyBpdFxuICAgICAgdGhpcy5fZGQudXBkYXRlSXRlbXMocmVzdWx0cywgdGhpcy5fc2VhcmNoVGV4dCk7XG4gICAgICB0aGlzLl9kZC5zaG93KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGl0ZW1TZWxlY3RlZERlZmF1bHRIYW5kbGVyKGl0ZW06YW55KTp2b2lkIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpdGVtU2VsZWN0ZWREZWZhdWx0SGFuZGxlcicsIGl0ZW0pO1xuICAgICAgLy8gZGVmYXVsdCBiZWhhdmlvdXIgaXMgc2V0IGVsbWVudCdzIC52YWwoKVxuICAgICAgbGV0IGl0ZW1Gb3JtYXR0ZWQ6YW55ID0gdGhpcy5fc2V0dGluZ3MuZm9ybWF0UmVzdWx0KGl0ZW0pO1xuXHRcdFx0aWYgKHR5cGVvZiBpdGVtRm9ybWF0dGVkID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRpdGVtRm9ybWF0dGVkID0geyB0ZXh0OiBpdGVtRm9ybWF0dGVkIH1cblx0XHRcdH1cbiAgICAgIHRoaXMuXyRlbC52YWwoaXRlbUZvcm1hdHRlZC50ZXh0KTtcbiAgICAgIC8vIGlmIHRoZSBlbGVtZW50IGlzIGEgc2VsZWN0XG4gICAgICBpZiAodGhpcy5faXNTZWxlY3RFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdEhpZGRlbkZpZWxkLnZhbChpdGVtRm9ybWF0dGVkLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIC8vIHNhdmUgc2VsZWN0ZWQgaXRlbVxuICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtID0gaXRlbTtcbiAgICAgIC8vIGFuZCBoaWRlXG4gICAgICB0aGlzLl9kZC5oaWRlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWZhdWx0Rm9ybWF0UmVzdWx0KGl0ZW06YW55KTp7fSB7XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnICkge1xuICAgICAgICByZXR1cm4geyB0ZXh0OiBpdGVtIH07XG4gICAgICB9IGVsc2UgaWYgKCBpdGVtLnRleHQgKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gcmV0dXJuIGEgdG9TdHJpbmcgb2YgdGhlIGl0ZW0gYXMgbGFzdCByZXNvcnRcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcignTm8gZGVmYXVsdCBmb3JtYXR0ZXIgZm9yIGl0ZW0nLCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIHsgdGV4dDogaXRlbS50b1N0cmluZygpIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxufVxuXG4oZnVuY3Rpb24oJDogSlF1ZXJ5U3RhdGljLCB3aW5kb3c6IGFueSwgZG9jdW1lbnQ6IGFueSkge1xuICAkLmZuW0F1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FXSA9IGZ1bmN0aW9uKG9wdGlvbnM6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcGx1Z2luQ2xhc3M6QXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlO1xuXG4gICAgICBwbHVnaW5DbGFzcyA9ICQodGhpcykuZGF0YShBdXRvQ29tcGxldGVOUy5BdXRvQ29tcGxldGUuTkFNRSk7XG5cbiAgICAgIGlmICghcGx1Z2luQ2xhc3MpIHtcbiAgICAgICAgcGx1Z2luQ2xhc3MgPSBuZXcgQXV0b0NvbXBsZXRlTlMuQXV0b0NvbXBsZXRlKHRoaXMsIG9wdGlvbnMpOyBcbiAgICAgICAgJCh0aGlzKS5kYXRhKEF1dG9Db21wbGV0ZU5TLkF1dG9Db21wbGV0ZS5OQU1FLCBwbHVnaW5DbGFzcyk7XG4gICAgICB9XG5cblxuICAgIH0pO1xuICB9O1xufSkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcblxuLy8gKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cbi8vICAgJ3VzZSBzdHJpY3QnO1xuXG4vLyAgIGZhY3RvcnkoalF1ZXJ5KTtcblxuLy8gfSh0aGlzLCBmdW5jdGlvbiAoJCkge1xuXG4vLyAgICd1c2Ugc3RyaWN0Jztcbi8vICAgLy8ganNoaW50IGxheGNvbW1hOiB0cnVlXG5cblxuLy8gIC8qIFRZUEVBSEVBRCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuLy8gICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vLyAgIHZhciBUeXBlYWhlYWQgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuLy8gICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuLy8gICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnR5cGVhaGVhZC5kZWZhdWx0cywgb3B0aW9ucyk7XG4vLyAgICAgdGhpcy5tYXRjaGVyID0gdGhpcy5vcHRpb25zLm1hdGNoZXIgfHwgdGhpcy5tYXRjaGVyO1xuLy8gICAgIHRoaXMuc29ydGVyID0gdGhpcy5vcHRpb25zLnNvcnRlciB8fCB0aGlzLnNvcnRlcjtcbi8vICAgICB0aGlzLnNlbGVjdCA9IHRoaXMub3B0aW9ucy5zZWxlY3QgfHwgdGhpcy5zZWxlY3Q7XG4vLyAgICAgdGhpcy5hdXRvU2VsZWN0ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5hdXRvU2VsZWN0ID09ICdib29sZWFuJyA/IHRoaXMub3B0aW9ucy5hdXRvU2VsZWN0IDogdHJ1ZTtcbi8vICAgICB0aGlzLmhpZ2hsaWdodGVyID0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodGVyIHx8IHRoaXMuaGlnaGxpZ2h0ZXI7XG4vLyAgICAgdGhpcy5yZW5kZXIgPSB0aGlzLm9wdGlvbnMucmVuZGVyIHx8IHRoaXMucmVuZGVyO1xuLy8gICAgIHRoaXMudXBkYXRlciA9IHRoaXMub3B0aW9ucy51cGRhdGVyIHx8IHRoaXMudXBkYXRlcjtcbi8vICAgICB0aGlzLmRpc3BsYXlUZXh0ID0gdGhpcy5vcHRpb25zLmRpc3BsYXlUZXh0IHx8IHRoaXMuZGlzcGxheVRleHQ7XG4vLyAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRUZXh0IHx8IHRoaXMuc2VsZWN0ZWRUZXh0O1xuLy8gICAgIHRoaXMuc291cmNlID0gdGhpcy5vcHRpb25zLnNvdXJjZTtcbi8vICAgICB0aGlzLmRlbGF5ID0gdGhpcy5vcHRpb25zLmRlbGF5O1xuLy8gICAgIHRoaXMuJG1lbnUgPSAkKHRoaXMub3B0aW9ucy5tZW51KTtcbi8vICAgICB0aGlzLiRhcHBlbmRUbyA9IHRoaXMub3B0aW9ucy5hcHBlbmRUbyA/ICQodGhpcy5vcHRpb25zLmFwcGVuZFRvKSA6IG51bGw7XG4vLyAgICAgdGhpcy5maXRUb0VsZW1lbnQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmZpdFRvRWxlbWVudCA9PSAnYm9vbGVhbicgPyB0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50IDogZmFsc2U7XG4vLyAgICAgdGhpcy5zaG93biA9IGZhbHNlO1xuLy8gICAgIHRoaXMubGlzdGVuKCk7XG4vLyAgICAgdGhpcy5zaG93SGludE9uRm9jdXMgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PSAnYm9vbGVhbicgfHwgdGhpcy5vcHRpb25zLnNob3dIaW50T25Gb2N1cyA9PT0gXCJhbGxcIiA/IHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgOiBmYWxzZTtcbi8vICAgICB0aGlzLmFmdGVyU2VsZWN0ID0gdGhpcy5vcHRpb25zLmFmdGVyU2VsZWN0O1xuLy8gICAgIHRoaXMuYWRkSXRlbSA9IGZhbHNlO1xuLy8gICAgIHRoaXMudmFsdWUgPSB0aGlzLiRlbGVtZW50LnZhbCgpIHx8IHRoaXMuJGVsZW1lbnQudGV4dCgpO1xuLy8gICB9O1xuICBcbi8vICAgVHlwZWFoZWFkLnByb3RvdHlwZSA9IHtcblxuLy8gICAgIGNvbnN0cnVjdG9yOiBUeXBlYWhlYWQsXG5cbi8vICAgICBzZWxlY3Q6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciB2YWwgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5kYXRhKCd2YWx1ZScpO1xuLy8gICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCB2YWwpO1xuLy8gICAgICAgaWYgKHRoaXMuYXV0b1NlbGVjdCB8fCB2YWwpIHtcbi8vICAgICAgICAgdmFyIG5ld1ZhbCA9IHRoaXMudXBkYXRlcih2YWwpO1xuLy8gICAgICAgICAvLyBVcGRhdGVyIGNhbiBiZSBzZXQgdG8gYW55IHJhbmRvbSBmdW5jdGlvbnMgdmlhIFwib3B0aW9uc1wiIHBhcmFtZXRlciBpbiBjb25zdHJ1Y3RvciBhYm92ZS5cbi8vICAgICAgICAgLy8gQWRkIG51bGwgY2hlY2sgZm9yIGNhc2VzIHdoZW4gdXBkYXRlciByZXR1cm5zIHZvaWQgb3IgdW5kZWZpbmVkLlxuLy8gICAgICAgICBpZiAoIW5ld1ZhbCkge1xuLy8gICAgICAgICAgIG5ld1ZhbCA9ICcnO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHZhciBzZWxlY3RlZFZhbCA9IHRoaXMuc2VsZWN0ZWRUZXh0KG5ld1ZhbCk7XG4vLyAgICAgICAgIGlmIChzZWxlY3RlZFZhbCAhPT0gZmFsc2UpIHtcbi8vICAgICAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgICAgICAudmFsKHNlbGVjdGVkVmFsKVxuLy8gICAgICAgICAgICAgLnRleHQodGhpcy5kaXNwbGF5VGV4dChuZXdWYWwpIHx8IG5ld1ZhbClcbi8vICAgICAgICAgICAgIC5jaGFuZ2UoKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB0aGlzLmFmdGVyU2VsZWN0KG5ld1ZhbCk7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gdGhpcy5oaWRlKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIHVwZGF0ZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2V0U291cmNlOiBmdW5jdGlvbiAoc291cmNlKSB7XG4vLyAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgdmFyIHBvcyA9ICQuZXh0ZW5kKHt9LCB0aGlzLiRlbGVtZW50LnBvc2l0aW9uKCksIHtcbi8vICAgICAgICAgaGVpZ2h0OiB0aGlzLiRlbGVtZW50WzBdLm9mZnNldEhlaWdodFxuLy8gICAgICAgfSk7XG5cbi8vICAgICAgIHZhciBzY3JvbGxIZWlnaHQgPSB0eXBlb2YgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodCA9PSAnZnVuY3Rpb24nID9cbi8vICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsSGVpZ2h0LmNhbGwoKSA6XG4vLyAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbEhlaWdodDtcblxuLy8gICAgICAgdmFyIGVsZW1lbnQ7XG4vLyAgICAgICBpZiAodGhpcy5zaG93bikge1xuLy8gICAgICAgICBlbGVtZW50ID0gdGhpcy4kbWVudTtcbi8vICAgICAgIH0gZWxzZSBpZiAodGhpcy4kYXBwZW5kVG8pIHtcbi8vICAgICAgICAgZWxlbWVudCA9IHRoaXMuJG1lbnUuYXBwZW5kVG8odGhpcy4kYXBwZW5kVG8pO1xuLy8gICAgICAgICB0aGlzLmhhc1NhbWVQYXJlbnQgPSB0aGlzLiRhcHBlbmRUby5pcyh0aGlzLiRlbGVtZW50LnBhcmVudCgpKTtcbi8vICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgIGVsZW1lbnQgPSB0aGlzLiRtZW51Lmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpO1xuLy8gICAgICAgICB0aGlzLmhhc1NhbWVQYXJlbnQgPSB0cnVlO1xuLy8gICAgICAgfSAgICAgIFxuICAgICAgXG4vLyAgICAgICBpZiAoIXRoaXMuaGFzU2FtZVBhcmVudCkge1xuLy8gICAgICAgICAgIC8vIFdlIGNhbm5vdCByZWx5IG9uIHRoZSBlbGVtZW50IHBvc2l0aW9uLCBuZWVkIHRvIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSB3aW5kb3dcbi8vICAgICAgICAgICBlbGVtZW50LmNzcyhcInBvc2l0aW9uXCIsIFwiZml4ZWRcIik7XG4vLyAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KCk7XG4vLyAgICAgICAgICAgcG9zLnRvcCA9ICBvZmZzZXQudG9wO1xuLy8gICAgICAgICAgIHBvcy5sZWZ0ID0gb2Zmc2V0LmxlZnQ7XG4vLyAgICAgICB9XG4vLyAgICAgICAvLyBUaGUgcnVsZXMgZm9yIGJvb3RzdHJhcCBhcmU6ICdkcm9wdXAnIGluIHRoZSBwYXJlbnQgYW5kICdkcm9wZG93bi1tZW51LXJpZ2h0JyBpbiB0aGUgZWxlbWVudC5cbi8vICAgICAgIC8vIE5vdGUgdGhhdCB0byBnZXQgcmlnaHQgYWxpZ25tZW50LCB5b3UnbGwgbmVlZCB0byBzcGVjaWZ5IGBtZW51YCBpbiB0aGUgb3B0aW9ucyB0byBiZTpcbi8vICAgICAgIC8vICc8dWwgY2xhc3M9XCJ0eXBlYWhlYWQgZHJvcGRvd24tbWVudVwiIHJvbGU9XCJsaXN0Ym94XCI+PC91bD4nXG4vLyAgICAgICB2YXIgZHJvcHVwID0gJChlbGVtZW50KS5wYXJlbnQoKS5oYXNDbGFzcygnZHJvcHVwJyk7XG4vLyAgICAgICB2YXIgbmV3VG9wID0gZHJvcHVwID8gJ2F1dG8nIDogKHBvcy50b3AgKyBwb3MuaGVpZ2h0ICsgc2Nyb2xsSGVpZ2h0KTtcbi8vICAgICAgIHZhciByaWdodCA9ICQoZWxlbWVudCkuaGFzQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUtcmlnaHQnKTtcbi8vICAgICAgIHZhciBuZXdMZWZ0ID0gcmlnaHQgPyAnYXV0bycgOiBwb3MubGVmdDtcbi8vICAgICAgIC8vIGl0IHNlZW1zIGxpa2Ugc2V0dGluZyB0aGUgY3NzIGlzIGEgYmFkIGlkZWEgKGp1c3QgbGV0IEJvb3RzdHJhcCBkbyBpdCksIGJ1dCBJJ2xsIGtlZXAgdGhlIG9sZFxuLy8gICAgICAgLy8gbG9naWMgaW4gcGxhY2UgZXhjZXB0IGZvciB0aGUgZHJvcHVwL3JpZ2h0LWFsaWduIGNhc2VzLlxuLy8gICAgICAgZWxlbWVudC5jc3MoeyB0b3A6IG5ld1RvcCwgbGVmdDogbmV3TGVmdCB9KS5zaG93KCk7XG5cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZml0VG9FbGVtZW50ID09PSB0cnVlKSB7XG4vLyAgICAgICAgICAgZWxlbWVudC5jc3MoXCJ3aWR0aFwiLCB0aGlzLiRlbGVtZW50Lm91dGVyV2lkdGgoKSArIFwicHhcIik7XG4vLyAgICAgICB9XG4gICAgXG4vLyAgICAgICB0aGlzLnNob3duID0gdHJ1ZTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRtZW51LmhpZGUoKTtcbi8vICAgICAgIHRoaXMuc2hvd24gPSBmYWxzZTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBsb29rdXA6IGZ1bmN0aW9uIChxdWVyeSkge1xuLy8gICAgICAgdmFyIGl0ZW1zO1xuLy8gICAgICAgaWYgKHR5cGVvZihxdWVyeSkgIT0gJ3VuZGVmaW5lZCcgJiYgcXVlcnkgIT09IG51bGwpIHtcbi8vICAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCkgfHwgJyc7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmICh0aGlzLnF1ZXJ5Lmxlbmd0aCA8IHRoaXMub3B0aW9ucy5taW5MZW5ndGggJiYgIXRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXM7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHZhciB3b3JrZXIgPSAkLnByb3h5KGZ1bmN0aW9uICgpIHtcblxuLy8gICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKHRoaXMuc291cmNlKSkge1xuLy8gICAgICAgICAgIHRoaXMuc291cmNlKHRoaXMucXVlcnksICQucHJveHkodGhpcy5wcm9jZXNzLCB0aGlzKSk7XG4vLyAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zb3VyY2UpIHtcbi8vICAgICAgICAgICB0aGlzLnByb2Nlc3ModGhpcy5zb3VyY2UpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9LCB0aGlzKTtcblxuLy8gICAgICAgY2xlYXJUaW1lb3V0KHRoaXMubG9va3VwV29ya2VyKTtcbi8vICAgICAgIHRoaXMubG9va3VwV29ya2VyID0gc2V0VGltZW91dCh3b3JrZXIsIHRoaXMuZGVsYXkpO1xuLy8gICAgIH0sXG5cbi8vICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoaXRlbXMpIHtcbi8vICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuLy8gICAgICAgaXRlbXMgPSAkLmdyZXAoaXRlbXMsIGZ1bmN0aW9uIChpdGVtKSB7XG4vLyAgICAgICAgIHJldHVybiB0aGF0Lm1hdGNoZXIoaXRlbSk7XG4vLyAgICAgICB9KTtcblxuLy8gICAgICAgaXRlbXMgPSB0aGlzLnNvcnRlcihpdGVtcyk7XG5cbi8vICAgICAgIGlmICghaXRlbXMubGVuZ3RoICYmICF0aGlzLm9wdGlvbnMuYWRkSXRlbSkge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5zaG93biA/IHRoaXMuaGlkZSgpIDogdGhpcztcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtc1swXSk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIG51bGwpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICAvLyBBZGQgaXRlbVxuLy8gICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGRJdGVtKXtcbi8vICAgICAgICAgaXRlbXMucHVzaCh0aGlzLm9wdGlvbnMuYWRkSXRlbSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaXRlbXMgPT0gJ2FsbCcpIHtcbi8vICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKGl0ZW1zKS5zaG93KCk7XG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXIoaXRlbXMuc2xpY2UoMCwgdGhpcy5vcHRpb25zLml0ZW1zKSkuc2hvdygpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBtYXRjaGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuLy8gICAgICAgdmFyIGl0ID0gdGhpcy5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgIHJldHVybiB+aXQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMucXVlcnkudG9Mb3dlckNhc2UoKSk7XG4vLyAgICAgfSxcblxuLy8gICAgIHNvcnRlcjogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgYmVnaW5zd2l0aCA9IFtdO1xuLy8gICAgICAgdmFyIGNhc2VTZW5zaXRpdmUgPSBbXTtcbi8vICAgICAgIHZhciBjYXNlSW5zZW5zaXRpdmUgPSBbXTtcbi8vICAgICAgIHZhciBpdGVtO1xuXG4vLyAgICAgICB3aGlsZSAoKGl0ZW0gPSBpdGVtcy5zaGlmdCgpKSkge1xuLy8gICAgICAgICB2YXIgaXQgPSB0aGlzLmRpc3BsYXlUZXh0KGl0ZW0pO1xuLy8gICAgICAgICBpZiAoIWl0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpKSBiZWdpbnN3aXRoLnB1c2goaXRlbSk7XG4vLyAgICAgICAgIGVsc2UgaWYgKH5pdC5pbmRleE9mKHRoaXMucXVlcnkpKSBjYXNlU2Vuc2l0aXZlLnB1c2goaXRlbSk7XG4vLyAgICAgICAgIGVsc2UgY2FzZUluc2Vuc2l0aXZlLnB1c2goaXRlbSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHJldHVybiBiZWdpbnN3aXRoLmNvbmNhdChjYXNlU2Vuc2l0aXZlLCBjYXNlSW5zZW5zaXRpdmUpO1xuLy8gICAgIH0sXG5cbi8vICAgICBoaWdobGlnaHRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHZhciBodG1sID0gJCgnPGRpdj48L2Rpdj4nKTtcbi8vICAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcnk7XG4vLyAgICAgICB2YXIgaSA9IGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgICAgdmFyIGxlbiA9IHF1ZXJ5Lmxlbmd0aDtcbi8vICAgICAgIHZhciBsZWZ0UGFydDtcbi8vICAgICAgIHZhciBtaWRkbGVQYXJ0O1xuLy8gICAgICAgdmFyIHJpZ2h0UGFydDtcbi8vICAgICAgIHZhciBzdHJvbmc7XG4vLyAgICAgICBpZiAobGVuID09PSAwKSB7XG4vLyAgICAgICAgIHJldHVybiBodG1sLnRleHQoaXRlbSkuaHRtbCgpO1xuLy8gICAgICAgfVxuLy8gICAgICAgd2hpbGUgKGkgPiAtMSkge1xuLy8gICAgICAgICBsZWZ0UGFydCA9IGl0ZW0uc3Vic3RyKDAsIGkpO1xuLy8gICAgICAgICBtaWRkbGVQYXJ0ID0gaXRlbS5zdWJzdHIoaSwgbGVuKTtcbi8vICAgICAgICAgcmlnaHRQYXJ0ID0gaXRlbS5zdWJzdHIoaSArIGxlbik7XG4vLyAgICAgICAgIHN0cm9uZyA9ICQoJzxzdHJvbmc+PC9zdHJvbmc+JykudGV4dChtaWRkbGVQYXJ0KTtcbi8vICAgICAgICAgaHRtbFxuLy8gICAgICAgICAgIC5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGVmdFBhcnQpKVxuLy8gICAgICAgICAgIC5hcHBlbmQoc3Ryb25nKTtcbi8vICAgICAgICAgaXRlbSA9IHJpZ2h0UGFydDtcbi8vICAgICAgICAgaSA9IGl0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5LnRvTG93ZXJDYXNlKCkpO1xuLy8gICAgICAgfVxuLy8gICAgICAgcmV0dXJuIGh0bWwuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGl0ZW0pKS5odG1sKCk7XG4vLyAgICAgfSxcblxuLy8gICAgIHJlbmRlcjogZnVuY3Rpb24gKGl0ZW1zKSB7XG4vLyAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4vLyAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4vLyAgICAgICB2YXIgYWN0aXZlRm91bmQgPSBmYWxzZTtcbi8vICAgICAgIHZhciBkYXRhID0gW107XG4vLyAgICAgICB2YXIgX2NhdGVnb3J5ID0gdGhhdC5vcHRpb25zLnNlcGFyYXRvcjtcblxuLy8gICAgICAgJC5lYWNoKGl0ZW1zLCBmdW5jdGlvbiAoa2V5LHZhbHVlKSB7XG4vLyAgICAgICAgIC8vIGluamVjdCBzZXBhcmF0b3Jcbi8vICAgICAgICAgaWYgKGtleSA+IDAgJiYgdmFsdWVbX2NhdGVnb3J5XSAhPT0gaXRlbXNba2V5IC0gMV1bX2NhdGVnb3J5XSl7XG4vLyAgICAgICAgICAgZGF0YS5wdXNoKHtcbi8vICAgICAgICAgICAgIF9fdHlwZTogJ2RpdmlkZXInXG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICAvLyBpbmplY3QgY2F0ZWdvcnkgaGVhZGVyXG4vLyAgICAgICAgIGlmICh2YWx1ZVtfY2F0ZWdvcnldICYmIChrZXkgPT09IDAgfHwgdmFsdWVbX2NhdGVnb3J5XSAhPT0gaXRlbXNba2V5IC0gMV1bX2NhdGVnb3J5XSkpe1xuLy8gICAgICAgICAgIGRhdGEucHVzaCh7XG4vLyAgICAgICAgICAgICBfX3R5cGU6ICdjYXRlZ29yeScsXG4vLyAgICAgICAgICAgICBuYW1lOiB2YWx1ZVtfY2F0ZWdvcnldXG4vLyAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgZGF0YS5wdXNoKHZhbHVlKTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpdGVtcyA9ICQoZGF0YSkubWFwKGZ1bmN0aW9uIChpLCBpdGVtKSB7XG4vLyAgICAgICAgIGlmICgoaXRlbS5fX3R5cGUgfHwgZmFsc2UpID09ICdjYXRlZ29yeScpe1xuLy8gICAgICAgICAgIHJldHVybiAkKHRoYXQub3B0aW9ucy5oZWFkZXJIdG1sKS50ZXh0KGl0ZW0ubmFtZSlbMF07XG4vLyAgICAgICAgIH1cblxuLy8gICAgICAgICBpZiAoKGl0ZW0uX190eXBlIHx8IGZhbHNlKSA9PSAnZGl2aWRlcicpe1xuLy8gICAgICAgICAgIHJldHVybiAkKHRoYXQub3B0aW9ucy5oZWFkZXJEaXZpZGVyKVswXTtcbi8vICAgICAgICAgfVxuXG4vLyAgICAgICAgIHZhciB0ZXh0ID0gc2VsZi5kaXNwbGF5VGV4dChpdGVtKTtcbi8vICAgICAgICAgaSA9ICQodGhhdC5vcHRpb25zLml0ZW0pLmRhdGEoJ3ZhbHVlJywgaXRlbSk7XG4vLyAgICAgICAgIGkuZmluZCgnYScpLmh0bWwodGhhdC5oaWdobGlnaHRlcih0ZXh0LCBpdGVtKSk7XG4vLyAgICAgICAgIGlmICh0ZXh0ID09IHNlbGYuJGVsZW1lbnQudmFsKCkpIHtcbi8vICAgICAgICAgICBpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICAgICBzZWxmLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsIGl0ZW0pO1xuLy8gICAgICAgICAgIGFjdGl2ZUZvdW5kID0gdHJ1ZTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICByZXR1cm4gaVswXTtcbi8vICAgICAgIH0pO1xuXG4vLyAgICAgICBpZiAodGhpcy5hdXRvU2VsZWN0ICYmICFhY3RpdmVGb3VuZCkge1xuLy8gICAgICAgICBpdGVtcy5maWx0ZXIoJzpub3QoLmRyb3Bkb3duLWhlYWRlciknKS5maXJzdCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5kYXRhKCdhY3RpdmUnLCBpdGVtcy5maXJzdCgpLmRhdGEoJ3ZhbHVlJykpO1xuLy8gICAgICAgfVxuLy8gICAgICAgdGhpcy4kbWVudS5odG1sKGl0ZW1zKTtcbi8vICAgICAgIHJldHVybiB0aGlzO1xuLy8gICAgIH0sXG5cbi8vICAgICBkaXNwbGF5VGV4dDogZnVuY3Rpb24gKGl0ZW0pIHtcbi8vICAgICAgIHJldHVybiB0eXBlb2YgaXRlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGl0ZW0ubmFtZSAhPSAndW5kZWZpbmVkJyAmJiBpdGVtLm5hbWUgfHwgaXRlbTtcbi8vICAgICB9LFxuXG4vLyAgICAgc2VsZWN0ZWRUZXh0OiBmdW5jdGlvbihpdGVtKSB7XG4vLyAgICAgICByZXR1cm4gdHlwZW9mIGl0ZW0gIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBpdGVtLm5hbWUgIT0gJ3VuZGVmaW5lZCcgJiYgaXRlbS5uYW1lIHx8IGl0ZW07XG4vLyAgICAgfSxcblxuLy8gICAgIG5leHQ6IGZ1bmN0aW9uIChldmVudCkge1xuLy8gICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgIHZhciBuZXh0ID0gYWN0aXZlLm5leHQoKTtcblxuLy8gICAgICAgaWYgKCFuZXh0Lmxlbmd0aCkge1xuLy8gICAgICAgICBuZXh0ID0gJCh0aGlzLiRtZW51LmZpbmQoJ2xpJylbMF0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBuZXh0LmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgcHJldjogZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgICAgICB2YXIgYWN0aXZlID0gdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuLy8gICAgICAgdmFyIHByZXYgPSBhY3RpdmUucHJldigpO1xuXG4vLyAgICAgICBpZiAoIXByZXYubGVuZ3RoKSB7XG4vLyAgICAgICAgIHByZXYgPSB0aGlzLiRtZW51LmZpbmQoJ2xpJykubGFzdCgpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBwcmV2LmFkZENsYXNzKCdhY3RpdmUnKTtcbi8vICAgICB9LFxuXG4vLyAgICAgbGlzdGVuOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgIC5vbignZm9jdXMnLCAgICAkLnByb3h5KHRoaXMuZm9jdXMsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2JsdXInLCAgICAgJC5wcm94eSh0aGlzLmJsdXIsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ2tleXByZXNzJywgJC5wcm94eSh0aGlzLmtleXByZXNzLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdpbnB1dCcsICAgICQucHJveHkodGhpcy5pbnB1dCwgdGhpcykpXG4vLyAgICAgICAgIC5vbigna2V5dXAnLCAgICAkLnByb3h5KHRoaXMua2V5dXAsIHRoaXMpKTtcblxuLy8gICAgICAgaWYgKHRoaXMuZXZlbnRTdXBwb3J0ZWQoJ2tleWRvd24nKSkge1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duJywgJC5wcm94eSh0aGlzLmtleWRvd24sIHRoaXMpKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgdGhpcy4kbWVudVxuLy8gICAgICAgICAub24oJ2NsaWNrJywgJC5wcm94eSh0aGlzLmNsaWNrLCB0aGlzKSlcbi8vICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgJ2xpJywgJC5wcm94eSh0aGlzLm1vdXNlZW50ZXIsIHRoaXMpKVxuLy8gICAgICAgICAub24oJ21vdXNlbGVhdmUnLCAnbGknLCAkLnByb3h5KHRoaXMubW91c2VsZWF2ZSwgdGhpcykpXG4vLyAgICAgICAgIC5vbignbW91c2Vkb3duJywgJC5wcm94eSh0aGlzLm1vdXNlZG93bix0aGlzKSk7XG4vLyAgICAgfSxcblxuLy8gICAgIGRlc3Ryb3kgOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ3R5cGVhaGVhZCcsbnVsbCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50LmRhdGEoJ2FjdGl2ZScsbnVsbCk7XG4vLyAgICAgICB0aGlzLiRlbGVtZW50XG4vLyAgICAgICAgIC5vZmYoJ2ZvY3VzJylcbi8vICAgICAgICAgLm9mZignYmx1cicpXG4vLyAgICAgICAgIC5vZmYoJ2tleXByZXNzJylcbi8vICAgICAgICAgLm9mZignaW5wdXQnKVxuLy8gICAgICAgICAub2ZmKCdrZXl1cCcpO1xuXG4vLyAgICAgICBpZiAodGhpcy5ldmVudFN1cHBvcnRlZCgna2V5ZG93bicpKSB7XG4vLyAgICAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duJyk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHRoaXMuJG1lbnUucmVtb3ZlKCk7XG4vLyAgICAgICB0aGlzLmRlc3Ryb3llZCA9IHRydWU7XG4vLyAgICAgfSxcblxuLy8gICAgIGV2ZW50U3VwcG9ydGVkOiBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4vLyAgICAgICB2YXIgaXNTdXBwb3J0ZWQgPSBldmVudE5hbWUgaW4gdGhpcy4kZWxlbWVudDtcbi8vICAgICAgIGlmICghaXNTdXBwb3J0ZWQpIHtcbi8vICAgICAgICAgdGhpcy4kZWxlbWVudC5zZXRBdHRyaWJ1dGUoZXZlbnROYW1lLCAncmV0dXJuOycpO1xuLy8gICAgICAgICBpc1N1cHBvcnRlZCA9IHR5cGVvZiB0aGlzLiRlbGVtZW50W2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbic7XG4vLyAgICAgICB9XG4vLyAgICAgICByZXR1cm4gaXNTdXBwb3J0ZWQ7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdmU6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVybjtcblxuLy8gICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbi8vICAgICAgICAgY2FzZSA5OiAvLyB0YWJcbi8vICAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbi8vICAgICAgICAgY2FzZSAyNzogLy8gZXNjYXBlXG4vLyAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgIGJyZWFrO1xuXG4vLyAgICAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4vLyAgICAgICAgICAgLy8gd2l0aCB0aGUgc2hpZnRLZXkgKHRoaXMgaXMgYWN0dWFsbHkgdGhlIGxlZnQgcGFyZW50aGVzaXMpXG4vLyAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHJldHVybjtcbi8vICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgdGhpcy5wcmV2KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvd1xuLy8gICAgICAgICAgIC8vIHdpdGggdGhlIHNoaWZ0S2V5ICh0aGlzIGlzIGFjdHVhbGx5IHRoZSByaWdodCBwYXJlbnRoZXNpcylcbi8vICAgICAgICAgICBpZiAoZS5zaGlmdEtleSkgcmV0dXJuO1xuLy8gICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICB0aGlzLm5leHQoKTtcbi8vICAgICAgICAgICBicmVhaztcbi8vICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAga2V5ZG93bjogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIHRoaXMuc3VwcHJlc3NLZXlQcmVzc1JlcGVhdCA9IH4kLmluQXJyYXkoZS5rZXlDb2RlLCBbNDAsMzgsOSwxMywyN10pO1xuLy8gICAgICAgaWYgKCF0aGlzLnNob3duICYmIGUua2V5Q29kZSA9PSA0MCkge1xuLy8gICAgICAgICB0aGlzLmxvb2t1cCgpO1xuLy8gICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgdGhpcy5tb3ZlKGUpO1xuLy8gICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICBrZXlwcmVzczogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICh0aGlzLnN1cHByZXNzS2V5UHJlc3NSZXBlYXQpIHJldHVybjtcbi8vICAgICAgIHRoaXMubW92ZShlKTtcbi8vICAgICB9LFxuXG4vLyAgICAgaW5wdXQ6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICAvLyBUaGlzIGlzIGEgZml4ZWQgZm9yIElFMTAvMTEgdGhhdCBmaXJlcyB0aGUgaW5wdXQgZXZlbnQgd2hlbiBhIHBsYWNlaG9kZXIgaXMgY2hhbmdlZFxuLy8gICAgICAgLy8gKGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODEwNTM4L2llLTExLWZpcmVzLWlucHV0LWV2ZW50LW9uLWZvY3VzKVxuLy8gICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IHRoaXMuJGVsZW1lbnQudmFsKCkgfHwgdGhpcy4kZWxlbWVudC50ZXh0KCk7XG4vLyAgICAgICBpZiAodGhpcy52YWx1ZSAhPT0gY3VycmVudFZhbHVlKSB7XG4vLyAgICAgICAgIHRoaXMudmFsdWUgPSBjdXJyZW50VmFsdWU7XG4vLyAgICAgICAgIHRoaXMubG9va3VwKCk7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGtleXVwOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4vLyAgICAgICAgIHJldHVybjtcbi8vICAgICAgIH1cbi8vICAgICAgIHN3aXRjaCAoZS5rZXlDb2RlKSB7XG4vLyAgICAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbi8vICAgICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3dcbi8vICAgICAgICAgY2FzZSAxNjogLy8gc2hpZnRcbi8vICAgICAgICAgY2FzZSAxNzogLy8gY3RybFxuLy8gICAgICAgICBjYXNlIDE4OiAvLyBhbHRcbi8vICAgICAgICAgICBicmVhaztcblxuLy8gICAgICAgICBjYXNlIDk6IC8vIHRhYlxuLy8gICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuLy8gICAgICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuO1xuLy8gICAgICAgICAgIHRoaXMuc2VsZWN0KCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG5cbi8vICAgICAgICAgY2FzZSAyNzogLy8gZXNjYXBlXG4vLyAgICAgICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm47XG4vLyAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgICAgICAgYnJlYWs7XG4vLyAgICAgICB9XG5cblxuLy8gICAgIH0sXG5cbi8vICAgICBmb2N1czogZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgIGlmICghdGhpcy5mb2N1c2VkKSB7XG4vLyAgICAgICAgIHRoaXMuZm9jdXNlZCA9IHRydWU7XG4vLyAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0hpbnRPbkZvY3VzICYmIHRoaXMuc2tpcFNob3dIaW50T25Gb2N1cyAhPT0gdHJ1ZSkge1xuLy8gICAgICAgICAgIGlmKHRoaXMub3B0aW9ucy5zaG93SGludE9uRm9jdXMgPT09IFwiYWxsXCIpIHtcbi8vICAgICAgICAgICAgIHRoaXMubG9va3VwKFwiXCIpOyBcbi8vICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgdGhpcy5sb29rdXAoKTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICAgIGlmICh0aGlzLnNraXBTaG93SGludE9uRm9jdXMpIHtcbi8vICAgICAgICAgdGhpcy5za2lwU2hvd0hpbnRPbkZvY3VzID0gZmFsc2U7XG4vLyAgICAgICB9XG4vLyAgICAgfSxcblxuLy8gICAgIGJsdXI6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBpZiAoIXRoaXMubW91c2Vkb3ZlciAmJiAhdGhpcy5tb3VzZWRkb3duICYmIHRoaXMuc2hvd24pIHtcbi8vICAgICAgICAgdGhpcy5oaWRlKCk7XG4vLyAgICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuLy8gICAgICAgfSBlbHNlIGlmICh0aGlzLm1vdXNlZGRvd24pIHtcbi8vICAgICAgICAgLy8gVGhpcyBpcyBmb3IgSUUgdGhhdCBibHVycyB0aGUgaW5wdXQgd2hlbiB1c2VyIGNsaWNrcyBvbiBzY3JvbGwuXG4vLyAgICAgICAgIC8vIFdlIHNldCB0aGUgZm9jdXMgYmFjayBvbiB0aGUgaW5wdXQgYW5kIHByZXZlbnQgdGhlIGxvb2t1cCB0byBvY2N1ciBhZ2FpblxuLy8gICAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSB0cnVlO1xuLy8gICAgICAgICB0aGlzLiRlbGVtZW50LmZvY3VzKCk7XG4vLyAgICAgICAgIHRoaXMubW91c2VkZG93biA9IGZhbHNlO1xuLy8gICAgICAgfSBcbi8vICAgICB9LFxuXG4vLyAgICAgY2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICB0aGlzLnNraXBTaG93SGludE9uRm9jdXMgPSB0cnVlO1xuLy8gICAgICAgdGhpcy5zZWxlY3QoKTtcbi8vICAgICAgIHRoaXMuJGVsZW1lbnQuZm9jdXMoKTtcbi8vICAgICAgIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgICBtb3VzZWVudGVyOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRvdmVyID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbi8vICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4vLyAgICAgfSxcblxuLy8gICAgIG1vdXNlbGVhdmU6IGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICB0aGlzLm1vdXNlZG92ZXIgPSBmYWxzZTtcbi8vICAgICAgIGlmICghdGhpcy5mb2N1c2VkICYmIHRoaXMuc2hvd24pIHRoaXMuaGlkZSgpO1xuLy8gICAgIH0sXG5cbi8vICAgIC8qKlxuLy8gICAgICAqIFdlIHRyYWNrIHRoZSBtb3VzZWRvd24gZm9yIElFLiBXaGVuIGNsaWNraW5nIG9uIHRoZSBtZW51IHNjcm9sbGJhciwgSUUgbWFrZXMgdGhlIGlucHV0IGJsdXIgdGh1cyBoaWRpbmcgdGhlIG1lbnUuXG4vLyAgICAgICovXG4vLyAgICAgbW91c2Vkb3duOiBmdW5jdGlvbiAoZSkge1xuLy8gICAgICAgdGhpcy5tb3VzZWRkb3duID0gdHJ1ZTtcbi8vICAgICAgIHRoaXMuJG1lbnUub25lKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKXtcbi8vICAgICAgICAgLy8gSUUgd29uJ3QgZmlyZSB0aGlzLCBidXQgRkYgYW5kIENocm9tZSB3aWxsIHNvIHdlIHJlc2V0IG91ciBmbGFnIGZvciB0aGVtIGhlcmVcbi8vICAgICAgICAgdGhpcy5tb3VzZWRkb3duID0gZmFsc2U7XG4vLyAgICAgICB9LmJpbmQodGhpcykpO1xuLy8gICAgIH0sXG5cbi8vICAgfTtcblxuXG4vLyAgIC8qIFRZUEVBSEVBRCBQTFVHSU4gREVGSU5JVElPTlxuLy8gICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLy8gICB2YXIgb2xkID0gJC5mbi50eXBlYWhlYWQ7XG5cbi8vICAgJC5mbi50eXBlYWhlYWQgPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4vLyAgICAgdmFyIGFyZyA9IGFyZ3VtZW50cztcbi8vICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyAmJiBvcHRpb24gPT0gJ2dldEFjdGl2ZScpIHtcbi8vICAgICAgIHJldHVybiB0aGlzLmRhdGEoJ2FjdGl2ZScpO1xuLy8gICAgIH1cbi8vICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4vLyAgICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcpO1xuLy8gICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbjtcbi8vICAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgndHlwZWFoZWFkJywgKGRhdGEgPSBuZXcgVHlwZWFoZWFkKHRoaXMsIG9wdGlvbnMpKSk7XG4vLyAgICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJyAmJiBkYXRhW29wdGlvbl0pIHtcbi8vICAgICAgICAgaWYgKGFyZy5sZW5ndGggPiAxKSB7XG4vLyAgICAgICAgICAgZGF0YVtvcHRpb25dLmFwcGx5KGRhdGEsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZywgMSkpO1xuLy8gICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgIGRhdGFbb3B0aW9uXSgpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIH07XG5cbi8vICAgJC5mbi50eXBlYWhlYWQuZGVmYXVsdHMgPSB7XG4vLyAgICAgc291cmNlOiBbXSxcbi8vICAgICBpdGVtczogOCxcbi8vICAgICBtZW51OiAnPHVsIGNsYXNzPVwidHlwZWFoZWFkIGRyb3Bkb3duLW1lbnVcIiByb2xlPVwibGlzdGJveFwiPjwvdWw+Jyxcbi8vICAgICBpdGVtOiAnPGxpPjxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIGhyZWY9XCIjXCIgcm9sZT1cIm9wdGlvblwiPjwvYT48L2xpPicsXG4vLyAgICAgbWluTGVuZ3RoOiAxLFxuLy8gICAgIHNjcm9sbEhlaWdodDogMCxcbi8vICAgICBhdXRvU2VsZWN0OiB0cnVlLFxuLy8gICAgIGFmdGVyU2VsZWN0OiAkLm5vb3AsXG4vLyAgICAgYWRkSXRlbTogZmFsc2UsXG4vLyAgICAgZGVsYXk6IDAsXG4vLyAgICAgc2VwYXJhdG9yOiAnY2F0ZWdvcnknLFxuLy8gICAgIGhlYWRlckh0bWw6ICc8bGkgY2xhc3M9XCJkcm9wZG93bi1oZWFkZXJcIj48L2xpPicsXG4vLyAgICAgaGVhZGVyRGl2aWRlcjogJzxsaSBjbGFzcz1cImRpdmlkZXJcIiByb2xlPVwic2VwYXJhdG9yXCI+PC9saT4nXG4vLyAgIH07XG5cbi8vICAgJC5mbi50eXBlYWhlYWQuQ29uc3RydWN0b3IgPSBUeXBlYWhlYWQ7XG5cbi8vICAvKiBUWVBFQUhFQUQgTk8gQ09ORkxJQ1Rcbi8vICAgKiA9PT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgJC5mbi50eXBlYWhlYWQubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICAkLmZuLnR5cGVhaGVhZCA9IG9sZDtcbi8vICAgICByZXR1cm4gdGhpcztcbi8vICAgfTtcblxuXG4vLyAgLyogVFlQRUFIRUFEIERBVEEtQVBJXG4vLyAgICogPT09PT09PT09PT09PT09PT09ICovXG5cbi8vICAgJChkb2N1bWVudCkub24oJ2ZvY3VzLnR5cGVhaGVhZC5kYXRhLWFwaScsICdbZGF0YS1wcm92aWRlPVwidHlwZWFoZWFkXCJdJywgZnVuY3Rpb24gKGUpIHtcbi8vICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuLy8gICAgIGlmICgkdGhpcy5kYXRhKCd0eXBlYWhlYWQnKSkgcmV0dXJuO1xuLy8gICAgICR0aGlzLnR5cGVhaGVhZCgkdGhpcy5kYXRhKCkpO1xuLy8gICB9KTtcblxuLy8gfSkpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbWFpbi50c1xuICoqLyIsIlxuY2xhc3MgQmFzZVJlc29sdmVyIHtcblx0cHJvdGVjdGVkIHJlc3VsdHM6QXJyYXk8T2JqZWN0PjtcblxuXHRwcm90ZWN0ZWQgX3NldHRpbmdzOmFueTtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOmFueSkge1xuXHRcdHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgb3B0aW9ucyk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0RGVmYXVsdHMoKTp7fSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldFJlc3VsdHMobGltaXQ/Om51bWJlciwgc3RhcnQ/Om51bWJlciwgZW5kPzpudW1iZXIpOkFycmF5PE9iamVjdD4ge1xuXHRcdFxuXHRcdHJldHVybiB0aGlzLnJlc3VsdHM7XG5cdH1cblxuXHRwdWJsaWMgc2VhcmNoKHE6c3RyaW5nLCBjYms6RnVuY3Rpb24pOnZvaWQge1xuXHRcdGNiayh0aGlzLmdldFJlc3VsdHMoKSk7XG5cdH1cblxufVxuXG5leHBvcnQgY2xhc3MgQWpheFJlc29sdmVyIGV4dGVuZHMgQmFzZVJlc29sdmVyIHtcblx0cHJvdGVjdGVkIGpxWEhSOkpRdWVyeVhIUjtcblxuXHRjb25zdHJ1Y3RvcihvcHRpb25zOmFueSkge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coJ3Jlc29sdmVyIHNldHRpbmdzJywgdGhpcy5fc2V0dGluZ3MpO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldERlZmF1bHRzKCk6e30ge1xuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6ICcnLFxuXHRcdFx0bWV0aG9kOiAnZ2V0Jyxcblx0XHRcdHF1ZXJ5S2V5OiAncScsXG5cdFx0XHRleHRyYURhdGE6IHt9LFxuXHRcdFx0dGltZW91dDogdW5kZWZpbmVkLFxuXHRcdH07XG5cdH1cblxuXHRwdWJsaWMgc2VhcmNoKHE6c3RyaW5nLCBjYms6RnVuY3Rpb24pOnZvaWQge1xuXHRcdGlmICh0aGlzLmpxWEhSICE9IG51bGwpIHtcblx0XHRcdHRoaXMuanFYSFIuYWJvcnQoKTtcblx0XHR9XG5cblx0XHRsZXQgZGF0YTpPYmplY3QgPSB7fTtcblx0XHRkYXRhW3RoaXMuX3NldHRpbmdzLnF1ZXJ5S2V5XSA9IHE7XG5cdFx0JC5leHRlbmQoZGF0YSwgdGhpcy5fc2V0dGluZ3MuZXh0cmFEYXRhKTtcblxuXHRcdHRoaXMuanFYSFIgPSAkLmFqYXgoXG5cdFx0XHR0aGlzLl9zZXR0aW5ncy51cmwsXG5cdFx0XHR7XG5cdFx0XHRcdG1ldGhvZDogdGhpcy5fc2V0dGluZ3MubWV0aG9kLFxuXHRcdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0XHR0aW1lb3V0OiB0aGlzLl9zZXR0aW5ncy50aW1lb3V0XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdHRoaXMuanFYSFIuZG9uZSgocmVzdWx0KSA9PiB7XG5cdFx0XHRjYmsocmVzdWx0KTtcblx0XHR9KTtcblx0XHRcblx0XHR0aGlzLmpxWEhSLmZhaWwoKGVycikgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coZXJyKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuanFYSFIuYWx3YXlzKCgpID0+IHtcblx0XHRcdHRoaXMuanFYSFIgPSBudWxsO1xuXHRcdH0pO1xuXHR9XG5cbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3Jlc29sdmVycy50c1xuICoqLyIsIi8qXG4gKlx0RHJvcGRvd24gY2xhc3MuIE1hbmFnZXMgdGhlIGRyb3Bkb3duIGRyYXdpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIERyb3Bkb3duIHtcblx0cHJvdGVjdGVkIF8kZWw6SlF1ZXJ5O1xuXHRwcm90ZWN0ZWQgX2RkOkpRdWVyeTtcblx0cHJvdGVjdGVkIGluaXRpYWxpemVkOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJvdGVjdGVkIHNob3duOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJvdGVjdGVkIGl0ZW1zOmFueVtdID0gW107XG5cdHByb3RlY3RlZCBmb3JtYXRJdGVtOkZ1bmN0aW9uO1xuXHRwcm90ZWN0ZWQgc2VhcmNoVGV4dDpzdHJpbmc7XG5cdHByb3RlY3RlZCBhdXRvU2VsZWN0OmJvb2xlYW47XG5cdHByb3RlY3RlZCBtb3VzZW92ZXI6Ym9vbGVhbjtcblxuXHRjb25zdHJ1Y3RvcihlOkpRdWVyeSwgZm9ybWF0SXRlbUNiazpGdW5jdGlvbiwgYXV0b1NlbGVjdDpib29sZWFuKSB7XG5cdFx0dGhpcy5fJGVsID0gZTtcblx0XHR0aGlzLmZvcm1hdEl0ZW0gPSBmb3JtYXRJdGVtQ2JrO1xuXHRcdHRoaXMuYXV0b1NlbGVjdCA9IGF1dG9TZWxlY3Q7XG5cdFx0XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblx0XG5cdHByb3RlY3RlZCBpbml0KCk6dm9pZCB7XG5cdFx0Ly8gSW5pdGlhbGl6ZSBkcm9wZG93blxuXHRcdGxldCBwb3M6YW55ID0gJC5leHRlbmQoe30sIHRoaXMuXyRlbC5wb3NpdGlvbigpLCB7XG4gICAgICAgIFx0XHRcdFx0aGVpZ2h0OiB0aGlzLl8kZWxbMF0ub2Zmc2V0SGVpZ2h0XG4gICAgXHRcdFx0XHR9KTtcblx0XHRcblx0XHQvLyBjcmVhdGUgZWxlbWVudFxuXHRcdHRoaXMuX2RkID0gJCgnPHVsIC8+Jyk7XG5cdFx0Ly8gYWRkIG91ciBjbGFzcyBhbmQgYmFzaWMgZHJvcGRvd24tbWVudSBjbGFzc1xuXHRcdHRoaXMuX2RkLmFkZENsYXNzKCdib290c3RyYXAtYXV0b2NvbXBsZXRlIGRyb3Bkb3duLW1lbnUnKTtcblxuXHRcdHRoaXMuX2RkLmluc2VydEFmdGVyKHRoaXMuXyRlbCk7XG5cdFx0dGhpcy5fZGQuY3NzKHsgbGVmdDogcG9zLmxlZnQsIHdpZHRoOiB0aGlzLl8kZWwub3V0ZXJXaWR0aCgpIH0pO1xuXHRcdFxuXHRcdC8vIGNsaWNrIGV2ZW50IG9uIGl0ZW1zXG5cdFx0dGhpcy5fZGQub24oJ2NsaWNrJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NsaWNrZWQnLCBldnQuY3VycmVudFRhcmdldCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKCQoZXZ0LmN1cnJlbnRUYXJnZXQpKTtcblx0XHRcdGxldCBpdGVtOmFueSA9ICQoZXZ0LmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2l0ZW0nKTtcblx0XHRcdHRoaXMuaXRlbVNlbGVjdGVkTGF1bmNoRXZlbnQoaXRlbSk7XG5cdFx0fSk7XG5cdFx0XG5cdFx0dGhpcy5fZGQub24oJ2tleXVwJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuc2hvd24pIHtcblx0XHRcdFx0c3dpdGNoIChldnQud2hpY2gpIHtcblx0XHRcdFx0XHRjYXNlIDI3OlxuXHRcdFx0XHRcdFx0Ly8gRVNDXG5cdFx0XHRcdFx0XHR0aGlzLmhpZGUoKTtcblx0XHRcdFx0XHRcdHRoaXMuXyRlbC5mb2N1cygpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fZGQub24oJ21vdXNlZW50ZXInLCAnbGknLCAoZXZ0OkpRdWVyeUV2ZW50T2JqZWN0KSA9PiB7XG5cdFx0XHQkKGV2dC5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCd1bCcpLmZpbmQoJ2xpLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblx0XHRcdCQoZXZ0LmN1cnJlbnRUYXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdHRoaXMubW91c2VvdmVyID0gdHJ1ZTtcblx0XHR9KTtcblxuXHRcdHRoaXMuX2RkLm9uKCdtb3VzZWxlYXZlJywgJ2xpJywgKGV2dDpKUXVlcnlFdmVudE9iamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5tb3VzZW92ZXIgPSBmYWxzZTtcblx0XHR9KTtcblxuXHRcdHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXHRcdFxuXHR9XG5cblx0Z2V0IGlzTW91c2VPdmVyKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMubW91c2VvdmVyO1xuXHR9XG5cblx0cHVibGljIGZvY3VzTmV4dEl0ZW0ocmV2ZXJzZWQ/OmJvb2xlYW4pIHtcblx0XHQvLyBnZXQgc2VsZWN0ZWRcblx0XHRsZXQgY3VyckVsZW06SlF1ZXJ5ID0gdGhpcy5fZGQuZmluZCgnbGkuYWN0aXZlJyk7XG5cdFx0bGV0IG5leHRFbGVtOkpRdWVyeSA9IHJldmVyc2VkID8gY3VyckVsZW0ucHJldigpIDogY3VyckVsZW0ubmV4dCgpO1xuXG5cdFx0aWYgKG5leHRFbGVtLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHQvLyBmaXJzdCBcblx0XHRcdG5leHRFbGVtID0gcmV2ZXJzZWQgPyB0aGlzLl9kZC5maW5kKCdsaScpLmxhc3QoKSA6IHRoaXMuX2RkLmZpbmQoJ2xpJykuZmlyc3QoKTtcblx0XHR9XG5cdFx0XG5cdFx0Y3VyckVsZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdG5leHRFbGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0fVxuXG5cdHB1YmxpYyBmb2N1c1ByZXZpb3VzSXRlbSgpIHtcblx0XHR0aGlzLmZvY3VzTmV4dEl0ZW0odHJ1ZSk7XG5cdH1cblxuXHRwdWJsaWMgZm9jdXNJdGVtKGluZGV4Om51bWJlcikge1xuXHRcdC8vIEZvY3VzIGFuIGl0ZW0gaW4gdGhlIGxpc3Rcblx0XHRpZiAodGhpcy5zaG93biAmJiAodGhpcy5pdGVtcy5sZW5ndGggPiBpbmRleCkpXG5cdFx0XHR0aGlzLl9kZC5maW5kKCdsaScpLmVxKGluZGV4KS5maW5kKCdhJykuZm9jdXMoKTtcblx0fVxuXHRcblx0cHVibGljIHNlbGVjdEZvY3VzSXRlbSgpIHtcblx0XHR0aGlzLl9kZC5maW5kKCdsaS5hY3RpdmUnKS50cmlnZ2VyKCdjbGljaycpO1xuXHR9XG5cblx0Z2V0IGlzSXRlbUZvY3VzZWQoKTpib29sZWFuIHtcblx0XHRpZiAodGhpcy5fZGQuZmluZCgnbGkuYWN0aXZlJykubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHB1YmxpYyBzaG93KCk6dm9pZCB7XG5cdFx0aWYgKCF0aGlzLnNob3duKSB7XG5cdFx0XHR0aGlzLl9kZC5kcm9wZG93bigpLnNob3coKTtcblx0XHRcdHRoaXMuc2hvd24gPSB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBpc1Nob3duKCk6Ym9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuc2hvd247XG5cdH1cblxuXHRwdWJsaWMgaGlkZSgpOnZvaWQge1xuXHRcdGlmICh0aGlzLnNob3duKSB7XG5cdFx0XHR0aGlzLl9kZC5kcm9wZG93bigpLmhpZGUoKTtcblx0XHRcdHRoaXMuc2hvd24gPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlSXRlbXMoaXRlbXM6YW55W10sIHNlYXJjaFRleHQ6c3RyaW5nKSB7XG5cdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZUl0ZW1zJywgaXRlbXMpO1xuXHRcdHRoaXMuaXRlbXMgPSBpdGVtcztcblx0XHR0aGlzLnNlYXJjaFRleHQgPSBzZWFyY2hUZXh0O1xuXHRcdHRoaXMucmVmcmVzaEl0ZW1MaXN0KCk7XG5cdH1cblxuXHRwcml2YXRlIHNob3dNYXRjaGVkVGV4dCh0ZXh0OnN0cmluZywgcXJ5OnN0cmluZyk6c3RyaW5nIHtcblx0XHRsZXQgc3RhcnRJbmRleDpudW1iZXIgPSB0ZXh0LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxcnkudG9Mb3dlckNhc2UoKSk7XG5cdFx0aWYgKHN0YXJ0SW5kZXggPiAtMSkge1xuXHRcdFx0bGV0IGVuZEluZGV4Om51bWJlciA9IHN0YXJ0SW5kZXggKyBxcnkubGVuZ3RoO1xuXG5cdFx0XHRyZXR1cm4gdGV4dC5zbGljZSgwLCBzdGFydEluZGV4KSArICc8Yj4nIFxuXHRcdFx0XHQrIHRleHQuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpICsgJzwvYj4nXG5cdFx0XHRcdCsgdGV4dC5zbGljZShlbmRJbmRleCk7XG5cdFx0fVxuXHRcdHJldHVybiB0ZXh0O1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlZnJlc2hJdGVtTGlzdCgpIHtcblx0XHR0aGlzLl9kZC5lbXB0eSgpO1xuXHRcdGxldCBsaUxpc3Q6SlF1ZXJ5W10gPSBbXTtcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG5cdFx0XHRsZXQgaXRlbUZvcm1hdHRlZDphbnkgPSB0aGlzLmZvcm1hdEl0ZW0oaXRlbSk7XG5cdFx0XHRpZiAodHlwZW9mIGl0ZW1Gb3JtYXR0ZWQgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdGl0ZW1Gb3JtYXR0ZWQgPSB7IHRleHQ6IGl0ZW1Gb3JtYXR0ZWQgfVxuXHRcdFx0fVxuXHRcdFx0bGV0IGl0ZW1UZXh0OnN0cmluZztcblx0XHRcdGxldCBpdGVtSHRtbDphbnk7XG5cblx0XHRcdGl0ZW1UZXh0ID0gdGhpcy5zaG93TWF0Y2hlZFRleHQoaXRlbUZvcm1hdHRlZC50ZXh0LCB0aGlzLnNlYXJjaFRleHQpO1xuXHRcdFx0aWYgKCBpdGVtRm9ybWF0dGVkLmh0bWwgIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0aXRlbUh0bWwgPSBpdGVtRm9ybWF0dGVkLmh0bWw7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpdGVtSHRtbCA9IGl0ZW1UZXh0O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRsZXQgbGkgPSAkKCc8bGkgPicpO1xuXHRcdFx0bGkuYXBwZW5kKFxuXHRcdFx0XHQkKCc8YT4nKS5hdHRyKCdocmVmJywgJyMnKS5odG1sKGl0ZW1IdG1sKVxuXHRcdFx0KVxuXHRcdFx0LmRhdGEoJ2l0ZW0nLCBpdGVtKTtcblx0XHRcdFxuXHRcdFx0bGlMaXN0LnB1c2gobGkpO1xuXHRcdH0pO1xuXHRcdCBcblx0XHR0aGlzLl9kZC5hcHBlbmQobGlMaXN0KTtcblx0fVxuXG5cdHByb3RlY3RlZCBpdGVtU2VsZWN0ZWRMYXVuY2hFdmVudChpdGVtOmFueSk6dm9pZCB7XG5cdFx0Ly8gbGF1bmNoIHNlbGVjdGVkIGV2ZW50XG5cdFx0Ly8gY29uc29sZS5sb2coJ2l0ZW1TZWxlY3RlZExhdW5jaEV2ZW50JywgaXRlbSk7XG5cdFx0dGhpcy5fJGVsLnRyaWdnZXIoJ2F1dG9jb21wbGV0ZS5zZWxlY3QnLCBpdGVtKVxuXHR9XG5cbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kcm9wZG93bi50c1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=