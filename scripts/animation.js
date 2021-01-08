import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/build/three.module.js';
import {
    OrbitControls
} from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'https://threejsfundamentals.org/threejs/resources/threejs/r114/examples/jsm/loaders/GLTFLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });

    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    var goodOldTime = 0;
    var actualTime = 0;


    camera.position.set(1.3250406408110678, 104.88500303402239, 20.99895565347296);
    const controls = new OrbitControls(camera, canvas);

    controls.enableRotate = false;
    controls.update();

    renderer.autoClear = false;

    const shadertoyCamera = new THREE.OrthographicCamera(
        -1, // left
        1, // right
        1, // top
        -1, // bottom
        -1, // near,
        0, // far
    );

    const shadertoyScene = new THREE.Scene();
    const plane = new THREE.PlaneBufferGeometry(2, 2);

    const fragmentShader2 = `
    // Hexagone by Martijn Steinrucken aka BigWings - 2019
    // countfrolic@gmail.com
    // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
    // 
    // This started as an idea to do the effect below, but with hexagons:
    // https://www.shadertoy.com/view/wdlGRM
    //
    // Turns out that really doesn't look very nice so I just made it
    // into a dance party instead ;)
    //
    // Music: https://soundcloud.com/buku/front-to-back
    #include <common>

    uniform vec3 iResolution;
    uniform float iTime;

    #define R3 1.7
    precision lowp float;

    vec4 HexCoords(vec2 uv) {
        vec2 s = vec2(1, R3);
        vec2 h = .5*s;

        vec2 gv = s*uv;
        
        vec2 a = mod(gv, s)-h;
        vec2 b = mod(gv+h, s)-h;
        
        vec2 ab = dot(a,a)<dot(b,b) ? a : b;
        vec2 st = ab;
        vec2 id = gv-ab;
        
    // ab = abs(ab);
        //st.x = .5-max(dot(ab, normalize(s)), ab.x);
        st = ab;
        return vec4(st, id);
    }

    float GetSize(vec2 id, float seed) {
        float d = length(id);
        float t = iTime*.5;
        float a = sin(d*seed+t)+sin(d*seed*seed*10.+t*2.);
        return a/2. +.5;
    }

    mat2 Rot(float a) {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    float Hexagon(vec2 uv, float r, vec2 offs) {
        
        uv *= Rot(mix(0., 3.1415, r));
        
        r /= 1./sqrt(2.);
        uv = vec2(-uv.y, uv.x);
        uv.x *= R3;
        uv = abs(uv);
        
        vec2 n = normalize(vec2(1,1));
        float d = dot(uv, n)-r;
        d = max(d, uv.y-r*.707);
        
        d = smoothstep(.06, .02, abs(d));
        
        d += smoothstep(.1, .09, abs(r-.5))*sin(iTime);
        return d;
    }

    float Xor(float a, float b) {
        return a+b;
        //return a*(1.-b) + b*(1.-a);
    }

    float Layer(vec2 uv, float s) {
        vec4 hu = HexCoords(uv*2.);

        float d = Hexagon(hu.xy, GetSize(hu.zw, s), vec2(0));
        vec2 offs = vec2(1,0);
        d = Xor(d, Hexagon(hu.xy-offs, GetSize(hu.zw+offs, s), offs));
        d = Xor(d, Hexagon(hu.xy+offs, GetSize(hu.zw-offs, s), -offs));
        offs = vec2(.5,.8725);
        d = Xor(d, Hexagon(hu.xy-offs, GetSize(hu.zw+offs, s), offs));
        d = Xor(d, Hexagon(hu.xy+offs, GetSize(hu.zw-offs, s), -offs));
        offs = vec2(-.5,.8725);
        d = Xor(d, Hexagon(hu.xy-offs, GetSize(hu.zw+offs, s), offs));
        d = Xor(d, Hexagon(hu.xy+offs, GetSize(hu.zw-offs, s), -offs));
        
        return d;
    }

    float N(float p) {
        return fract(sin(p*123.34)*345.456);
    }

    vec3 Col(float p, float offs) {
        float n = N(p)*1234.34;
        
        return sin(n*vec3(12.23,45.23,56.2)+offs*3.)*.5+.5;
    }

    vec3 GetRayDir(vec2 uv, vec3 p, vec3 lookat, float zoom) {
        vec3 f = normalize(lookat-p),
            r = normalize(cross(vec3(0,1,0), f)),
            u = cross(f, r),
            c = p+f*zoom,
            i = c + uv.x*r + uv.y*u,
            d = normalize(i-p);
        return d;
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
        vec2 UV = fragCoord.xy/iResolution.xy-.5;
        float duv= dot(UV, UV);
        //vec2 m = iMouse.xy/iResolution.xy-.5;
        vec2 m = vec2(1.);

        float t = iTime*.2+m.x*10.+5.;
        
        float y = sin(t*.5);//+sin(1.5*t)/3.;
        vec3 ro = vec3(0, 20.*y, -5);
        vec3 lookat = vec3(0,0,-10);
        vec3 rd = GetRayDir(uv, ro, lookat, 1.);
        
        vec3 col = vec3(0);
        
        vec3 p = ro+rd*(ro.y/rd.y);
        float dp = length(p.xz);
        
        if((ro.y/rd.y)>0.)
            col *= 0.;
        else {
            uv = p.xz*.1;

            uv *= mix(1., 5., sin(t*.5)*.5+.5);

            uv *= Rot(t);
            m *= Rot(t);

            uv.x *= R3;
            

            for(float i=0.; i<1.; i+=1./3.) {
                float id = floor(i+t);
                float t = fract(i+t);
                float z = mix(5., .1, t);
                float fade = smoothstep(0., .3, t)*smoothstep(1., .7, t);

                col += fade*t*Layer(uv*z, N(i+id))*Col(id,duv);
            }
        }
        col *= 2.;
        
        if(ro.y<0.) col = 1.-col;
        
        col *= smoothstep(18., 5., dp);
        col *= 1.-duv*2.;
        fragColor = vec4(col,1.0);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `;

    const uniformsBackground = {
        iTime: {
            value: 0
        },
        iResolution: {
            value: new THREE.Vector3()
        },
    };
    const material = new THREE.ShaderMaterial({
        fragmentShader: fragmentShader2,
        uniforms: uniformsBackground,
    });
    shadertoyScene.add(new THREE.Mesh(plane, material));

    const scene = new THREE.Scene();

    //varible init
    var planeFaders = null;
    var planeScreen = null;
    const raycaster = new THREE.Raycaster();
    var faders = [];
    var potards = [];
    var selectedFader, selectedPotard;
    var offset = new THREE.Vector3();
    var originalPotardMouseX, originalPotardMouseY;
    var originalPotardRotation;
    const potardSensitivity = 14;
    var uniforms;

    //3D model variables
    const faderWidth = 5;
    const spaceBetweenFaders = 11.75;
    const maxFaderPosition = new THREE.Vector3(0, 0.03, 0);
    const minFaderPosition = new THREE.Vector3(0, -4.1, 16.9);
    const minPotardAngle = 0;
    const maxPotardAngle = 5.1;

    //eventCreation
    document.addEventListener("touchmove", onTouchMove, false);
    document.addEventListener("touchstart", onTouchStart, false);
    document.addEventListener("touchend", onTouchEnd, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(5, 10, 2);
        scene.add(light);

        var lightAmbient = new THREE.AmbientLight(0xF0F0F0, 1); // soft white light
        scene.add(lightAmbient);
    }

    {
        // Plane, that helps to determinate an intersection position
        planeFaders = new THREE.Mesh(new THREE.PlaneBufferGeometry(130, 130, 8, 8), new THREE.MeshBasicMaterial({
            color: 0xffffff
        }));
        planeFaders.position.set(0, -1, 0);
        planeFaders.lookAt(0, 1, 0.5);
        planeFaders.visible = false;
        scene.add(planeFaders);
    }

    {
        var vertexShaderText = `
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;

        var fragmentShaderText = `
        #include <common>

        uniform vec3 iResolution;
        uniform float iTime;
        uniform sampler2D waveform;

        vec3 purpleBackground = vec3(96./255., 63./255., 168./255.);
        vec3 yellowFont = vec3(255./255., 249./255., 81./255.);
        vec3 greenMisc = vec3(77./255., 226./255., 160./255.);
        vec3 orangeMisc = vec3(255./255., 249./255., 81./255.);

        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            vec2 uv = fragCoord/iResolution.xy;
            
            vec4 tex = texture2D(waveform, vec2(uv.x,0.5));
            if(uv.y>tex.x && uv.y < 0.5 || uv.y<tex.x && uv.y > 0.5){
                if(mod(iTime,5.) > 2.5){
                    fragColor = vec4(greenMisc, 1.);
                }else{
                    fragColor = vec4(yellowFont, 1.);
                }

                if(mod(iTime,10.) < 0.5 ){
                    fragColor = vec4(purpleBackground, 1.);
                }
                
            }else{
                if(mod(iTime,10.) < 0.5 ){
                    fragColor = vec4(orangeMisc, 1.);
                }else{
                    fragColor = vec4(purpleBackground, 1.);
                }
            }
        }

        varying vec2 vUv;

        void main() {
            mainImage(gl_FragColor, vUv * iResolution.xy);
        }
        `;



        uniforms = {
            iTime: {
                value: 0
            },
            iResolution: {
                value: new THREE.Vector3()
            },
            waveform: {
                type: 't',
                value: 0
            },
        };
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShaderText,
            fragmentShader: fragmentShaderText,
            uniforms,
        });

        planeScreen = new THREE.Mesh(new THREE.PlaneBufferGeometry(15, 10, 8, 8), shaderMaterial);
        var y = -1;
        planeScreen.position.set(51.5, y, -19);
        planeScreen.rotation.set(3 * 3.14 / 2 + 5.925, 0, 0);
        scene.add(planeScreen);
    }

    {
        const gltfLoader = new GLTFLoader();
        var root;
        gltfLoader.load('models/mixer.glb', (gltf) => {
            root = gltf.scene;
            root.position.set(0, -3.75, 0);
            scene.add(root);
            const box = new THREE.Box3().setFromObject(root);

            const boxSize = box.getSize(new THREE.Vector3()).length();
            //const boxCenter = box.getCenter(new THREE.Vector3());
            const boxCenter = new THREE.Vector3(1.3553901638776724, -6.662529599268561, -2.3002362037373625);

            camera.near = boxSize / 100;
            camera.far = boxSize * 100;

            camera.updateProjectionMatrix();

            // update the Trackball controls to handle the new size
            controls.maxDistance = boxSize * 10;
            controls.target.copy(boxCenter);
            //controls.enablePan = false;
            //controls.mouseButtons = { LEFT: THREE.MOUSE.RIGHT, MIDDLE: THREE.MOUSE.MIDDLE, RIGHT: THREE.MOUSE.LEFT };
            controls.update();
        });
    }

    {
        const gltfLoader = new GLTFLoader();
        var root;
        var newFader;
        gltfLoader.load('models/fader.glb', (gltf) => {
            for (let i = 0; i <= 7; i++) {
                newFader = gltf.scene.clone();
                //newFader.position.set(-41+spaceBetweenFaders*aYeahThisNameSucks,0,0);
                newFader.position.set(-45.75 + spaceBetweenFaders * i, 0, 1.2);
                newFader.name = i + 1;
                faders.push(newFader);
                scene.add(newFader);
            }
        });
    }

    {
        const gltfLoader = new GLTFLoader();
        var root;
        var newPotard;
        gltfLoader.load('models/potard.glb', (gltf) => {
            for (let i = 0; i <= 7; i++) {
                newPotard = gltf.scene.clone();
                newPotard.name = i + 1;
                newPotard.position.set(-45.75 + faderWidth / 2 + spaceBetweenFaders * i, -1, -19);
                newPotard.rotation.set(5.925, 0, 0);
                potards.push(newPotard);
                scene.add(newPotard);
            }
        });
    }

    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };

    function onDocumentMouseDown(event) {
        var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseEventStart(mouseX, mouseY);
    }

    function onDocumentMouseMove(event) {
        var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseEventMove(mouseX, mouseY);
    }

    function onTouchStart(event) {
        var mouseX = ((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length - 1].pageX) / window.innerWidth) * 2 - 1;
        var mouseY = -((event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length - 1].pageY) / window.innerHeight) * 2 + 1;
        var vector = new THREE.Vector3(mouseX, mouseY, 1);
        vector.unproject(camera);
        raycaster.set(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObject(planeFaders);
        planeFaders.position.copy(intersects[0].point);
        mouseEventStart(mouseX, mouseY);
    }

    function onTouchMove(event) {
        var mouseX = ((event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length - 1].pageX) / window.innerWidth) * 2 - 1;
        var mouseY = -((event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length - 1].pageY) / window.innerHeight) * 2 + 1;
        mouseEventMove(mouseX, mouseY)
    }

    function onTouchEnd(event) {
        mouseEventEnd(event);
    }

    function onDocumentMouseUp(event) {
        mouseEventEnd(event);
    }

    function mouseEventStart(mouseX, mouseY) {
        // Get 3D vector from 3D mouse position using 'unproject' function
        var vector = new THREE.Vector3(mouseX, mouseY, 1);
        vector.unproject(camera);
        // Set the raycaster position
        raycaster.set(camera.position, vector.sub(camera.position).normalize());
        // Find all intersected faders
        var intersects = raycaster.intersectObjects(faders, true);
        if (intersects.length > 0) {
            // Disable the controls
            controls.enabled = false;
            // Set the selectedFader - first intersected object
            selectedFader = intersects[0].object;
            //selectedFader.position = intersects[0].object.point;
            // Calculate the offset
            var intersects = raycaster.intersectObject(planeFaders);
            offset.copy(intersects[0].point).sub(planeFaders.position);
            return;
        }

        var intersects = raycaster.intersectObjects(potards, true);
        if (intersects.length > 0) {
            controls.enabled = false;
            selectedPotard = intersects[0].object.parent;
            originalPotardMouseX = mouseX;
            originalPotardMouseY = mouseY;
            originalPotardRotation = selectedPotard.rotation.z;
        }
    }

    function mouseEventMove(mouseX, mouseY) {
        // Get 3D vector from 3D mouse position using 'unproject' function
        var vector = new THREE.Vector3(mouseX, mouseY, 1);
        vector.unproject(camera);
        // Set the raycaster position
        raycaster.set(camera.position, vector.sub(camera.position).normalize());
        if (selectedFader) {
            var intersects = raycaster.intersectObject(planeFaders);
            // Reposition the object based on the intersection point with the planeFaders
            if (intersects.length > 0) {
                var oldXPosition = selectedFader.position.x;
                if (selectedFader.position.z < 10) {
                    selectedFader.position.copy(intersects[0].point.sub(offset));
                    selectedFader.position.set(oldXPosition, Math.min(selectedFader.position.y, maxFaderPosition.y), Math.max(selectedFader.position.z, maxFaderPosition.z));
                } else {
                    selectedFader.position.copy(intersects[0].point.sub(offset));
                    selectedFader.position.set(oldXPosition, Math.max(selectedFader.position.y, minFaderPosition.y), Math.min(selectedFader.position.z, minFaderPosition.z));
                }
                var faderLevel = ((selectedFader.position.z - minFaderPosition.z) / (maxFaderPosition.z - minFaderPosition.z));
                adjustVolume(selectedFader.parent.name, faderLevel);
            }
        } else if (selectedPotard) {
            var deltaAngle = potardSensitivity * (mouseX - originalPotardMouseX) + originalPotardRotation;

            if (selectedPotard.rotation.z < 3.14) {
                selectedPotard.rotation.set(3.14 / 2, 0, Math.max(deltaAngle, minPotardAngle));
            } else {
                selectedPotard.rotation.set(3.14 / 2, 0, Math.min(deltaAngle, maxPotardAngle));
            }

            var potardLevel = ((selectedPotard.rotation.z - minPotardAngle) / (maxPotardAngle - minPotardAngle));
            adjustEffect(selectedPotard.parent.name, potardLevel);
        } else {
            var intersects = raycaster.intersectObjects(faders, true);
            if (intersects.length > 0) {
                planeFaders.position.copy(intersects[0].object.position);
            }
        }
    }

    function mouseEventEnd(event) {
        controls.enabled = true;
        selectedFader = null;
        selectedPotard = null;
        offset = new THREE.Vector3(0, 0, 0);
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        if (isMusicPlaying) {
            actualTime += (time - goodOldTime) * 0.001; // convert to seconds
        }


        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        if (analyser != null && dataArray != undefined && isMusicPlaying) {
            analyser.getByteTimeDomainData(dataArray);

            var awidth = analyser.fftSize;
            var aheight = 1;

            var size = awidth * aheight;
            var data = new Uint8Array(3 * size);

            for (var i = 0; i < size; i++) {

                var r = dataArray[i];
                var g = dataArray[i];
                var b = dataArray[i];

                var stride = i * 3;

                data[stride] = r;
                data[stride + 1] = g;
                data[stride + 2] = b;

            }

            var texture = new THREE.DataTexture(data, awidth, aheight, THREE.RGBFormat);

            uniforms.iResolution.value.set(20, 10, 1);
            uniforms.iTime.value = actualTime;
            uniformsBackground.iTime.value = actualTime;
            uniforms.waveform.value = texture;

            uniformsBackground.iResolution.value.set(canvas.width, canvas.height, 1);
        }

        if (!isMobileDevice()) {
            renderer.render(shadertoyScene, shadertoyCamera);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        goodOldTime = time;
    }

    requestAnimationFrame(render);
}

main();