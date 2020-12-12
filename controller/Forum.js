const ForumModel = require('./../model/ForumModel');

class Forum{
    constructor(){
        // this.title = title;
        // this.postBody = postBody;
        // this.catagory = catagory;
        // this.user = user;
    }
   async createPost(req, res, next) {
        let post = Object.assign({}, req.body);
        post.user = req.user._id;
        let newPost = await ForumModel.create(post);
        res.status(201).json({
            status: 'success',
            data: newPost
        })
    }
    async getAPost(req, res, next) {
        const post = await ForumModel.findById({_id: req.params.id});
        res.status(201).json({
            status: 'success',
            data: post
        });
    }

    async deletePost(req, res, next) {
        const post = await ForumModel.findById({_id: req.params.id})
        if(!post) return res.status(404).json({
            status: 'fail',
            message: 'could not found any post with that id'
        })

        const requestUser = req.user["_id"].toHexString()
        const postUser = post.user["_id"].toHexString();

        if(postUser === requestUser|| req.user.role === "admin") {
            await ForumModel.findByIdAndDelete({_id: req.params.id});
            return res.status(200).json({
                status: 'success',
            })
        }
        res.status(400).json({
            status: 'fail',
            message: 'something went wrong'
        })
        
    }

    async editPost(req, res, next) {
        const post = await ForumModel.findById({_id: req.params.id});
        if(!post) return res.status(404).json({
            status: 'fail',
            message: 'could not find any post with that id'
        });

        const requestUser = req.user["_id"].toHexString()
        const postUser = post.user["_id"].toHexString();

        if( postUser === requestUser ){
            const editedPost = await ForumModel.findByIdAndUpdate(req.params.id, req.body, {
                runValidators: true
            })
            return res.status(201).json({
                status: 'success',
                data: editedPost
            })
        }
        res.status(500).json({
            status: 'fail',
            message: 'something went wrong'
        })
    }
}

module.exports = Forum;