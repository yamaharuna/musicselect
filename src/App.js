import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const uri = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT09BUESKSHoUFUtYoEp_iDZjN0P47gPaOFJkB-4d-fEesWJfxBnco-ib3NgTnsmD8a5HArrTaZx4_E/pub?gid=640910969&single=true&output=tsv";

function App() {
  const [data, setData] = useState(null);
  const [tempoTarget, setTempoTarget] = useState(120);
  const [tolerance, setTolerance] = useState(0.1);

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

  if (!data) {
    return <div>読み込み中...</div>;
  }

  if (data.length === 0) {
    return <div>データがありません</div>;
  }

  // フィルタリング条件をtoleranceも使って拡張可能
  const filteredSongs = data.filter(d =>
    typeof d.tempo === "number" &&
    Math.abs(d.tempo - tempoTarget) <= 5 &&
    typeof d.danceability === "number" &&
    Math.abs(d.danceability - 0.5) <= tolerance // 例: danceabilityターゲット0.5で固定
  );

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <label>
          テンポ: {tempoTarget}
          <input
            type="range"
            min="50"
            max="200"
            value={tempoTarget}
            onChange={e => setTempoTarget(+e.target.value)}
          />
        </label>
      </div>
      <div style={{ marginTop: "10px" }}>
        <label>
          許容範囲 (Tolerance): {tolerance.toFixed(2)}
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={tolerance}
            onChange={e => setTolerance(+e.target.value)}
          />
        </label>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
  {filteredSongs.map(song => (
    <li
      key={song.name + song.artist}
      style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
    >
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

export default App;
