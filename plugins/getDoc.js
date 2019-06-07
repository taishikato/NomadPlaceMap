export default doc => {
  return new Promise(resolve => {
    doc.get().then(data => {
      resolve(data || false)
    })
  })
}
