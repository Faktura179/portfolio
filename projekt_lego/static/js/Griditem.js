class Griditem extends THREE.Object3D {

    constructor (){
 
        super()
        
        this.isGrid = true

        var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(50, 0, 0));
        geometry.vertices.push(new THREE.Vector3(50, 0, 50));
        geometry.vertices.push(new THREE.Vector3(0, 0, 50));
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));

        var line = new THREE.Line(geometry, lineMaterial);
       
        var geometry = new THREE.PlaneGeometry( 50, 50, 4 );
        var material = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );
        plane.rotation.x = Math.PI / 2
        plane.position.x=25
        plane.position.z=25

        this.add(line)
        this.add(plane)
    }
 }