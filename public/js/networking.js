import * as AudioFX from './audio-fx.js';
import * as Utils from './utils.js';

const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

class Networking {
  constructor(stream, localVideoElement, remoteVideoElement) {
    this.localStream = stream;
    this.localVideoElement = localVideoElement;
    this.remoteVideoElement = remoteVideoElement;

    this.connectionCallback = null;
    this.disconnectionCallback = null;

    this.remoteStream = null;
    this.peerConnection = null;
    this.roomId = null;
    this.role = null;

    this.db = firebase.firestore();
  }

  async initialize() {
    this.remoteStream = new MediaStream();
    await this.negotiateNewConnection();
  }

  async finalize() {
    this.stopTracks();
    this.closePeerConnection();
    await this.deleteRoom();
    await this.resetWaitingRoom();

    this.remoteStream = null;
    this.peerConnection = null;
    this.roomId = null;
    this.role = null;
  }


  async reinitialize() {
    await this.finalize();
    await this.initialize();
  }

  stopTracks() {
    this.remoteStream.getTracks().forEach(track => track.stop());
  }

  closePeerConnection() {
    if (this.peerConnection) {
      this.peerConnection.close();
    }

  }

  async deleteRoom() {
    if (this.roomId) {
      const roomRef = this.db.collection('rooms').doc(this.roomId);
      const calleeCandidates = await roomRef.collection('calleeCandidates').get();
      calleeCandidates.forEach(async candidate => {
        await candidate.ref.delete();
      });
      const callerCandidates = await roomRef.collection('callerCandidates').get();
      callerCandidates.forEach(async candidate => {
        await candidate.ref.delete();
      });
      await roomRef.delete();
      this.roomId = null;
    }
  }

  async resetWaitingRoom() {
    const ref = this.db.doc('config/waiting_room');
    await this.db.runTransaction(async transaction => {
      const existingRoom = await transaction.get(ref);
      if (!existingRoom.exists) {
        throw (new Error("waiting_room doc does not exist"));
      }
      if (existingRoom.data().roomId == this.roomId && this.role == "caller") {
        await transaction.update(ref, { "roomId": "" });
      }
    });
  }

  async negotiateNewConnection() {
    const ref = this.db.doc('config/waiting_room');
    await this.db.runTransaction(async transaction => {
      const existingRoom = await transaction.get(ref);
      if (!existingRoom.exists) {
        throw (new Error("waiting_room doc does not exist"));
      }

      if (existingRoom.data().roomId !== "") {
        const roomId = existingRoom.data().roomId;
        await transaction.update(ref, { "roomId": "" });
        this.roomId = roomId;
        this.role = "callee";
      } else {
        const roomId = Utils.uuidv4();
        await transaction.update(ref, { "roomId": roomId });
        this.roomId = roomId;
        this.role = "caller";
      }
    });
    await this.joinOrCreateRoom();
  }


  async joinOrCreateRoom() {
    if (this.role == "caller") {
      await this.createRoom();
    } else {
      await this.joinRoom();
    }
  }

  async createRoom() {
    const roomRef = this.db.collection('rooms').doc(`${this.roomId}`);
    this.peerConnection = new RTCPeerConnection(configuration);
    this.registerPeerConnectionListeners();
    this.addLocalStreamToPeerConnection();
    await this.collateICECandidates(roomRef);
    await this.createOffer(roomRef);
    this.addPeerTracksToRemoteStream();
    await this.listenForRemoteDescription(roomRef);
    await this.listenForRemoteICECandidates(roomRef);
  }

  async joinRoom() {
    const roomRef = this.db.collection('rooms').doc(`${this.roomId}`);
    const roomSnapshot = await roomRef.get();
    if (roomSnapshot.exists) {
      this.peerConnection = new RTCPeerConnection(configuration);
      this.registerPeerConnectionListeners();
      this.addLocalStreamToPeerConnection();
      await this.collateICECandidates(roomRef);
      this.addPeerTracksToRemoteStream();
      await this.createAnswer(roomRef, roomSnapshot);
      await this.listenForRemoteICECandidates(roomRef);
    }
  }

  async createAnswer(roomRef, roomSnapshot) {
    const offer = roomSnapshot.data().offer;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await roomRef.update(roomWithAnswer);
  }

  async createOffer(roomRef) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await roomRef.set(roomWithOffer);
  }

  async collateICECandidates(roomRef) {
    const candidatesCollection = roomRef.collection(this.role + 'Candidates');
    this.peerConnection.addEventListener('icecandidate', async event => {
      if (!event.candidate) {
        return;
      }
      await candidatesCollection.add(event.candidate.toJSON());
    });
  }

  registerPeerConnectionListeners() {
    this.peerConnection.addEventListener('iceconnectionstatechange', async function(event) {
      const connectionState = this.peerConnection.iceConnectionState;
      console.log(connectionState);
      if (connectionState == 'disconnected') {
        await this.finalize();
        if(this.disconnectionCallback) {
          await this.disconnectionCallback();
        }
      } else if (connectionState == 'connected') {
        this.remoteVideoElement.srcObject = this.remoteStream;
        try {
          await this.remoteVideoElement.play();
        } catch(e) {
          //don't worry, it was already playing.
        }
        if(this.connectionCallback) {
          await this.connectionCallback();
        }
      }
    }.bind(this));
  }

  addPeerTracksToRemoteStream() {
    this.peerConnection.addEventListener('track', async event => {
      event.streams[0].getTracks().forEach(async track => {
        this.remoteStream.addTrack(track);
      });
    });
  }

  addLocalStreamToPeerConnection() {
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });
  }

  async listenForRemoteDescription(roomRef) {
    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!this.peerConnection.currentRemoteDescription && data && data.answer) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await this.peerConnection.setRemoteDescription(rtcSessionDescription);
      }
    });
  }

  async listenForRemoteICECandidates(roomRef) {
    const peerRole = this.role == "caller" ? "callee" : "caller";
    roomRef.collection(peerRole + 'Candidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }
}


export { Networking }
