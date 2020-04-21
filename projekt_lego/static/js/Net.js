class Net{
    constructor(){
        this.addedBlocks=[]
        client.on("create", function(data){
            var block = new Block()
            block.name=data.id
            block.position.copy(data.position)
            game.scene.add(block)
            net.addedBlocks.push(block.id)
        })
        client.on("name",function(data){
            game.lastBlock.name=data.id
        })
        client.on("edit",function(data){
            var object = game.scene.getObjectByName(data.id,true)
            switch(data.edit){
                case "Escape":
                    object.changeColor(game.colors)
                    break;
                case " ":
                    object.changeSize()
                    break;
                case "r":
                    object.rotate()
                    break;
                case "ArrowRight":
                    object.position.x+=25
                    break;
                case "ArrowLeft":
                    object.position.x-=25
                    break;
                case "ArrowUp":
                    object.position.z-=25
                    break;
                case "ArrowDown":
                    object.position.z+=25
                    break;
            }
        })
    }
}