import '/src/components/recent-product/recent.css';
import { setStorage, getStorage } from "/src/lib/utils/storage.js";

const LATELY_VIEW_ITEM_EXPIRATION_DATE = 1; //유효기간 1일
const LATELY_VIEW_MAX_SAVE_COUNT = 5;  // 저장할 수 있는 아이템 갯수 5개!

