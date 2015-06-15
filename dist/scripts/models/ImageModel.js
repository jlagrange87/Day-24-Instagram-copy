var $ = require("jquery");
var Backbone = require("backbone");
Backbone.$ = $;

module.exports = Backbone.Model.extend({
	defaults: {
	_id:null,
	url:null,
	caption:null,
	user: null,
	},
	urlRoot:"https://tiny-pizza-server.herokuapp.com/collections/josh-model-photo-2",
	idAttribute:"_id"
})