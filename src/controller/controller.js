const { QueryTypes } = require('sequelize');
const sequelize  = require('../databases/connection.js');

const addUser = async (req, res) => {
    // let keyword = req.query.keyword;
    // let processKeyword = `%${keyword}%`;
    const body = req.body;
    console.log(sequelize);
    const result = await sequelize.query(
        "INSERT INTO user (username, password, nama, alamat, nomorhp) VALUES (:username, :password, :nama, :alamat, :nomorhp)",
        {
            type: QueryTypes.INSERT,
            replacements: {
                username: body.username,
                password: body.password,
                nama: body.nama,
                alamat: body.alamat,
                nomorhp: body.nomorhp,
            }
        }
    )
    if(result){
        return res.status(200).json({
            message: "Success",
            
        })
    }else{
        return res.status(400).json({
            message: "Failed",
            
        })
    }
}
const cekLogin = async (req, res) => {
    const body = req.body;
    const result = await sequelize.query(
        "SELECT * FROM user WHERE username = :username AND password = :password",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: body.username,
                password: body.password,
            }
        }
    )
    if(result.length > 0){ 
        res.status(200).json({
            message: "Success",
            data: result
        })
    }else{
        res.status(400).json({
            message: "Failed",
            
        })
    }
}

//make edit user
const editUser = async (req, res) => {
    const body = req.body;
    const username = req.params.username;
    const result = await sequelize.query(
        "UPDATE user SET username = :username, password = :password, nama = :nama, alamat = :alamat, nomorhp = :nomorhp WHERE username = :username",
        {
            type: QueryTypes.UPDATE,
            replacements: {
                username: body.username,
                password: body.password,
                nama: body.nama,
                alamat: body.alamat,
                nomorhp: body.nomorhp,
            }
        }
    )

    
    if(result){
        res.status(200).json({
            message: "Success",
            data: result
        })
    }else{
        res.status(400).json({
            message: "Failed",
            
        })
    }
}

const addFriend = async (req, res) => {
    const body = req.body;


    let adauser = await sequelize.query(
        "SELECT * FROM user WHERE username = :username",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: body.username,
            }
        }
    )
    let adausercari = await sequelize.query(
        "SELECT * FROM user WHERE username = :username",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: body.usercari,
            }
        }
    )

    if(adauser.length == 0){
        res.status(400).json({
            message: "User tidak ada",
            
        })
    }
    if(adausercari.length == 0){
        res.status(400).json({
            message: "User Cari tidak ada",
            
        })
    }

    if(adauser[0].password != body.password){
        res.status(400).json({
            message: "Password salah",
            
        })
    }

    let friends = await sequelize.query(
        "SELECT * FROM friend WHERE user1 = :user1 AND user2 = :user2",
        {
            type: QueryTypes.SELECT,
            replacements: {
                user1: body.username,
                user2: body.usercari,
            }
        }
    )
    if(friends.length!=0){
        res.status(400).json({
            message: "User sudah berteman",
            
        })
    }   

    const result = await sequelize.query(
        "INSERT INTO friend (user1, user2) VALUES (:user1, :user2)",
        {
            type: QueryTypes.INSERT,
            replacements: {
                user1: body.username,
                user2: body.usercari,
            }
        }
    )
    if(result){
        return res.status(200).json({
            message: "Success",
            data: result
        })
    }else{
        return res.status(400).json({
            message: "Failed",
            
        })
    }
}

const getFriend = async (req, res) => {
    const username = req.params.username;
    const result = await sequelize.query(
        "SELECT * FROM friend WHERE user1 = :username OR user2 = :username",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: username,
            }
        }
    )
    if(result){
        res.status(200).json({
            message: "Success",
            data: result
        })
    }else{
        res.status(400).json({
            message: "Failed",
            
        })
    }
}
// const deleteFriend = async (req, res) => {
//     const body = req.body;
//     const result = await sequelize.query(
//         "DELETE FROM friend WHERE user1 = :user1 AND user2 = :user2",
//         {
//             type: QueryTypes.DELETE,
//             replacements: {
//                 user1: body.username,
//                 user2: body.usercari,
//             }
//         }
//     )
//     if(result){
//         res.status(200).json({
//             message: "Success",
//             data: result
//         })
//     }else{
//         res.status(400).json({
//             message: "Failed",
            
//         })
//     }
// }

//make delete friend with check password
const deleteFriend = async (req, res) => {
    const body = req.body;
    const username = req.params.username;
    const result = await sequelize.query(
        "SELECT * FROM user WHERE username = :username AND password = :password",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: body.username,
                password: body.password,
            }
        }
    )
    if(result.length == 0){
        res.status(400).json({
            message: "Password salah",
        })
    }else{
        const result = await sequelize.query(
            "DELETE FROM friend WHERE user1 = :user1 AND user2 = :user2",
            {
                type: QueryTypes.DELETE,
                replacements: {
                    user1: body.username,
                    user2: body.usercari,
                }
            }
        )
        if(result){
            res.status(200).json({
                message: "Success",
                data: result
            })
        }else{
            res.status(400).json({
                message: "Success!!!!!!",
            })
        }
    }
}

//make add message with check friend database
const addMessage = async (req, res) => {
    const body = req.body;
    const username = req.params.username;
    const result = await sequelize.query(
        "SELECT * FROM friend WHERE user1 = :user1 AND user2 = :user2",
        {
            type: QueryTypes.SELECT,
            replacements: {
                user1: body.username,
                user2: body.usercari,
            }
        }
    )
    if(result.length == 0){
        return res.status(400).json({
            message: "User tidak berteman",
        })
    }else{
        const result = await sequelize.query(
            "INSERT INTO messages (user1, message, user2) VALUES (:user1, :message, :user2)",
            {
                type: QueryTypes.INSERT,
                replacements: {
                    user1: body.username,
                    message: body.message,
                    user2: body.usercari,
                }
            }
        )
        if(result){
            return res.status(200).json({
                message: "Success",
                data: result
            })
        }else{
            return res.status(400).json({
                message: "FAILED",
            })
        }
    }
}

//make get message with check password
const getMessage = async (req, res) => {
    const body = req.body;
    const username = req.params.username;
    const result = await sequelize.query(
        "SELECT * FROM user WHERE username = :username",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: username,
                
            }
        }
    )
    // if(adauser[0].password != body.password){
    //     res.status(400).json({
    //         message: "Password salah",
            
    //     })
    // }
    console.log(result)
    console.log(body.password)
    if(result[0].password != body.password){
        return res.status(400).json({
            message: "Password salah",
        })
    }else{
        const result = await sequelize.query(
            "SELECT * FROM messages WHERE user1 = :user1",
            {
                type: QueryTypes.SELECT,
                replacements: {
                    user1: username,

                }
            }
        )
        if(result){
            return res.status(200).json({
                message: "Success",
                data: result
            })
        }else{
            return res.status(400).json({
                message: "FAILED",
            })
        }
    }
}




module.exports = {
    addUser,cekLogin,editUser,addFriend,getFriend,deleteFriend,addMessage,getMessage
}