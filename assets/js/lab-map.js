(function () {
  'use strict';
  window.initializeLabMap = function () {
    if (!window.AMap) return;
    var position = [113.549863, 22.132091];
    var map = new AMap.Map('container', { center: position, zoom: 17 });
    var infoWindow = new AMap.InfoWindow({
      anchor: 'bottom-center',
      content: '<strong>Research Building N21, 1015d</strong><div>University of Macau, Macau SAR, China</div>',
      offset: new AMap.Pixel(0, -30)
    });
    var marker = new AMap.Marker({ position: position, map: map, title: 'AND Lab, University of Macau' });
    marker.on('click', function () { infoWindow.open(map, position); });
    infoWindow.open(map, position);
  };
}());
