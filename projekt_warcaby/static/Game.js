class Tile extends THREE.Mesh{
    constructor(geometry,mesh){
        if(arguments.length==1){
            var geo = new THREE.BoxGeometry(100, 40, 100);
            var mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load(geometry) });
            super(geo,mat)
        }else{
            super(geometry,mesh)
        }
    }
}

class Game{
    constructor(){
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(
            90,    // kąt patrzenia kamery (FOV - field of view)
            $(window).width() / $(window).height(),    // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maxymalna renderowana odległość od kamery 
        );
        var renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setClearColor(0x000000);
        renderer.setSize($(window).width(), $(window).height());
        $("#root").append(renderer.domElement);
        camera.position.set(0, 320, 520)
        camera.lookAt(scene.position)
        var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.addEventListener('change', function () {
            renderer.render(scene, camera)
        });
        //var axes = new THREE.AxesHelper(1000)
        //scene.add(axes)
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.scene=scene
        this.camera=camera
        this.renderer=renderer
        this.selectedPiece=null

        this.render()
        window.onresize=this.resize.bind(this)
        renderer.domElement.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
        renderer.domElement.onclick=this.onClick.bind(this)



        this.whitePieces=null
        this.blackPieces=null
        this.szachownica=[
            [1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1],
        ]
        this.pionki=[
            [0,2,0,2,0,2,0,2],
            [2,0,2,0,2,0,2,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0]
        ]


        //Generuj plansze
        var blackTile = new Tile("img/black_tile2.jpg")
        var whiteTile = new Tile('img/white_tile2.jpg')
        this.blackTiles=[]
        for(var i =0;i<this.szachownica.length;i++){
            for(var j=0;j<this.szachownica[i].length;j++){
                var cube
                if(this.szachownica[i][j]==1){
                    cube =whiteTile.clone()
                }else{
                    cube =blackTile.clone()
                    this.blackTiles.push(cube)
                }
                cube.x=j
                cube.y=i
                cube.position.x=-350+j*100
                cube.position.z=-350+i*100
                scene.add(cube)
            }
        }
        
    }

