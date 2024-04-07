var LGHelpTemplate = require("../GHbot.js");
var RM = require("../api/rolesManager.js");
var {genPermsReport, IsEqualInsideAnyLanguage} = require ("../api/utils.js");

function main(args)
{

    const GHbot = new LGHelpTemplate(args);
    const {TGbot, db, config} = GHbot;

    l = global.LGHLangs; //importing langs object

    //founder role is automatically set from /reload command
    var founderCommands = ["COMMAND_SETTINGS", "COMMAND_PERMS", "COMMAND_RULES", "COMMAND_PIN", "COMMAND_BAN", "COMMAND_MUTE", "COMMAND_KICK", "COMMAND_WARN","COMMAND_DELETE"]
    var founderPerms = RM.newPerms(founderCommands, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
    var modPerms = RM.newPerms(["COMMAND_RULES", "COMMAND_PIN", "COMMAND_BAN", "COMMAND_MUTE", "COMMAND_KICK", "COMMAND_WARN","COMMAND_DELETE"], 1, 1, 1, 1, 1, 1, 1, 1);
    var muterPerms = RM.newPerms(["COMMAND_RULES", "COMMAND_MUTE"], 1, 1, 1, 1, 1, 1, 1, 1);
    var cleanerPerms = RM.newPerms(["COMMAND_RULES", "COMMAND_DELETE"]);
    var helperPerms = RM.newPerms(["COMMAND_RULES"]);
    var freePerms = RM.newPerms([], 1, 1, 1, 1, 1, 1, 1, 1);

    global.roles = {
        founder : RM.newRole("FOUNDER", "👑", 100, founderPerms),
        moderator : RM.newRole("MODERATOR", "👷🏻‍♂️", 60, modPerms),
        muter : RM.newRole("MUTER", "🙊", 40, muterPerms),
        cleaner : RM.newRole("CLEANER", "🛃", 20, cleanerPerms),
        helper : RM.newRole("HELPER", "⛑", 0, helperPerms),
        free : RM.newRole("FREE", "🔓", 0, freePerms),
    }

    GHbot.onMessage( (msg, chat, user) => {

        if(!chat.isGroup) return;

        if(!chat.users.hasOwnProperty(user.id))
        {
            chat.users[user.id] = RM.newUser();
            db.chats.update(chat);
        }

        var command = msg.command;
        if(command && (command.name == "perms" || IsEqualInsideAnyLanguage(command.name, "COMMAND_PERMS")))
        {
            if(!msg.hasOwnProperty("reply_to_message")) return;

            var target = msg.reply_to_message.from;
            var targetPerms = RM.sumUserPerms(chat, target.id);

            var options = {
                parse_mode : "HTML",
                reply_parameters: {message_id:msg.message_id}
            }

            var text = target.first_name+" permissions: \n"+genPermsReport(chat.lang, targetPerms);

            TGbot.sendMessage(chat.id, text, options);
        }

    } )

}

module.exports = main;
