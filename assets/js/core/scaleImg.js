
var ImageScale = function(element, options) {
    var that = this;
    that.options = options;
    that.element = element;

    var img = that.img = element.tagName === 'IMG' ? element : element.getElementsByTagName("img")[0];

    that.src = img.getAttribute('src');
    that.imgWidth = img.naturalWidth || img.width;
    that.imgHeight = img.naturalHeight || img.height;

    var parent = that.parent = options.parent?options.parent:element.parentElement;

    if(parent){
        that.hotSpot = parent.parentElement.querySelector("span.plus-btn-wrapper");
        that.hotSpotPoint = new Array(that.hotSpot.getAttribute('data-x'),that.hotSpot.getAttribute('data-y'));
    }

    // Fixes: https://github.com/gestixi/image-scale/issues/1
    if (parent.style.position === 'static') {
        parent.style.position = 'relative';
    }

    if (options.rescaleOnResize) {
        window.addEventListener('resize', function(){
            that.scheduleScale();
        });
    }
};

ImageScale.prototype = {

    NONE: "none",
    FILL: "fill",
    BEST_FILL: "best-fill",
    BEST_FIT: "best-fit",
    BEST_FIT_DOWN_ONLY: "best-fit-down",

    ALIGN_LEFT: 'left',
    ALIGN_RIGHT: 'right',
    ALIGN_CENTER: 'center',
    ALIGN_TOP: 'top',
    ALIGN_BOTTOM: 'bottom',
    ALIGN_TOP_LEFT: 'top-left',
    ALIGN_TOP_RIGHT: 'top-right',
    ALIGN_BOTTOM_LEFT: 'bottom-left',
    ALIGN_BOTTOM_RIGHT: 'bottom-right',

    constructor: ImageScale,

    /**
     The initial element.

     @type DOM Element
     */
    element: null,

    /**
     The passed options.

     @type Object
     */
    options: null,

    /**
     Main method. Used to scale the images.

     When `rescaleOnResize` is set to true, this method is executed each time the
     windows size changes.

     If `rescaleOnResize` is set to false, you may want to call it manually. Here is an
     example on how you should do it:

     $image.imageScale('scale');


     @param {Boolean} firstTime
     */
    scale: function(firstTime, opt) {

        if (this._isDestroyed || this._canScale === false){
            return;
        }

        var that = this,
            options = this.options,
            parent = this.parent,
            element = this.element,
            img = this.img,
            hotSpot = this.hotSpot,
            hotSpotPoint = this.hotSpotPoint;

        if (firstTime) {
            if (options.hideParentOverflow) {
                parent.style.overflow = 'hidden';
            }
        }
        else {
            // If the source of the image has changed
            if (this.src !== img.getAttribute('src')) {
                this.destroy();
                element.setAttribute('data-imageScale', null);
                element.imageScale(options);
                return;
            }
        }

        this._didScheduleScale = false;

        if (options.rescaleOnResize && !opt) {
            if (!this._needUpdate(this.parent)){
                return;
            }
        }

        opt = opt ? opt : {};

        var transition = opt.transition;
        if (transition) {
            this._canScale = false;
            element.style.transition = 'all '+transition+'ms';

            setTimeout(function() {
                that._canScale = null;
                element.style.transition = null;
            }, transition);
        }

        var destWidth = opt.destWidth ? opt.destWidth : parent.offsetWidth,
            destHeight = opt.destHeight ? opt.destHeight : parent.offsetHeight,

            destInnerWidth = opt.destWidth ? opt.destWidth : parent.offsetWidth,
            destInnerHeight = opt.destHeight ? opt.destHeight : parent.offsetHeight,

            widthOffset = destWidth - destInnerWidth,
            heightOffset = destHeight - destInnerHeight,

            scaleData = element.getAttribute('data-scale'),
            alignData = element.getAttribute('data-align'),

            scale = scaleData?scaleData:options.scale,
            align = alignData?alignData:options.align,

            fadeInDuration = options.fadeInDuration;

        if (!scale) {
            if (options.logLevel > 2) {
                console.log("imageScale - DEBUG NOTICE: The scale property is null.", element);
            }
            return;
        }

        if (this._cacheDestWidth === destWidth && this._cacheDestHeight === destHeight) {
            if (options.logLevel > 2) {
                console.log("imageScale - DEBUG NOTICE: The parent size hasn't changed: dest width: '"+destWidth+"' - dest height: '"+destHeight+"'.", element);
            }
        }

        var sourceWidth = this.imgWidth,
            sourceHeight = this.imgHeight;

        if (!(destWidth && destHeight && sourceWidth && sourceHeight)) {
            if (options.logLevel > 0) {
                console.error("imageScale - DEBUG ERROR: The dimensions are incorrect: source width: '"+sourceWidth+"' - source height: '"+sourceHeight+"' - dest width: '"+destWidth+"' - dest height: '"+destHeight+"'.", element);
            }
            return;
        }

        this._cacheDestWidth = destWidth;
        this._cacheDestHeight = destHeight;

        var layout = this._innerFrameForSize(scale, align, sourceWidth, sourceHeight, destWidth, destHeight);

        if (widthOffset){
            layout.x -= widthOffset/2;
        }

        if (heightOffset){
            layout.y -= heightOffset/2;
        }

        element.style.position = 'absolute';
        element.style.top = layout.y+'px';
        element.style.left = layout.x+'px';
        element.style.width = layout.width+'px';
        element.style.height = layout.height+'px';
        element.style.maxWidth = 'none';
        
        if(hotSpot){
            hotSpot.style.top =  ((hotSpotPoint[1] * (layout.height / sourceHeight)) + (layout.y)) + 'px';
            hotSpot.style.left = ((hotSpotPoint[0] * (layout.width / sourceWidth)) + (layout.x)) + 'px';
        }

        if (firstTime && fadeInDuration) {
            element.style.display = 'none';
            //element.fadeIn(fadeInDuration);
        }

    },

    /**
     Removes the data from the element.

     Here is an example on how you can call the destroy method:

     $image.imageScale('destroy');

     */
    destroy: function() {
        this._isDestroyed = true;
        this.element.removeAttribute('imageScale');
    },

    /**
     @private

     Returns a frame (x, y, width, height) fitting the source size (sourceWidth & sourceHeight) within the
     destination size (destWidth & destHeight) according to the align and scale properties.

     @param {String} scale
     @param {String} align
     @param {Number} sourceWidth
     @param {Number} sourceHeight
     @param {Number} destWidth
     @param {Number} destHeight
     @returns {Object} the inner frame with properties: { x: value, y: value, width: value, height: value }
     */
    _innerFrameForSize: function(scale, align, sourceWidth, sourceHeight, destWidth, destHeight) {
        var scaleX,
            scaleY,
            result;

        // Fast path
        result = { x: 0, y: 0, width: destWidth, height: destHeight };

        if (scale === this.FILL){
            return result;
        }

        // Determine the appropriate scale
        scaleX = destWidth / sourceWidth;
        scaleY = destHeight / sourceHeight;

        switch (scale) {
            case this.BEST_FIT_DOWN_ONLY:
                if (scale !== this.BEST_FIT_DOWN_ONLY && this.options.logLevel > 1) {
                    console.warn("imageScale - DEBUG WARNING: The scale '"+scale+"' was not understood.");
                }

                if ((sourceWidth > destWidth) || (sourceHeight > destHeight)) {
                    scale = scaleX < scaleY ? scaleX : scaleY;
                } else {
                    scale = 1.0;
                }
                break;
            case this.BEST_FIT:
                scale = scaleX < scaleY ? scaleX : scaleY;
                break;
            case this.NONE:
                scale = 1.0;
                break;
            //case this.BEST_FILL:
            default:
                scale = scaleX > scaleY ? scaleX : scaleY;
                break;
        }

        sourceWidth *= scale;
        sourceHeight *= scale;
        result.width = Math.round(sourceWidth);
        result.height = Math.round(sourceHeight);

        // Align the image within its frame
        switch (align) {
            case this.ALIGN_LEFT:
                result.x = 0;
                result.y = (destHeight / 2) - (sourceHeight / 2);
                break;
            case this.ALIGN_RIGHT:
                result.x = destWidth - sourceWidth;
                result.y = (destHeight / 2) - (sourceHeight / 2);
                break;
            case this.ALIGN_TOP:
                result.x = (destWidth / 2) - (sourceWidth / 2);
                result.y = 0;
                break;
            case this.ALIGN_BOTTOM:
                result.x = (destWidth / 2) - (sourceWidth / 2);
                result.y = destHeight - sourceHeight;
                break;
            case this.ALIGN_TOP_LEFT:
                result.x = 0;
                result.y = 0;
                break;
            case this.ALIGN_TOP_RIGHT:
                result.x = destWidth - sourceWidth;
                result.y = 0;
                break;
            case this.ALIGN_BOTTOM_LEFT:
                result.x = 0;
                result.y = destHeight - sourceHeight;
                break;
            case this.ALIGN_BOTTOM_RIGHT:
                result.x = destWidth - sourceWidth;
                result.y = destHeight - sourceHeight;
                break;
            default: // this.ALIGN_CENTER
                if (align !== this.ALIGN_CENTER && this.options.logLevel > 1) {
                    console.warn("imageScale - DEBUG WARNING: The align '"+align+"' was not understood.");
                }
                result.x = (destWidth / 2) - (sourceWidth / 2);
                result.y = (destHeight / 2) - (sourceHeight / 2);
        }

        return result;
    },

    /**
     @private

     Determines if the windows size has changed since the last update.

     @returns {Boolean}
     */
    _needUpdate: function(parent) {
        var size = parent.clientHeight + ' ' + parent.clientWidth;

        if (this._lastParentSize !== size) {
            this._lastParentSize = size;
            return true;
        }
        return false;
    },

    /**
     @private

     Schedule a scale update.
     */
    scheduleScale: function() {

        if (this._didScheduleScale){
            return;
        }

        if (window.requestAnimationFrame) {
            var that = this;
            this._didScheduleScale = true;
            // setTimeout important when resizing down if the scrollbar were visible
            requestAnimationFrame(function() { setTimeout(function() { that.scale(); }, 0); });
        }
        else {
            this.scale();
        }
    }
};

