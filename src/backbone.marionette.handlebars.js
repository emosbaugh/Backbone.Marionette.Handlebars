(function (root, define, require, exports, module, factory, undef) {
    'use strict';
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'), require('backbone'), require('backbone.marionette'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone', 'backbone.marionette'], function (_, Backbone) {
            // Check if we use the AMD branch of Backbone
            _ = _ === undef ? root._ : _;
            Backbone = Backbone === undef ? root.Backbone : Backbone;
            return (root.returnExportsGlobal = factory(_, Backbone, root));
        });
    } else {
        // Browser globals
        root.returnExportsGlobal = factory(root._, root.Backbone);
    }
}(this, this.define, this.require, this.exports, this.module, function (_, Backbone, root, undef) {
    'use strict';     
    var oldGetTemplateSelector, oldTemplateCacheGet, oldRenderTemplate;

    oldGetTemplateSelector = Backbone.Marionette.View.prototype.getTemplateSelector;
    Backbone.Marionette.View.prototype.getTemplateSelector = function () {
        var template;

        // Get the template from `this.options.template` or
        // `this.template`. The `options` takes precedence.
        if (this.options && this.options.template) {
            template = this.options.template;
        } else {
            template = this.template;
        }

        // check if it's a handlebars template
        if (_.isObject(template) && template.type === 'handlebars') {
            return template;
        }

        return _.bind(oldGetTemplateSelector, this)();
    };

    oldTemplateCacheGet = Backbone.Marionette.TemplateCache.get;
    Backbone.Marionette.TemplateCache.get = function (template) {
        // check if it's a handlebars template
        if (_.isObject(template) && template.type === 'handlebars') {
            return template;
        }

        return _.bind(oldTemplateCacheGet, this)(template);
    };

    oldRenderTemplate = Backbone.Marionette.Renderer.renderTemplate;
    Backbone.Marionette.Renderer.renderTemplate = function (template, data) {
        if (template !== null) {
            return template.template(data, template.options);
        }
    };

    return Backbone.Marionette;
}));    