import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const uri =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT09BUESKSHoUFUtYoEp_iDZjN0P47gPaOFJkB-4d-fEesWJfxBnco-ib3NgTnsmD8a5HArrTaZx4_E/pub?gid=640910969&single=true&output=tsv";

function App() {
  const [data, setData] = useState(null);

  // スライダー用の状態
  const [tempoTarget, setTempoTarget] = useState(120);
  const [tolerance, setTolerance] = useState(0.1);
  const [danceabilityTarget, setDanceabilityTarget] = useState(0.5);
  const [energyTarget, setEnergyTarget] = useState(0.5);
  const [valenceTarget, setValenceTarget] = useState(0.5);
  const [acousticnessTarget, setAcousticnessTarget] = useState(0.5);
  const [instrumentalnessTarget, setInstrumentalnessTarget] = useState(0.5);

  useEffect(() => {
    d3.tsv(uri, d3.autoType)
      .then(data => {
        console.log("読み込んだデータ:", data);
        setData(data);
      })
      .catch(error => {
        console.error("データ読み込みエラー:", error);
      });
  }, []);

  if (!data) return <div>読み込み中...</div>;
  if (data.length === 0) return <div>データがありません</div>;

  const filteredSongs = data.filter(d =>
    typeof d.tempo === "number" &&
    typeof d.danceability === "number" &&
    typeof d.energy === "number" &&
    typeof d.valence === "number" &&
    typeof d.acousticness === "number" &&
    typeof d.instrumentalness === "number" &&
    Math.abs(d.tempo - tempoTarget) <= 5 &&
    Math.abs(d.danceability - danceabilityTarget) <= tolerance &&
    Math.abs(d.energy - energyTarget) <= tolerance &&
    Math.abs(d.valence - valenceTarget) <= tolerance &&
    Math.abs(d.acousticness - acousticnessTarget) <= tolerance &&
    Math.abs(d.instrumentalness - instrumentalnessTarget) <= tolerance
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>フィルタースライダー</h2>
      <Slider label="テンポ (BPM)" min={50} max={200} value={tempoTarget} onChange={setTempoTarget} />
      <Slider label="許容範囲 (Tolerance)" min={0.01} max={0.5} step={0.01} value={tolerance} onChange={setTolerance} />
      <Slider label="踊りやすさ" min={0} max={1} step={0.01} value={danceabilityTarget} onChange={setDanceabilityTarget} />
      <Slider label="エネルギッシュさ" min={0} max={1} step={0.01} value={energyTarget} onChange={setEnergyTarget} />
      <Slider label="明るさ" min={0} max={1} step={0.01} value={valenceTarget} onChange={setValenceTarget} />
      <Slider label="アコースティック度" min={0} max={1} step={0.01} value={acousticnessTarget} onChange={setAcousticnessTarget} />
      <Slider label="インスト感" min={0} max={1} step={0.01} value={instrumentalnessTarget} onChange={setInstrumentalnessTarget} />

      <h2>一致する楽曲: {filteredSongs.length} 件</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredSongs.map(song => (
          <li key={song.name + song.artist} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <img
              src={song.album_art_url}
              alt={song.name}
              width={50}
              height={50}
              style={{ marginRight: 10, borderRadius: 4 }}
            />
            <span>
              <strong>{song.name}</strong> - {song.tempo.toFixed(1)} BPM
              <br />
              <small>{song.artist}</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// スライダーコンポーネントの定義
function Slider({ label, min, max, step = 1, value, onChange }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label>
        {label}: {value}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(+e.target.value)}
          style={{ width: "100%", marginLeft: "10px" }}
        />
      </label>
    </div>
  );
}

export default App;
