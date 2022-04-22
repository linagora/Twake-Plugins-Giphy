import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { useState } from "react";
import { Input } from "antd";
import ResizeObserver from "react-resize-observer";
import "./App.scss";

const giphyFetch = new GiphyFetch("0MFSt231AIlYRUpzjNsPdQUZPaVKqBPb");
const urlParamCommand = new URLSearchParams(window.location.search);

function GridDemo({ onGifClick }: any) {
  const [width, setWidth] = useState(window.innerWidth);
  const [word, setWord] = useState(urlParamCommand.get("command") || "");

  const fetchGifs = (offset: number) => {
    return word.length > 0
      ? giphyFetch.search(word, { offset, limit: 10 })
      : giphyFetch.trending({ offset, limit: 10 });
  };

  return (
    <>
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          height: "100%",
          borderRadius: "8px",
          marginTop: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "40px",
            marginBottom: "8px",
            alignItems: "center",
            borderRadius: "8px",
            backgroundColor: "#eee",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
            }}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="search"
              width="16px"
              height="16px"
              fill="currentColor"
              aria-hidden="true"
              style={{
                paddingInline: "8px",
                paddingTop: "8px",
                paddingBottom: "8px",
              }}
            >
              <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
            </svg>
          </div>
          <div
            style={{
              flex: 1,
              alignItems: "center",
              height: "32px",
            }}
          >
            <Input
              maxLength={30}
              value={word}
              bordered={false}
              onChange={(e) => setWord(e.target.value)}
              className="search-bar"
              type="text"
              style={{ width: "100%" }}
              placeholder="Gif name"
            />
          </div>
        </div>
        <div style={{ flex: 1, overflow: "scroll", borderRadius: 8 }}>
          <Grid
            onGifClick={onGifClick}
            fetchGifs={fetchGifs}
            width={width}
            columns={5}
            gutter={6}
            key={word}
          />
        </div>
      </div>

      <ResizeObserver
        onResize={({ width }) => {
          setWidth(width);
        }}
      />
    </>
  );
}

function App() {
  const [modalGif, setModalGif] = useState();

  return (
    <>
      <GridDemo
        onGifClick={async (gif: any, e: { preventDefault: () => void }) => {
          e.preventDefault();
          setModalGif(gif);

          const urlParams = new URLSearchParams(window.location.search);
          const body = {
            url: gif.images.downsized_large.url,
            name: gif.title,
            context: urlParams.get("context") || "",
          };

          await fetch("../send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        }}
      />
    </>
  );
}

export default App;
