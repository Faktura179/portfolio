class Block extends THREE.Object3D {

    constructor (){
 
       super()
 
      this.isBlock=true
      this.color=0
      this.direction=0
      this.size=0

       // budowa elementów klocka (prostopadłościan i odpowiednia ilość cylindrów)
      var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
       var geometry = new THREE.BoxGeometry( 50, 36, 50 );
       var box = new THREE.Mesh(geometry)
       box.position.y=18
      box.updateMatrix()

       var singleGeometry = new THREE.Geometry();
      singleGeometry.merge(box.geometry, box.matrix)

      var cylindergeo = new THREE.CylinderGeometry(7,7,14,32)
      var cylinder = new THREE.Mesh(cylindergeo)
      cylinder.position.y=36
      cylinder.position.x=10
      cylinder.position.z=10
      cylinder.updateMatrix()
      singleGeometry.merge(cylinder.geometry, cylinder.matrix)
      var cg2 = new THREE.CylinderGeometry(7,7,14,32)
      var c2 = new THREE.Mesh(cg2)
      c2.position.y=36
      c2.position.x=-10
      c2.position.z=10
      c2.updateMatrix()
      singleGeometry.merge(c2.geometry, c2.matrix)
      var cg3 = new THREE.CylinderGeometry(7,7,14,32)
      var c3 = new THREE.Mesh(cg3)
      c3.position.y=36
      c3.position.x=10
      c3.position.z=-10
      c3.updateMatrix()
      singleGeometry.merge(c3.geometry, c3.matrix)
      var cg4 = new THREE.CylinderGeometry(7,7,14,32)
      var c4 = new THREE.Mesh(cg4)
      c4.position.y=36
      c4.position.x=-10
      c4.position.z=-10
      c4.updateMatrix()
      singleGeometry.merge(c4.geometry, c4.matrix)


      this.block= new THREE.Mesh(singleGeometry)
       var singleMesh = new THREE.Mesh(singleGeometry, material);
       this.add(singleMesh)
       this.material = material
       this.singleMesh= singleMesh
    }
    changeColor(colors){
       if(this.color>=colors.length){
          this.color=0
       }else{
          this.color++
       }
         this.material.color.setHex(colors[this.color])
    }

    changeSize(){
      if(this.size<4){
         this.size++
      }else{
         this.size=0
      }
      this.remove(this.singleMesh)
      game.scene.remove(this.singleMesh)
      this.singleMesh.geometry.dispose()
      this.singleMesh.material.dispose()
      var singleGeometry = new THREE.Geometry();
      singleGeometry.merge(this.block.geometry, this.block.matrix)
      for(var i = 0 ; i <this.size; i++){
         var block = this.block.clone()
         block.position.x=(i+1)*50
         block.updateMatrix()
         singleGeometry.merge(block.geometry, block.matrix)

      }
      this.singleMesh = new THREE.Mesh(singleGeometry, this.material);
      this.singleMesh.rotation.y=Math.PI*(this.direction)/2
      this.add(this.singleMesh)
    }
    rotate(){
      if(this.direction<4){
         this.direction++
      }else{
         this.direction=1
      }
      this.singleMesh.rotation.y=Math.PI*(this.direction)/2
    }

 }