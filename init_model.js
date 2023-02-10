//https://sketchfab.com/developers/viewer/examples?sample=Camera%20Animation
// api.focusOnVisibleGeometries(function(err) {
//     if (!err) {
//         window.console.log('Camera recentered');
//     }
// });

var version = '1.12.1';
var iframe = document.getElementById('api-frame');
var iframe1 = document.getElementById('api-frame1');
var iframe2 = document.getElementById('api-frame2');
var uid = 'aa63eefcd48c41d3a9d41e0a32ee6dbb';
var uid1 = 'be035da2e43e4f66a2405fa1508ef293';
var uid2 = '493dddfd34ac4f19aa88ef6281f22459';

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 2;
canvas.height = 2;
var myMaterials;
var getColorAsTextureURL = function getColorAsTextureURL(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 2, 2);
    return canvas.toDataURL('image/png', 1.0);
};
var blackTextureURL = getColorAsTextureURL('black');
var blackTextureUID;

var coeff = 10000;
var date = Date.now();  //or use any other date
date = date + 21000;
var rounded_date = new Date(Math.round(date / coeff) * coeff);
var screenstaken = 0;
var easings;
var cameraPosition;
var client = new window.Sketchfab(version, iframe);
var client1 = new window.Sketchfab(version, iframe1);
var client2 = new window.Sketchfab(version, iframe2);
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
            var local_time = Date.now();
            // console.log(rounded_date);
            sleep(rounded_date - local_time);
            api.getCameraLookAt(function (err, camera) {
                initLen = Math.sqrt((camera.position[0]) * (camera.position[0]) +
                    (camera.position[1]) * (camera.position[1]) +
                    (camera.position[2]) * (camera.position[2]));
                console.log("Init Length", initLen);
                api.getTextureList(function (err, textures) {
                    if (!err) {
                        console.log(textures);
                    }
                });
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
        // api.focusOnVisibleGeometries(function (err) {
        //     if (!err) {
        //         window.console.log('Camera recentered');
        //     }
        // });


        api.setCameraLookAtEndAnimationCallback(function (err) {
            if (err) console.error(err);
            console.log('=> Camera End Callback');
            // console.log('initlen', initLen);
            // console.log('screenstaken', screenstaken);
            if ((initLen != 0) && (screenstaken <= (4 + 2) * 3) && (screenstaken > 0)) {
                if (currentCameraPosition.eye[1] != -1) {
                    api.getScreenShot(800, 800, 'image/png', function (err, result) {
                        var anchor = document.createElement('a');
                        anchor.href = result;
                        anchor.download = 'screenshot.png';
                        anchor.innerHTML = '<img width="100" height="100" src=' + result + '>download';
                        saveBase64AsFile(result, uid + '/tst.jpg')
                    });
                };

            };
            screenstaken++;

            setTimeout(_loop, 8000);
        });
        currentCamera++;
        // api.setCameraEasing(easings[Math.floor(Math.random() * easings.length)]);

    };
    api.start(function () {

        api.addEventListener('viewerready', function () {
            var textures = [];
            api.addTexture(blackTextureURL, function (err, textureId) {
                blackTextureUID = textureId;
            });
            api.getMaterialList(function (err, materials) {
                myMaterials = materials;
                for (var i = 0; i < myMaterials.length; i++) {
                    var m = myMaterials[i];
                    textures[m.name] = m.channels.AlbedoPBR.texture;
                    console.log(m.name, m);
                }
            });
            api.getRootMatrixNode(function (err, nodeID) {
                var direction = 1;
                setInterval(function () {

                }, 2000);
            });
            setTimeout(_loop, 8000);
        });
    });

};

function sleep(miliseconds) {
    const date = Date.now();

    let currentDate = null;
    do {
        currentDate = Date.now();
        // console.log(currentDate - date);
    } while (currentDate - date < miliseconds);
}


client.init(uid1, {
    success: success,
    error: error,
    preload: 1,
    autotsart: 1
});
client1.init(uid, {
    success: success,
    error: error,
    preload: 1,
    autotsart: 1
});
client2.init(uid2, {
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