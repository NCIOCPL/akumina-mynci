import { FireWhen } from "../helpers/FireWhen";

const latestMediaWidget_data_loadPhotos = function (_widget, _properties) {
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
            function (_e) {
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

export const latestMediaWidget_callbacks = {
  latestMediaWidget_data_loadPhotos
}