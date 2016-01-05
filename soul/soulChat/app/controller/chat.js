/**
 * Created by soul on 2015/12/27.
 */

var room_model = require("../models/room");
var category_model = require("../models/category");
var async = require("async")


exports.getRoom = function (req, res) {
    category_model.getCategorys(function (err, categorys) {
        if (err) {
            return res.json({
                info: "获取房间列表失败"
            })
        }
        res.json({
            info: "获取成功",
            categorys: categorys
        })
    })
}

exports.newRoom = function (req, res) {
    var isNewcategory = req.body.category.isNewcategory;
    var category_name = req.body.category.category_name;
    var add_room = req.body.room;
    console.log("isNewcategory",isNewcategory)
    console.log("category_name",category_name)
    console.log("add_room",add_room)
    var _room = new room_model({name: add_room})
    _room.save(function (err, room) {
        console.log(33,err)
        if (err) {
            return res.json({
                info: "已经存在相同房间,但服务器并未完全处理,请删除房间ID"
            })
        }
        //是否为新增分类
        if (isNewcategory) {
            var _category = category_model({name: category_name, rooms: room._id})
            _category.save(function (err, category) {
                if (err) {
                    return res.json({
                        info: "添加分类失败"
                    })
                } else {
                    res.json({
                        okay: true,
                        info: "添加成功",
                    })
                }
            })
        } else {
            category_model.findOne({_id: category_name}, function (err, category) {
                if (err) {
                    return res.json({
                        info: "分类选择失败"
                    })
                } else {
                    console.log(58,category)
                    category.rooms.push(room._id)
                    category.save(function (err, category) {
                        if (err) {
                            return res.json({
                                info: "添加分类失败"
                            })
                        } else {
                            res.json({
                                okay: true,
                                info: "添加成功",
                            })
                        }
                    })
                }
            })
        }
    })
}

exports.removeRoom = function (req, res) {
    var _roomId = req.body.roomId,
          _categoryId=req.body.categoryId;
    console.log("删除 _roomId,_categoryId",_roomId,_categoryId)
    category_model.update({_id:_categoryId},{$pull:{rooms:{$in:[_roomId]}}},function(err){
        if (err) {
            return res.json({
                info: "删除失败"
            })
        }
        room_model.remove({_id: _roomId}, function (err, rooms) {
            if (err) {
                return res.json({
                    info: "删除失败"
                })
            }
            room_model.find({}, function (err, rooms) {
                if (err) {
                    return res.json({
                        info: "获取房间列表失败"
                    })
                }
                res.json({
                    okay: true,
                    info: "删除成功",
                })
            })
        })
    })
}


exports.removeCategory = function (req, res) {
    var _category_id = req.params.id
    console.log(105, _category_id)

    category_model.findOne({_id: _category_id}, function (err, category) {
        console.log(108, category)
        async.map(category.rooms, function (item, cb) {
            room_model.remove({_id: item}, function (err,docs) {
                console.log(109,err)
                if (err) {
                    cb(err)
                }else{
                    cb(null)
                }
            })
        }, function (err, result) {
            console.log(115)
            if (err) {
                return res.json({
                    info: "删除分类失败"
                })
            } else {
                category_model.remove({_id: _category_id}, function (err) {
                    if (err) {
                        return res.json({
                            info: "删除分类失败"
                        })
                    }
                    res.json({
                        okay: true,
                        info: "删除分类成功"
                    })
                })
            }
        })
    })
}


exports.getRoomDetail=function(req,res){
    var _roomId=req.params.id;
    var _categorys,_room_background,_room_name,_room_sid,_current_category;
    category_model.getRoomCategory(_roomId,function(err,category){
        if (err) {
            return res.json({
                info: "获取内容失败"
            })
        }
        _current_category=category._id
        category_model.getCategorys(function(err,categorys){
            if(err){
                return res.json({
                    info: "获取内容失败"
                })
            }
            _categorys=categorys.map(function(n){
                var _obj={};
                    _obj._id= n._id;
                    _obj.name= n.name;
                return _obj


            })
            //_categorys=categorys
            room_model.findOne({_id:_roomId},function(err,room){
                if(err){
                    return res.json({
                        info: "获取内容失败"
                    })
                }
                _room_background=room.backgroundImg;
                _room_name=room.name
                _room_sid=room.sid
                res.json({
                    info: "获取内容成功",
                    isokay:true,
                    room_background:_room_background,
                    room_name:_room_name,
                    room_sid:_room_sid,
                    current_category:_current_category,
                    categorys:_categorys
                })
            })
        })
    })

}



