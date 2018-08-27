

// begin view

let view = {
	
	// function showCount() - player account
	showCount: function (count) {
		let elCount = document.getElementById("area_game__user_count--total");
		elCount.innerHTML = count;
	},
	
	// function showMsg() - message on the page
	showMsg: function (msg) {
		let elMessage = document.getElementById("area_game__user-message--msg");
		elMessage.innerHTML = msg;
	},

	// function showShip() - ship on page (blue or red)
	showShip: function (id, color) {
		let elShip = document.getElementById(id);
		if (color === "red") {
			elShip.setAttribute("class", "ship-red");
		} else if (color === "blue") {
			elShip.setAttribute("class", "ship-blue");
		}
	},

	// function showAsteroid() - asteroid if missed
	showAsteroid: function (id) {
		let elAsteroid = document.getElementById(id);
		elAsteroid.setAttribute("class", "asteroid");
	},

	// function soundShot() - sound of a shot
	soundShot: function () {
		let audio = document.getElementsByTagName("audio")[0];

		audio.pause();
		audio.currentTime = 0;
		setTimeout(function () {      
   			audio.play();
		}, 20);
		 audio.play();
	},

  // end view


	// begin model

var:model = {
	sizeSpace: 	  7,
	numShips: 	  6,
	lengthShips:  3,
	destroyShips: 0,

	spaceships: [
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "red"  },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "blue" },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "red"  },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "blue" },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "red"  },
		{ position: ["0", "0", "0"], damage: ["", "", ""], color: "blue" }
	],

	// function shot() - shot and hit test
	shot: function (id) {
		for (let i = 0; i < this.numShips; i++) {
			let spaceship = this.spaceships[i];
			let posDamage = spaceship.position.indexOf(id);
			// console.log(posDamage);
			if (posDamage >= 0) {

				if (spaceship.damage[posDamage] === "loss") {
					return true;
				}
				spaceship.damage[posDamage] = "loss";
				let color = spaceship.color;

				if (this.checkDestroyedShip(spaceship)) {
					this.destroyShips++;
					return {
						id: id,
						color: color,
						status: 3
					};
				}
				return {
					id: id,
					color: color,
					status: 1
				};
			}
		}
		return id;
	},

	// function checkDestoyedShip() - check of fully damaget ship
	checkDestroyedShip: function (ship) {
		for (let i = 0; i < this.lengthShips; i++) {
			if (ship.damage[i] === "") {
				return false;
			}
		}
		return true;
	},

	// function createShipPos() - creation of random positions of chips
	createShipPos: function () {
		let col = 0;
		let row = 0;
		let location = Math.floor(Math.random() * 2);
		let shipPosition = [];

		if (location === 1) { // horizontal
			row = Math.floor(Math.random() * this.sizeSpace);
			col = Math.floor(Math.random() * (this.sizeSpace - this.lengthShips + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.sizeSpace - this.lengthShips + 1));
			col = Math.floor(Math.random() * this.sizeSpace);
		}
	
		for (let i = 0; i < this.lengthShips; i++) {
			if (location === 1) {
				shipPosition.push(row + "" + (col + i));
			} else {
				shipPosition.push((row + i) + "" + col);
			}
		}
		return shipPosition;
	},

	// function checkRepeatsPos() - checked or not superimproset ships
	checkRepeatsPos: function (position) {
		for (let i = 0; i < this.numShips; i++) {
			let spaceship = this.spaceships[i];
			for (let j = 0; j < position.length; j++) {
				if (spaceship.position.indexOf(position[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},

	createSpaceships: function () {
		let position;
		for (let i = 0; i < this.numShips; i++) {

			do {
				position = this.createShipPos();
			} while (this.checkRepeatsPos(position));
			this.spaceships[i].position = position;

		}
	}
},

		//end model


		//begin controller

let:controller = {
	
	// number of shot
	numShots: 0,

	// generate ships
	createShips: function () {
		model.createSpaceships();
	},

	// function shotShip() - unites method
	shotShip: function (c) {
		let id = this.convertToID(c);

		if (id) {
			let loss = model.shot(id);
			if (loss === true) {
				view.showMsg("The ship is damaget!");
			} else if (loss.status === 3) {
				view.showShip(loss.id, loss.color);
				view.showMsg("The flotilla is destroyed!");
			} else if (loss.status === 1) {
				view.showShip(loss.id, loss.color);
				view.showMsg("Hitting!");
			} else if (typeof(loss) === 'string') {
				view.showAsteroid(loss);
				view.showMsg("Slip!");
			}
			this.numShots++;
			if (loss && (model.destroyShips === model.numShips)) {
				let count = Math.round((model.numShips * 3 / this.numShots) * 1000);
				view.showMsg("You destroyed all the ship!");
				view.showCount(count);
			}
			view.soundShot();
		}
	},

	// function convertToID() - translates coordinates in id
	convertToID: function (c) {
		let symbol = ["A", "B", "C", "D", "E", "F", "G"];

		if (c !== null && c.length === 2) {

			let firstChar = c.charAt(0);
			let row = symbol.indexOf(firstChar);
			let col = c.charAt(1);

			if (!this.isNumeric(row) || !this.isNumeric(col)) {
				alert("Entered an invalid value!");
			} else if (row < 0 || row >= model.sizeSpace ||
					   col < 0 || col >= model.sizeSpace) {
				alert("Outside the map!");
			} else {
				return row + col;
			}

		} else {
			alert("Enter the symbol A - G!");
		}
		return null;
	},

	// function isNumeric() - definition of a variable in a number
	isNumeric: function (n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	},

	hoverClick: function (id) {
		let el = document.getElementById(id);
		el.mouseover = function (e) {
			e = e || window.event;

			
			if (e.target.id !== "") {
				e.target.style.transition = "0.5s";
				e.target.style.backgroundColor = "rgba(104, 142, 218, 0.33)";
				

			
				e.target.onclick = function () {
					let c = this.getAttribute("data-title");
					controller.shotShip(c)
				};
			}
		};

		el.mouseout = function (e) {
			e = e || window.event;
			if (e.target.id !== "") {
				e.target.style.backgroundColor = "inherit";
			}
		};
	},

	createDataTitle: function () {
		let elCell = document.getElementsByTagName("td");
		for (let i = 0; i < elCell.length; i++) {
			if (elCell[i].id !== "") {
				let value = elCell[i].getAttribute("id");
				let element = elCell[i];
				let letter = element.parentNode.firstElementChild.firstElementChild.innerHTML;
				
				elCell[i].setAttribute("data-title", letter + value.charAt(1));
			}
		}
	},

	hBtnClick:function () {
		let el = document.getElementById("crdInput");
		let elValueUp = el.value.toUpperCase();

		controller.shotShip(elValueUp);

		el.value = "";
	},

	hKeyPress: function (e) {
		e = e || window.event;

		let el = document.getElementById("btnShot");

		if (e.keyCode === 13) {
			el.click();
			return false;
		}
	}

},

		// end controller

		// anonymous initialize function
(function () {
  
	let start = {

		init: function () {
			this.main();
			this.control();
			this.event();
		},

		main: function () {

		},

		// control()

		control: function () {


			controller.createShips();
			controller.createDataTitle();


		},
		
		// event()
		event: function () {

			let btnShot = document.getElementById("btnShot");
			btnShot.onclick = controller.hBtnClick;

			let elCrdInput = document.getElementById("crdInput");
			elCrdInput.onkeypress = controller.hKeyPress;

			controller.hoverClick("area_game__table");

		}

	};

	start.init();

});
		// anonymous initialize function