    render() {
        this.animationFrame = requestAnimationFrame(this.render.bind(this));

        

        this.renderer.render(this.scene, this.camera);
    }
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    setPieces(){
        var whitePiece = new Piece("/img/white_pawn.jpg")
        var blackPiece = new Piece("/img/red_pawn.jpg")
        if(this.whitePieces!=null){
            this.whitePieces.forEach((el,index)=>{
                this.scene.remove(el)
            })
        }
        if(this.blackPieces!=null){
            this.blackPieces.forEach((el,index)=>{
                this.scene.remove(el)
            })
        }
        this.whitePieces=[]
        this.blackPieces=[]
        for(var i =0;i<this.pionki.length;i++){
            for(var j=0;j<this.pionki[i].length;j++){
                var piece
                if(this.pionki[i][j]==1){
                    piece = whitePiece.clone()
                    this.whitePieces.push(piece)
                }else if(this.pionki[i][j]==2){
                    piece = blackPiece.clone()
                    this.blackPieces.push(piece)
                }else{
                    continue
                }
                piece.x=j
                piece.y=i
                piece.position.x=-350+j*100
                piece.position.z=-350+i*100
                piece.position.y=20
                this.scene.add(piece)
            }
        }
    }
    onMouseMove( event ) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
    
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    }

    onClick(event){
        this.raycaster.setFromCamera( this.mouse, this.camera );
        var arr = net.player==1 ? this.whitePieces:this.blackPieces
        var intersects =this.raycaster.intersectObjects( arr, true )
        if(intersects.length>0){
            arr.forEach(el=>{
                el.color=0xffffff
            })
            
            if(this.selectedPiece==null){
                this.selectedPiece=intersects[0].object
                intersects[ 0 ].object.color= 0x00ffff
            }
            else if(this.selectedPiece==intersects[0].object){
                this.selectedPiece=null
            }else{
                this.selectedPiece=intersects[0].object
                intersects[ 0 ].object.color= 0x00ffff
            }
        }
        var intersects =this.raycaster.intersectObjects( this.blackTiles, true )
        if(intersects.length>0){
            if(this.selectedPiece!=null){
                var pos = intersects[0].object.position
                var x = intersects[0].object.x
                var y = intersects[0].object.y
                if(this.pionki[y][x]==0){
                    console.log(x,y)
                    if(net.player==1){
                        if(y == this.selectedPiece.y - 1){
                            if(this.selectedPiece.x + 1 == x || this.selectedPiece.x - 1 ==x){
                                this.selectedPiece.position.set(pos.x,20,pos.z)
                                this.pionki[y][x]=net.player
                                this.pionki[this.selectedPiece.y][this.selectedPiece.x]=0
                                this.selectedPiece.x=x
                                this.selectedPiece.y=y
                                net.update()
                            }
                        }else if(y == this.selectedPiece.y - 2){//zbijanie bez nizszczenia pionka przeciwnika
                            if(this.selectedPiece.x + 2 == x){
                                if(this.pionki[this.selectedPiece.y-1][this.selectedPiece.x+1]==2){
                                    this.pionki[this.selectedPiece.y-1][this.selectedPiece.x+1]=0
                                    this.selectedPiece.position.set(pos.x,20,pos.z)
                                    this.pionki[y][x]=net.player
                                    this.pionki[this.selectedPiece.y][this.selectedPiece.x]=0
                                    this.selectedPiece.x=x
                                    this.selectedPiece.y=y
                                    net.update()
                                }
                            }else if(this.selectedPiece.x - 2 == x){
                                if(this.pionki[this.selectedPiece.y-1][this.selectedPiece.x-1]==2){
                                    this.pionki[this.selectedPiece.y-1][this.selectedPiece.x-1]=0
                                    this.selectedPiece.position.set(pos.x,20,pos.z)
                                    this.pionki[y][x]=net.player
                                    this.pionki[this.selectedPiece.y][this.selectedPiece.x]=0
                                    this.selectedPiece.x=x
                                    this.selectedPiece.y=y
                                    net.update()
                                }
                            }
                        }
                    }else{
                        if(y == this.selectedPiece.y + 1){
                            if(this.selectedPiece.x + 1 == x || this.selectedPiece.x - 1 ==x){
                                this.selectedPiece.position.set(pos.x,20,pos.z)
                                this.pionki[y][x]=net.player
                                this.pionki[this.selectedPiece.y][this.selectedPiece.x]=0
                                this.selectedPiece.x=x
                                this.selectedPiece.y=y
                                net.update()
                            }
                        }else if(y == this.selectedPiece.y + 2){//zbijanie bez nizszczenia pionka przeciwnika
                            if(this.selectedPiece.x + 2 == x){
                                if(this.pionki[this.selectedPiece.y+1][this.selectedPiece.x+1]==1){
                                    this.pionki[this.selectedPiece.y+1][this.selectedPiece.x+1]=0
                                    this.selectedPiece.position.set(pos.x,20,pos.z)
                                    this.pionki[y][x]=net.player
                                    this.pionki[this.selectedPiece.y][this.selectedPiece.x]=0
                                    this.selectedPiece.x=x
                                    this.selectedPiece.y=y
                                    net.update()
                                }
                            }else if(this.selectedPiece.x - 2 == x){
                                if(this.pionki[this.selectedPiece.y+1][this.selectedPiece.x-1]==1){
                                    this.pionki[this.selectedPiece.y+1][this.selectedPiece.x-1]=0
                                    this.selectedPiece.position.set(pos.x,20,pos.z)
                                    this.pionki[y][x]=net.player
                                    this.pionki[this.selectedPiece.y][this.selectedPiece.x]=0
                                    this.selectedPiece.x=x
                                    this.selectedPiece.y=y
                                    net.update()
                                }
                            }
                        }
                    }
                    
                }
            }
        }
    }
}