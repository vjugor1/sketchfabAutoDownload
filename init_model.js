//https://sketchfab.com/developers/viewer/examples?sample=Camera%20Animation
// api.focusOnVisibleGeometries(function(err) {
//     if (!err) {
//         window.console.log('Camera recentered');
//     }
// });

var version = '1.12.1';
var iframe = document.getElementById('api-frame');

var uid = '2e99a64c5a90473d93dc153d631c780f';
var screenstaken = 0;
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
                eye: [cameraPosition[currentCamera % cameraPosition.length].eye[0] * initLen * 2,
                cameraPosition[currentCamera % cameraPosition.length].eye[1] * initLen * 2,
                cameraPosition[currentCamera % cameraPosition.length].eye[2] * initLen * 2 + initLen * 0.6]
            };
        } else {
            currentCameraPosition = {
                eye: [cameraPosition[currentCamera % cameraPosition.length].eye[0],
                cameraPosition[currentCamera % cameraPosition.length].eye[1],
                cameraPosition[currentCamera % cameraPosition.length].eye[2]]
            };
        };
        console.log('=> Camera loop ', currentCameraPosition.eye, [0.0, 0.0, initLen * 0.6]);
        api.setCameraLookAt(currentCameraPosition.eye, [0.0, 0.0, initLen * 0.6], 2, function (err) {
            if (err) console.error(err);
            console.log('=> Camera Start Callback');
        });

        api.setCameraLookAtEndAnimationCallback(function (err) {
            if (err) console.error(err);
            console.log('=> Camera End Callback');
            if ((initLen != 0) && (screenstaken <= 4) && (screenstaken > 0)) {
                api.getScreenShot(800, 800, 'image/png', function (err, result) {

                    var anchor = document.createElement('a');
                    anchor.href = result;
                    anchor.download = 'screenshot.png';
                    anchor.innerHTML = '<img width="100" height="100" src=' + result + '>download';
                    saveBase64AsFile(result, uid + '/tst.jpg')

                });
            };
            screenstaken++;
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