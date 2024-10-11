function active(now, viewingStart) {
    const viewingEnd = calculateViewingEndFrom(viewingStart);

    if (future(now, viewingStart)) {
        console.log("viewing not started yet");
        return false;
    }

    if (now > viewingEnd) {
        console.log("viewing over");
        console.log("viewingEnd: \t", viewingEnd);
        return false;
    }

    if (now >= viewingStart && now < viewingEnd) {
        console.log("viewing active!");
        return true;
    } else {
        console.log("viewingStart: \t", viewingStart);
        console.log("viewingEnd: \t", viewingEnd);

        return false;
    }
}

function future(now, viewingStart) {
    if (now < viewingStart) {
        return true;
    }
}

function calculateViewingEndFrom(viewingStart) {
    const viewingWindowMins = 30;
    const viewingEnd = new Date(
        viewingStart.getTime() + viewingWindowMins * 60000
    );

    return viewingEnd;
}
export {
    active,
    future
};
