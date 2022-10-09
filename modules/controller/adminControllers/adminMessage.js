const ControllerModels = require("../ControllerModels");

const moment = require("jalali-moment");

module.exports = new class AdminMessage extends ControllerModels {
    
    sendMessage = async (req, res) => {
        try {
            const { title, text, messageType } = req.body;
            moment.locale("fa", { useGregorianParser : true });
            const currentDate = moment().format("YYYY/MM/DD");
            console.log(currentDate);
            // console.log(req.body);
            const createdMessage = await this.Message.create({ title, text, createdTime: currentDate, messageType }, { raw : true});
            res.status(200).json({
                success : true,
                result : createdMessage
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success : false,
                error
            });
        }
    }

    deleteMessage = async (req, res) => {
        try {
            
            // moment.locale("fa", { useGregorianParser : true });
            // const currentTime = moment().format("YYYY/MM/DD HH:mm:ss");

            // const result = await this.Message.update({deleteTime: currentTime}, { where :  {id : req.params.messageId } });
            const result = await this.Message.destroy({ where : { id : req.params.messageId } });
            if( result == 1) {
                return res.status(200).json({
                    success : true,
                    result : "با موفقیت حذف شد"
                });
            }
            
            res.status(422).json({
                success : false,
                error : "خطایی رخ داده است"
            });
            
        } catch (error) {
            res.status(500).json({
                success : false,
                error
            });
        }
    }

}