export function getPbImageURL(item, fileName = 'productImg', num = null){
  if(typeof(num) === 'number'){
    num = String(num);
  }
  return `${import.meta.env.VITE_PB_API}/files/${item.collectionId}/${item.id}/${num ? item[fileName][num]:item[fileName]}`
}
