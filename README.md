# YBS Music Visualizer v1

Yun Brand System 的 Remotion 音樂視覺器第一版，為《後來，我也成為了後來》／後來系列 FINAL Vol.06 製作。

## 視覺方向

- 1920×1080 / 30fps
- 電影感背景
- 中央圓形 Audio Spectrum，實際跟隨 `song.wav`
- 開頭約 5 秒：系列 / 歌名 / Yun
- 開場後僅保留小型系列識別與 Yun
- SRT 動態字幕，一次一段，過濾【Intro】【Verse】【Chorus】【Bridge】段落標記
- Bridge 中段視覺收暗、音譜收斂
- Bridge 尾端無詞哼聲重新托起
- Final Chorus 後半達到最高視覺張力與晨光
- Outro 音譜退場，最後顯示：
  - 後來不是終點
  - 只是下一段故事開始的地方
  - Yun
- 無進度條、無播放鍵、無時間碼、無假播放器 UI

## 素材

已放在 `public/`：

- `song.wav`：FINAL Master
- `captions.srt`：字幕
- `background.png`：圓形主視覺背景

## 執行

```bash
npm install
npm run studio
```

Remotion Studio 開啟後，選擇 `YBSMusicVisualizer`。

## 匯出

確認 Studio 預覽無誤後再執行：

```bash
npm run render
```

輸出：`out/final-vol06.mp4`

## 建議先在 Studio 微調

1. 圓形頻譜中心是否和背景圓形主視覺對齊。
2. 字幕字級與位置是否適合 16:9 YouTube。
3. Bridge 約 2:24～2:49 是否夠明顯收斂。
4. 2:49～2:54 無詞哼聲是否能自然托起視覺。
5. Final Chorus 約 2:54～3:29 的後半段是否為全片最亮、最開闊的區域。
