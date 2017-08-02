<div style="margin: 0 auto;" class="metaslider metaslider-flex metaslider-<?php echo $gallery_id; ?> ml-slider nav-hidden">
    <style type="text/css" id="metaslider-css-<?php echo $gallery_id; ?>">
        #metaslider_<?php echo $gallery_id; ?>_filmstrip.flexslider .slides li {margin-right: 5px;}
    </style>
    <div id="metaslider_container_<?php echo $gallery_id; ?>">
        <div id="metaslider_<?php echo $gallery_id; ?>" class="flexslider">
            <ul class="slides">
              <?php if(!empty($images['full'])): ?>
             
              <?php echo implode(' ', $images['full']); ?>
              
              <?php endif; ?>
             
            </ul>
        </div>
                <div id="metaslider_<?php echo $gallery_id; ?>_filmstrip" class="flexslider filmstrip">
            <ul class='slides'>
              <?php if(!empty($images['thumbs'])): ?>
             
              <?php echo implode(' ', $images['thumbs']); ?>
              
              <?php endif; ?>
            </ul>
        </div>
    </div>
    <script type="text/javascript">
        var metaslider_<?php echo $gallery_id; ?> = function($) {
            
            $('#metaslider_<?php echo $gallery_id; ?>_filmstrip').flexslider({
                 animation: 'slide',
                 controlNav: false,
                 animationLoop: false,
                 slideshow: false,
                 itemWidth: 70,
                 itemMargin: 5,
                 asNavFor: '#metaslider_<?php echo $gallery_id; ?>'
            });
            $('#metaslider_<?php echo $gallery_id; ?>').flexslider({ 
                slideshowSpeed:3000,
                animation:"slide",
                controlNav:false,
                directionNav:true,
                pauseOnHover:true,
                direction:"horizontal",
                reverse:false,
                animationSpeed:600,
                prevText:"&lt;",
                nextText:"&gt;",
                easing:"linear",
                slideshow:false,
                sync:'#metaslider_<?php echo $gallery_id; ?>_filmstrip',
                useCSS:false
            });
        };
        var timer_metaslider_<?php echo $gallery_id; ?> = function() {
            var slider = !window.jQuery ? window.setTimeout(timer_metaslider_<?php echo $gallery_id; ?>, 100) : !jQuery.isReady ? window.setTimeout(timer_metaslider_<?php echo $gallery_id; ?>, 1) : metaslider_<?php echo $gallery_id; ?>(window.jQuery);
        };
        timer_metaslider_<?php echo $gallery_id; ?>();
    </script>
</div>