Object.prototype.scaleImg = function (options) {

    this.defaults = {
        scale: 'best-fill',
        align: 'center',
        parent: null,
        hotSpot:null,
        hotSpotPoint:null,
        hideParentOverflow: true,
        fadeInDuration: 0,
        rescaleOnResize: true,
        logLevel: 0
    };

    this.mergeObjects = function () {
        if (typeof this.defaults === "object" && typeof options === "object") {
            var obj1Keys = Object.keys(this.defaults);
            var obj2Keys = Object.keys(options);
            for (var i = obj1Keys.length - 1; i >= 0; i--) {
                for (var j = obj2Keys.length - 1; j >= 0; j--) {
                    if (obj2Keys[j] === obj1Keys[i]) {
                        this.defaults[obj1Keys[i]] = options[obj2Keys[j]];
                    }
                }
            }
        }
        return this.defaults;
    };

    for(var i = 0; i < this.length; i++) {
        var that = this[i],
            img = this[i].tagName === 'IMG' ? that : that.getElementsByTagName("img")[0];

        var didLoad = img.complete,
            formattedOpt = this.mergeObjects(),
            loadFunc = function(img) {
                var data = new ImageScale(img, formattedOpt);
                data.scale(true, formattedOpt);
            };

        if (didLoad) {
            loadFunc(img);
        }
        else {
            img.addEventListener('load', function() {
                loadFunc(this);
            });
            img.setAttribute("src", img.getAttribute("src"));
        }
    }

};