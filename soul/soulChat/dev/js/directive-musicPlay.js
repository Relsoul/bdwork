app.directive("musicPlayer", function ($timeout) {
    return {
        restrict: 'EA',
        templateUrl: '/musicPlay.html',
        scope: {
            room: '='
        },
        controller: function ($scope) {
            $scope.$on("musicList", function () {
                //加载歌曲列表
                $scope.music_list = $scope.room.music
                $scope.pointer = 0
                $scope.now_music = $scope.music_list[$scope.pointer]

                //歌曲当前时间
                $scope.progress_time = {
                    now: 0,
                    true_time: 0,
                    end: 0,
                }

                //播放与暂停
                $scope.musicPlay = function () {
                    //只有当歌曲触发了"canplay"事件才能点击
                    if ($scope.progress_time.end == 0) {
                        console.log("未准备")
                        return false
                    } else if ($scope.playClass) {
                        $scope.audio.pause();
                        $scope.playClass = false
                        $scope.clearAudioProgress();
                        console.log("暂停")
                    } else if ($scope.playClass == false) {
                        //获取歌曲当前时间
                        $scope.getNowTime()
                        $scope.progress_time.true_time = ($scope.progress_time.end - $scope.progress_time.now) * 1000
                        $scope.setAudioProgress($scope.progress_time.true_time)
                        $scope.audio.play();
                        $scope.playClass = true;
                        console.log("开始")
                    }
                }

                //下一曲
                $scope.musicNext = function () {

                    if ($scope.pointer >= $scope.music_list.length - 1) {
                        return false
                    }

                    //设置歌曲与进度条为初始状态
                    $scope.clearAudioProgress(true)
                    $scope.setNowTime(0)
                    $scope.pointer++
                    $scope.now_music = $scope.music_list[$scope.pointer]
                }

                //上一曲
                $scope.musicPref = function () {
                    if ($scope.pointer <= 0) {
                        return false
                    }

                    //设置歌曲与进度条为初始状态
                    $scope.clearAudioProgress(true)
                    $scope.setNowTime(0)
                    $scope.pointer--
                    $scope.now_music = $scope.music_list[$scope.pointer]
                }
            })

        },
        link: function (scope, element, attr) {
            //关于DOM操作都在这块
            scope.audio = $(".music_audio")[0]
            scope.audio_progress = $(".music-play-progress")[0];
            //当歌曲触发了canplay事件才能播放
            $(scope.audio).on("canplay", function () {
                //重置歌曲信息
                scope.progress_time.now = scope.audio.currentTime = 0
                scope.progress_time.true_time = 0
                scope.progress_time.end = scope.audio.duration
                //清除进度条
                scope.clearAudioProgress()
                scope.audio.play()
                scope.playClass = true;
                //设置进度条
                scope.progress_time.true_time = (scope.progress_time.end - scope.progress_time.now) * 1000
                scope.setAudioProgress(scope.progress_time.true_time)
                scope.$apply()
            })

            //清除进度条当前状态
            scope.clearAudioProgress = function (val) {
                $(scope.audio_progress).stop(true)
                if (val) {
                    $(scope.audio_progress).width(0)
                }
            }

            //设置进度条
            scope.setAudioProgress = function (time, cb) {
                $(scope.audio_progress).stop(true)
                $(scope.audio_progress).animate({
                    width: "100%"
                }, time, function () {
                    scope.musicNext()
                })
            }

            //获取歌曲当前时间
            scope.getNowTime = function () {
                return scope.progress_time.now = scope.audio.currentTime
            }

            //设置歌曲当前时间
            scope.setNowTime = function (val) {
                scope.progress_time.now = scope.audio.currentTime = val
            }

        }
    }
})