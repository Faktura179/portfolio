class Visual {

    constructor() {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(
            90,    // kąt patrzenia kamery (FOV - field of view)
            $(window).width() / $(window).height(),    // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maxymalna renderowana odległość od kamery 
        );
        var renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setClearColor(0xffffff);
        renderer.setSize($(window).width(), $(window).height());
        $("#root").append(renderer.domElement);
        camera.position.set(0, 0, 800)
        camera.lookAt(scene.position)
        this.points=[]
        

        this.scene=scene
        this.camera=camera
        this.renderer=renderer
        //this.render()
        this.animationFrame=null
        window.onresize=this.resize.bind(this)

        


        // var rendererStats	= new THREEx.RendererStats()
        // rendererStats.domElement.style.position	= 'absolute'
        // rendererStats.domElement.style.left	= '0px'
        // rendererStats.domElement.style.bottom	= '0px'
        // document.body.appendChild( rendererStats.domElement )
        // this.rendererStats=rendererStats
        
    }

    render() {
        this.animationFrame = requestAnimationFrame(this.render.bind(this)); // bind(this) przekazuje this do metody render
        var arr = music.getData()
        var points=[]
        var background =0
       // this.points.push(new THREE.Vector3(-810,0,0))
        for(var i =0;i<arr.length;i++){
            points.push(new THREE.Vector3(-1400+i*90,0,0))
            points.push(new THREE.Vector3(-1370+i*90,arr[i]*2,0))
            //this.points.push(new THREE.Vector3(-780+i*50,0,0))
            points.push(new THREE.Vector3(-1340+i*90,-arr[i]*2,0))
            points.push(new THREE.Vector3(-1310+i*90,0,0))
            var curve = new THREE.CatmullRomCurve3(points)
            var points = curve.getPoints( 50 );
            var geometry = new THREE.BufferGeometry().setFromPoints( points );
            var g = 255-arr[i]
            if(g<16)
            g=17
            var color=parseInt("ff"+g.toString(16)+"00",16)
            var material = new THREE.LineBasicMaterial( { color : color, linewidth: 3} );
            var curveObject = new THREE.Line( geometry, material );
            this.scene.add(curveObject)
            this.points.push(curveObject)
            points=[]
            if(i>arr.length-(arr.length/4))
                background+=arr[i]
        }
        //this.points.push(new THREE.Vector3(810,0,0))

        
        background/=arr.length/4
        background=Math.round(background)
        if(background<16)
        background=17
        this.scene.background= new THREE.Color(parseInt(background.toString(16)+"00ff",16))

        // Create the final object to add to the scene
        


        this.renderer.render(this.scene, this.camera);
        this.points.forEach(el=>{
            this.scene.remove(el)
            el.geometry.dispose()
            el.material.dispose()
            el=undefined
        })
        
        this.points=[]


        //this.rendererStats.update(this.renderer);
    }

    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}