'use strict';

module.exports = function (sequelize, DataTypes) {
	let Chat = sequelize.define('Chat', {
		telegram_id: DataTypes.STRING,
		chat_type: DataTypes.ENUM('private', 'group', 'supergroup'),
		random_chance: {
			type: DataTypes.INTEGER,
			defaultValue: 10
		}
	}, {
		classMethods: {
			associate: function (models) {
				Chat.hasMany(models.Pair);
			},
			getChat: async function (tg_message) {
				let chat = tg_message.chat;
				let tg_id = chat.id;
				let response = await Chat.findOrCreate({
					where: {
						telegram_id: tg_id.toString(),
						chat_type: chat.type
					},
					defaults: {},
					limit: 1
				});

				return response[0];
			}
		},
		instanceMethods: {
			migration: async function (logger, chatId) {
				try {
					await this.update({telegram_id: chatId});
					logger.log('Succesfully migrated to ' + chatId);
				} catch(e) {
						logger.log('Failed to migrate to ' + chatId);
				}
			}
		}
	});
	return Chat;
};