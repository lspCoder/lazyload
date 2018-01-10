;(function ($, window) {
    $.fn.lazyLoad = function (options) {
        /* 默认选项 */
        var defaultSetting = {
            attr: 'data-src',               //dom属性
            container: document,         //图片容器,传容器id，且容器需要时overflow,有滚动条
            placeholder: 'assets/img/loading.gif',             //图片加载前的loading
            preload: 100,            //预加载的距离
            delay: 500            //延迟加载图片
        }

        var settings = $.extend(defaultSetting, options);

        var isInSight = function (element, scope) {
            var top = element.offsetTop;               
            var scrollTop = $(document).scrollTop();
            var clientHeight = $(window).height();

            return top <= scrollTop + clientHeight  + settings.preload;              //加一百位预加载
        }

        var loadingImg = function (el) {
            var source = $(el).attr(settings.attr);

            var img = new Image();
            img.src = source;

            img.onload = function () {
                el.src = this.src;
                if (img.complete == true) {
                    el.isloaded = true;
                    settings.callback && settings.callback();
                }
            }

            img.onerror = function () {
                el.src = settings.placeholder;
            }
        }

        this.each(function () {
            var self = $(this);
            var imgs = self.find('img');
            [].forEach.call(imgs, function (el) {
                if (el.isloaded) return;
                setTimeout(function () {
                    if (isInSight(el, self)) {
                        loadingImg(el);
                    }
                }, self.get('delay'));

            })
        })


        return this;
    }
}(jQuery, window, undefined))