(function ($) {

    "use strict";

    /**
     * Request Animation Frame
     */

    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());

    /**
     * Zoomer
     * @param src
     * @constructor
     */

    function Zoomer(src) {

        var _this = this,
            $body = $("body");

        this.image = new Image();
        this.swipeStep = 20;
        this.$image = $(this.image);
        this.$zoomContainer = $('<div class="zoom-container"></div>');
        this.$zoomClose = $('<div class="zoom-close"></div>');
        this.$zoomContainer.append(this.$zoomClose);
        this.$zoomCover = $('<div class="zoom-cover"></div>');

        $body.append(this.$zoomCover);
        this.$zoomCover.addClass("animated fadeIn");

        $body.append(this.$zoomContainer);
        this.$zoomContainer.addClass("animated bounceIn");

        this.$image.load(function () {
            var frameWidth = _this.$zoomContainer.width(),
                frameHeight = _this.$zoomContainer.height()
                ;

            _this.$zoomContainer.append(_this.$image);

            if (_this.$image.width > frameWidth && _this.image.height < frameHeight) {
                // add top
                _this.$image.css({top: ((frameHeight - _this.image.height) / 2) + "px"});
            }
            else if (_this.image.width < frameWidth && _this.image.height > frameHeight) {
                // add left
                _this.$image.css({left: ((frameWidth - _this.image.width) / 2) + "px"});
            }
            else if (_this.image.width < frameWidth && _this.image.height < frameHeight) {
                // add left
                _this.$image.css({left: ((frameWidth - _this.image.width) / 2) + "px"});
                _this.$image.css({top: ((frameHeight - _this.image.height) / 2) + "px"});
            }
            else {
                _this.$image.css({left: "", top: ""});
            }
            _this.initZoomNavigation();
        });
        this.image.src = src;
    };

    Zoomer.prototype.resetViewport = function () {
        this.xFull = this.$zoomContainer.width();
        this.yFull = this.$zoomContainer.height();
        this.xCenter = this.xFull / 2;
        this.yCenter = this.yFull / 2;
    };

    Zoomer.prototype.initZoomNavigation = function () {

        var _this = this,
            image = this.image,
            $window = $(window),
            currentMousePos = {x: 0, y: 0},
            wW = $window.width(),
            wH = $window.height()
            ;

        _this.alive = true;

        this.resetViewport();
        $window.on("debouncedresize", function () {
            wW = $window.width();
            wH = $window.height();
            _this.resetViewport();
        });

        $(document).mousemove(function (event) {
            currentMousePos.x = event.pageX;
            currentMousePos.y = event.pageY;
        });

        var natWidth = _this.$image.prop("naturalWidth"),
            natHeight = _this.$image.prop("naturalHeight"),
            zoomStep = 200,
            zoomBase = 150,
            fitMode = "width"
            ;

        function zoomMove(x, y) {
            var xMargin = Number(_this.$image.css("margin-left").replace("px", "")),
                yMargin = Number(_this.$image.css("margin-top").replace("px", "")),
                quot = 1;

            if (x > 0 && x < 100 && image.width > _this.xFull) {
                _this.$image.css({
                    "margin-left": -(x / 100 * (_this.image.width - _this.xFull) * quot) + "px"
                });
            }
            else if (xMargin < 0 && x < 100) {
                _this.$image.css({
                    "margin-left": ""
                });
            }
            if (y > 0 && y < 100 && _this.image.height > _this.yFull) {
                _this.$image.css({
                    "margin-top": -(y / 100 * (_this.image.height - _this.yFull)) + "px"
                });
            }
            else if (yMargin < 0 && y < 100) {
                _this.$image.css({
                    "margin-top": ""
                });
            }
            if (_this.image.height < _this.yFull) {
                _this.$image.css({
                    "margin-top": ((_this.yFull - _this.image.height) / 2) + "px"
                });
            }
        }

        function zoomin() {
            if (!_this.alive) return;
            zoomMove((currentMousePos.x - _this.xCenter) * 100 / _this.xCenter, (currentMousePos.y - _this.yCenter) * 100 / _this.yCenter);
            requestAnimationFrame(zoomin);
        }

        function resetFitMode() {
            fitMode = natWidth / natHeight >= wW / wH ? "width" : "height";
        }

        function resetZoomStep() {
            if (natWidth > wW) zoomStep = zoomBase * natWidth / wW; // reset zoom quotient
        }

        function plusZoom() {

            resetFitMode();

            if (_this.$image.width() >= natWidth) return; // we've reached max size

            resetZoomStep();

            if (_this.$image.width() + zoomBase >= natWidth) {
                _this.$image.width(natWidth);
            }
            else {
                _this.$image.width(_this.$image.width() + zoomStep);
                _this.$image.css({"height": "auto"});
            }
        }

        // Scroll Zoom Out

        function minusZoom() {

            resetFitMode();

            if (fitMode == "width" && _this.$image.width() <= wW || fitMode == "height" && _this.$image.height() < wH) return; // we've reached min size

            resetZoomStep();

            if (fitMode == "width" && _this.$image.width() - zoomStep <= wW) {
                _this.$image.width(wW);
                _this.$image.height(_this.$image.height * wH / wW); // reset to auto
            }
            else if (fitMode == "height" && _this.$image.height() - zoomStep * _this.$image.height() / _this.$image.width() <= wH) {
                _this.$image.height(wH);
                _this.$image.css({"width": "auto"}); // reset to auto
            }
            else {
                _this.$image.width(_this.$image.width() - zoomStep);
                _this.$image.css({"height": "auto"});
            }
        }

        if ($("body").hasClass("computer")) { // on desktop move on mouse move

            zoomin();

            resetZoomStep(); // initial setup

            /**
             * Scroll Zoom In
             */

            this.$zoomContainer.on("mousewheel", function (event) {
                if (event.deltaY == 1) { // left
                    plusZoom();
                }
                else if (event.deltaY == -1) { // right
                    minusZoom();
                }
            });
        }
        else { // on mobile swipe
            this.$zoomContainer.find("img").swipe({
                swipeLeft: function (event, direction, distance, duration, fingerCount) {
                    currentMousePos.x = currentMousePos.x + _this.swipeStep >= 100 ? 100 : currentMousePos.x + _this.swipeStep;
                    zoomMove(currentMousePos.x, currentMousePos.y);
                },
                swipeRight: function (event, direction, distance, duration, fingerCount) {
                    currentMousePos.x = currentMousePos.x - _this.swipeStep <= 0 ? 0 : currentMousePos.x - _this.swipeStep;
                    zoomMove(currentMousePos.x, currentMousePos.y);
                },
                swipeDown: function (event, direction, distance, duration, fingerCount) {
                    currentMousePos.y = currentMousePos.y - _this.swipeStep <= 0 ? 0 : currentMousePos.y - _this.swipeStep;
                    zoomMove(currentMousePos.x, currentMousePos.y);
                },
                swipeUp: function (event, direction, distance, duration, fingerCount) {
                    currentMousePos.y = currentMousePos.y + _this.swipeStep >= 100 ? 100 : currentMousePos.y + _this.swipeStep;
                    zoomMove(currentMousePos.x, currentMousePos.y);
                }
            });
        }

        this.$zoomClose.on("click", function () {

            _this.alive = false; // exit from animation loop

            _this.$zoomContainer.css({
                "-webkit-animation-duration": "500ms",
                "-moz-animation-duration": "500ms",
                "animation-duration": "500ms"
            });

            _this.$zoomCover.css({
                "-webkit-animation-duration": "500ms",
                "-moz-animation-duration": "500ms",
                "animation-duration": "500ms"
            });

            _this.$zoomContainer.addClass("animated bounceOutUp").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                _this.$zoomContainer.remove();
                _this.$zoomCover.addClass("animated fadeOut").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                    _this.$zoomCover.remove();
                });
            });
        });
    };

    /**
     *
     * @param t
     * @param P0
     * @param P1
     * @param P2
     * @param P3
     * @returns {number}
     */

    function cubicBezier(t, P0, P1, P2, P3) {
        return Math.pow((1 - t), 3) * P0 + 3 * Math.pow((1 - t), 2) * t * P1 + 3 * (1 - t) * Math.pow(t, 2) * P2 + Math.pow(t, 3) * P3;
    }

    /**
     *
     * @param $item
     * @param property
     * @param value
     */

    function autoPrefix($item, property, value) {

        var css = {},
            webkit = "-webkit-" + property,
            moz = "-moz-" + property,
            ie = "-ms-" + property,
            o = "-o-" + property;

        css[webkit] = value;
        css[moz] = value;
        css[ie] = value;
        css[o] = value;
        css[property] = value;

        $item.css(css);
    }

    /**
     * Animation helper
     * @constructor
     */

    function Animator($item) {
        this.$item = $item;
    }

    Animator.prototype.prefixize = function (property, value) {
        var css = {},
            webkit = "-webkit-" + property,
            moz = "-moz-" + property,
            ie = "-ms-" + property,
            o = "-o-" + property;

        css[webkit] = value;
        css[moz] = value;
        css[ie] = value;
        css[o] = value;
        css[property] = value;

        this.$item.css(css);
    };

    Animator.prototype.animate = function (duration, easing, callback) {

        callback = callback || function () {
        };

        var oldEasing = this.$item.css("transition-timing-function"),
            oldDuration = this.$item.css("transition-duration"),
            _this = this
            ;

        this.prefixize("transition-duration", duration + "ms");
        this.prefixize("transition-timing-function", easing);

        this.$item.one('webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend', function () {
            _this.prefixize("transition-duration", oldDuration + "ms");
            _this.prefixize("transition-timing-function", oldEasing);
            callback();
        });
    };

    /**
     *
     * @constructor
     */

    window.Photoframe = function ($container) {

        var _this = this;

        /**
         * Elements
         */

        this.$container = $container;

        this.$body = $("body");

        this.$controls = this.$container.find("#frame-controls");
        this.$left = this.$container.find("#frame-controls #frame-left");
        this.$center = this.$container.find("#frame-controls #frame-center");
        this.$centerBottom = this.$container.find("#frame-controls #frame-center-bottom");
        this.$right = this.$container.find("#frame-controls #frame-right");
        this.$zoom = this.$container.find("#frame-controls #frame-center-top");
        this.$info = this.$controls.find('.photo-info-button');
        this.$infoBlock = this.$controls.find('.photo-info-block');
        this.$purchaseBlock = this.$controls.find('.purchase-info-block');
        this.$purchaseBtn = this.$controls.find('.purchase-info-button-bg').find(".info-label");
        this.$infoWrap = this.$controls.find('.photo-info-button-bg');
        this.$infoTitle = this.$infoWrap.find('.info-label');
        this.$leftThumb = this.$left.find("#left-thumb");
        this.$rightThumb = this.$right.find("#right-thumb");
        this.$share = this.$container.find("#frame-controls #frame-share");
        this.$shareButton = this.$share.find(".info-title");
        this.$like = this.$share.find(".image-like");
        this.$itemsWrap = this.$container.find('#frame-items');
        this.items = this.$itemsWrap.find('.photography');
        this.$counter = $("#frame-counter");
        this.$itemCount = this.$counter.find(".item-count");
        this.$counter.find(".total-count").html(this.items.length);
        this.$thumbsHolder = this.$container.find("#frame-thumbs");
        this.$thumbs = this.$container.find("#frame-thumbs .photo-thumb");
        this.$menu = $("#menu-wrap");
        this.$menuToggle = this.$menu.find("#main-menu-toggle");

        /**
         * Mobile buttons
         */

        this.$mobNext = this.$container.find("#mob-next");
        this.$mobPrev = this.$container.find("#mob-prev");
        this.$mobZoom = this.$container.find("#mob-zoom");
        this.$mobPlay = this.$container.find("#mob-play");
        this.$mobInfo = this.$container.find("#mob-info");
        this.$mobShare = this.$container.find("#mob-share");
        this.$mobBuy = this.$container.find("#mob-buy");

        this.$mobShare.on("click", function(){
            _this.$shareButton.trigger("click");
            return false;
        });

        this.$mobInfo.on("click", function(){
            _this.$infoTitle.trigger("click");
            return false;
        });

        this.$mobBuy.on("click", function(){
            _this.$purchaseBtn.trigger("click");
            return false;
        });

        /**
         * Properties
         */

        this.mode = this.$container.attr("data-mode") || "proportional";
        this.layout = this.$container.attr("data-layout") || "thumbs";
        this.thumbsMode = this.$container.attr("data-thumbs-mode");
        this.zoomEnabled = this.$container.attr("data-zoom-enabled");
        this.copyright = this.$container.attr("data-copyright");
        this.autoplay = this.$container.attr("data-auto") || false;
        this.autoInterval = this.$container.attr("data-interval") || 3000;
        this.adminbar = $("#wpadminbar").length;
        this.itemsLength = this.items.length;
        this.thumbWidth = Number(this.$thumbs.eq(0).width())
        + Number(this.$thumbs.eq(0).css("margin-left").replace("px", ""))
        + Number(this.$thumbs.eq(0).css("margin-right").replace("px", ""));

        /**
         * Initialization
         */

        this.resizeFrame();
        this.loadImages();
        this.initYoutubeApi();
        this.initVimeoApi();
        this.hashManager();
        this.setLikes();
        this.resetInfo();

        if (this.layout == "thumbs" && this.thumbsMode == "thumbs-bottom") {
            this.initThumbs();
            this.$centerBottom.on("click", function () {
                if($(window).width() < 768){
                    return;
                }
                if (!_this.$container.hasClass("thumbs")) {
                    _this.animateThumbs();
                }
                else {
                    _this.animateThumbsOut();
                }
                _this.$container.toggleClass("thumbs");
                _this.$body.toggleClass("thumbs-open");
            });
        }
        else if (this.layout == "thumbs" && this.thumbsMode == "thumbs-side") {
            this.setSideThumbs();
        }

        /**
         * Events
         */

        $(window).on("debouncedresize", function () {
            _this.resizeFrame();
            _this.resetAllImages();
        });

        this.$left.on("click", function () {

            if($(window).width() < 768){
                return;
            }

            var oldIndex = _this.$container.find(".photography.active").index(),
                newIndex = oldIndex - 1;

            _this.navigateTo(newIndex);
        });

        this.$mobPrev.on("click", function(){

            var oldIndex = _this.$container.find(".photography.active").index(),
                newIndex = oldIndex - 1;

            _this.navigateTo(newIndex);
            return false;
        });

        this.$right.on("click", function () {

            if($(window).width() < 768){
                return;
            }

            var oldIndex = _this.$container.find(".photography.active").index(),
                newIndex = oldIndex + 1;

            _this.navigateTo(newIndex);
        });

        this.$mobNext.on("click", function(){
            var oldIndex = _this.$container.find(".photography.active").index(),
                newIndex = oldIndex + 1;

            _this.navigateTo(newIndex);
            return false;
        });

        if (this.zoomEnabled) {
            this.$container.addClass("zoom-enabled");
        }
        this.$zoom.on("click", function () {
            
            if ((_this.$container.hasClass("image") || _this.$container.hasClass("woo_product")) && _this.zoomEnabled) {

				if($(window).width() < 768){
					return;
				} else {
					var active = _this.$container.find(".photography.active");
                	var zoomer = new Zoomer(active.attr("data-full"));
				}

            }
            else {
                _this.videoPlay();
                _this.$container.toggleClass("playing");
            }
        });
        this.$mobZoom.on("click", function(){
            if ((_this.$container.hasClass("image") || _this.$container.hasClass("woo_product")) && _this.zoomEnabled) {
                var active = _this.$container.find(".photography.active");
                var zoomer = new Zoomer(active.attr("data-full"));
            }
            return false;
        });

        this.$mobPlay.on("click", function(){
            _this.videoPlay();
            _this.$container.toggleClass("playing");
            return false;
        });

        /**
         * Like click event
         */

        this.$like.on("click", function () {

            if ($(this).hasClass("clicked")) return;

            var active = _this.$container.find(".photography.active"),
                id = active.attr("data-image-id");

            $.ajax({
                type: "POST",
                url: adminAjax,
                data: {
                    action: "image_like",
                    imageID: id
                },
                dataType: 'json',
                success: function (response) {
                    active.attr("data-likes-count", response.likes);
                    active.attr("data-like-clicked", true);
                    _this.setLikes();
                },
                error: function (response) {

                }
            });
        });

        this.$thumbsHolder.on("mouseenter", function () {
            _this.$container.addClass("thumbscroll");
            _this.thumbsNavigation();
        });

        this.$thumbsHolder.on("mouseleave", function () {
            _this.$container.removeClass("thumbscroll");
        });

        $(window).on("keydown", function (event) {
            if (event.which == 37) { // left arrow
                _this.$left.trigger("click");
            }
            else if (event.which == 39) {
                _this.$right.trigger("click");
            }
        });

		/**
		 * for gallery delay
		 */

		function debounce(func, wait, immediate) {
			var timeout, args, context, timestamp, result;
		
			var later = function () {
				var last = new Date().getTime() - timestamp;
		
				if (last < wait && last >= 0) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					if (!immediate) {
						result = func.apply(context, args);
						if (!timeout) context = args = null;
					}
				}
			};
		
			return function () {
				context = this;
				args = arguments;
				timestamp = new Date().getTime();
				var callNow = immediate && !timeout;
				if (!timeout) timeout = setTimeout(later, wait);
				if (callNow) {
					result = func.apply(context, args);
					context = args = null;
				}
		
				return result;
			};
		}


        _this.$container.on("mousewheel", debounce(function (event) {
            if (_this.$container.hasClass("zoom")) return;
            if (event.deltaY == 1) { // left
                _this.$left.trigger("click");
            }
            else if (event.deltaY == -1) { // right
                _this.$right.trigger("click");
            }
        }, 150)); 

        /*
         Thumbs navigation
         */

        this.$thumbs.on("click", function () {
            _this.navigateTo($(this).index());
        });

        if (this.autoplay) {
            this.slideshow();
        }
    };

    Photoframe.prototype.resetHorizontalOffset = function () {
        this.$itemsWrap.css({"left": -(this.calcOffset(this.$active.index())) + "px"});
    };

    Photoframe.prototype.calcOffset = function (index) {
        var $item = this.items.eq(index),
            itemWidth = $item.width(),
            offset = 0,
            itemDelta = 0
            ;

        for (var i = 0; i < index; i++) {
            offset += this.items.eq(i).width();
        }
        itemDelta = $(window).width() - itemWidth;
        itemDelta = itemDelta > 0 ? itemDelta : 0;
        offset -= itemDelta / 2;
        //offset = offset > 0 ? offset : 0;
        return offset;
    };

    /**
     *
     */

    Photoframe.prototype.setSideThumbs = function () {
        this.setLeftSideThumb();
        this.setRightSideThumb();
    };

    /**
     *
     */

    Photoframe.prototype.setLeftSideThumb = function () {
        var _this = this,
            newIndex = this.$active.index() - 1;

        if (newIndex == -1) newIndex = _this.itemsLength - 1;
        _this.$leftThumb.css({"background-image": "url(" + _this.items.eq(newIndex).attr("data-thumb-side") + ")"});
    };

    /**
     *
     */

    Photoframe.prototype.setRightSideThumb = function () {
        var _this = this,
            newIndex = this.$active.index() + 1;

        if (newIndex == _this.itemsLength) newIndex = 0;
        _this.$rightThumb.css({"background-image": "url(" + _this.items.eq(newIndex).attr("data-thumb-side") + ")"});
    };

    Photoframe.prototype.initYoutubeApi = function () {
        var _this = this;
        var tag = document.createElement('script');
        tag.src = "//www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        var done = false;

        window.onYouTubeIframeAPIReady = function () {
            var $youtubeVideos = _this.$container.find(".photography.type-youtube_video");
            $.each($youtubeVideos, function () {
                var $container = $(this).find(".video-container"),
                    id = $container.attr("data-video-id"),
                    preloader = $(this).find(".inner-preloader"),
                    player = new YT.Player('yt_' + id, {
                        height: '390',
                        width: '640',
                        videoId: id,
                        playerVars: {
                            controls: 0,
                            rel: 0,
                            showinfo: 0,
                            modestbranding: 1
                        },
                        events: {
                            'onReady': function () {
                                preloader.remove();
                                $container.addClass("video-ready");
                            }
                        }
                    });
                $(this).data("youtubePlayer", player);
            });
            $(window).trigger("resize");
        }
    };

    Photoframe.prototype.initVimeoApi = function () {
        var _this = this;
        var $vimeoVideos = _this.$container.find(".photography.type-vimeo_video");
        $.each($vimeoVideos, function () {
            var $this = $(this),
                $container = $(this).find(".video-container"),
                id = $container.attr("data-video-id"),
                $iframe = $container.find("iframe"),
                preloader = $(this).find(".inner-preloader");

            $iframe.attr("src", $iframe.attr("data-src"));
            setTimeout(function(){
                var player = $f('vimeo_' + id);
                player.addEvent('ready', function () {
                    preloader.remove();
                    $container.addClass("video-ready");
                });
                $this.data("vimeoPlayer", player);
            }, 150);
        });
    };

    Photoframe.prototype.videoPlay = function () {

        var $video = this.$active.find('video').get(0),
            $cover = this.$active.find('.image-cover'),
            type,
            youtubePlayer = this.$active.data("youtubePlayer"),
            vimeoPlayer = this.$active.data("vimeoPlayer")
            ;

        if (!this.$container.hasClass("playing")) {
            if (this.$active.attr("data-type") == "youtube_video") {
                youtubePlayer.playVideo();
            }
            else if (this.$active.attr("data-type") == "vimeo_video") {
                vimeoPlayer.api("play");
            }
            else {
                $video.play();
            }
            $cover.css({opacity: 0});
        }
        else {
            if (this.$active.attr("data-type") == "youtube_video") {
                youtubePlayer.pauseVideo();
            }
            else if (this.$active.attr("data-type") == "vimeo_video") {
                vimeoPlayer.api("pause");
            }
            else {
                $video.pause();
            }
            $cover.css({opacity: 1});
        }
    };

    /**
     *
     * @param newHash
     */

    Photoframe.prototype.hashManager = function (newHash) {

        var hash = location.hash,
            _this = this,
            $active = _this.$container.find(".photography.active"),
            activeIndex = $active.index()
            ;

        _this.$active = $active;

        if (newHash != undefined) { //function was called with parameter
            location.hash = newHash;
            return; // do nothing more
        }

        if (!hash) { // init
            location.hash = activeIndex;
            _this.navigateTo(activeIndex);
        }
        else if (hash) {
            var newIndex = Number(hash.replace("#", ""));
            _this.navigateTo(newIndex);

        }
    };

    /**
     *
     * @param newIndex
     */

    Photoframe.prototype.navigateTo = function (newIndex) {
        var _this = this
            ;

        if (newIndex == -1) newIndex = _this.itemsLength - 1;
        if (newIndex == _this.itemsLength) newIndex = 0;

        if (_this.$container.hasClass("playing")) {
            _this.videoPlay();
            _this.$container.removeClass("playing");
        }

        if (_this.$menuToggle.hasClass("on")) {
            _this.$menuToggle.trigger("click");
        }

        //$(window).trigger("hideinfo");

        if (_this.thumbsMode == "thumbs-bottom") {
            _this.maybeScrollThumbs(newIndex);
            _this.$thumbs.removeClass("active");
            _this.$thumbs.eq(newIndex).addClass("active");
        }

        this.$itemCount.html(newIndex + 1);

        _this.items.removeClass("active");
        var $newActive = _this.items.eq(newIndex);
        _this.$container.removeClass("image woo_product selfhosted_video youtube_video vimeo_video");
        _this.currentType = $newActive.attr("data-type");
        _this.$container.addClass($newActive.attr("data-type"));
        $newActive.addClass("active");
        _this.$active = $newActive;

        if (!this.initiation && _this.layout == "horizontal-list") { // reset center position after active image loaded
            var src = _this.$active.attr("data-src"),
                image = new Image();
            $(image).load(function () {
                _this.resetHorizontalOffset();
            });
            image.src = src;
            this.initiation = true;
        }

        _this.$body.removeClass("fs-skin-dark fs-skin-light").addClass("fs-skin-" + $newActive.attr("data-skin"));

        _this.hashManager(newIndex);
        _this.setLikes();
        _this.resetInfo();

        if (this.layout == "horizontal-list") {
            if (newIndex == 0) {
                _this.$container.removeClass("last-item").addClass("first-item");
            }
            else if (newIndex == this.items.length - 1) {
                _this.$container.removeClass("first-item").addClass("last-item");
            }
            else {
                _this.$container.removeClass("first-item").removeClass("last-item");
            }
            _this.resetHorizontalOffset();
        }

        if (_this.thumbsMode == "thumbs-side") {
            _this.setSideThumbs();
        }
    };

    /**
     *
     */

    Photoframe.prototype.resetInfo = function () {
        var _this = this;
        _this.$infoBlock.html('');
        var $activeInfo = _this.$active.find('.photo-info-block'),
            $purchaseInfo = _this.$active.find('.product-data')
            ;

        if ($activeInfo) {
            _this.$infoBlock.html($activeInfo.html());
        }
        if ($purchaseInfo) {
            _this.$purchaseBlock.find(".message-window").removeClass("success").removeClass("error").html('');
            _this.$purchaseBlock.find(".product-data-wrap").html($purchaseInfo.html());
        }
    };

    /**
     *
     */

    Photoframe.prototype.animateInfo = function () {
        var _this = this,
            active = _this.$container.find(".photography.active"),
            $info = active.find(".photo-info-block"),
            $allInfo = _this.$container.find(".photo-info-block")
            ;

        $allInfo.removeClass("animated slideInRight").css({opacity: 0});
        $info.css({opacity: 1});
        $info.addClass("animated slideInRight");
    };

    /**
     *
     */

    Photoframe.prototype.resetAllImages = function () {
        var _this = this;

        _this.items.each(function (index, value) {
            _this.resetImage($(this));
        });

        if (this.layout == "horizontal-list") {
            setTimeout(function () {
                _this.resetHorizontalOffset();
            }, 400);
        }
    };

    /**
     *
     */

    Photoframe.prototype.resetImageThumbs = function ($item) {

        var _this = this,
            $image = $item.find('img.photoimage'),
            imgWidth = $image.prop("naturalWidth"),
            imgHeight = $image.prop("naturalHeight"),
            $video = $item.find(".video-container"),
            frameHeight = _this.$container.height(),
            frameWidth = _this.$container.width(),
            type
            ;

        if ($item.attr("data-type") == "image") {
            type = "image";
        }
        else if ($item.attr("data-type") == "woo_product") {
            type = "woo_product";
        }
        else {
            type = "video";
        }

        if (type == "image" || type == "woo_product") { // image only
            /**
             * Best fit, no stretch algorithm
             * We need to calculate image and frame ratios first
             * @type {number}
             */
            var imgRatio = imgWidth / imgHeight,
                frameRatio = frameWidth / frameHeight
                ;

            if (imgRatio > frameRatio) { // image is proportionally wider, than frame, fit by frame width + top offset
                if (imgWidth > frameWidth) { // image is wide enough to fit frame by width
                    $image.css({
                        width: frameWidth + "px", // scale down to frame width
                        height: "auto", // automatically calculate height
                        "top": (Math.abs(frameHeight - (imgHeight * frameWidth / imgWidth)) / 2) + "px", // calculate new top offset
                        "left": "" // reset to default offset
                    });
                }
                else { // image is too small to fit frame by width, set it to natural height/width and center
                    $image.css({
                        width: "", // set to default width
                        height: "", // set to default height
                        "top": (Math.abs(frameHeight - imgHeight) / 2) + "px",
                        "left": (Math.abs(frameWidth - imgWidth) / 2) + "px"
                    });
                }

            }
            else { // image is narrower, than frame, fit by height + left offset
                if (imgHeight > frameHeight) { // image is high enough to fill frame height
                    $image.css({
                        height: frameHeight, // scale down to frame height
                        width: "auto", // automatically calculate width
                        "left": (Math.abs(frameWidth - (imgWidth * frameHeight / imgHeight)) / 2) + "px",
                        "top": ""
                    });
                }
                else { // image is not high enough to fill al frame by height
                    $image.css({
                        width: "", // set to default width
                        height: "", // set to default height
                        "top": (Math.abs(frameHeight - imgHeight) / 2) + "px",
                        "left": (Math.abs(frameWidth - imgWidth) / 2) + "px"
                    });
                }

            }
        }
        /**
         * video resize, fit by video aspect ratio
         * image just covers the video
         */
        else {
            var $iframe = $video.find('video'),
                multi = 1; // first, find video

            if ($item.attr("data-type") == "vimeo_video" || $item.attr("data-type") == "youtube_video") {
                multi = 1.35;
            }

            if (!$iframe.length) {
                $iframe = $video.find('iframe'); // or iframe
            }

            if($(window).width() < 768){
                $iframe.width($(window).width()).height("auto");
            }
            else{
                if (frameWidth / frameHeight >= 16 / 9) { // frame is wider, than 16:9 video, fit by frame height
                    if (this.mode == "proportional") {
                        $iframe.height(frameHeight);
                        $iframe.width(frameHeight * 16 / 9);
                        $video.css({"margin-left": ((frameWidth - $iframe.width()) / 2) + "px"});
                        $video.css({"margin-top": ""});
                    }
                    else {
                        $iframe.width(frameWidth * multi);
                        $iframe.height((frameWidth / 16 * 9) * multi);
                        $video.css({"margin-top": -(($iframe.height() - frameHeight) / 2) + "px"});
                        //$video.css({"margin-left": ""});
                        if (multi > 1) {
                            $video.css({"margin-left": -(($video.width() - frameWidth) / 2)});
                        }
                        else {
                            $video.css({"margin-left": ""});
                        }
                    }
                }
                else { // frame is narrower, than 16:9 video, fit by frame width
                    if (this.mode == "proportional") {
                        $iframe.width(frameWidth);
                        $iframe.height(frameWidth * 9 / 16);
                        $video.css({"margin-top": ((frameHeight - $iframe.height()) / 2) + "px"});
                        $video.css({"margin-left": ""});
                    }
                    else {
                        $iframe.height(frameHeight * multi);
                        $iframe.width((frameHeight / 9 * 16) * multi);
                        $video.css({"margin-left": -(($iframe.width() - frameWidth) / 2) + "px"});
                        //$video.css({"margin-top": ""});
                        if (multi > 1) {
                            $video.css({"margin-top": -(($video.height() - frameHeight) / 2)});
                        }
                        else {
                            $video.css({"margin-top": ""});
                        }
                    }
                }
            }

        }
    };

    /**
     * Horizontal list reset image
     * @param $item
     */

    Photoframe.prototype.resetImageHorizontal = function ($item) {
        var _this = this,
            $image = $item.find('img.photoimage'),
            imgWidth = $image.prop("naturalWidth"),
            imgHeight = $image.prop("naturalHeight"),
            $video = $item.find(".video-container"),
            $header = $("#page-header"),
            videoWidth,
            frameHeight = _this.$container.height(),
            frameWidth = _this.$container.width(),
            leftMargin = "",
            topMargin = "",
            type
            ;

        if ($item.attr("data-type") == "image") {
            type = "image";
        }
        else if ($item.attr("data-type") == "woo_product") {
            type = "woo_product";
        }
        else {
            type = "video";
        }

        if (type == "image" || type == "woo_product") { // image
            if($(window).width() < 768){
                $item.css({
                    "height": $(window).height() - $header.height(),
                    "line-height": Number($(window).height() - $header.height()) + "px"
                });
                $image.css({
                    "width": $(window).width(),
                    "height": "auto"
                });
            }
            else{
                $image.height(frameHeight);
                $image.css({width: ""});
                $item.css({
                    "height": "",
                    "line-height": ""
                });
            }
        }
        else { // video
            var $iframe = $video.find('video');
            if (!$iframe.length) {
                $iframe = $video.find('iframe');
            }

            if($(window).width() < 768){
                $iframe.css({
                    "width": $(window).width(),
                    "height": "auto",
                    "vertical-align": "middle"
                });
                $item.css({
                    "height": $(window).height() - $header.height(),
                    "line-height": Number($(window).height() - $header.height()) + "px"
                });
            }
            else{
                $iframe.height(frameHeight);
                $iframe.width(frameHeight / 9 * 16);
                $video.height(frameHeight);
                $video.width(frameHeight / 9 * 16);
                $item.height(frameHeight);
                $item.width(frameHeight / 9 * 16);
            }
        }

    };

    Photoframe.prototype.resetImage = function ($item) {
        switch (this.layout) {
            case "thumbs":
                this.resetImageThumbs($item);
                break;

            case "horizontal-list":
                this.resetImageHorizontal($item);
                break;

            default:
                this.resetImageThumbs($item);
                break;
        }
    };

    /**
     *
     */

    Photoframe.prototype.animateThumbs = function () {
        var _this = this;

        _this.$thumbs.each(function (index, value) {
            var delayQuotient = ((index + 1) / _this.$thumbs.length);
            autoPrefix($(this), "transition-delay", 500 * cubicBezier(delayQuotient, 0, 1, .39, 1) + "ms");
            autoPrefix($(this), "transition-duration", "500ms");
        });
        setTimeout(function () {
            _this.$body.addClass("thumbs-animated");
        }, 500);
    };

    Photoframe.prototype.animateThumbsOut = function () {
        var _this = this;

        _this.$body.removeClass("thumbs-animated").addClass("thumbs-go-out");
        setTimeout(function () {
            _this.$body.removeClass("thumbs-go-out");
        }, 500);
        _this.$thumbs.css({
            "-webkit-transition-delay": "",
            "-webkit-transition-duration": "",
            "-moz-transition-delay": "",
            "-moz-transition-duration": "",
            "transition-delay": "",
            "transition-duration": ""
        });
    };

    /**
     *
     */

    Photoframe.prototype.setLikes = function () {
        var _this = this,
            active = _this.$container.find(".photography.active"),
            $count = this.$like.find(".like-count"),
            clicked = active.attr("data-like-clicked")
            ;
        if (!clicked) {
            this.$like.removeClass("clicked");
        }
        else {
            this.$like.addClass("clicked");
        }
        $count.html(active.attr("data-likes-count"));
    };

    /**
     *
     */

    Photoframe.prototype.slideshow = function () {
        var _this = this;

        setInterval(function () {
            _this.$right.trigger("click");
        }, this.autoInterval);
    };

    Photoframe.prototype.maybeScrollThumbs = function (newIndex) {
        var offset = Math.abs(this.$thumbsHolder.css("margin-left").replace("px", "")),
            newThumb = this.$thumbs.eq(newIndex),
            thumbPosition = newThumb.prop("offsetLeft")
            ;

        if (offset + this.$container.width() < thumbPosition + this.thumbWidth) {
            this.$thumbsHolder.css({"margin-left": (this.$container.width() - (thumbPosition + this.thumbWidth)) + "px"});
        }

        else if (offset > thumbPosition) {
            this.$thumbsHolder.css({"margin-left": ""});
        }
    };

    /**
     *
     */

    Photoframe.prototype.initThumbs = function () {
        this.$thumbsHolder.width(this.$thumbs.length * 150);
    };

    /**
     *
     */

    Photoframe.prototype.thumbsNavigation = function () {
        var _this = this,
            xFull = this.$container.width(),
            xCenter = xFull / 2,
            currentMousePos = {x: -1, y: -1},
            thumbsHolder = this.$thumbsHolder,
            thumbsHolderWidth = this.$thumbsHolder.width()
            ;

        function thumbMove(x) {
            var xMargin = Number(thumbsHolder.css("margin-left").replace("px", ""));

            if (x > 0 && x + xFull < thumbsHolderWidth) {
                thumbsHolder.css({
                    "margin-left": -(x / 100 * (thumbsHolderWidth - xFull)) + "px"
                });
            }
            else if (x < 0) {
                thumbsHolder.css({
                    "margin-left": ""
                });
            }
        }

        function thumbScroll() {
            if (!_this.$container.hasClass("thumbscroll")) return;
            thumbMove((currentMousePos.x - xCenter) * 100 / xCenter);
            requestAnimationFrame(thumbScroll);
        }

        if (!$("body").hasClass("computer")) { // on mobile swipe
            this.swipeStep = 20;
            this.$thumbs.swipe({
                swipeLeft: function (event, direction, distance, duration, fingerCount) {
                    currentMousePos.x = currentMousePos.x + _this.swipeStep >= 100 ? 100 : currentMousePos.x + _this.swipeStep;
                    thumbMove(currentMousePos.x, currentMousePos.y);
                },
                swipeRight: function (event, direction, distance, duration, fingerCount) {
                    currentMousePos.x = currentMousePos.x - _this.swipeStep <= 0 ? 0 : currentMousePos.x - _this.swipeStep;
                    thumbMove(currentMousePos.x, currentMousePos.y);
                }
            });
        }
        else {

            $(document).mousemove(function (event) {
                currentMousePos.x = event.pageX;
                currentMousePos.y = event.pageY;
            });

            thumbScroll();
        }
    };

    /**
     *
     */

    Photoframe.prototype.resizeFrame = function () {
        var $adminBar = $("#wpadminbar"),
            $footer = $("#page-footer"),
            adminHeight = $adminBar.length ? $adminBar.height() : 0
            ;
        if ($(window).width() <= 1024) {
            if ($(window).width() < 768) { // responsive
                var offset = $("#page-header").outerHeight();

                if (this.adminbar) {
                    this.$container.height($(window).height() - offset - adminHeight); // 32px - adminbar height
                }
                else {
                    this.$container.height($(window).height() - offset);
                }
            }
            else {
                if (this.adminbar) {
                    this.$container.height($(window).height() - $footer.outerHeight() - adminHeight); // 32px - adminbar height
                }
                else {
                    this.$container.height($(window).height() - $footer.outerHeight());
                }
            }
        }
        else { // not responsive
            if (this.adminbar) {
                this.$container.height($(window).height() - adminHeight); // 32px - adminbar height
            }
            else {
                this.$container.height($(window).height());
            }
        }

        this.$container.width($(window).width());

        if (this.layout == "thumbs" && this.thumbsMode == "thumbs-side") {
            var newThumbTop = this.$container.height() / 2 - this.$leftThumb.height() / 2;
            this.$leftThumb.css({top: newThumbTop + "px"});
            this.$rightThumb.css({top: newThumbTop + "px"});
        }
    };

    Photoframe.prototype.loadImages = function () {

        var _this = this;

        if (_this.copyright) {
            _this.$container.append('<div id="image-copyright">&copy;' + _this.copyright.replace("©", "") + '</div>');
        }

        $.each(this.items, function (index, value) {
            var tmpImage = new Image(),
                $image,
                alt = $(this).attr("data-alt"),
                _image = $(this),
                preloader = $(this).find(".inner-preloader"),
                $video_container = _image.find(".video-container")
                ;

            $(tmpImage).attr("alt", alt);
            tmpImage.src = $(value).attr("data-src");
            $image = $(tmpImage);

            if (index == 0) {
                $image.addClass("active");
            }

            $image.load(function () {
                if (_this.layout == "thumbs") { // thumbs mode

                    if (_image.attr("data-type") == "image" || _image.attr("data-type") == "woo_product") { // image
                        if (_this.mode == "proportional") {
                            $image.addClass("photoimage");
                            _image.append($image);
                            _this.resetImage(_image);
                        }
                        else if (_this.mode == "cover") {
                            _image.append('<div class="image-cover" style="background-image: url(' + tmpImage.src + ');"></div>');
                        }
                    }
                    else { // video
                        if (_image.attr("data-type") == "youtube_video") {

                        }
                        if (_this.mode == "proportional") {
                            $video_container.append('<div class="image-cover" style="background-image: url(' + tmpImage.src + ');"></div>');
                            _this.resetImage(_image);
                        }
                        else if (_this.mode == "cover") {
                            $video_container.append('<div class="image-cover" style="background-image: url(' + tmpImage.src + ');"></div>');
                        }
                    }
                }

                else if (_this.layout == "horizontal-list") { // horizontal-list mode
                    if (_image.attr("data-type") == "image" || _image.attr("data-type") == "woo_product") { // image
                        _image.css({width: "auto"});
                        $image.addClass("photoimage");
                        _image.append($image);
                        _this.resetImage(_image);
                    }
                    else {
                        $video_container.append('<div class="image-cover" style="background-image: url(' + tmpImage.src + ');"></div>');
                        _this.resetImage(_image);
                    }
                    _image.addClass("photo-holder");
                }

                if (_image.attr("data-type") != "youtube_video" && _image.attr("data-type") != "vimeo_video") {
                    preloader.remove();
                }
            });
        });
    };

    /**
     * jQuery bridge
     */

    $.fn.photoFrame = function () {
        var frame = new Photoframe($(this));
    };

    $(document).ready(function () {
        if ($('#photoframe').length && $('#photoframe #frame-items .photography').length) {
            $('#photoframe').photoFrame();
        }
    });

})(jQuery);