import { getStorage } from '/src/lib/index.js';
import pb from '/src/api/pocketbase.js';
import viewModal from '/src/components/modal/modal.js';

export default async function userWithdrawl() {
  const userData = await getStorage('auth');

  await pb.collection('users').delete(userData.user.id).then(
    viewModal('탈퇴 되었습니다.', '확인', ()=>{
      localStorage.removeItem('auth');
      location.href = '/';
    })
  );
}