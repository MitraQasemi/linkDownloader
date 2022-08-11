const { Telegraf, Context } = require("telegraf");
var mime = require('mime-types');
const http = require('https');
const fs = require('fs');
const bot = new Telegraf("5517533701:AAEjVQ38h_URKHotwcexT9zjQBXv8cAYt4U");
bot.start(ctx => {
    console.log(ctx.message.from);
    ctx.reply("Hi");
})








bot.hears(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, async ctx => {
    ctx.reply("you sent a link");
    let file ;
    const request = http.get(ctx.update.message.text, function (response) {
        if(!file){
            file = fs.createWriteStream(ctx.message.message_id+"."+mime.extension(response.headers["content-type"]));
        }
        response.pipe(file);
        ctx.replyWithChatAction("upload_document");
        file.on("finish", async() => {
            file.close();
            ctx.replyWithChatAction("upload_document");
            console.log("Download Completed");
            await ctx.telegram.sendDocument(ctx.chat.id, { source: ctx.message.message_id+"."+mime.extension(response.headers["content-type"])});
            if(fs.existsSync(ctx.message.message_id+"."+mime.extension(response.headers["content-type"]))){
                fs.unlink(ctx.message.message_id+"."+mime.extension(response.headers["content-type"]),(err)=>{if (err) throw err});
            }else console.log("no");
        });
    });
});
// https://dls.music-fa.com/tagdl/ati/Novan%20-%20Berim%20Darya%20(320).mp3
bot.launch();