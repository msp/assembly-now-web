import * as GUI from './gui.js';
import * as Viewing from './viewing.js';

async function check(tl) {
    const now = new Date();
    const _now = new Date(now);
    const startOfToday = new Date(_now.setHours(0, 0, 0, 0));

    console.log("checking schedule at:", now);
    console.log("startOfToday: \t\t", startOfToday);

    const db = firebase.firestore();
    const viewingsCollection = await db.collection('viewings')
        .where("date", ">=", startOfToday)
        .orderBy("date")
        .get();

    const activeViewings = [];
    const futureViewings = [];

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

    if (activeViewings.length > 0) {
        tl.resume();
    } else {
        if (futureViewings.length > 0) {
            console.log("Our next private view is at " + futureViewings[0] + ", please check back then");
            GUI.showViewingSchedule(futureViewings);
        } else {
            console.log("Sorry, now viewings scheduled right now. Please check back later!")
        }
    }
}

export {
    check
};
