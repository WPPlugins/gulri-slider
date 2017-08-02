<?php global $gsp_settings; ?>
    <div id="photoframe"

     class="layout-thumbs thumbs-bottom"

     data-mode="cover"

     data-auto=""

     data-layout="thumbs"

     data-interval="3000"

     data-thumbs-mode="thumbs-bottom"

     data-transition="kenburns"

     data-zoom-enabled="1">



<div id="frame-controls">

    <div id="frame-left">

            </div>

    <div id="frame-center-top">

    </div>

    <div id="frame-center">

        <div id="frame-center-bottom">

        </div>

    </div>

    <div id="frame-right">

            </div>

    <div id="frame-counter">

        <div class="item-count"></div>/        <div class="total-count"></div>

    </div>

    <div class="gallery-buttons">

        



    </div>

</div>





<div id="mobile-controls">

    <a id="mob-prev" href="#" class="mobile-ctrl"><i class="icomoon_icon icon-arrow-left4"></i></a>

    <a id="mob-next" href="#" class="mobile-ctrl"><i class="icomoon_icon icon-arrow-right5"></i></a>

    <a id="mob-zoom" href="#" class="mobile-ctrl"><i class="icomoon_icon icon-zoom-in"></i></a>

</div>



<div id="frame-items">

    <?php if(!empty($images['full'])): ?>

             

              <?php echo implode(' ', $images['full']); ?>

              

              <?php endif; ?>

            

</div>

<!--#frame-items-->

    <div id="frame-thumbs">

                <?php if(!empty($images['thumbs'])): ?>

             

              <?php echo implode(' ', $images['thumbs']); ?>

              

              <?php endif; ?>

                

    </div>

</div>

<style type="text/css">
.fs-skin-dark .info-button-bg .info-title,

.fs-skin-dark .info-button-bg .photo-info-button:before,

.fs-skin-dark .info-button-bg .share-info-button:before,

.fs-skin-dark .info-button-bg .purchase-info-button:before,

.fs-skin-dark #frame-controls > div{

    color: <?php echo $gsp_settings['nav_color']!=''?$gsp_settings['nav_color']:'#ffffff'; ?>;

}

<?php if(is_single()): ?>
	#photoframe.layout-thumbs .photography .image-cover{
		background-size: <?php echo $images['width']!=''?$images['width']:'100%'; ?> <?php echo $images['height']!=''?$images['height']:'auto'; ?>;
	}
<?php endif; ?>
</style>