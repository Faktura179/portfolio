var game
var client
var net
$(document).ready(function () {
   // kamera, renderer etc
   client = io();
   net = new Net()
   game = new Game()
})