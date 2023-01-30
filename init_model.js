//https://sketchfab.com/developers/viewer/examples?sample=Camera%20Animation
var version = '1.12.1';
var iframe = document.getElementById('api-frame');
var uid = '8bf24790f55e47a28fd53029eed9367d';
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
    _loop = function loop() {
        currentCamera++;
        console.log("currentCamera = ", currentCamera);
        console.log('=> Camera loop ', cameraPosition[currentCamera % cameraPosition.length].eye, target);
        api.setCameraLookAt(cameraPosition[currentCamera % cameraPosition.length].eye, target, 4, function (err) {
            if (err) console.error(err);
            console.log('=> Camera Start Callback');
        });
        api.setCameraLookAtEndAnimationCallback(function (err) {
            if (err) console.error(err);
            console.log('=> Camera End Callback');
            api.getScreenShot(800, 800, 'image/png', function (err, result) {

                var anchor = document.createElement('a');
                anchor.href = result;
                anchor.download = 'screenshot.png';
                anchor.innerHTML = '<img width="100" height="100" src=' + result + '>download';
                saveBase64AsFile(result, 'tst.jpg')

            });
            setTimeout(_loop, 5000);
        });
        api.setCameraEasing(easings[Math.floor(Math.random() * easings.length)]);
    };
    api.start(function () {
        api.addEventListener('viewerready', function () {
            api.getRootMatrixNode(function (err, nodeID) {
                var direction = 1;
                setInterval(function () {
                    // console.log('translate start');
                    // api.translate(nodeID, [direction * 1, 0, 0, 1], {
                    //     duration: 1,
                    //     easing: easings[Math.floor(Math.random() * easings.length)]
                    // }, function () {
                    //     console.log('translate callback');
                    // });
                    // console.log('rotate start');
                    // api.rotate(nodeID, [Math.PI * 0.05 * direction, 0, 1, 0], {
                    //     duration: direction === -1 ? 2 : 8
                    // }, function () {
                    //     console.log('rotate callback');
                    // });
                }, 1000);
            });
            setTimeout(_loop, 5000);
        });
    });
};
client.init(uid, {
    success: success,
    error: error,
    preload: 1,
    autotsart: 1
});
easings = ['easeLinear', 'easeOutQuad', 'easeInQuad', 'easeInOutQuad', 'easeOutCubic', 'easeInCubic', 'easeInOutCubic', 'easeOutQuart', 'easeInQuart', 'easeInOutQuart', 'easeOutQuintic', 'easeInQuintic', 'easeInOutQuintic', 'easeOutSextic', 'easeInSextic', 'easeInOutSextic', 'easeOutSeptic', 'easeInSeptic', 'easeInOutSeptic', 'easeOutOctic', 'easeInOctic', 'easeInOutOctic', 'easeOutBack', 'easeInBack', 'easeInOutBack', 'easeOutCircle', 'easeInCircle', 'easeInOutCircle', 'easeOutElastic', 'easeInElastic', 'easeInOutElastic', 'easeOutBounce', 'easeInBounce', 'easeInOutBounce'];
cameraPosition = [{
    eye: [0, -2, 0]
}, {
    eye: [2, 0, 0]
}, {
    eye: [0, 2, 0]
},
{
    eye: [-2, 0, 0]
}
];