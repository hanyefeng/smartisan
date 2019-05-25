const gulp = require("gulp");
const webserver = require("gulp-webserver");
const express = require("express");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass");
const csso = require("gulp-csso");
const autoprefixer = require("gulp-autoprefixer");
const https = require("https");
const http = require("http");

gulp.task("compileJS", ()=>{
	gulp.src("src/scripts/**/*.js")
		.pipe( babel({
			presets : ["@babel/env"]
		}) )
		.pipe( uglify() )
		.pipe( gulp.dest("dist/scripts") )
	gulp.src("src/pages/**/*.js")
		.pipe( babel({
			presets : ["@babel/env"]
		}) )
		.pipe( uglify() )
		.pipe( gulp.dest("dist/pages") )
	gulp.src("src/static/**/*").pipe( gulp.dest("dist/static") );
})
gulp.task("compileCSS", ()=>{
	gulp.src("src/styles/**/*.scss")
		.pipe( sass() )
		.pipe( autoprefixer() )
		.pipe( csso() )
		.pipe( gulp.dest("dist/styles") )
})
gulp.task("compileHTML", ()=>{
	gulp.src("src/pages/**/*.html")
		.pipe( gulp.dest("dist/pages") )
})


gulp.task("server", function(){
	//静态资源服务器 : 9999
	gulp.src("dist")
		.pipe( webserver({
			livereload : true,
			port : 9999
		}) )
	gulp.watch("src/pages/**/*.js", ["compileJS"]);
	gulp.watch("src/scripts/**/*.js", ["compileJS"]);
	gulp.watch("src/styles/**/*.scss", ["compileCSS"]);
	gulp.watch("src/pages/**/*.html", ["compileHTML"])
	
	//接口代理服务器
	let app = express();
	
	//搜索热词
	//https://shopapi.smartisan.com/v1/search/hot-words
	app.get("/hotwords", (req,res)=>{
		res.setHeader("Access-Control-Allow-Origin","*"); //cors
		res.setHeader("Content-Type","text/plain; charset=utf-8")
		let proxy = https.request({
			hostname: "shopapi.smartisan.com",
			path: "/v1/search/hot-words",
			method: 'get'
		}, (response) => {
			response.pipe(res);
		});
		proxy.end();
	})

	//普通搜索
	app.get("/suggest", (req,res)=>{
		let obj=req.query;
		res.setHeader("Access-Control-Allow-Origin","*");
		res.setHeader("Content-Type","text/plain; charset=utf-8");
		let proxy = https.request({
			hostname: "shopapi.smartisan.com",
			path: "/v1/search/suggest?keyword="+encodeURIComponent(obj.keyword),
			method: 'get'
		}, (response) => {
			response.pipe(res);
		});
		proxy.end();
	})

	//主页信息
	//https://shopapi.smartisan.com/product/home
	app.get("/home", (req,res)=>{
		res.setHeader("Access-Control-Allow-Origin","*");
		res.setHeader("Content-Type","text/plain; charset=utf-8")
		res.setHeader("content-encoding","gzip")
		let proxy = https.request({
			hostname: "shopapi.smartisan.com",
			path: "/product/home",
			method: 'get'
		}, (response) => {
			response.pipe(res);
		});
		proxy.end();
	})

	//商品详情
	app.get("/goods", (req,res)=>{
		let obj=req.query;
		res.setHeader("Access-Control-Allow-Origin","*");
		res.setHeader("Content-Type","text/plain; charset=utf-8")
		// res.setHeader("content-encoding","gzip")
		let proxy = https.request({
			hostname: "shopapi.smartisan.com",
			path: "/product/spus?ids="+obj.ids,
			method: 'get'
		}, (response) => {
			response.pipe(res);
		});
		proxy.end();
	})

	app.get("/goodinfo", (req,res)=>{
		let obj=req.query;
		res.setHeader("Access-Control-Allow-Origin","*");
		res.setHeader("Content-Type","text/plain; charset=utf-8")
		// res.setHeader("content-encoding","gzip")
		let proxy = https.request({
			hostname: "shopapi.smartisan.com",
			path: "/product/skus?ids="+obj.id,
			method: 'get'
		}, (response) => {
			response.pipe(res);
		});
		proxy.end();
	})

	app.listen(8000);
})


gulp.task("build", ["compileJS","compileCSS","compileHTML"])