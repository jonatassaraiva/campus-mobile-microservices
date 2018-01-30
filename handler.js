'use strict'
const dynamoose = require('dynamoose');

const MessageSchema = new dynamoose.Schema({
  userId: {
    type: Number,
    hashKey: true
  },
  date: {
    type: Date,
    rangeKey: true,
    index: true
  },
  message: String
});
const MessageModel = dynamoose.model('campus-mobile-message', MessageSchema);

module.exports.post = function (event, context, callback) {
  const data = JSON.parse(event.body);

  MessageModel.create({
    userId: data.userId,
    date: Date.now(),
    message: data.message
  }, (err, result) => {
    if (err) {
      callback({
        statusCode: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: err.message
      }, null);
    } else {
      callback(null, {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(result)
      });
    }
  });
};

module.exports.getAll = function (event, context, callback) {
  const userId = event.pathParameters.id;

  MessageModel.query('userId').eq(userId).exec((err, result) => {
    if (err) {
      callback({
        statusCode: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: err.message
      }, null);
    } else {
      callback(null, {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(result)
      });
    }
  });
};