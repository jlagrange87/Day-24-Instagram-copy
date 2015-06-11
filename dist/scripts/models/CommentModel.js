var $ = require("jquery");
var Backbone = require("backbone");
Backbone.$ = $;

module.exports = Backbone.Model.extend({
	defaults: {
	_id:null,
	text:null,
	imageId:null
	},
	urlRoot:"https://tiny-pizza-server.herokuapp.com/collections/josh-model-photo-2-comments",
	idAttribute:"_id"
})