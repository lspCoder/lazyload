;(function (window, undefined) {
    "use strict"

    /* 私有工具方法 */
    /**
     * 
     * @param {*目标值} dst 
     * @param {*源值} src 
     */
    var extend = function (dst, src) {
        dst = dst || {};
        for (var key in dst) {
            src[key] = dst[key];
        }
        return src;
    }

    /**
     * @description 函数节流
     * @description 也可以使用时间戳
     * @param {*回调函数} fn 
     * @param {*延迟时间} delay 
     */
    // var throttle = function (fn, delay) {
    //     var timer = null;
    //     return function () {
    //         var context = this;
    //         clearTimeout(timer);
    //         timer = setTimeout(function () {
    //             fn.apply(context, arguments);
    //         }, delay);
    //     }
    // }

    /**
     * 函数节流方法
     * @param Function fn 延时调用函数
     * @param Number delay 延迟多长时间
     * @param Number atleast 至少多长时间触发一次
     * @return Function 延迟执行的方法
     */
    var throttle = function (fn, delay, atleast) {
        var timer = null;
        var previous = null;

        return function () {
            var now = +new Date();

            if (!previous) previous = now;

            if (now - previous > atleast) {
                fn();
                // 重置上一次开始时间为本次结束时间
                previous = now;
            } else {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn();
                }, delay);
            }
        }
    };

    /* 默认选项 */
    var defaultSetting = {
        attr: 'data-src',               //dom属性
        container: document,         //图片容器,传容器id，且容器需要时overflow,有滚动条
        placeholder: 'assets/img/loading.gif',             //图片加载前的loading
        preload: 100,            //预加载的距离
        delay: 500            //延迟加载图片
    }

    var lazyLoad = function (options) {
        this.options = options;
        this.init(options);
    }

    /**
     * @description 检测元素是否在可视窗口内
     * @param {*} element 
     * @param {*} scope 
     */
    var isInSight = function (element, scope) {
        var bound = element.getBoundingClientRect();               //The Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
        var clientHeight = window.innerHeight;      //文档可视高度

        // var offsetTop = element.offsetTop;
        // var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        // return offsetTop - scrollTop < clientHeight;

        return bound.top <= clientHeight + scope.options.preload;              //加一百位预加载
    }

    lazyLoad.prototype = {
        constructor: lazyLoad,

        init: function (options) {
            this.options = extend(options, defaultSetting);
            this.checkImgs();
            this.bind();
        },

        bind: function () {
            var container = this.options.container;
            container.onscroll = throttle(this.checkImgs.bind(this), 500);
        },

        get: function (key) {
            return this.options[key];
        },

        /**
         * @description 验证图片
         */
        checkImgs: function () {
            var imgs = document.querySelectorAll('img');
            var self = this;
            [].forEach.call(imgs, function (el) {
                if(el.isloaded) return;
                el.src = self.get('placeholder');
                setTimeout(function () {
                    if (isInSight(el, self)) {
                        self.loadingImg(el);
                    }
                }, self.get('delay'));
                
            })
        },

        /**
         * @description 加载图片
         */
        loadingImg: function (el) {
            var source;
            if (el.dataset) {      //兼容性判断
                source = el.dataset.src;
            } else {
                source = el.getAttribute(this.options.attr);
            }
            var self = this;

            var img = new Image();
            img.src = source;

            img.onload = function () {
                el.src = this.src;
                if (img.complete == true) {
                    el.isloaded = true;
                    self.options.callback && self.options.callback();
                }
            }
            
            img.onerror = function () {
                el.src = self.get('placeholder');
            }
        }

    }


    window.lazyLoad = lazyLoad;
    
}(window, undefined));