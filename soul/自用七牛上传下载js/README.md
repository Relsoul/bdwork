
# 自用nodejs版七牛上传下载功能
[Blog](http://emufan.com)

[list](http://cdn.emufan.com/img/七牛-1.png)
[get](http://cdn.emufan.com/img/七牛-2.png)
[upload](http://cdn.emufan.com/img/七牛-3.png)


## 自用功能

自动对比服务器文件上传,
自动获取服务器文件下载,
获取服务器上所有文件

依赖模块
- npm install qiniu
- npm install request
- npm install underscore

JS中最下方的初始化
```
    AK: 你的七牛AK,
    SK: 你的七牛SK,
    path: 需要同步文件夹以当前文件夹下的文件夹,非绝对路径如:"/uploadQN"指的是当前文件夹下的uploadQN,
    bucket: 你的七牛空间,
    domain: 你的七牛CDN域名 用来下载
```

<!-- more -->

## 指令

目前仅仅支持get,list,upload


### get

```
nodejs uploadQN.js get 
```
获取目录下的所有文件以及文件夹

### list
```
nodejs uploadQN.js list 
```
获取服务器上的所有文件

### upload

```
nodejs uploadQN.js upload 
```


上传同步文件夹下的所有文件至服务器