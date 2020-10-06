import { connect } from "./database";

import { IBedpres } from "./models/bedpres";

import { BEDPRES_SOURCES } from "./bedpresSource";

import { startDiscordBot } from "./discord";

import { processBedpresList } from "./bedpresDatabase";

//Connect to mongo
/*
//Fetch events
const mainLoop = async () => {
	//Avoid connections being dropped due to inactivity(if it does even happen?) by connecting and disconnecting when needed
	connect()
	await doEventLoop();
	disconnect()
}

setInterval(mainLoop, 60*1000*30);

mainLoop()*/

connect();
const mainLoop = async () => {
  let bedpresList: IBedpres[] = [];
  for (const source of Object.keys(BEDPRES_SOURCES)) {
    bedpresList = bedpresList.concat(
      await BEDPRES_SOURCES[source].fetchNewBedpresses()
    );
  }

  console.log("---Start processing bedpres---");

  await processBedpresList(bedpresList);

  console.log("Done, going to sleep");
};

startDiscordBot()
  .then(async () => {
    await mainLoop();

    setInterval(mainLoop, 60 * 1000 * 5);
  })
  .catch((err) => {
    console.log(`Failed! ${err}`);
  });
