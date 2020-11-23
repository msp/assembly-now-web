import * as GUI from './gui.js';
import * as Viewing from './viewing.js';

async function read() {
    const db = firebase.firestore();

    const now = new Date();
    const _now = new Date(now);
    const startOfToday = new Date(_now.setHours(0, 0, 0, 0));

    const activeViewings = [];
    const futureViewings = [];

    console.log("checking schedule at:", now);
    console.log("startOfToday: \t\t", startOfToday);

    const viewingsCollection =
        await db.collection('viewings')
            .where("date", ">=", startOfToday)
            .orderBy("date")
            .get();

    for (let doc of viewingsCollection.docs) {
        console.log("=================================================");
        const viewing = new Date(doc.data().date.toDate()); // convert from Firestore Timestamp
        console.log(viewing);
        console.log("-------------------------------------------------");

        if (Viewing.active(now, viewing)) {
            activeViewings.push(viewing);
        } else {
            if (Viewing.future(now, viewing)) {
                futureViewings.push(viewing);
            }
        }
    }

    console.log("activeViewings", activeViewings);
    console.log("futureViewings", futureViewings);

    return {
        activeViewings: activeViewings,
        futureViewings: futureViewings
    };
}

export {
    read
};
