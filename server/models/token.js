const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true,
    },
    token: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date,  // ✅ Fixed `typeI` to `type`
        default: Date.now,  // ✅ Fixed: Removed `()`
        expires: 3600,  // Token expires in 1 hour
    }
});

module.exports = mongoose.model("Token", tokenSchema);
