//https://sketchfab.com/developers/viewer/examples?sample=Camera%20Animation
var version = '1.12.1';
var iframe = document.getElementById('api-frame');
var uid = '7w7pAfrCfjovwykkEeRFLGw5SXS';
var easings;
var cameraPosition;
var client = new window.Sketchfab(version, iframe);
var error = function error() {
    console.error('Sketchfab API error');
};
function saveBase64AsFile(base64, fileName) {
    var link = document.createElement("a");
    document.body.appendChild(link); // for Firefox
    link.setAttribute("href", base64);
    link.setAttribute("download", fileName);
    link.click();
}
var success = function success(api) {
    var target = [0.0, 0.0, 0.0];
    var currentCamera = 0;
    var _loop;
    var _podzaloop;

    _loop = function loop() {
        api.setCameraLookAt([2, 0, 0], target, 0, function (err) {
            if (err) console.error(err);
            console.log('=> Camera Start Callback hardcode side');
        });
        api.getScreenShot(800, 800, 'image/png', function (err, result) {

            var anchor = document.createElement('a');
            anchor.href = result;
            anchor.download = 'screenshot.png';
            anchor.innerHTML = '<img width="100" height="100" src=' + result + '>download';
            saveBase64AsFile(result, 'tst1.jpg')

        });

    };
    _podzaloop = function podazoop() {
        api.setCameraLookAt([0, -2, 0], target, 0, function (err) {
            if (err) console.error(err);
            console.log('=> Camera Start Callback hardcode side');
        });

        api.getScreenShot(800, 800, 'image/png', function (err, result) {

            var anchor = document.createElement('a');
            anchor.href = result;
            anchor.download = 'screenshot.png';
            anchor.innerHTML = '<img width="100" height="100" src=' + result + '>download';

            saveBase64AsFile(result, 'tst2.jpg')

        });
    };


    api.start(function () {
        api.addEventListener('viewerready', function () {


            api.setCameraLookAt([2, 0, 0], target, 0, function (err) {
                if (err) console.error(err);
                console.log('=> Camera Start Callback hardcode front');
            });
            api.getScreenShot(800, 800, 'image/png', function (err, result) {

                var anchor = document.createElement('a');
                anchor.href = result;
                anchor.download = 'screenshot.png';
                anchor.innerHTML = '<img width="100" height="100" src=' + result + '>download';
                saveBase64AsFile(result, 'tst3.jpg');

            });

            setTimeout(_loop, 0);

        });
    });
};
client.init(uid, {
    success: success,
    error: error,
    preload: 1,
    autotsart: 1,
    camera: 0
});
easings = ['easeLinear', 'easeOutQuad', 'easeInQuad', 'easeInOutQuad', 'easeOutCubic', 'easeInCubic', 'easeInOutCubic', 'easeOutQuart', 'easeInQuart', 'easeInOutQuart', 'easeOutQuintic', 'easeInQuintic', 'easeInOutQuintic', 'easeOutSextic', 'easeInSextic', 'easeInOutSextic', 'easeOutSeptic', 'easeInSeptic', 'easeInOutSeptic', 'easeOutOctic', 'easeInOctic', 'easeInOutOctic', 'easeOutBack', 'easeInBack', 'easeInOutBack', 'easeOutCircle', 'easeInCircle', 'easeInOutCircle', 'easeOutElastic', 'easeInElastic', 'easeInOutElastic', 'easeOutBounce', 'easeInBounce', 'easeInOutBounce'];
cameraPosition = [{
    eye: [0, -2, 0]
}, {
    eye: [0, -2, 0]
}, {
    eye: [2, 0, 0]
},
{
    eye: [2, 0, 0]
}
];