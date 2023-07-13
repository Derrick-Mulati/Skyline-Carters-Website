angular.module('colorsApp', []).controller('colorsController', function($scope){
  $scope.palettes = [ {name:"Windows Phones", colors: ['#a4c400','#60a917','#008a00','#00aba9','#1ba1e2','#0050ef','#6a00ff','#aa00ff','#f472d0','#d80073','#a20025','#e51400','#fa6800','#f0a30a','#d8c100','#825a2c','#6d8764','#7a3b3f','#647687','#76608a']},
                      {name:"Tango Desktop Project", colors: ['#fce94f','#edd400','#c4a000','#fcaf3e','#f57900','#ce5c00','#e9b96e','#c17d11','#8f5902','#8ae234','#73d216','#4e9a06','#729fcf','#3465a4','#204a87','#ad7fa8','#75507b','#5c3566','#ef2929','#cc0000','#a40000','#eeeeec','#d3d7cf','#babdb6','#888a85','#555753','#2e3436']},
                      {name:"Fedora", colors: ['#19aeff','#0047c8','#005c94','#ccff42','#9ade00','#009100','#ffff3e','#ff9900','#ff6600','#eccd84','#d49725','#804d00','#ff4141','#dc0000','#b50000','#f1caff','#d76cff','#ba00ff','#bdcdd4','#9eabb0','#364e59','#0e232e','#cccccc','#999999','#666666','#2d2d2d']},
                      {name:"Open suse", colors: ['#fcb11c','#e35302','#ffff66','#b2b247','#91d007','#217808','#d4c4ff','#4d4466','#5080ff','#000074','#babdb6','#2e3436','#ff4d4d','#8c0000']},
                      {name:"Jack Production", colors: ['#8fca40','#fff43b','#f29524','#f04090','#916ab1','#55b9fc' ]},
                      {name:"iOs 7 Palette", colors: ['#8e8e93','#ff2252','#ff342f','#ff9422','#ffcc34','#2ada70','#48c9f8','#10abda','#007afa','#5855d1']},
                      //{name:"Nimber Palette", colors: ['#c83321','#ffffff','#363C43','#808A9d','#b8c0ce','#a41807','#f2f2f2','#21262d','#6d788c','#95a0b4','#fec411','#ffb900','#72c700','#f4511e','#46a6eb','#e5a904','#e5a904','#5a9d00','#c73608','#1979be']},
                      {name:"Pantone Spring 2016", colors: ['#f7cac9','#f7786b','#91a8d0','#034f84','#fae03c','#98ddde','#9896a4','#dd4132','#b18f6a','#79c753']},
                    ];

  $scope.numOfShades = 10;
  $scope.shades = [];
  $scope.useCustomPalette = function(){
    $scope.selectedPalette = $scope.customPalette.split(",");
    for(var i = 0; i<$scope.selectedPalette.length; i++){
      if(!$scope.selectedPalette[i].startsWith("#"))
        $scope.selectedPalette[i] = "#" + $scope.selectedPalette[i];
    }

    changePalette();
  };

  $scope.choosePalette = function(paletteIndex){
    $scope.selectedPalette = $scope.palettes[paletteIndex].colors;
    changePalette();
  };

  $scope.changeNumOfShades = function(){
    changePalette();
  };

  var changePalette = function(){
      $scope.shades = [];
      for(var colorIndex=0; colorIndex<$scope.selectedPalette.length; colorIndex++){
        var shades = [];
        var delta = 1.8/$scope.numOfShades;
        var lum = -0.9;
        for(var i=0; i<$scope.numOfShades; i++){
          if(lum<0.1)
            shades.push(increase_darkness($scope.selectedPalette[colorIndex],lum));
          else
            shades.push(increase_brightness($scope.selectedPalette[colorIndex],lum));
          lum += delta;
        }
        $scope.shades.push(shades);
      }
  };
  $scope.selectedPalette = $scope.palettes[0].colors;
  changePalette();
  
}).filter('guessForegroundColor', function() {
	return function(bgHex) {
      bgHex = String(bgHex).replace(/[^0-9a-f]/gi, '');
      if (bgHex.length < 6) {
        bgHex = bgHex[0] + bgHex[0] + bgHex[1] + bgHex[1] + bgHex[2] + bgHex[2];
      }
      var rgb = parseInt(bgHex, 16);   // convert rrggbb to decimal
    	var r = (rgb >> 16) & 0xff;  // extract red
    	var g = (rgb >>  8) & 0xff;  // extract green
    	var b = (rgb >>  0) & 0xff;  // extract blue

    	var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    	return luma > 164?"#000":"#fff";
	};
});


var increase_darkness = function(hex, lum) {
				// validate hex string
				hex = String(hex).replace(/[^0-9a-f]/gi, '');
				if (hex.length < 6) {
					hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
				}
				lum = lum || 0;

				// convert to decimal and change luminosity
				var rgb = "#", c, i;
				for (i = 0; i < 3; i++) {
					c = parseInt(hex.substr(i * 2, 2), 16);
					c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
					rgb += ("00" + c).substr(c.length);
				}
				return rgb;
			};

var increase_brightness = function(hex, lum){
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);
    return '#' +
       pad(((0|(1<<8) + r + (256 - r) * lum).toString(16)).substr(1)) +
       pad(((0|(1<<8) + g + (256 - g) * lum).toString(16)).substr(1)) +
       pad(((0|(1<<8) + b + (256 - b) * lum).toString(16)).substr(1));
};

var pad = function(n) {
    return (n <10) ? ("0" + n) : n;
};