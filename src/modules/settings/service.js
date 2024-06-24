const settingModel = require('./model');
const {
    BadRequest,
    Unauthorized,
    Forbidden,
    NoContent,
} = require('../../utility/errors');
const { SendEmailUtility } = require('../../utility/email');


const updateEmailSettings = async (id, settings) => {
    try {
        const newSetting = await settingModel.findOneAndUpdate({ id }, settings, { new: true });
        return newSetting;
    } catch (error) {
        throw new BadRequest(error.message);
    }
}


module.exports = {
    updateEmailSettings
} 