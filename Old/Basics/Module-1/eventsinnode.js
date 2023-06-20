"use strict";

const EventEmmiter = require("events");

const celebrity = new EventEmmiter();

celebrity.on("race", (result) => {
  if (result === "win") {
    console.log("you win");
  }
});

celebrity.on("race", (result) => {
  if (result === "lose") {
    console.log("you lost");
  }
});

celebrity.emit("race", "win");
