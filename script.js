const fileInput = document.getElementById('fileInput');
const containerAudio = document.getElementById('container-audio');
const globalRepeatInput = document.getElementById('globalRepeat');

let state = {
  globalRepeat: 1,
  listDOMStringFiles: [],
  playingAudioDOMString: '',
  countTimePlay: 0,
};

function setState(value) {
  state = { ...state, ...value };
}

function setGlobalRepeat() {
  if (globalRepeatInput.value.length === 0) return;
  const repeat = Number(globalRepeatInput.value);
  if (typeof repeat !== 'number') return alert('Vui lòng nhập số');
  if (repeat < 1) return alert('Vui lòng nhập số nguyên lớn hơn 0');
  setState({ globalRepeat: repeat });
  state.listDOMStringFiles.forEach(
    (id) => (document.getElementById(id).dataset.repeat = state.globalRepeat)
  );
}

globalRepeatInput.addEventListener('keyup', (event) => {
  setGlobalRepeat();
});

fileInput.addEventListener('change', (event) => {
  const files = [...event.target.files];
  const listDOMStringFiles = files.map((file) => URL.createObjectURL(file));

  setState({ listDOMStringFiles });

  state.listDOMStringFiles.forEach((DOMString, idx) => {
    containerAudio.innerHTML += `<div class="col-12 d-md-flex align-items-center mb-3"><label class="mr-3">${files[idx].name}</label>
    <audio id=${DOMString} class="audio" controls data-repeat=${state.globalRepeat} src=${DOMString}></audio></div>`;
  });

  state.listDOMStringFiles.forEach((DOMString) => {
    const audioElm = document.getElementById(DOMString);

    audioElm.addEventListener('play', (event) => {
      if (
        state.countTimePlay === 0 ||
        state.playingAudioDOMString !== audioElm.id
      ) {
        setState({ countTimePlay: +audioElm.dataset.repeat });
      }
      if (state.playingAudioDOMString !== audioElm.id) {
        const preAudioElm = document.getElementById(
          state.playingAudioDOMString
        );
        if (preAudioElm) {
          preAudioElm.pause();
          preAudioElm.previousElementSibling.style.color = 'black';
        }
      }
      setState({ playingAudioDOMString: audioElm.src });
      audioElm.previousElementSibling.style.color = 'red';
    });

    audioElm.addEventListener('ended', (event) => {
      if (state.countTimePlay > 0) {
        setState({ countTimePlay: --state.countTimePlay });
        if (state.countTimePlay !== 0) {
          audioElm.play();
          return;
        }
      }

      const indexCurrentAudio = state.listDOMStringFiles.findIndex(
        (value) => value === audioElm.id
      );
      const indexNextAudio =
        indexCurrentAudio + 1 >= state.listDOMStringFiles.length
          ? 0
          : indexCurrentAudio + 1;
      const DOMStringOfNextAudio = state.listDOMStringFiles[indexNextAudio];
      audioElm.previousElementSibling.style.color = 'black';
      const nextAudioElm = document.getElementById(DOMStringOfNextAudio);
      nextAudioElm.currentTime = 0;
      nextAudioElm.play();
    });
  });
});
