const Realm = require("realm");

async function startApp() {
  const Block = {
    name: "Block",
    primaryKey: "_id",
    properties: {
      _id: "string",
      name: "string",
      description: "string",
      type: "string",
    },
  };

  let realmDB;
  try {
    realmDB = await Realm.open({
      path: "dbtest/realmDB.realm",
      schema: [Block],
    });

    console.time("createBlocks");
    realmDB.write(() => {
      for (let i = 0; i < 100000; i++) {
        let newBlock = realmDB.create("Block", {
          _id: i.toString(),
          name: "Block " + i,
          description: "Block " + i + " description",
          type: "THING",
        });
      }
    });
    console.timeEnd("createBlocks");

    console.time("updateBlocks");
    let blocks = realmDB.objects("Block").filtered('type == "THING"');
    let ctr = 0;
    realmDB.write(() => {
      blocks.forEach((block) => {
        console.log(ctr);
        ctr++;
        if (ctr > 5000) {
          return;
        }
        block.name = `___Block content id: ${block._id}`;
      });
    });
    console.timeEnd("updateBlocks");
  } catch (error) {
    console.log(`RealmDB initialization error: ${error}`);
  } finally {
    realmDB.close();
  }
}

startApp();
