/**
 * collectioにデータを保存する
 * @param {*} collection Firestoreのcollection ref
 * @param {Object} data 保存データ
 */
export default function addData(collection, data) {
  return new Promise((resolve, reject) => {
    collection
      .add(data)
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        console.log(err)
        reject(false)
      })
  })
}
