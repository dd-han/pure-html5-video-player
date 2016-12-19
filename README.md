# 純 HTML5 Video 播放器測試

無第三方 Library ，只有純粹的 HTML 、 JavaScript 與 CSS。

就說了測試用嘛，之後會變成怎樣我也不知道（？


## 啟用方法

### 安裝 font-awesome 

因為 font-awesome 已經包含了完整的播放器會需要的圖示，所以直接採用 font-aswsome 的圖示。

安裝指令：

`./get-font-awesome.sh`

執行前請確認電腦中已經安裝 curl 與 unzip 。

### 啟用 http 伺服器

以下請任挑一種順眼的方法：

- 點開 `index.html` 
- 透過 Python 3 內建的 http Server `python -m http.server 8000` 
- 透過 NodeJS 的 httpServer `http-server -p 8000`
- 透過[其他一行開啟的 http server 的語法](https://gist.github.com/willurd/5720255)
- 透過 [auto-nginx-config](https://github.com/dd-han/auto-nginx-config) 產生 nginx 設定檔


