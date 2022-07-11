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

    let cube1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1));
    let cuboid1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,2), cube2_material);
    cube1.updateMatrix();
    cuboid1.updateMatrix();
    let bspA = CSG.fromMesh( cube1 );
    let bspB = CSG.fromMesh( cuboid1 );
    let bspResult = bspA.subtract(bspB);
    meshResult = CSG.toMesh( bspResult, cube1.matrix, cube1_material );
    scene.add( meshResult );

    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 3;

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

    const targetQuaternion = new THREE.Quaternion();
    targetQuaternion.random();
    targetQuaternion.normalize();
    const clock = new THREE.Clock();
    const speed = 2;

    function render() {
        renderer.render( scene, camera );
    }

    function animate() {
        scene.remove( meshResult );
        const delta = clock.getDelta();
        if ( ! cuboid1.quaternion.equals( targetQuaternion ) ) {
            const step = 0.5 * delta;
            cuboid1.quaternion.rotateTowards( targetQuaternion, step );
        }
        else {
            targetQuaternion.random();
            targetQuaternion.normalize();
            iFrame = 0;
        }
        cuboid1.updateMatrix();
        let bspA = CSG.fromMesh( cube1 );
        let bspB = CSG.fromMesh( cuboid1 );
        let bspResult = bspA.subtract(bspB);
        meshResult = CSG.toMesh( bspResult, cube1.matrix, cube1_material );
        scene.add( meshResult );
        render();

        requestAnimationFrame( animate );
    }

    animate();
}
