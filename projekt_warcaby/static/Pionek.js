class Piece extends THREE.Mesh{
    constructor(texture, mesh){
        if(arguments.length==1){
            var geometry = new THREE.CylinderGeometry(40,40,20,40)
            var mesh = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, map: new THREE.TextureLoader().load(texture)})
            super(geometry, mesh) 
        }else{
            super(texture,mesh.clone())
        }
        this._color=null
    }
    
    set color(val){
        this._color=val
        this.material.color.setHex(val)
    }
    get color(){
        return this._color
    }
}