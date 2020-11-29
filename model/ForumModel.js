const mongoose = require('mongoose');

const forumSchema = mongoose.Schema({
    title: {
        type: String,
        maxLength: [100, 'maximum length for title is 100 charecter'],
        required: [true, 'title field is required']
    },
    postBody: {
        type: String,
        maxLength: [1000, "maximum length for postBody is 1000 charecter"],
        required: [true, "postBody is required"]
    },
    catagory: {
        type: String,
        required: [true, "catagory is required"],
        enum: {
            values: ["transaction", "genarel notice", "changing rules", "others"]
        }
    },
    createdAt: {
        type: Date,
        default: new Date().toLocaleString()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "a forum post must have a user"]
    }
});

forumSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user', 
        select: '-__v -parmanent_address -present_address -father_name -mother_name -occupation -institution -cell_phone_no -nid'
    });
    next();
})

const ForumModel = mongoose.model('Forum', forumSchema);

module.exports = ForumModel;