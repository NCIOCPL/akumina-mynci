Handlebars.registerHelper("ThumbnailImage", function (image, options) {
    if (image != null && image.toLowerCase().indexOf("akumina%20library") == -1){
        var imageSegments = image.split("/");
        imageSegments.splice(imageSegments.length - 1, 0, "_t");
        var fileName = imageSegments[imageSegments.length - 1].toLowerCase();
        var fileNameSegments = fileName.split('.');
        var fileExtValue = fileNameSegments[fileNameSegments.length - 1];
        var fileExtValueSegments = fileExtValue.split("&");
        var fileExt = fileExtValueSegments[0];
        fileName = fileName.replace("." + fileExt,"_" + fileExt + ".jpg");
        imageSegments[imageSegments.length - 1] =  fileName;
        image = imageSegments.join("/");
    }
    return image
});

// Used with the Latest Media Widget / ncifeaturedphotos.html view
Handlebars.registerHelper("MediumThumbnailImage", function (image, exclusion, options) {
    if (image != null && image.toLowerCase().indexOf("akumina%20library") == -1){
        var imagePath = image.split("relativeurl=")[1];
        //var useThumbnail = true;
        //if (exclusion != null && Array.isArray(exclusion)){ // check excluded extensions
        //    var onExclusionList = $.inArray(fileExt, exclusion) > -1;
        //    useThumbnail = !onExclusionList;
        //}
        //if (useThumbnail){

            // To-Do: Change the tenant URL to reference a variable
            image = "https://nih.sharepoint.com/_layouts/15/getpreview.ashx?path=" + imagePath + "&resolution=0";
        //}
    }
    return image
});

function InitializeSlider() {
    
    new Slider({
        images: '.slider-1 img',
        btnPrev: '.slider-1 .buttons .prev',
        btnNext: '.slider-1 .buttons .next',
        auto: true,
        rate: 5000
    });
}


function Slider(obj) {
    this.images = $(obj.images);
    this.auto = obj.auto;
    this.btnPrev = obj.btnPrev;
    this.btnNext = obj.btnNext;
    this.rate = obj.rate || 1000;

    var i = 0;
    var slider = this;

    // The "Previous" button: to remove the class .shoved, show the previous image and add the .shoved class
    this.prev = function () {
        slider.images.eq(i).removeClass('shown');
        i--;

        if (i < 0) {
            i = slider.images.length - 1;
        }
        slider.images.eq(i).addClass('shown');
    }

    // The "Next" button: to remove the class .shoved, show the next image and add the .shoved class
    this.next = function () {
        slider.images.eq(i).removeClass('shown');
        i++;

        if (i >= slider.images.length) {
            i = 0;
        }
        slider.images.eq(i).addClass('shown');
    }

    // To add next and prev functions when clicking the corresponding buttons
    $(slider.btnPrev).on('click', function () {slider.prev(); });
    $(slider.btnNext).on('click', function () { slider.next(); });

    // For the automatic slider: this method calls the next function at the set rate
    if (slider.auto) {
        setInterval(slider.next, slider.rate);
    }
};

window.NCI_LatestMediaPhotos = function(widget, properties){
    if (window["NCI_LatestMediaPhotos_load"] == null){
        var prefix = Akumina.Digispace.ConfigurationContext.FrameworkCDNPrefix + "/fe/" + Akumina.Digispace.Version;
        var suffix = "?v=" + Akumina.Digispace.SiteContext.ImplementationVersion;
        var slickSliderUrl = prefix + "/vendor/slickslider.min.js" + suffix;
        (new Akumina.Digispace.Data.CacheManager).cachedScript(slickSliderUrl).then(function() {
            console.log("success loading " + slickSliderUrl);
        }, function(e) {
            console.log("error loading " + slickSliderUrl);
        })
        window["NCI_LatestMediaPhotos_load"] = true;
    }
    FireWhen("NCI_LatestMediaPhotos".toLocaleLowerCase(), function() {
        return jQuery().slick != null;
    }, function() {
        $(document).ready(function () {
            $('.featuredPhotosSlider').slick({
                dots: true,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
    
                speed: 500,
                fade: true,
                cssEase: 'linear',
    
                autoplay: true,
                autoplayspeed: 5000
            });
        });
    
    
        $('.ia-modal-inline-trigger-photo').magnificPopup({
            type: 'inline',
            preloader: false,
            closeBtnInside: true,
            showCloseBtn: true,
            fixedBgPos: true,
            mainClass: 'ak-photo-modal'
        });
        $('.ia-modal-inline-trigger-photo').on('click', function () {
            $('.imagepreview').attr('src', $(this).find('img').attr('src'));
        });
    }, 250);
}
