import { FireWhen } from "../helpers/FireWhen";

export function latestMediaWidget_callbacks() {

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
        };
    
        // The "Next" button: to remove the class .shoved, show the next image and add the .shoved class
        this.next = function () {
          slider.images.eq(i).removeClass('shown');
          i++;
    
          if (i >= slider.images.length) {
            i = 0;
          }
          slider.images.eq(i).addClass('shown');
        };
    
        // To add next and prev functions when clicking the corresponding buttons
        $(slider.btnPrev).on('click', function () {
          slider.prev();
        });
        $(slider.btnNext).on('click', function () {
          slider.next();
        });
    
        // For the automatic slider: this method calls the next function at the set rate
        if (slider.auto) {
          setInterval(slider.next, slider.rate);
        }
    }
    
    window.LatestMediaWidget_data_loadPhotos = function (widget, properties) {
        if (window['NCI_LatestMediaPhotos_load'] == null) {
            var prefix =
                Akumina.Digispace.ConfigurationContext.FrameworkCDNPrefix +
                '/fe/' +
                Akumina.Digispace.Version;
            var suffix = '?v=' + Akumina.Digispace.SiteContext.ImplementationVersion;
            var slickSliderUrl = prefix + '/vendor/slickslider.min.js' + suffix;
            new Akumina.Digispace.Data.CacheManager()
                .cachedScript(slickSliderUrl)
                .then(
                function () {
                    console.log('success loading ' + slickSliderUrl);
                },
                function (e) {
                    console.log('error loading ' + slickSliderUrl);
                }
                );
            window['NCI_LatestMediaPhotos_load'] = true;
        }

        FireWhen(
          'NCI_LatestMediaPhotos'.toLocaleLowerCase(),
          function () {
            return jQuery().slick != null;
          },
          function () {
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
                autoplayspeed: 5000,
              });
            });
    
            $('.ia-modal-inline-trigger-photo').magnificPopup({
              type: 'inline',
              preloader: false,
              closeBtnInside: true,
              showCloseBtn: true,
              fixedBgPos: true,
              mainClass: 'ak-photo-modal',
            });
            $('.ia-modal-inline-trigger-photo').on('click', function () {
              $('.imagepreview').attr('src', $(this).find('img').attr('src'));
            });
          },
          250
        );
    };
}