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
        const color = 0x87CEEB;
        const intensity = 0.3;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
    }

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );

    {
        let meshA = new THREE.Mesh(new THREE.BoxGeometry(1,1,1));
        let meshB = new THREE.Mesh(new THREE.BoxGeometry(1,1,1));
        meshB.position.add(new THREE.Vector3( 0.5, 0.5, 0.5));
        meshA.updateMatrix();
        meshB.updateMatrix();
        let bspA = CSG.fromMesh( meshA );
        let bspB = CSG.fromMesh( meshB );
        let bspResult = bspA.subtract(bspB);
        let meshResult = CSG.toMesh( bspResult, meshA.matrix, material );
        scene.add( meshResult );
    }

    camera.position.z = 5;
    camera.position.y = 2;
    camera.position.x = 1;

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
    
    function render() {
        renderer.render( scene, camera );
    }
    
    render();
}
