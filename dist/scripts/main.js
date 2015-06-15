var $ = require("jquery");
var _ = require("backbone/node_modules/underscore");
var Backbone = require("backbone");
Backbone.$ = $;

$(document).ready(function(){
		var App = Backbone.Router.extend({
		routes:{
			"":     			 	"login",

			"registration": 				"registration",

			"imageView": 			"imageView",

			"userProfile/:query": 	"userProfile",
		
		},
		login: function(){
			$("nav").hide();
			$(".page").hide();
			$("#login").fadeIn(1000);

		},
		registration: function(){
			$("nav").hide();
			$(".page").hide();
			$("#registration").fadeIn(1000);

		},
		imageView: function(){
			$(".page").hide();
			$("nav").fadeIn(1000);
			$("#image-list").fadeIn(1000);

		},
		userProfile: function(theUser){
			$(".page").hide();
			$("#userProfile").fadeIn(1000);

		}
	});
	var myRouter = new App();
	Backbone.history.start();
	$("#to-registration").click(function(){
		myRouter.navigate("registration", {trigger: true});
	});
	$("a.click-form").click(function() {
		var form = $(".dropdown-form");
		form.slideDown("slow");
	});
	$("#cancel").click(function(){
		$(".dropdown-form").slideUp("slow");
	});
	$("#logout").click(function(){
		myRouter.navigate("", {trigger: true});
	});
	var ImageCollection = require("./collections/ImageCollection.js")
	var ImageModel = require("./models/ImageModel.js")
	var CommentCollection = require("./collections/CommentCollection.js")
	var CommentModel = require("./models/CommentModel.js")
	var UserCollection = require('./collections/UserCollection.js');
	var UserModel = require('./models/UserModel.js');

	var imageRowBuilder =_.template($("#image-row-template").html());
	var commentRowBuilder =_.template($("#comment-row-template").html());
	var imageList = new ImageCollection();
	var commentList = new CommentCollection();
	
	imageList.fetch({
		success: function(){
			commentList.fetch();
		}
	});
	var currentUserId = {};
	var users = new UserCollection();
	var loggedInUser = false;
	users.fetch({ success: onUsersLoaded });

	function onUsersLoaded(newlyFetchedCollection) {
		$("#registration-form").on("submit", function(e) {
			e.preventDefault();
			$("#registration-error").html("");
			var newUser = new UserModel({
				username: $("#username-reg").val(),
				password: $("#password-reg").val(),
				email: $("#email-reg").val()
			});
			if(!newUser.isValid()) {
				$("#registration-error").html(newUser.validationError);
			}
			else {
				newUser.save();
				myRouter.navigate("imageView", {trigger: true});
			}

		});

		$("#login-form").on("submit", function(e) {
			e.preventDefault();

			$("#login-error").html("");
			var currentUser = new UserModel({
				username: $("#login-username").val(),
				password: $("#login-password").val()
			});
			if(!currentUser.isValid()) {
				$("#login-error").html(currentUser.validationError);
			}
			else {
				loggedInUser = users.findWhere({
					username: $("#login-username").val(),
					password: $("#login-password").val(),

				});
				currentUserId.ID = loggedInUser.attributes._id;
				console.log(currentUserId.ID)
				if(loggedInUser) {
					myRouter.navigate("imageView", {trigger: true});
				}
				else {
					$("#login-error").html("Your username / password combination is incorrect.");
				}
			}

		});
	}

	$("#add-image-form").submit(function(e){
		e.preventDefault();

		var imageToAdd = new ImageModel({
			url: $("#image-url-input").val(),
			caption:$("#image-caption-input").val()
		});
		imageList.add(imageToAdd);
		imageToAdd.save();
		$(".dropdown-form").slideUp("slow");
	});

	imageList.on("add", function(addedImage){
		var imageHtml = imageRowBuilder({model: addedImage});
		$("#image-list").append(imageHtml);
		$(".add-comment-"+addedImage.cid).click(function(){
			$("#comment-input-"+addedImage.cid).slideDown("slow");

		})

		$("[data-form-cid='"+addedImage.cid+"']").submit(function(e){
			e.preventDefault();
			var commentInput = $(this).find(".comment-input");
			var commentToAdd = new CommentModel({
				text: commentInput.val(),
				imageId: addedImage.id
			});
			$("#comment-input-"+addedImage.cid).slideUp("slow");
			commentList.add(commentToAdd);
			commentToAdd.save();
		});
	});

	commentList.on("add", function(addedComment){
		var commentHtml = commentRowBuilder({model: addedComment});
		var imageId = addedComment.get("imageId");
		var imageModel = imageList.get(imageId);

		$("[data-cid='"+imageModel.cid+"'] .comment-list").append("<li>"+commentHtml+"</li>");

	});
});