var $ = require("jquery");
var Backbone = require("backbone");
Backbone.$ = $;

var CommentModel = require("../models/CommentModel.js");

module.exports = Backbone.Collection.extend({
	model: CommentModel,
	url:"https://tiny-pizza-server.herokuapp.com/collections/josh-model-photo-2-comments"
})