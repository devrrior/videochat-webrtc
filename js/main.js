const peerConnectionConfig = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.1.google.com:19302'],
    },
  ],
};

const peerConnection = new RTCPeerConnection(peerConnectionConfig);

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const offerGeneratorButton = document.getElementById('offerGeneratorBtn');
const answerGeneratorButton = document.getElementById('answerGeneratorBtn');
const addAnswerButton = document.getElementById('addAnswerBtn');

const init = async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  const remoteStream = new MediaStream();

  localVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;

  localStream
    .getTracks()
    .forEach((track) => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = (event) => {
    event.streams[0]
      .getTracks()
      .forEach((track) => remoteStream.addTrack(track));
  };
};

const createOffer = async () => {
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      document.getElementById('offerValue').value = JSON.stringify(
        peerConnection.localDescription
      );
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
};

const createAnswer = async () => {
    const offer = JSON.parse(document.getElementById('receivedOfferValue').value);

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            document.getElementById('generatedAnswerValue').value = JSON.stringify(
                peerConnection.localDescription
            );
        }
    };

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
};

const addAnswer = async () => {
    const answer = JSON.parse(document.getElementById('answerValue').value);

    await peerConnection.setRemoteDescription(answer);
};

init();

offerGeneratorButton.addEventListener('click', createOffer);
answerGeneratorButton.addEventListener('click', createAnswer);
addAnswerButton.addEventListener('click', addAnswer);