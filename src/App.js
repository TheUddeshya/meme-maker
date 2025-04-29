import { useState, useEffect, useRef } from "react";
import "./styles.css";
import Sidebar from "./Sidebar";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";

export default function App() {
  const [memes, setMemes] = useState([]);
  const [currentMeme, setMeme] = useState(null);
  const [memeText, setMemeText] = useState([]);
  const memeImage = useRef(null);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setMemes(data.data.memes));

    const memeTextArr = [];
    for (let i = 0; i < 6; i++) {
      memeTextArr.push({ body: "", size: 16 });
    }

    setMemeText(memeTextArr);
  }, []);

  function updateCurrentMeme(id) {
    const newmeme = memes.find((meme) => meme.id === id);
    setMeme(newmeme);
  }

  function updateMemeText(event, index, prop) {
    const newVal =
      prop === "size" ? parseInt(event.target.value, 10) : event.target.value;

    setMemeText((prev) => {
      const newText = [...prev];
      newText[index][prop] = newVal;
      return newText;
    });
  }

  function downloadMeme() {
    if (memeImage.current)
      html2canvas(memeImage.current, { useCORS: true }).then((canvas) => {
        let a = document.createElement("a");
        // document.body.appendChild(a);
        a.download = `${currentMeme.name}.png`;
        a.href = canvas.toDataURL();
        a.click();
      });
    // console.log(currentMeme , " was downloaded");
  }

  /*
  +===================
  \\
  \\ size value is incrementing and Decrementing by 2, Don't know why
  \\
  +===================
  */

  function sizePlus(index) {
    console.log("sizePlus at", index);
    setMemeText((prev) => {
      const newArr = [...prev];
      newArr[index].size = prev[index].size + 1;
      return newArr;
    });
  }

  function sizeMinus(index) {
    console.log("sizeMinus at", index);
    setMemeText((prev) => {
      const newArr = [...prev];
      newArr[index].size = prev[index].size - 1;
      return newArr;
    });
  }

  const renderThumbnail = memes.map((meme) => {
    return (
      <img
        key={meme.id}
        className="thumbnail"
        onClick={() => updateCurrentMeme(meme.id)}
        src={meme.url}
        alt="meme thumbnail"
      />
    );
  });

  const renderInputs = () => {
    const retArr = [];
    // const memeTextArr = [];
    const boxes = (currentMeme && currentMeme.box_count) || 2;
    // console.log("box count", boxes);
    for (let i = 0; i < boxes; i++) {
      retArr.push(
        <div key={i} className="input-container">
          <input
            type="text"
            value={(memeText[i] && memeText[i].body) || ""}
            className="memeInput"
            onChange={(event) => updateMemeText(event, i, "body")}
            placeholder={`text ${i + 1}`}
          />
          <div className="size-container">
            <button className="sizeBut" onClick={() => sizeMinus(i)}>
              -
            </button>
            <input
              type="text"
              className="sizeInput"
              maxLength="3"
              onChange={(e) => updateMemeText(e, i, "size")}
              value={(memeText[i] && memeText[i].size) || 16}
            />
            <button className="sizeBut" onClick={() => sizePlus(i)}>
              +
            </button>
          </div>
        </div>
      );
    }
    return retArr;
  };

  const renderMemeText = () => {
    const retArr = [];
    const boxes = (currentMeme && currentMeme.box_count) || 2;
    // console.log("box count", boxes);
    for (let i = 0; i < boxes; i++) {
      retArr.push(
        <Rnd
          key={i}
          className="meme-text"
          bounds=".text-container"
          style={{ fontSize: (memeText[i] && memeText[i].size) || 16 }}
        >
          {memeText[i].body}
        </Rnd>
      );
    }
    return retArr;
  };

  return (
    <div className="App">
      <header className="header">
        <span className="fa-solid fa-dice"></span> Meme Generator
      </header>
      <main>
        <Sidebar>
          {memes.length ? renderThumbnail : <h2>Loading...</h2>}
        </Sidebar>
        <div className="img-container">
          {currentMeme ? (
            <div ref={memeImage} className="text-container">
              {renderMemeText()}
              <img
                className="current-meme outline"
                src={currentMeme.url}
                alt="current meme"
              />
            </div>
          ) : (
            <h2> Select Meme On Left to Get started </h2>
          )}
        </div>
        <div className="inputs">
          {renderInputs()}
          <button className="download" onClick={downloadMeme}>
            {" "}
            Download 🖼{" "}
          </button>
        </div>
      </main>
    </div>
  );
}
