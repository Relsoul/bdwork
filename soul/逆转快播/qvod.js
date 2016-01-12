/**
 * Created by soul on 2016/1/9.
 */
var app=angular.module("qvod",[]);

app.controller("qvodCtrl",function($scope,$sce){
    $scope.qvod_text=[];
    $scope.scope=0;
    $scope.text_all=[[{
        txt:"先来看看案件经过 </br>公诉机关指控，被告单位深圳市快播科技有限公司自2007年12月成立以来，基于流媒体播放技术，通过向国际互联网发布免费的QVOD媒体服务器安装程序（简称QSI）和快播播放器软件的方式，为网络用户提供网络视频服务。期间，被告单位快播公司及其直接负责的主管人员被告人王欣、吴铭、张克东、牛文举以牟利为目的，在明知上述QVOD媒体服务器安装程序及快播播放器被网络用户用于发布、搜索、下载、播放淫秽视频的情况下，仍予以放任，导致大量淫秽视频在国际互联网上传播。2013年11月18日，北京市海淀区文化委员会从位于本市海淀区的北京某技术有限公司查获快播公司托管的服务器四台。后北京市公安局从上述服务器中的三台服务器里提取了29841个视频文件进行鉴定，认定其中属于淫秽视频的文件为21251个。公诉机关认为，上述被告单位及四名被告人的行为构成传播淫秽物品牟利罪。"
        ,btn:[{btn_txt:"好啊,打官司我奉陪",score:1,btn_pointer:1},{btn_txt:"必须打！为了部落",score:1,btn_pointer:2}]
    },{
            txt:"fsdfdsgfdgdfgfhghjgjjhkjhkhjkhj </br>公诉机关指控，被告单位深圳市快播科技有限公司自2007年12月成立以来，基于流媒体播放技术，通过向国际互联网发布免费的QVOD媒体服务器安装程序（简称QSI）和快播播放器软件的方式，为网络用户提供网络视频服务。期间，被告单位快播公司及其直接负责的主管人员被告人王欣、吴铭、张克东、牛文举以牟利为目的，在明知上述QVOD媒体服务器安装程序及快播播放器被网络用户用于发布、搜索、下载、播放淫秽视频的情况下，仍予以放任，导致大量淫秽视频在国际互联网上传播。2013年11月18日，北京市海淀区文化委员会从位于本市海淀区的北京某技术有限公司查获快播公司托管的服务器四台。后北京市公安局从上述服务器中的三台服务器里提取了29841个视频文件进行鉴定，认定其中属于淫秽视频的文件为21251个。公诉机关认为，上述被告单位及四名被告人的行为构成传播淫秽物品牟利罪。"
            ,btn:[{btn_txt:"fdsfdgdfgdfg,打官司我奉陪",score:1,btn_pointer:1},{btn_txt:"gfdgfdhgfhg！为了部落",score:1,btn_pointer:2}]
    }],
        [{
            txt:"审批长:现在开庭,有请被告,公诉人,辩护人</br>刷拉拉,刷拉拉..</br>审判长:下面开庭,审批快播一案"
        },{}]

    ];
    $scope.pointer=[0,0];
    $scope.qvod_text.push(Transcode($scope.text_all[$scope.pointer[0]][$scope.pointer[1]]));
    console.log($scope.qvod_text);

    function Transcode(obj){
        obj.txt=$sce.trustAsHtml(obj.txt)
        return obj
    }

    $scope.choice=function(btn,index,btn_txt){
        btn_txt.disable=true
        console.log(23,btn,index,btn_txt)
        btn.active=true
        $scope.qvod_text[$scope.pointer[0]].disable=true
        $scope.pointer[0]++
        $scope.pointer[1]=index
        $scope.qvod_text.push(Transcode($scope.text_all[$scope.pointer[0]][$scope.pointer[1]]));

    }

})