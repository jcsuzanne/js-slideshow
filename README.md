# js-slideshow
Slideshow

#CSS

    // Generic slideshow
    //==================
    .mod-slideshow-01 {
        @include absoluteLeft(0,0);
        height:                 100%;
        overflow:               hidden;
        width:                  100%;
        z-index:                0;
        .collection {
            @include absoluteLeft(0,0);
            height:                 100%;
            width:                  100%;
            z-index:                0;
            .slide {
                @include absoluteLeft(0,0);
                height:                 100%;
                width:                  100%;
                &.disabled {
                    visibility:             hidden;
                }
                &.enabled {
                    visibility:             visible;
                }
            }
        }
    }

#JS

    // Slideshow of the home
    //=======================
    Transition.prototype.slideshowGeneric = function(_scope) {
        var
            scope               =   _scope
        ,   $ref                =   scope.$slideshow
        ,   $panels             =   scope.panels
        ,   current             =   parseInt($ref.data('index'))
        ,   next                =   scope.currentIndex
        ,   context             =   _k.getViewport()
        ,   moveX               =   (scope.full)?context.width:scope.$slideshow.width()
        ,   $next               =   $ref.find('.slide').eq(next)
        ,   $current            =   $ref.find('.slide').eq(current)
        ,   timeline            =   new TimelineLite({
                paused : true
            })
        ,   duration            =   1.2
        ;


        if(current!=next)
        {
            scope.locked            =   true;
            // timeline
            //=========
            timeline.kill();

            var
                endCurrent      =   (current>next)?moveX:(moveX*-1)
            ,   startNext       =   (current>next)?(moveX*-1):moveX
            ;

            timeline.call(
                function() {
                    $current.css({
                        'z-index' : 2
                    });
                    $next
                        .css({
                            'z-index' : 3
                        })
                        .removeClass('disabled')
                        .addClass('enabled')
                    ;
                    scope.updateInfo();
                }
            );
            timeline.add(
                [
                    TweenLite.fromTo($current,duration ,{ x : 0 },{ x : endCurrent/1.8 , ease : Expo.easeInOut, force3D:true }),
                    TweenLite.fromTo($next,duration,{ x : startNext },{ x : 0 , ease : Expo.easeInOut, force3D:true })
                ]
            );


            timeline.call(
                function() {
                    scope.locked    =   false;
                    TweenLite.set($current,{clearProps:"all" });
                    TweenLite.set($next,{clearProps:"all" });
                    scope.store();
                    scope.update();
                }
            );

            timeline.restart();
        }

    }