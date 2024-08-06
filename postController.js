const multer = require("multer")
const Post = require("./models/post")
const path = require('path')
const fs = require('fs')

const createPost = async (req,res) => {

    const {caption,UserId} = req.body

    const imgPath = `${process.env.BASE_URL}${req.file.path.replace(/\\/g, '/')}`
    const post = await Post.create({caption,image:imgPath,UserId})

    return res.status(201).json({success:true,data:post})
}

const updatePost = async (req,res) => {

    const {postId} = req.params
    const {caption} = req.body

    const post = await Post.findByPk(postId)
    if(!post) {
        return res.status(404).json({
            success:false,
            error:"Post not found."
        })
    }

    fs.unlink(post.image.replace(process.env.BASE_URL, ''), (err) => {
        if (err) {
            console.error('Error deleting privous image.', err);
        }
    });

    const newImgPath = `${process.env.BASE_URL}${req.file.path.replace(/\\/g, '/')}`
    post.image = newImgPath
    post.caption = caption

    await post.save()

    return res.status(200).json({
        success:true,
        message:"Post updated successfully.",
        data:post
    })

}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: '4000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)  
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('file format are not according to the format specified.')
    }
}).single('image')

module.exports = {
    upload,
    createPost,
    updatePost
}