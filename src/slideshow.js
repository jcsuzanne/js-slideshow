(function(window, document, undefined) {
    'use strict';

    SITE.slideshow = (function()
    {

        // Slideshow
        //==========
        var Generic = function(_view,_options) {
            this.view           =   (typeof _view != 'undefined')?_view.find('#slideshowInstance'):$(document.getElementById('slideshowInstance'));
            this.settings       =   (typeof _options != 'undefined')?_options:{};
            this.$slideshow     =   this.view.find('.jsSlideshow--collection');
            this.currentIndex   =   (typeof _options.start != 'undefined')?_options.start:0;
            this.full           =   true;
            this.locked         =   false;
            this.items          =   this.$slideshow.find('.jsSlideshow--item');
            this.triggers       =   this.view.find('.jsSlideshow--buttons');
            this.total          =   this.items.length - 1;
            this.interval       =   5000;
            this.timerAutoplay  =   false;
            this.init();
        };
        Generic.prototype = {
            events : function() {
                var
                    __that       =   this
                ;

                if(__that.settings.autoplay == true)
                {
                    __that.timerAutoplay = window.setInterval(function() {
                        __that.currentIndex++;
                        if(__that.currentIndex > __that.total)
                        {
                            __that.currentIndex = 0;
                        }
                        __that.goTo(__that.currentIndex,1);
                    },__that.interval);
                }
                __that.triggers.on('click',function() {
                    if(!__that.locked)
                    {
                        var
                            dir
                        ;
                        if($(this).index() > __that.currentIndex)
                        {
                            dir     =   -1;
                        }
                        else
                        {
                            dir     =   1;
                        }
                        __that.currentIndex   =   $(this).index();
                        API_transition.slideshowGeneric(__that);
                        clearInterval(__that.timerAutoplay);
                    }

                });
                if(isTablet)
                {
                    __that.swipeOn();
                }
            }
            ,
            goTo : function(_index,_dir)
            {
                if(!this.locked)
                {
                    this.currentIndex   =   _index;
                    API_transition.slideshowGeneric(this);
                }
            }
            ,
            goToPrevious : function() {
                if(!this.locked)
                {
                    this.currentIndex--;
                    if(this.currentIndex < 0)
                    {
                        this.currentIndex   =   0;
                    }
                    API_transition.slideshowGeneric(this);
                }
            }
            ,
            goToNext : function() {
                if(!this.locked)
                {
                    this.currentIndex++;
                    if(this.currentIndex > this.total)
                    {
                        this.currentIndex   =   this.total;
                    }
                    API_transition.slideshowGeneric(this);
                }
            }
            ,
            setup : function() {
                this.store();
                if(this.total == 0)
                {
                    this.triggers.addClass('vs-0');
                }
            }
            ,
            store : function() {
                this.$slideshow.data('index',this.currentIndex);
            }
            ,
            swipeOn : function() {
                var
                    refID       =   document.getElementById('main-content')
                ,   __that   =   this
                ;
                Hammer(refID).on("swipeup", function(event) {
                    __that.$next.trigger('click');
                });
                Hammer(refID).on("swipedown", function(event) {
                    __that.$previous.trigger('click');
                });
            }
            ,
            update : function() {
                this.items.removeClass('disabled enabled');
                this.items.css({
                    'z-index' : 0
                }).addClass('disabled');
                this.items.eq(this.currentIndex).css({
                    'z-index':1
                }).removeClass('disabled').addClass('enabled');
            }
            ,
            updateInfo : function()
            {

                this.triggers.removeClass('active');
                this.triggers.eq(this.currentIndex).addClass('active');
                if(typeof this.settings.onUpdate != 'undefined' && typeof this.settings.onUpdate == 'function') this.settings.onUpdate(this.currentIndex,this.items.eq(this.currentIndex));
            }
            ,
            init : function() {
                this.setup();
                this.events();
                this.update();
                this.updateInfo();
            }
        }

        return {
                Generic: Generic
        }
    })();

}(window, document));