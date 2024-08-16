// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
const db = cloud.database();

exports.main = async (event, context) => {
  const { collectionName, docId } = event;
  try {
    const result = await db.collection(collectionName).doc(docId).get();
    return result;
  } catch (err) {
    console.error(err);
    return err;
  }
};