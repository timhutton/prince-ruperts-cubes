window.onload = function() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(0, 10, 4);
        scene.add(light);
    }
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.PointLight(color, intensity);
        light.position.set(4, -3, -3);
        scene.add(light);
    }
    {
        const color = 0xFFFFFF;//0x87CEEB;
        const intensity = 0.3;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
    }

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const cube1_material = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    const cube2_material = new THREE.MeshStandardMaterial( { color: 0x0000ff } );
    const cube3_material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );

    let cube1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1));
    let cuboid1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,2));
    let cube2 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), cube2_material);
    let cuboid2 = new THREE.Mesh(new THREE.BoxGeometry(1,1,2), cube3_material);
    cube1.updateMatrix();
    cube2.updateMatrix();
    cuboid1.updateMatrix();
    cuboid2.updateMatrix();
    let bspCube1 = CSG.fromMesh( cube1 );
    let bspCuboid1 = CSG.fromMesh( cuboid1 );
    let bspDrilledCube1 = bspCube1.subtract(bspCuboid1);
    meshDrilledCube1 = CSG.toMesh( bspDrilledCube1, cube1.matrix, cube1_material );
    scene.add( meshDrilledCube1 );
    let bspCube2 = CSG.fromMesh( cube2 );
    let bspCuboid2 = CSG.fromMesh( cuboid2 );
    let bspDrilledCube2 = bspCube2.subtract(bspCuboid2);
    meshDrilledCube2 = CSG.toMesh( bspDrilledCube2, cube2.matrix, cube2_material );
    scene.add( meshDrilledCube2 );

    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 3;
    spinning = true;

    orbit_controls = new THREE.OrbitControls( camera, renderer.domElement );

    renderer.domElement.addEventListener( 'mousemove', render, false );
    renderer.domElement.addEventListener( 'touchmove', render, false );
    renderer.domElement.addEventListener( 'mousedown',  render, false );
    renderer.domElement.addEventListener( 'touchstart',  render, false );
    renderer.domElement.addEventListener( 'mouseup',  render, false );
    renderer.domElement.addEventListener( 'mouseout',  render, false );
    renderer.domElement.addEventListener( 'touchend',  render, false );
    renderer.domElement.addEventListener( 'touchcancel',  render, false );
    renderer.domElement.addEventListener( 'wheel',  render, false );
    
    const targetQuaternion1 = new THREE.Quaternion();
    targetQuaternion1.random();
    targetQuaternion1.normalize();
    
    const targetQuaternion2 = new THREE.Quaternion();
    targetQuaternion2.random();
    targetQuaternion2.normalize();
    
    const clock = new THREE.Clock();
    const speed = 2;

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
        spinning = !spinning;
        if(spinning) clock.start();
        if(!spinning) clock.stop();
    }

    function render() {
        renderer.render( scene, camera );
    }

    function animate() {
        if(spinning) {
            scene.remove( meshDrilledCube1 );
            scene.remove( meshDrilledCube2 );
            const delta = clock.getDelta();
            if ( ! cuboid1.quaternion.equals( targetQuaternion1 ) ) {
                const step = 0.2 * delta;
                cuboid1.quaternion.rotateTowards( targetQuaternion1, step );
                cube2.setRotationFromQuaternion( cuboid1.quaternion );
            }
            else {
                targetQuaternion1.random();
                targetQuaternion1.normalize();
            }
            if ( ! cuboid2.quaternion.equals( targetQuaternion2 ) ) {
                const step = 0.2 * delta;
                cuboid2.quaternion.rotateTowards( targetQuaternion2, step );
            }
            else {
                targetQuaternion2.random();
                targetQuaternion2.normalize();
            }
            cube2.updateMatrix();
            cuboid1.updateMatrix();
            cuboid2.updateMatrix();
            let bspCube1 = CSG.fromMesh( cube1 );
            let bspCuboid1 = CSG.fromMesh( cuboid1 );
            let bspDrilledCube1 = bspCube1.subtract(bspCuboid1);
            meshDrilledCube1 = CSG.toMesh( bspDrilledCube1, cube1.matrix, cube1_material );
            scene.add( meshDrilledCube1 );
            let bspCube2 = CSG.fromMesh( cube2 );
            let bspCuboid2 = CSG.fromMesh( cuboid2 );
            let bspDrilledCube2 = bspCube2.subtract(bspCuboid2);
            meshDrilledCube2 = CSG.toMesh( bspDrilledCube2, cube2.matrix, cube2_material );
            scene.add( meshDrilledCube2 );
            render();
        }

        requestAnimationFrame( animate );
    }

    animate();
}
