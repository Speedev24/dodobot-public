const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Everything that is saved about a server by the DodoBot
const serverSchema = new Schema(
{
    Name: {
        type: String,
        required: true
    },
    Join_Role: [
        {
            type: String
        }
    ],
    React_Role: [
        {
            Message: {
                type: String
            },
            Channel: {
                type: String
            },
            Reaction_Name: {
                type: String
            },
            Reaction_ID: {
                type: String
            },
            Role: {
                type: String
            }
        }
    ],
    W_Msg: {
        Channel: {
            type: String
        },
        Msg: {
            type: String
        }
    },
    Users: [
        {
            id: {
                type: String
            },
            xp: {
                type: Number
            },
            warns: [
                {
                    Reason: {
                        type: String
                    },
                    Time: {
                        type: Number
                    }
                }
            ]
        }
    ],
    Rank_Channel: {
        type: String
    },
    Warn_Words: [
        {
            type: String
        }
    ]
}, {
});

const Svr = mongoose.model('Server', serverSchema);
module.exports = Svr;