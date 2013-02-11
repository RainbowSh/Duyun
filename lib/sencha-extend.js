/// <reference path='../ExtJS/ext-base.js' />
/// <reference path='../ExtJS/ext-all-debug.js' />
/// <reference path='../ExtJs/Extjs_Intellisense.js' />
/// <reference path="../lib/wind-all-0.7.3.js" />

Ext.applyIf(Number.prototype, {
    toMoney: function() {
        var v = this;
        v = (Math.round((v - 0) * 100)) / 100;
        v = (v == Math.floor(v)) ? v + '.00' : ((v * 10 == Math.floor(v * 10)) ? v + '0' : v);
        v = String(v);
        var ps = v.split('.'),
                whole = ps[0],
                sub = ps[1] ? '.' + ps[1] : '.00',
                r = /(\d+)(\d{3})/;
        while (r.test(whole)) {
            whole = whole.replace(r, '$1' + ',' + '$2');
        }
        return whole + sub;
    },

    div: function(arg) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = this.toString().split(".")[1].length;
        } catch (e) { }
        try {
            t2 = arg.toString().split(".")[1].length;
        } catch (e) { }

        r1 = Number(this.toString().replace(".", ""));
        r2 = Number(arg.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    },

    mul: function(arg) {
        var m = 0, s1 = this.toString(), s2 = arg.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) { }
        try {
            m += s2.split(".")[1].length;
        } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },

    add: function(arg) {
        var r1, r2, m;
        try {
            r1 = this.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (this * m + arg * m) / m;
    }
});

Ext.applyIf(Ext.util.Format, {
    cnMoney: function(v) {
        v = (Math.round((v - 0) * 100)) / 100;
        v = (v == Math.floor(v)) ? v + '.00' : ((v * 10 == Math.floor(v * 10)) ? v + '0' : v);
        v = String(v);
        var ps = v.split('.'),
                whole = ps[0],
                sub = ps[1] ? '.' + ps[1] : '.00',
                r = /(\d+)(\d{3})/;
        while (r.test(whole)) {
            whole = whole.replace(r, '$1' + ',' + '$2');
        }
        v = whole + sub;
        if (v.charAt(0) == '-') {
            return '-￥' + v.substr(1);
        }
        return '￥' + v;
    }
});

Ext.applyIf(String.prototype, {
    leftPad: function(len) {
        if (len <= 0) return this;

        var padStr = '';
        while (len-- > 0) {
            padStr += ' ';
        }

        return padStr + this;
    }
});

Ext.applyIf(Ext, {
    /**
    * Returns true if the passed value is a JavaScript array, otherwise false.
    * @param {Mixed} value The value to test
    * @return {Boolean}
    */
    isArray: function(v) {
        return toString.apply(v) === '[object Array]';
    },

    /**
    * Returns true if the passed object is a JavaScript date object, otherwise false.
    * @param {Object} object The object to test
    * @return {Boolean}
    */
    isDate: function(v) {
        return toString.apply(v) === '[object Date]';
    },

    /**
    * Returns true if the passed value is a JavaScript Object, otherwise false.
    * @param {Mixed} value The value to test
    * @return {Boolean}
    */
    isObject: function(v) {
        return !!v && Object.prototype.toString.call(v) === '[object Object]';
    },

    /**
    * Returns true if the passed value is a JavaScript 'primitive', a string, number or boolean.
    * @param {Mixed} value The value to test
    * @return {Boolean}
    */
    isPrimitive: function(v) {
        return Ext.isString(v) || Ext.isNumber(v) || Ext.isBoolean(v);
    },

    /**
    * Returns true if the passed value is a JavaScript Function, otherwise false.
    * @param {Mixed} value The value to test
    * @return {Boolean}
    */
    isFunction: function(v) {
        return toString.apply(v) === '[object Function]';
    },

    /**
    * Returns true if the passed value is a number. Returns false for non-finite numbers.
    * @param {Mixed} value The value to test
    * @return {Boolean}
    */
    isNumber: function(v) {
        return typeof v === 'number' && isFinite(v);
    },

    /**
    * Returns true if the passed value is a string.
    * @param {Mixed} value The value to test
    * @return {Boolean}
    */
    isString: function(v) {
        return typeof v === 'string';
    },

    /**
    * Returns true if the passed value is a boolean.
    * @param {Mixed} value The value to test
    * @return {Boolean}
    */
    isBoolean: function(v) {
        return typeof v === 'boolean';
    },

    /**
    * Returns true if the passed value is an HTMLElement
    * @param {Mixed} value The value to test
    * @return {Boolean}
    */
    isElement: function(v) {
        return v ? !!v.tagName : false;
    },

    /**
    * Returns true if the passed value is not undefined.
    * @param {Mixed} value The value to test
    * @return {Boolean}
    */
    isDefined: function(v) {
        return typeof v !== 'undefined';
    },

    getParentFrameEl: function(name) {
        if (Ext.isEmpty(name)) return null;

        return window.parent.Ext.getCmp(name);
        //return parent.document.getElementById(name);
    }
});

Ext.applyIf(Ext.Ajax, {
    requestAsync: function(option) {
        return Wind.Async.Task.create(function(t) {
            var success = option.success;
            option.success = function(response) {
                if (success) success(response);
                t.complete('success');
            };

            var failure = option.failure;
            option.failure = function(response, e) {
                if (failure) failure(response, e);
                t.complete('failure');
            };

            Ext.Ajax.request(option);
        });
    }
});