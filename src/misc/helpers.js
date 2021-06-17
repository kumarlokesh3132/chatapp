/* eslint-disable arrow-body-style */
export function getNameInitials(name){
  const splitName = name.toUpperCase().split(' ');
  if(splitName.length > 1){
    return splitName[0][0] + splitName[1][0];
  }
  return splitName[0][0];
}

export function transformToArr(snapVal){
  return snapVal ? Object.keys(snapVal) : [];
}

export function transformToArray(snapValue){
  return snapValue ? Object.keys(snapValue).map(roomId => {
    return {...snapValue[roomId], id: roomId}
  }) : []
}
export async function getUserUpdates(userId, keyToUpdate, value, db) {
  const updates = {};

  updates[`/profile/${userId}/${keyToUpdate}`] = value;

  const getMsgs = db
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)
    .once('value');

  const getRooms = db
    .ref('/room')
    .orderByChild('lastMessage/author/uid')
    .equalTo(userId)
    .once('value');

  const [mSnap, rSnap] = await Promise.all([getMsgs, getRooms]);

  mSnap.forEach(msgSnap => {
    updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
  });

  rSnap.forEach(roomSnap => {
    updates[`/room/${roomSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
  });

  return updates;
}