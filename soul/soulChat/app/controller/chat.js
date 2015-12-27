/**
 * Created by soul on 2015/12/27.
 */

var room_model=require("../models/room")




exports.getRoom=function(req,res){
        room_model.find({},function(err,rooms){
            if(err){
                return res.json({
                    info:"获取房间列表失败"
                })
            }
            res.json({
                info:"获取成功",
                rooms:rooms
            })

        })
}

exports.newRoom=function(req,res){
    var name=req.body.name
    var _room=new room_model({name:name})
    _room.save(function(err,rooms){
        if(err) {
            return res.json({
                info: "获取房间列表失败"
            })
        }
        room_model.find({},function(err,rooms){
            if(err){
                return res.json({
                    info:"获取房间列表失败"
                })
            }
            res.json({
                info:"添加成功",
                rooms:rooms
            })
        })

    })
}

exports.removeRoom=function(req,res){
    var name=req.body.name;
    room_model.remove({name:name},function(err,rooms){
        if(err) {
            return res.json({
                info: "删除失败"
            })
        }
        room_model.find({},function(err,rooms){
            if(err){
                return res.json({
                    info:"获取房间列表失败"
                })
            }
            res.json({
                info:"删除成功",
                rooms:rooms
            })
        })
    })
}





