

# 具体使用说明
请看我[BLOG](http://emufan.com/2016/02/18/%E7%99%BE%E5%BA%A6%E4%B8%BB%E5%8A%A8%E6%8E%A8%E9%80%81hexo%E7%94%9F%E6%88%90%E7%9A%84%E6%96%87%E7%AB%A0/)

# 依赖
[hexo-generator-baidu-sitemap](https://github.com/coneycode/hexo-generator-baidu-sitemap)
cnpm install cheerio
cnpm install request

# 打开ActivePush.js进行设置
token:百度主动推送的token
file_name:保存上一次记录的文件


# 运行
设置hexo-generator-baidu-sitemap 只需要在.config.yml添加一些数据即可, 下面附上我的添加数据 theme这个可以随意更改 下面的copy即可
```
# Extensions
## Plugins: http://hexo.io/plugins/
## Themes: http://hexo.io/themes/
theme: yilia
baidusitemap:
path: baidusitemap.xml
```
然后
```
hexo g
```
接下来运行
```
node ActivePush.js
```

# 附加
node ActivePush.js all
是不进行文件对比 直接上传所有文件