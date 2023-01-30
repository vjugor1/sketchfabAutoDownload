//https://sketchfab.com/developers/viewer/examples?sample=Camera%20Animation
// api.focusOnVisibleGeometries(function(err) {
//     if (!err) {
//         window.console.log('Camera recentered');
//     }
// });

var version = '1.12.1';
var iframe = document.getElementById('api-frame');

var uid = '5d28dd1739e54d8f9cd74f16d1b52b58'; // gryphon
// var uid = '2e99a64c5a90473d93dc153d631c780f'; //wardobe
// var uid = '7w7pAfrCfjovwykkEeRFLGw5SXS'; //guy
// var uid = '8bf24790f55e47a28fd53029eed9367d'; // billy poster

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
    // console.log("Initial position", init_pos)
    var _loop;
    var initPosReg = false;
    var initLen = 0;
    _loop = function loop() {
        if (!initPosReg) {
            api.getCameraLookAt(function (err, camera) {
                // console.log(camera.position); // [x, y, z]
                // console.log(camera.target); // [x, y, z]

                initLen = Math.sqrt((camera.position[0]) * (camera.position[0]) +
                    (camera.position[1]) * (camera.position[1]) +
                    (camera.position[2]) * (camera.position[2]));
                console.log("Init Length", initLen);
                initPosReg = true;
            });
        }
        // console.log("currentCamera = ", currentCamera);
        if (initLen != 0) {
            currentCameraPosition = {
                eye: [cameraPosition[currentCamera % cameraPosition.length].eye[0] * initLen,
                cameraPosition[currentCamera % cameraPosition.length].eye[1] * initLen,
                cameraPosition[currentCamera % cameraPosition.length].eye[2] * initLen + initLen * 0.3]
            };
        } else {
            currentCameraPosition = {
                eye: [cameraPosition[currentCamera % cameraPosition.length].eye[0],
                cameraPosition[currentCamera % cameraPosition.length].eye[1],
                cameraPosition[currentCamera % cameraPosition.length].eye[2]]
            };
        };
        console.log('=> Camera loop ', currentCameraPosition.eye, target);
        api.setCameraLookAt(currentCameraPosition.eye, target, 2, function (err) {
            if (err) console.error(err);
            console.log('=> Camera Start Callback');
        });

        api.setCameraLookAtEndAnimationCallback(function (err) {
            if (err) console.error(err);
            console.log('=> Camera End Callback');
            // api.getScreenShot(800, 800, 'image/png', function (err, result) {

            //     var anchor = document.createElement('a');
            //     anchor.href = result;
            //     anchor.download = 'screenshot.png';
            //     anchor.innerHTML = '<img width="100" height="100" src=' + result + '>download';
            //     saveBase64AsFile(result, 'tst.jpg')

            // });

            setTimeout(_loop, 5000);
        });
        currentCamera++;
        // api.setCameraEasing(easings[Math.floor(Math.random() * easings.length)]);

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
    eye: [0, -1, 0]
}, {
    eye: [1, 0, 0]
}, {
    eye: [0, 1, 0]
},
{
    eye: [-1, 0, 0]
}
];