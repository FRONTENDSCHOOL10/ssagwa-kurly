export function getPbImageURL(item,fileName = 'productImg'){
  return `${import.meta.env.VITE_PB_API}/files/${item.collectionId}/${item.id}/${item[fileName]}`
}
